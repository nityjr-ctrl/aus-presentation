#!/usr/bin/env python3
"""Regression tests: python -m unittest discover -s presentation/3d -p 'test_*.py'."""
import hashlib
import importlib.util
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

from lxml import etree

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("embed_3d", HERE / "embed-3d.py")
embed = importlib.util.module_from_spec(spec)
spec.loader.exec_module(embed)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def slide_order(pkg):
    rels = etree.fromstring(pkg.read("ppt/_rels/presentation.xml.rels"))
    by_id = {r.get("Id"): embed.target_part("ppt/presentation.xml", r.get("Target")) for r in rels}
    pres = etree.fromstring(pkg.read("ppt/presentation.xml"))
    return [by_id[s.get(f"{{{embed.NS['r']}}}id")] for s in pres.find("p:sldIdLst", embed.NS)]


class RebuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix="aus portability ")
        cls.root = Path(cls.temp.name)
        cls.pres = cls.root / "relocated checkout" / "presentation"
        cls.here = cls.pres / "3d"
        # Only versioned build inputs. No agent session, node_modules, or recording.
        for folder in ("steps", "renders", "video"):
            shutil.copytree(HERE / folder, cls.here / folder,
                            ignore=shutil.ignore_patterns("*.mp4", "*.webm"))
        for name in ("embed-3d.py", "validate.py", "steps.json"):
            shutil.copyfile(HERE / name, cls.here / name)
        for name in ("AUS-teaching-deck.pptx", "AUS-teaching-deck-3d.pptx"):
            shutil.copyfile(HERE.parent / name, cls.pres / name)
        cls.original = cls.pres / "AUS-teaching-deck.pptx"
        cls.seed = cls.pres / "AUS-teaching-deck-3d.pptx"
        cls.before = {p: digest(p) for p in (cls.original, cls.seed)}
        cls.deck = cls.root / "rebuilt.pptx"
        cls.test = cls.root / "smoke.pptx"
        cls.env = dict(os.environ, HOME=str(cls.root / "empty home"),
                       USERPROFILE=str(cls.root / "empty home"), PYTHONDONTWRITEBYTECODE="1")
        cls.cwd = cls.root / "unrelated working directory"
        cls.cwd.mkdir()
        result = cls.run_script("embed-3d.py", "--output", cls.deck, "--test-output", cls.test)
        if result.returncode:
            raise AssertionError(result.stdout + result.stderr)
        cls.report = cls.root / "validation.json"
        cls.validation = cls.run_script("validate.py", "--deck", cls.deck,
                                        "--test", cls.test, "--report", cls.report)

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    @classmethod
    def run_script(cls, name, *args):
        return subprocess.run([sys.executable, str(cls.here / name), *map(str, args)],
                              cwd=cls.cwd, env=cls.env, capture_output=True, text=True, timeout=180)

    def test_relocated_build_passes_all_structural_checks(self):
        self.assertEqual(self.validation.returncode, 0, self.validation.stdout + self.validation.stderr)
        report = json.loads(self.report.read_text())
        self.assertEqual((report["passed"], report["failed"]), (48, 0))
        self.assertFalse((self.here / "video" / "aus-flow-1080p.mp4").exists())

    def test_original_and_video_seed_are_untouched(self):
        for path, expected in self.before.items():
            self.assertEqual(digest(path), expected)

    def test_all_content_assets_and_animation_parts_match_existing_deck(self):
        # Only package-level slide ID / relationship IDs may differ. All other
        # parts must be byte-identical: GLBs, raster fallbacks, MP4, original
        # text/tables/notes, model animation extension, Morph and video timing.
        excluded = {"ppt/presentation.xml", "ppt/_rels/presentation.xml.rels"}
        with zipfile.ZipFile(self.seed) as old, zipfile.ZipFile(self.deck) as new:
            self.assertEqual(set(old.namelist()), set(new.namelist()))
            self.assertEqual(slide_order(old), slide_order(new))
            self.assertEqual(len(slide_order(new)), 50)
            for name in sorted(set(old.namelist()) - excluded):
                with self.subTest(part=name):
                    self.assertEqual(hashlib.sha256(old.read(name)).digest(),
                                     hashlib.sha256(new.read(name)).digest())
            video = [n for n in new.namelist() if n.endswith(".mp4")]
            self.assertEqual(len(video), 1)
            self.assertEqual(hashlib.sha256(new.read(video[0])).hexdigest(), embed.VIDEO_SHA256)

    def test_smoke_package_has_no_orphan_slides_or_notes(self):
        with zipfile.ZipFile(self.test) as pkg:
            self.assertEqual(slide_order(pkg), ["ppt/slides/slide28.xml"])
            slides = [n for n in pkg.namelist() if n.startswith("ppt/slides/slide") and n.endswith(".xml")]
            notes = [n for n in pkg.namelist() if n.startswith("ppt/notesSlides/notesSlide") and n.endswith(".xml")]
            self.assertEqual(len(slides), 1)
            self.assertEqual(len(notes), 1)

    def test_original_output_is_rejected_before_writing(self):
        for flag in ("--output", "--test-output"):
            with self.subTest(flag=flag):
                result = self.run_script("embed-3d.py", flag, self.original)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("must not overwrite the original", result.stderr)
                self.assertEqual(digest(self.original), self.before[self.original])

    def test_missing_video_has_actionable_error(self):
        result = self.run_script("embed-3d.py", "--video-from", self.root / "absent.pptx")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("supply --video MP4 or --video-from", result.stderr)
        self.assertEqual(digest(self.seed), self.before[self.seed])

    def test_corrupted_seed_video_is_rejected(self):
        seed = self.root / "bad-seed.pptx"
        with zipfile.ZipFile(seed, "w") as pkg:
            pkg.writestr("ppt/media/media1.mp4", b"wrong video")
        result = self.run_script("embed-3d.py", "--video-from", seed)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("checksum mismatch", result.stderr)

    def test_explicit_video_is_supported(self):
        video = self.root / "explicit.mp4"
        video.write_bytes(b"caller-provided recording")
        self.assertEqual(embed.resolve_video(video, self.root / "absent.pptx", self.root), video)


