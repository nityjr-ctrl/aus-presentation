# Add start-on-show, looping playback to the UroOps clips in the animated deck (not the backup lesson video).
# usage: animate.py deck.pptx clip-slides.json
import json, re, sys, zipfile, shutil, os
deck, clips = sys.argv[1:3]
ms = {c['name']: c['ms'] for c in json.load(open(clips))}

def timing(spid, dur):
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
            '<p:tgtEl><p:spTgt spid="%s"/></p:tgtEl></p:cMediaNode></p:video></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>') % (dur, spid, spid)

zin = zipfile.ZipFile(deck)
items = [(i.filename, zin.read(i.filename)) for i in zin.infolist()]
zin.close()
done = 0
out = []
for name, data in items:
    if re.match(r'ppt/slides/slide\d+\.xml$', name):
        x = data.decode('utf8')
        m = re.search(r'<p:pic>(?:(?!</p:pic>).)*?<p:cNvPr id="(\d+)" name="UroOps clip ([^"]+)"', x, re.S)
        if m and '<p:timing' not in x:
            clip = m.group(2)
            # pptxgenjs can reuse a shape id for the media picture; give it a unique one so the timing target is unambiguous
            spid = str(max(int(i) for i in re.findall(r'<p:cNvPr id="(\d+)"', x)) + 100)
            x = x.replace(m.group(0), m.group(0).replace('<p:cNvPr id="%s" name="UroOps clip' % m.group(1), '<p:cNvPr id="%s" name="UroOps clip' % spid), 1)
            at = x.index('</p:cSld>') + len('</p:cSld>')
            if '</p:clrMapOvr>' in x:
                at = x.index('</p:clrMapOvr>') + len('</p:clrMapOvr>')
            x = x[:at] + timing(spid, ms[clip]) + x[at:]
            data = x.encode('utf8'); done += 1
    out.append((name, data))
tmp = deck + '.tmp'
z = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
for name, data in out:
    z.writestr(name, data, compress_type=zipfile.ZIP_STORED if name.endswith(('.mp4', '.png', '.jpg')) else zipfile.ZIP_DEFLATED)
z.close()
assert zipfile.ZipFile(tmp).testzip() is None
shutil.move(tmp, deck)
print('autoplay timing added to', done, 'slides;', os.path.getsize(deck), 'bytes')
