# am3d (PowerPoint 3D model) XML: research notes

Written 8 October 2026 before any 3D XML was generated (plan step 0). No PowerPoint is available on this PC, so every choice below comes from the published spec and from XML that real PowerPoint wrote, as reproduced by third parties. Where they differ, the samples win.

## Sources read

1. **[MS-ODRAWXML] Office Drawing Extensions to Office Open XML Structure**, v20261006 (release 6 October 2026), downloaded from `officeprotocoldocs-...azurefd.net/files/MS-ODRAWXML/[MS-ODRAWXML].pdf`. Sections read: 2.31 (`http://schemas.microsoft.com/office/drawing/2017/model3d`, elements and complex types 2.31.3.1 to 2.31.3.16, simple type 2.31.4.1), 2.36 (`.../2018/animation/model3d`: `embedAnim`, `posterFrame`), 5.29 and 5.34 (full XSDs).
2. **Microsoft Open XML SDK sample** `samples/AnimatedModel3DExample/Program.cs` (dotnet/Open-XML-SDK, MIT). Inserts an animated GLB with the values PowerPoint wrote for its "flying bee" sample.
3. **OfficeCLI** `PowerPointHandler.Add.Model3D.cs` and `PowerPointHandler.Animations.cs` (iOfficeAI/OfficeCLI, Apache-2.0), which state they follow native PowerPoint XML, plus its `morph-ppt-3d` skill notes.
4. **pptxforge** `evidence/fov-derivation.md` (GA16-24/pptxforge): verbatim `slide2.xml` values from a deck where PowerPoint Desktop itself inserted `DamagedHelmet.glb`, with the framing maths back-solved to within 2 EMU.
5. **ppt-master** `pptx-transitions.md` (hugohe3/ppt-master) for the Morph transition wrapper.

## Package facts (all confirmed by samples 2 and 3)

| Item | Value |
|---|---|
| Relationship type, slide to GLB | `http://schemas.microsoft.com/office/2017/06/relationships/model3d` |
| GLB part | `ppt/media/model3dN.glb` |
| Content type | `<Default Extension="glb" ContentType="model/gltf.binary"/>` (dot, not dash) |
| Fallback image | one PNG image relationship, used twice: `am3d:raster/am3d:blip/@r:embed` inside the Choice and `p:pic/p:blipFill/a:blip/@r:embed` in the Fallback |
| Container | `mc:AlternateContent` > `mc:Choice Requires="am3d" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d"` > `p:graphicFrame`; `mc:Fallback` > `p:pic` with the same `cNvPr` id, name and `a16:creationId` |
| graphicData | `<a:graphicData uri="http://schemas.microsoft.com/office/drawing/2017/model3d">` holding `am3d:model3d r:embed="rIdGLB"` |
| Shape name for Morph | `p:cNvPr name="!!AUS3D"` on both the graphicFrame and the fallback picture (the `!!` prefix forces Morph to pair objects by name) |
| Fallback picture locks | `a:picLocks` with noGrp, noRot, noChangeAspect, noMove, noResize, noEditPoints, noAdjustHandles, noChangeArrowheads, noChangeShapeType, noCrop all `1` |
| graphicFrame locks | `p:cNvGraphicFramePr` with `a:graphicFrameLocks noChangeAspect="1"` (OfficeCLI); the SDK sample leaves it empty |

## `am3d:model3d` child order (spec 2.31.3.3 and both samples agree)

`spPr`, `camera`, `trans`, `attrSrcUrl`?, `raster`?, `extLst`?, (`objViewport` | `winViewport`), `ambientLight`?, (`ptLight` | `spotLight` | `dirLight` | `unkLight`)*

- `am3d:spPr`: `a:xfrm` with `a:off x="0" y="0"` and `a:ext` equal to the frame size, then `a:prstGeom prst="rect"`.
- `am3d:camera` (2.31.3.4): `pos`, `up`, `lookAt`, then `perspective fov` or `orthographic`. `pos` and `lookAt` are `a:CT_Point3D` (x, y, z in EMU); `up` is `a:CT_Vector3D` (dx, dy, dz). Samples write `up dy="36000000"` and `lookAt 0,0,0`. `fov` is vertical, in 60000ths of a degree, range (0, 180): PowerPoint inserts at 2700000 (45 degrees).
- `am3d:trans` (2.31.3.6): order `meterPerModelUnit`, `preTrans`, `scale` (sx, sy, sz as `n`/`d`), `rot` (ax, ay, az, 60000ths of a degree), `postTrans`. Applied in that order. Samples always write all five; `rot` with no attributes means zero.
- `am3d:raster` (2.31.3.5): attributes `rName` and `rVer` are required. Samples write `rName="Office3DRenderer" rVer="16.0.8326"`. Child is `am3d:blip r:embed` (spec type `a:CT_Blip`, but `elementFormDefault="qualified"` puts it in the am3d namespace; both samples use `am3d:blip`).
- `am3d:extLst` on model3d (element form qualified, so am3d prefix, as the SDK's `Model3DExtensionList`) carries the embedded animation (2.36, schema 5.34 and 5.35): `a:ext uri="{9A65AA19-BECB-4387-8358-8AD5134E1D82}"` holding `a3danim:embedAnim animId="0"` with `a3danim:animPr length="..." count="indefinite"` (the element is declared locally in the a3danim schema, so it takes the a3danim prefix, as the SDK's `Office2019.Drawing.Animation.Model3D.AnimationProperties` does; its type `CT_AnimationProperties` comes from `http://schemas.microsoft.com/office/drawing/2018/animation`; `length` in milliseconds, the SDK sample writes `1899` for a 1.9 s clip; `auto` defaults to true), and `a:ext uri="{E9DE012E-A134-456F-84FE-255F9AAD75C6}"` holding `a3danim:posterFrame animId="0"`.
- Viewport: `objViewport viewportSz` (2.31.3.7, object mode: PowerPoint resizes the frame to fit the visible model whenever it is rotated, viewport centred on `lookAt`) or `winViewport` (2.31.3.15, window mode: frame size is kept, the camera may be panned, and the model may be clipped by the frame edge). Samples written by "Insert 3D model" use object mode.
- Lights: samples write `ambientLight` (scrgbClr 50000/50000/50000, illuminance 500000/1000000) and three `ptLight rad="0"` (warm, cool, lilac) at fixed EMU positions. Copied verbatim.

