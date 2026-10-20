# Build AUS-ST5-presenter-guide.pdf from AUS-ST5-presenter-guide.md.
# usage: python build_pdf.py            (needs reportlab; uses Segoe UI when Windows has it)
import os, re, sys
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, PageBreak, Spacer, Table, TableStyle, Flowable

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'AUS-ST5-presenter-guide.md')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'AUS-ST5-presenter-guide.pdf')
INK, MUTED, TEAL, RULE = HexColor('#143344'), HexColor('#52616b'), HexColor('#087f8c'), Color(0.733, 0.835, 0.847)
HEADER = 'ARTIFICIAL URINARY SPHINCTER SURGERY  |  ST5 PRESENTER GUIDE'
FOOTER = 'Evidence checked 5 October 2026  |  Deck revised 10 October 2026'
INDEX_ROWS = 20

FONTS = 'C:/Windows/Fonts/'
if os.path.exists(FONTS + 'segoeui.ttf'):
    for name, f in (('Guide', 'segoeui.ttf'), ('Guide-Bold', 'segoeuib.ttf'), ('Guide-Italic', 'segoeuii.ttf'), ('Guide-BoldItalic', 'segoeuiz.ttf')):
        pdfmetrics.registerFont(TTFont(name, FONTS + f))
    pdfmetrics.registerFontFamily('Guide', normal='Guide', bold='Guide-Bold', italic='Guide-Italic', boldItalic='Guide-BoldItalic')
    R, B, I = 'Guide', 'Guide-Bold', 'Guide-Italic'
else:
    R, B, I = 'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique'

BODY = ParagraphStyle('body', fontName=R, fontSize=10.7, leading=15.4, textColor=INK, spaceAfter=9)
BULLET = ParagraphStyle('bullet', parent=BODY, leftIndent=14, bulletIndent=2, spaceAfter=7)
TITLE = ParagraphStyle('title', fontName=B, fontSize=27, leading=33, textColor=INK, spaceBefore=6, spaceAfter=14)
SUB = ParagraphStyle('sub', fontName=B, fontSize=17.5, leading=22, textColor=INK, spaceAfter=14)
META = ParagraphStyle('meta', fontName=R, fontSize=10.7, leading=15, textColor=MUTED, spaceAfter=10)
H2 = ParagraphStyle('h2', fontName=B, fontSize=20, leading=25, textColor=INK, spaceAfter=12, keepWithNext=1)
EYEBROW = ParagraphStyle('eyebrow', fontName=R, fontSize=9.3, leading=13, textColor=MUTED, spaceAfter=7, keepWithNext=1)
H3 = ParagraphStyle('h3', fontName=B, fontSize=11.4, leading=15, textColor=TEAL, spaceBefore=6, spaceAfter=5, keepWithNext=1)
SAY = ParagraphStyle('say', fontName=I, fontSize=11.2, leading=15.8, textColor=TEAL, spaceAfter=9)
CELL = ParagraphStyle('cell', fontName=R, fontSize=10.2, leading=13.5, textColor=INK)
CELLR = ParagraphStyle('cellr', parent=CELL, alignment=2)


class Mark(Flowable):
    """Zero-height marker: records its page and adds a bookmark and outline entry."""
    def __init__(self, key, title, level, pages):
        super().__init__()
        self.key, self.title, self.level, self.pages = key, title, level, pages

    def wrap(self, w, h):
        return 0, 0

    def draw(self):
        c = self.canv
        self.pages[self.key] = c.getPageNumber()
        c.bookmarkPage(self.key, fit='Fit')
        c.addOutlineEntry(self.title, self.key, level=self.level)


def furniture(canvas, doc):
    canvas.saveState()
    canvas.setFont(R, 8.4)
    canvas.setFillColor(MUTED)
    canvas.drawString(48, A4[1] - 31, HEADER)
    canvas.drawString(48, 24.5, FOOTER)
    canvas.drawRightString(547, 24.5, str(canvas.getPageNumber()))
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.6)
    canvas.line(48, 38.5, 547, 38.5)
    canvas.restoreState()


def parse(text):
    """Markdown blocks as (kind, text): h1, h2, h3, p, li."""
    out = []
    for raw in text.replace('\r\n', '\n').split('\n'):
        line = raw.strip()
        if not line:
            continue
        for mark, kind in (('### ', 'h3'), ('## ', 'h2'), ('# ', 'h1'), ('- ', 'li')):
            if line.startswith(mark):
                out.append((kind, line[len(mark):]))
                break
        else:
            out.append(('p', line))
    return out


