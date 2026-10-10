# Swap the UroOps pictures in both decks for the new captures, and in the 3D deck replace the
# native 3D models on the step slides with looping clips. usage: embed.py <cap dir> <std deck> <3d deck>
import re, sys, zipfile, shutil, os, subprocess
from xml.sax.saxutils import escape
CAP, STD, D3 = sys.argv[1:4]
A = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"'
R = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
CREDIT = ('Image: UroOps 3D, https://uroops3d.com/lab/aus . Captured 10 October 2026. © UroOps3D / UroRef / Nity G. '
          'Teaching schematic with clinical review pending. It illustrates spatial relationships, not validated anatomy, tissue perfusion or operative instructions.')
PPR = '<a:pPr marL="0" lvl="0" indent="0" algn="l"><a:spcBef><a:spcPts val="0"/></a:spcBef><a:spcAft><a:spcPts val="0"/></a:spcAft><a:buNone/></a:pPr>'


def para(t):
    if t:
        return '<a:p %s>%s<a:r><a:rPr lang="en-GB" sz="1200" dirty="0"/><a:t>%s</a:t></a:r></a:p>' % (A, PPR, escape(t))
    return '<a:p %s>%s<a:endParaRPr lang="en-GB" sz="1200" dirty="0"/></a:p>' % (A, PPR)


def credit_note(t, anim=False):
    text = CREDIT.replace('Image:', 'Animation and image:') if anim else CREDIT
    t = re.sub(r'<a:p\b(?:(?!</a:p>).)*?<a:t>3D: (?:(?!</a:p>).)*?</a:p>', '', t, flags=re.S)
    if 'Image source: https://uroops3d.com/lab/aus' in t:
        return re.sub(r'Captured 30 September.{1,3}1 October 2026 \(UTC\)', 'Captured 10 October 2026', t)
    if 'Captured 10 October 2026' in t:
        return t
    b = re.search(r'type="body".*?(</p:txBody>)', t, re.S)
    return t[:b.start(1)] + para('') + para(text) + t[b.start(1):]


def duration_ms(f):
    out = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f])
    return round(float(out.decode()) * 1000)


def timing(spid, ms):
    return ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
            '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst><p:par><p:cTn id="3" fill="hold">'
            '<p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst><p:par>'
            '<p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:par>'
            '<p:cTn id="5" presetID="1" presetClass="mediacall" presetSubtype="0" fill="hold" nodeType="afterEffect"><p:stCondLst><p:cond delay="0"/></p:stCondLst>'
            '<p:childTnLst><p:cmd type="call" cmd="playFrom(0.0)"><p:cBhvr><p:cTn id="6" dur="%d" fill="hold"/><p:tgtEl><p:spTgt spid="%s"/></p:tgtEl></p:cBhvr></p:cmd>'
            '</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn>'
            '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
            '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
            '<p:video><p:cMediaNode vol="80000"><p:cTn id="7" repeatCount="indefinite" fill="hold" display="0"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst></p:cTn>'
            '<p:tgtEl><p:spTgt spid="%s"/></p:tgtEl></p:cMediaNode></p:video></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>') % (ms, spid, spid)


def rewrite(deck, fn):
    zin = zipfile.ZipFile(deck)
    files = {i.filename: zin.read(i.filename) for i in zin.infolist()}
    order = [i.filename for i in zin.infolist()]
    zin.close()
    fn(files, order)
    tmp = deck + '.tmp'
    zout = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
    for n in order:
        if n in files:
            stored = n.endswith(('.mp4', '.png', '.jpg'))
            zout.writestr(n, files[n], compress_type=zipfile.ZIP_STORED if stored else zipfile.ZIP_DEFLATED)
    zout.close()
    assert zipfile.ZipFile(tmp).testzip() is None
    shutil.move(tmp, deck)
    print('wrote', deck, os.path.getsize(deck))


def rd(p):
    return open(p, 'rb').read()


def notes_of(files, n):
    rels = files['ppt/slides/_rels/slide%d.xml.rels' % n].decode()
    return 'ppt/notesSlides/' + re.search(r'notesSlides/(notesSlide\d+\.xml)', rels).group(1)


def image_of(files, n):
    rels = files['ppt/slides/_rels/slide%d.xml.rels' % n].decode()
    found = []
    for rel in re.findall(r'<Relationship [^>]*>', rels):
        if '/image"' in rel:
            found.append('ppt/media/' + re.search(r'media/([^"]+)"', rel).group(1))
    assert len(found) == 1, (n, found)
    return found[0]


def swap_stills(files, pairs):
    for n, still in pairs:
        files[image_of(files, n)] = rd('%s/stills/%s.png' % (CAP, still))
        k = notes_of(files, n)
        files[k] = credit_note(files[k].decode('utf8')).encode('utf8')