class PackageHelperTests(unittest.TestCase):
    def test_target_resolution(self):
        self.assertEqual(embed.target_part("ppt/slides/slide28.xml", "../media/model.glb"), "ppt/media/model.glb")
        self.assertEqual(embed.target_part("ppt/slides/slide28.xml", "/ppt/media/model.glb"), "ppt/media/model.glb")

    def test_pruning_keeps_external_links_and_removes_stale_overrides(self):
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp)
            (d / "_rels").mkdir()
            (d / "_rels" / ".rels").write_text(
                f'<Relationships xmlns="{embed.NS["pr"]}">'
                '<Relationship Id="r1" Type="test" Target="keep.xml"/>'
                '<Relationship Id="r2" Type="test" Target="https://example.com" TargetMode="External"/>'
                '</Relationships>')
            (d / "[Content_Types].xml").write_text(
                f'<Types xmlns="{embed.NS["ct"]}">'
                '<Override PartName="/keep.xml" ContentType="application/xml"/>'
                '<Override PartName="/orphan.xml" ContentType="application/xml"/></Types>')
            (d / "keep.xml").write_text("<keep/>")
            (d / "orphan.xml").write_text("<orphan/>")
            embed.prune_package(d)
            self.assertTrue((d / "keep.xml").exists())
            self.assertFalse((d / "orphan.xml").exists())
            self.assertNotIn("orphan.xml", (d / "[Content_Types].xml").read_text())
            self.assertIn('TargetMode="External"', (d / "_rels" / ".rels").read_text())
            (d / "keep.xml").unlink()
            with self.assertRaisesRegex(ValueError, "missing internal relationship"):
                embed.prune_package(d)


if __name__ == "__main__":
    unittest.main()