def inline(md, code_re):
    """Bold, external links and citation-code links for a ReportLab paragraph."""
    def codes(s):
        s = escape(s)
        return code_re.sub(lambda m: '<a href="#ref-%s" color="#087f8c">%s</a>' % (m.group(1), m.group(1)), s) if code_re else s

    def bold(s):
        parts = re.split(r'\*\*(.+?)\*\*', s)
        return ''.join(codes(x) if i % 2 == 0 else '<b>%s</b>' % codes(x) for i, x in enumerate(parts))

    out, at = [], 0
    for m in re.finditer(r'\[([^\]]+)\]\(([^)\s]+)\)', md):
        out.append(bold(md[at:m.start()]))
        out.append('<a href="%s" color="#087f8c"><u>%s</u></a>' % (escape(m.group(2), {'"': '&quot;'}), escape(m.group(1))))
        at = m.end()
    out.append(bold(md[at:]))
    return ''.join(out)


def slide_label(n):
    if n == 1:
        return 'SLIDE 01 COVER'
    if n <= 39:
        return 'SLIDE %02d TEACHING %02d' % (n, n - 1)
    return 'SLIDE %02d BACKUP / REFERENCES' % n


def story(blocks, pages):
    code_names = [m.group(1) for k, t in blocks if k == 'h3' for m in [re.match(r'([A-Z][A-Z0-9]+) \| ', t)] if m]
    code_re = re.compile(r'\b(%s)\b' % '|'.join(sorted(set(code_names), key=len, reverse=True)))
    slides = [(int(m.group(1)), m.group(2)) for k, t in blocks if k == 'h2' for m in [re.match(r'Slide (\d+) \| (.*)', t)] if m]
    s, section, seen_h2 = [], '', 0

    def index():
        for start in range(0, len(slides), INDEX_ROWS):
            s.append(PageBreak())
            head = 'Slide index' if start == 0 else 'Slide index continued'
            if start == 0:
                s.append(Mark('slide-index', head, 0, pages))
            s.append(Paragraph(head, H2))
            s.append(Paragraph('The numbers below match the standard 49-slide PowerPoint, including its cover and backup slides.', META))
            rows = [[Paragraph('%02d' % n, CELL), Paragraph('<a href="#slide-%d">%s</a>' % (n, escape(title)), CELL),
                     Paragraph('<a href="#slide-%d">%s</a>' % (n, pages.get('slide-%d' % n, '')), CELLR)] for n, title in slides[start:start + INDEX_ROWS]]
            t = Table(rows, colWidths=[30, 425, 32], hAlign='LEFT')
            t.setStyle(TableStyle([('LINEBELOW', (0, 0), (-1, -1), 0.5, HexColor('#e3ecee')), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                                   ('TOPPADDING', (0, 0), (-1, -1), 3.2), ('BOTTOMPADDING', (0, 0), (-1, -1), 5.2),
                                   ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 4)]))
            s.append(t)

    done_index = False
    for kind, text in blocks:
        if kind == 'h1':
            s.append(Mark('top', text, 0, pages))
            s.append(Paragraph(escape(text), TITLE))
        elif kind == 'h2':
            seen_h2 += 1
            section = ''
            m = re.match(r'Slide (\d+) \| (.*)', text)
            if seen_h2 == 1:
                s.append(Paragraph(escape(text), SUB))
                continue
            if m and not done_index:
                index()
                done_index = True
            s.append(PageBreak())
            if m:
                n = int(m.group(1))
                s.append(Mark('slide-%d' % n, m.group(2), 0, pages))
                s.append(Paragraph(slide_label(n), EYEBROW))
                s.append(Paragraph(escape(m.group(2)), H2))
            else:
                s.append(Mark('sec-%d' % seen_h2, text, 0, pages))
                s.append(Paragraph(escape(text), H2))
        elif kind == 'h3':
            section = text
            m = re.match(r'([A-Z][A-Z0-9]+) \| ', text)
            if m:
                s.append(Mark('ref-' + m.group(1), text, 1, pages))
            s.append(Paragraph(escape(text), H3))
        elif kind == 'li':
            s.append(Paragraph(inline(text, code_re), BULLET, bulletText='\u2022'))
        elif seen_h2 == 1 and text.startswith('Prepared for'):
            s.append(Paragraph(escape(text), META))
        else:
            s.append(Paragraph(inline(text, code_re), SAY if section == 'A speaking line' else BODY))
    return s


def build(blocks, pages):
    doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=54, rightMargin=54, topMargin=56, bottomMargin=52,
                          title='AUS surgery: ST5 presenter guide to all 49 slides', author='Prepared for Nity G',
                          subject='Slide explanations and cited evidence, checked 5 October 2026; deck revised 10 October 2026')
    frame = Frame(54, 52, A4[0] - 108, A4[1] - 108, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates(PageTemplate(id='page', frames=[frame], onPage=furniture))
    doc.build(story(blocks, pages))


blocks = parse(open(SRC, encoding='utf8').read())
pages = {}
build(blocks, pages)          # first pass records page numbers
build(blocks, dict(pages))    # second pass prints them in the slide index
print('wrote', OUT, os.path.getsize(OUT), 'bytes')
