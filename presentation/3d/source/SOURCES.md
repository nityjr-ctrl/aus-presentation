# Source files

Downloaded 8 October 2026 from the public UroOps 3D site (no login, no consent prompt):

| File | URL | Bytes | SHA-256 |
|---|---|---|---|
| `4.glb` | https://uroops3d.com/models/aus-spatial/4.glb | 634040 | `16a8d9166bccaff7329210e75e883c89de9a3f6426dfdfdb431f5bfd7d34a9e3` |
| `manifest.json` | https://uroops3d.com/models/aus-spatial/manifest.json | 78402 | `46645ee7074da54d04f2323788c93fa285863d562052fc3eb77adb8db9d7dbf0` |

The public `4.glb` matches the hash the public `manifest.json` lists for it. The copy in the read-only checkout `C:\Users\nityj\Projects\UroOps3D-aus-spatial-ar\public\models\aus-spatial\4.glb` has the same size but a different hash (`27f1cde4...688b`); its own manifest lists that hash and an older `PelvisAtlasScene.tsx` fingerprint, so the checkout copy is an earlier export. The public (deployed) file was used, as the plan prefers.

Licence: atlas bones and bladder from Z-Anatomy / BodyParts3D (DBCLS), CC-BY-SA 4.0; derived GLBs keep that licence. Procedural AUS anatomy and device geometry: UroOps3D (Nity G), schematic, clinical review pending. Not patient-specific. Not a medical device.