def std(files, order):
    swap_stills(files, [(6, 'std-06'), (16, 'std-16'), (26, 'std-26'), (27, 'std-27'), (28, 'std-28'), (31, 'std-31'), (33, 'std-33')])


def d3(files, order):
    swap_stills(files, [(6, 'std-06'), (16, 'std-16')])
    ct = files['[Content_Types].xml'].decode()
    for n in (26, 27, 28, 30, 31, 32, 33):
        sp = 'ppt/slides/slide%d.xml' % n
        rp = 'ppt/slides/_rels/slide%d.xml.rels' % n
        x = files[sp].decode('utf8')
        rels = files[rp].decode('utf8')
        m = re.search(r'<mc:AlternateContent\b(?:(?!</mc:AlternateContent>).)*?am3d(?:(?!</mc:AlternateContent>).)*?</mc:AlternateContent>', x, re.S)
        assert m, n
        fb = re.search(r'<mc:Fallback>(.*?)</mc:Fallback>', m.group(0), re.S).group(1)
        spid = re.search(r'<p:cNvPr id="(\d+)"', fb).group(1)
        img_id = re.search(r'<a:blip r:embed="([^"]+)"', fb).group(1)
        xfrm = re.search(r'<a:xfrm>.*?</a:xfrm>', fb, re.S).group(0)
        title = re.search(r'descr="3D model: ([^"]*)"', fb).group(1)
        pic = ('<p:pic %s %s><p:nvPicPr><p:cNvPr id="%s" name="!!AUS3D" descr="Animation: %s"><a:hlinkClick r:id="" action="ppaction://media"/></p:cNvPr>'
               '<p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr><a:videoFile r:link="rIdAusVid1"/><p:extLst><p:ext uri="{DAA4B4D4-6D71-4841-9C94-3DE7FCFB9230}">'
               '<p14:media xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" r:embed="rIdAusVid2"/></p:ext></p:extLst></p:nvPr></p:nvPicPr>'
               '<p:blipFill><a:blip r:embed="%s"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr>%s<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>'
               ) % (A, R, spid, title, img_id, xfrm)
        x = x[:m.start()] + pic + x[m.end():]
        clip = '%s/out/aus-%d.mp4' % (CAP, n)
        assert '<p:timing' not in x
        tr = re.search(r'<mc:AlternateContent\b(?:(?!</mc:AlternateContent>).)*?<p:transition.*?</mc:AlternateContent>|<p:transition\b[^>]*/>|<p:transition\b.*?</p:transition>', x, re.S)
        if tr:
            at = tr.end()
        elif '</p:clrMapOvr>' in x:
            at = x.index('</p:clrMapOvr>') + len('</p:clrMapOvr>')
        else:
            at = x.index('</p:cSld>') + len('</p:cSld>')
        x = x[:at] + timing(spid, duration_ms(clip)) + x[at:]
        files[sp] = x.encode('utf8')
        glb = re.search(r'<Relationship [^>]*relationships/model3d"[^>]*Target="\.\./media/([^"]+)"[^>]*/>', rels)
        old_png = re.search(r'<Relationship Id="%s"[^>]*Target="\.\./media/([^"]+)"' % img_id, rels).group(1)
        rels = rels.replace(glb.group(0),
                            '<Relationship Id="rIdAusVid1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/video" Target="../media/aus-clip-%d.mp4"/>'
                            '<Relationship Id="rIdAusVid2" Type="http://schemas.microsoft.com/office/2007/relationships/media" Target="../media/aus-clip-%d.mp4"/>' % (n, n))
        rels = rels.replace('../media/' + old_png, '../media/aus-poster-%d.png' % n)
        files[rp] = rels.encode('utf8')
        del files['ppt/media/' + glb.group(1)]
        del files['ppt/media/' + old_png]
        ct = re.sub(r'<Override PartName="/ppt/media/%s"[^>]*/>' % re.escape(glb.group(1)), '', ct)
        for name, data in (('ppt/media/aus-clip-%d.mp4' % n, rd(clip)), ('ppt/media/aus-poster-%d.png' % n, rd('%s/stills/d3-%d.png' % (CAP, n)))):
            files[name] = data
            order.append(name)
        k = notes_of(files, n)
        files[k] = credit_note(files[k].decode('utf8'), anim=True).encode('utf8')
    files['[Content_Types].xml'] = ct.encode()
    flow = CAP + '/out/aus-flow.mp4'
    if os.path.exists(flow):
        files['ppt/media/media1.mp4'] = rd(flow)
        files['ppt/media/image1.png'] = rd(CAP + '/out/aus-flow-poster.png')
        print('flow video replaced')


rewrite(STD, std)
rewrite(D3, d3)
