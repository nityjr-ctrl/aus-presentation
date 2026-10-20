# Build AUS-presenter-script.pdf from AUS-presenter-script.md.
# usage: python build_script_pdf.py            (needs reportlab; uses Segoe UI when Windows has it)
import os, re, sys
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, PageBreak, Spacer, Table, TableStyle, KeepTogether

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'AUS-presenter-script.md')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'AUS-presenter-script.pdf')
INK, MUTED, TEAL, RULE, PANEL = HexColor('#1B2430'), HexColor('#5F6B7A'), HexColor('#0F7F86'), HexColor('#DDE2E8'), HexColor('#F3F4F6')
HEADER = 'ARTIFICIAL URINARY SPHINCTER SURGERY  |  PRESENTER SCRIPT'
FOOTER = 'Script revised 20 October 2026  |  Evidence checked 5 October 2026'

FONTS = 'C:/Windows/Fonts/'
if os.path.exists(FONTS + 'segoeui.ttf'):
    for name, f in (('S', 'segoeui.ttf'), ('S-Bold', 'seguisb.ttf'), ('S-Italic', 'segoeuii.ttf'), ('S-BoldItalic', 'seguisbi.ttf')):
        pdfmetrics.registerFont(TTFont(name, FONTS + f))
    pdfmetrics.registerFontFamily('S', normal='S', bold='S-Bold', italic='S-Italic', boldItalic='S-BoldItalic')
    R, B, I = 'S', 'S-Bold', 'S-Italic'
else:
    R, B, I = 'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique'

BODY = ParagraphStyle('body', fontName=R, fontSize=10.8, leading=15.6, textColor=INK, spaceAfter=8)
SAY = ParagraphStyle('say', parent=BODY, fontSize=11.4, leading=17, leftIndent=10)
EXAMPLE = ParagraphStyle('example', parent=BODY, fontSize=10.6, leading=15.2, leftIndent=10, rightIndent=6, backColor=PANEL, borderPadding=(6, 8, 6, 8), spaceBefore=4, spaceAfter=12)
ASK = ParagraphStyle('ask', parent=BODY, fontSize=11.4, leading=16, textColor=TEAL)
BULLET = ParagraphStyle('bullet', parent=BODY, fontSize=9.8, leading=13.6, leftIndent=16, bulletIndent=4, spaceAfter=5, textColor=INK)
TITLE = ParagraphStyle('title', fontName=B, fontSize=28, leading=34, textColor=INK, spaceBefore=4, spaceAfter=12)
H2 = ParagraphStyle('h2', fontName=B, fontSize=22, leading=27, textColor=INK, spaceBefore=6, spaceAfter=10, keepWithNext=1)
H3 = ParagraphStyle('h3', fontName=B, fontSize=15, leading=19, textColor=TEAL, spaceBefore=8, spaceAfter=4, keepWithNext=1)
META = ParagraphStyle('meta', fontName=I, fontSize=9.8, leading=13, textColor=MUTED, spaceAfter=8)
LABEL = ParagraphStyle('label', fontName=B, fontSize=9, leading=12, textColor=MUTED, spaceBefore=4, spaceAfter=3, keepWithNext=1)
CELL = ParagraphStyle('cell', fontName=R, fontSize=9.8, leading=13, textColor=INK)
CELLB = ParagraphStyle('cellb', parent=CELL, fontName=B, textColor=HexColor('#FFFFFF'))


def inline(t):
    t = escape(t)
    t = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<link href="\2" color="#0F7F86"><u>\1</u></link>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<!\*)\*(?!\*)(.+?)\*(?!\*)', r'<i>\1</i>', t)
    return t


def furniture(canvas, doc):
    canvas.saveState()
    canvas.setFont(R, 8.2)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, A4[1] - 32, HEADER)
    canvas.drawRightString(A4[0] - doc.rightMargin, A4[1] - 32, 'Page %d' % canvas.getPageNumber())
    canvas.drawString(doc.leftMargin, 26, FOOTER)
    canvas.setStrokeColor(RULE)
    canvas.line(doc.leftMargin, A4[1] - 40, A4[0] - doc.rightMargin, A4[1] - 40)
    canvas.restoreState()


def build():
    lines = open(SRC, encoding='utf-8').read().split('\n')
    story = []
    table_rows = []
    in_say = False
    in_example = False
    for raw in lines:
        line = raw.rstrip()
        if line.startswith('|'):
            cells = [c.strip() for c in line.strip('|').split('|')]
            if set(''.join(cells)) <= set('-: '):
                continue
            table_rows.append(cells)
            continue
        if table_rows:
            data = [[Paragraph(inline(c), CELLB if i == 0 else CELL) for c in r] for i, r in enumerate(table_rows)]
            t = Table(data, colWidths=[40, 170, 110, 110, 60])
            t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), INK), ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#FFFFFF'), PANEL]),
                                   ('LINEBELOW', (0, 0), (-1, -1), 0.4, RULE), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                                   ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5), ('LEFTPADDING', (0, 0), (-1, -1), 7)]))
            story.append(t); story.append(Spacer(1, 10)); table_rows = []
        if not line:
            continue
        if line.startswith('# '):
            story.append(Paragraph(inline(line[2:]), TITLE))
        elif line.startswith('## '):
            if story and not (len(story) == 1 and getattr(story[0], 'style', None) is TITLE):
                story.append(PageBreak())
            story.append(Paragraph(inline(line[3:]), H2))
        elif line.startswith('### '):
            m = re.match(r'### (\d\d) \| (.+)', line)
            if m:
                story.append(Paragraph('<font color="#5F6B7A">%s</font>&nbsp;&nbsp;%s' % (m.group(1), inline(m.group(2))), H3))
            else:
                story.append(Paragraph(inline(line[4:]), H3))
        elif line.startswith('- '):
            story.append(Paragraph(inline(line[2:]), BULLET, bulletText='•'))
        elif line.startswith('**Say**'):
            story.append(Paragraph('SAY', LABEL)); in_say, in_example = True, False
        elif line.startswith('**Example**'):
            story.append(Paragraph('EXAMPLE', LABEL)); in_say, in_example = False, True
        elif line.startswith('**Studies on this slide**'):
            story.append(Paragraph('STUDIES ON THIS SLIDE: WHAT EACH ONE DOES HERE', LABEL)); in_say, in_example = False, False
        elif line.startswith('**Next') or line.startswith('**Transition'):
            story.append(Paragraph(inline(line), BODY)); in_say, in_example = False, False
        elif line.startswith('**This slide wants'):
            story.append(Paragraph(inline(line), ASK))
        elif line.startswith('**On the slide') or line.startswith('**This slide') or line.startswith('**Divider'):
            story.append(Paragraph(inline(line), BODY))
        elif line.startswith('*') and line.endswith('*') and not line.startswith('**'):
            story.append(Paragraph(inline(line), META))
        else:
            story.append(Paragraph(inline(line), SAY if in_say else EXAMPLE if in_example else BODY))
    doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=54, rightMargin=54, topMargin=58, bottomMargin=48,
                          title='AUS presenter script', author='Nity G')
    frame = Frame(doc.leftMargin, doc.bottomMargin, A4[0] - doc.leftMargin - doc.rightMargin, A4[1] - doc.topMargin - doc.bottomMargin, id='f')
    doc.addPageTemplates([PageTemplate(id='p', frames=[frame], onPage=furniture)])
    doc.build(story)
    print('wrote', OUT, os.path.getsize(OUT), 'bytes')


if __name__ == '__main__':
    build()