## Units and the scene frame (sample 4, exact to 2 EMU)

- Scene space is in EMU at **36,000,000 EMU per metre**.
- A model vertex `v` (glTF units, after the GLB node transforms) lands at `v * meterPerModelUnit * 36e6 + preTrans`, then `scale`, `rot`, `postTrans`.
- PowerPoint sets `meterPerModelUnit = 1 / (2 * largest half-extent of the world bounding box)` and `preTrans = -centre * meterPerModelUnit * 36e6`, so the model is centred on the origin with its longest half-axis at 0.5 m.
- On insertion PowerPoint puts the camera on +Z at `radius / sin(fov / 2)`, looking at the origin, up +Y.

## Decisions for this deck

1. **Camera, not rotation.** The spec defines `pos`, `up` and `lookAt` unambiguously in scene space, whereas the Euler order of `rot` is not stated anywhere. Each step's UroOps camera is therefore written into `am3d:camera` (converted to scene EMU with the formula above) and `rot` stays zero. `postTrans` stays zero.
2. **Same scene frame on every slide.** All seven step GLBs carry the same `Frame_anchor` node: two degenerate (zero-area, invisible) triangles at the corners of the union bounding box of every node in every step. All seven therefore share one bounding box, one `meterPerModelUnit` and one `preTrans`, so a camera written for one slide means the same place on the next, and if PowerPoint ever recomputes the normalisation it gets the same numbers.
3. **Window viewport.** `am3d:winViewport` is used, not `objViewport`: the close-up views look past parts of the model, and object mode would resize the frame to the whole model on the first rotation. Window mode keeps the frame rectangle that the slide layout needs and allows a `lookAt` away from the origin (2.31.3.15 says panning moves `lookAt`).
4. **Field of view 50 degrees** (`fov="3000000"`), the UroOps shell lens, so the fallback PNG rendered by three.js (vertical fov 50, same aspect as the frame) and the live PowerPoint view should match.
5. **Animation only on slide 33.** Its GLB keeps the 8 s "Cycle AUS" animation, so its model3d carries the `embedAnim` and `posterFrame` extensions (animation 0, length 8000 ms, count indefinite, poster frame 0). `animPr auto` defaults to true. The Open XML SDK sample also adds a `p:timing` "Scene" emphasis effect; that is not added here, so slide 33 keeps the deck's no-click-animation rule. If the cycle does not play in Slide Show, select the model and add Animations > 3D > Scene (README). Other GLBs have no animations.
6. **Morph wrapper** (sample 5, OfficeCLI), placed after `p:cSld` (these slides have no `p:clrMapOvr` or `p:timing`):

```xml
<mc:AlternateContent>
  <mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">
    <p:transition spd="slow" p14:dur="1500"><p159:morph option="byObject"/></p:transition>
  </mc:Choice>
  <mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback>
</mc:AlternateContent>
```

`mc` is declared on the `mc:AlternateContent`, `p159` on the `mc:Choice` and `p14` on the `p:transition`, as in the plan's template. OfficeCLI also adds `mc:Ignorable="p159"` to the slide root; that is not done here, because every p14 and p159 item sits inside a Choice that requires p159, so a reader that takes the Choice understands both, and a reader that does not takes the plain fade.

## What remains uncertain

- Whether PowerPoint Morphs between two **different** GLB parts that share a name. OfficeCLI's verified examples always use the same GLB on every slide. If PowerPoint will not interpolate between different models it should still cross-fade the frames; the camera fly is then lost. This is the first thing to check in the one-slide and full-deck tests.
- `winViewport` has no sample written by PowerPoint in the sources above; it is in the current spec and the Open XML SDK typed schema (`WindowViewport`). If PowerPoint repairs the file, change `winViewport` to `objViewport viewportSz="<frame height in EMU>"` in `embed-3d.py` (one line) and rebuild.
- `rVer` is copied from the samples; PowerPoint re-renders the raster on first edit anyway.
