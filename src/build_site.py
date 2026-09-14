"""Build a single self-contained HTML page reproducing the v3 poster design
exactly (live CSS gradient-over-photo, same as the original Claude Design
source — no Word-related compromises needed here), with in-browser export:
  - "Export PNG" per language, via html2canvas
  - "Export PDF" (both pages), via the browser's native print dialog

All assets (background photo, logo, fonts, html2canvas itself) are inlined
(base64 data URIs / inline script) so the file works standalone from a plain
double-click (file://) with no CORS/canvas-tainting issues for the PNG
export, no CDN dependency, and no separate assets folder to keep track of.

Uses plain string.replace() with unique tokens instead of str.format(): the
template's CSS/JS (and the vendored html2canvas source) are full of literal
braces that .format() would misparse as placeholders.
"""
import base64
import re
from pathlib import Path

from PIL import Image

SRC = Path("design-source/daily-displacement-poster-v3.dc.html")
BG_PHOTO_SRC = Path("assets/background.jpg")
BG_PHOTO_WEB = Path("assets/background-web.jpg")
LOGO = Path("assets/logo.png")
FONT_DIR = Path("assets/fonts")
HTML2CANVAS = Path("assets/html2canvas.min.js")
OUT = Path("../index.html")


def build_web_background():
    """A ~2200px-wide recompression of the original 6000x3376 photo — the
    browser only ever displays it at print/screen size via background-size:
    cover, so shipping the full-resolution original just bloats this
    self-contained file for no visible gain."""
    im = Image.open(BG_PHOTO_SRC).convert("RGB")
    if im.width > 2200:
        ratio = 2200 / im.width
        im = im.resize((2200, round(im.height * ratio)), Image.LANCZOS)
    im.save(BG_PHOTO_WEB, quality=85)


def b64(path, mime):
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{data}"


def fix_paths(section, bg_uri, logo_uri):
    section = section.replace("uploads/DSC06426.JPG", bg_uri)
    section = section.replace("uploads/g%C3%BCzelEser_logo.png", logo_uri)
    section = re.sub(r'\s?data-screen-label="[A-Z]+"', "", section)
    return section


# Every number in the poster, marked editable. Matched by each div's exact
# style string, which (per the v3 source) is unique to that one figure —
# except the two spots reused for different numbers (families/governorate
# count share one style, the four damage stats share another), where the
# match is instead resolved by *position* since they always appear in the
# same fixed DOM order for both languages.
EDITABLE_BY_STYLE = [
    ("font-size:21px;font-weight:700;background:#9C1C33;border-radius:999px;padding:6px 20px", "date"),
    ("font-size:76px;font-weight:700;line-height:1;margin-top:5px;letter-spacing:-2px", "total"),
]
EDITABLE_BY_STYLE_ORDERED = [
    # (style, [data-keys in DOM order of appearance])
    ("font-size:40px;font-weight:700;line-height:1.05;margin-top:2px", ["families", "governorates"]),
    ("font-size:34px;font-weight:700;line-height:1.05;margin-top:4px",
     ["damage-0", "damage-1", "damage-2", "damage-3"]),
]


def mark_editable(section, lang):
    for style, key in EDITABLE_BY_STYLE:
        needle = f'style="{style}">'
        replacement = f'style="{style}" contenteditable="true" data-key="{lang}-{key}">'
        assert section.count(needle) == 1, (style, section.count(needle))
        section = section.replace(needle, replacement, 1)

    for style, keys in EDITABLE_BY_STYLE_ORDERED:
        needle = f'style="{style}">'
        assert section.count(needle) == len(keys), (style, section.count(needle))
        parts = section.split(needle)
        rebuilt = parts[0]
        for i, key in enumerate(keys):
            rebuilt += f'style="{style}" contenteditable="true" data-key="{lang}-{key}">' + parts[i + 1]
        section = rebuilt
    return section


URANGES = {
    "arabic": "U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, "
              "U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC, "
              "U+102E0-102FB, U+10E60-10E7E, U+10EC2-10EC4, U+10EFC-10EFF, U+1EE00-1EE03, "
              "U+1EE05-1EE1F, U+1EE21-1EE22, U+1EE24, U+1EE27, U+1EE29-1EE32, U+1EE34-1EE37, "
              "U+1EE39, U+1EE3B, U+1EE42, U+1EE47, U+1EE49, U+1EE4B, U+1EE4D-1EE4F, U+1EE51-1EE52, "
              "U+1EE54, U+1EE57, U+1EE59, U+1EE5B, U+1EE5D, U+1EE5F, U+1EE61-1EE62, U+1EE64, "
              "U+1EE67-1EE6A, U+1EE6C-1EE72, U+1EE74-1EE77, U+1EE79-1EE7C, U+1EE7E, U+1EE80-1EE89, "
              "U+1EE8B-1EE9B, U+1EEA1-1EEA3, U+1EEA5-1EEA9, U+1EEAB-1EEBB, U+1EEF0-1EEF1",
    "latin": "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, "
             "U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, "
             "U+FEFF, U+FFFD",
    "latinext": "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, "
                "U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, "
                "U+2113, U+2C60-2C7F, U+A720-A7FF",
}


def font_faces():
    blocks = []
    for weight in (400, 500, 600, 700):
        for subset in ("arabic", "latin", "latinext"):
            f = FONT_DIR / f"plex-arabic-{weight}-{subset}.woff2"
            uri = b64(f, "font/woff2")
            blocks.append(f"""  @font-face {{
    font-family: 'IBM Plex Sans Arabic';
    font-style: normal;
    font-weight: {weight};
    font-display: swap;
    src: url('{uri}') format('woff2');
    unicode-range: {URANGES[subset]};
  }}""")
    return "\n".join(blocks)


PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="utf-8">
<title>__PAGE_TITLE__</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>
__HTML2CANVAS_JS__
</script>
<style>
__FONT_FACES__

  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #0b1420; }
  body { font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif; }

  .toolbar {
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    flex-wrap: wrap;
    background: #0f1c2c; padding: 14px 16px; border-bottom: 1px solid #223449;
    font-family: system-ui, sans-serif;
  }
  .toolbar button {
    appearance: none; border: 1px solid #3C5A78; background: #14395E; color: #fff;
    font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 999px;
    cursor: pointer; transition: background .15s ease;
  }
  .toolbar button:hover { background: #1B4468; }
  .toolbar button.accent { background: #9C1C33; border-color: #9C1C33; }
  .toolbar button.accent:hover { background: #b32540; }
  .toolbar .label { color: #9fb0c3; font-size: 13px; margin-inline-end: 4px; }
  .toolbar button:disabled { opacity: .5; cursor: wait; }

  .pages { display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 28px 12px; }
  .page { width: 210mm; height: 297mm; box-shadow: 0 10px 40px rgba(0,0,0,0.45); flex-shrink: 0; }

  [contenteditable="true"] {
    border-radius: 6px;
    outline: 1px dashed rgba(255,255,255,0.35);
    outline-offset: 3px;
    cursor: text;
  }
  [contenteditable="true"]:hover { background: rgba(255,255,255,0.08); }
  [contenteditable="true"]:focus {
    outline: 2px solid #EBC9CF;
    background: rgba(255,255,255,0.12);
  }

  @page { size: A4; margin: 0; }
  @media print {
    body { background: #fff; }
    .toolbar { display: none !important; }
    .pages { gap: 0; padding: 0; }
    .page { box-shadow: none; page-break-after: always; }
    .page:last-child { page-break-after: auto; }
    [contenteditable="true"] { outline: none !important; background: none !important; }
  }
</style>
</head>
<body>

<div class="toolbar no-print">
  <span class="label">انقر على أي رقم في التقرير لتعديله — </span>
  <button onclick="resetNumbers()">إعادة الأرقام الأصلية</button>
  <span class="label">تصدير:</span>
  <button onclick="exportPng('page-ar', '__AR_FILENAME__.png')">صورة PNG (عربي)</button>
  <button onclick="exportPng('page-tr', '__TR_FILENAME__.png')">صورة PNG (Türkçe)</button>
  <button class="accent" onclick="window.print()">تصدير PDF (طباعة)</button>
</div>

<div class="pages">
__AR_SECTION__
__TR_SECTION__
</div>

<script>
const STORAGE_PREFIX = 'guzel-eser-poster-edit:';

function loadSavedNumbers() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const saved = localStorage.getItem(STORAGE_PREFIX + el.dataset.key);
    if (saved !== null) el.textContent = saved;
  });
}

function wireEditableNumbers() {
  document.querySelectorAll('[data-key]').forEach(el => {
    // Original value, for the reset button — captured before any restore.
    if (!el.dataset.original) el.dataset.original = el.textContent;

    el.addEventListener('input', () => {
      localStorage.setItem(STORAGE_PREFIX + el.dataset.key, el.textContent);
    });

    // Paste as plain text only — a contenteditable number field shouldn't
    // pick up formatting (or a stray newline) from whatever was copied.
    el.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, text);
    });

    // Enter confirms the edit instead of inserting a line break.
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
    });
  });
}

function resetNumbers() {
  if (!confirm('سيعيد هذا كل الأرقام إلى قيمها الأصلية في هذا المتصفح. متابعة؟')) return;
  document.querySelectorAll('[data-key]').forEach(el => {
    localStorage.removeItem(STORAGE_PREFIX + el.dataset.key);
    if (el.dataset.original) el.textContent = el.dataset.original;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  wireEditableNumbers();
  loadSavedNumbers();
});

async function exportPng(id, filename) {
  const el = document.getElementById(id);
  const btns = document.querySelectorAll('.toolbar button');
  btns.forEach(b => b.disabled = true);
  try {
    const canvas = await html2canvas(el, {
      scale: 3, useCORS: true, backgroundColor: null,
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll('[contenteditable]').forEach(n => {
          n.style.outline = 'none';
          n.style.background = 'none';
        });
      },
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (e) {
    alert('تعذّر إنشاء الصورة: ' + e.message);
  } finally {
    btns.forEach(b => b.disabled = false);
  }
}
</script>

</body>
</html>
"""


DATE_STYLE = "font-size:21px;font-weight:700;background:#9C1C33;border-radius:999px;padding:6px 20px"


def extract_date(section):
    m = re.search(rf'style="{re.escape(DATE_STYLE)}">([^<]+)<', section)
    return m.group(1)


def safe_filename(name):
    for ch in '/\\:*?"<>|':
        name = name.replace(ch, "-")
    return name


def main():
    build_web_background()
    src = SRC.read_text(encoding="utf-8")
    ar, tr = re.findall(r'<section class="page".*?</section>', src, re.S)

    ar_date = extract_date(ar)
    tr_date = extract_date(tr)
    ar_filename = safe_filename(f"الوضع الإنساني - اليمن {ar_date}")
    tr_filename = safe_filename(f"İnsani Durum - Yemen {tr_date}")
    page_title = f"{ar_filename} · {tr_filename}"

    bg_uri = b64(BG_PHOTO_WEB, "image/jpeg")
    logo_uri = b64(LOGO, "image/png")

    ar = fix_paths(ar, bg_uri, logo_uri).replace('<section class="page"', '<section id="page-ar" class="page"', 1)
    tr = fix_paths(tr, bg_uri, logo_uri).replace('<section class="page"', '<section id="page-tr" class="page"', 1)
    ar = mark_editable(ar, "ar")
    tr = mark_editable(tr, "tr")

    html = PAGE_TEMPLATE
    html = html.replace("__HTML2CANVAS_JS__", HTML2CANVAS.read_text(encoding="utf-8"))
    html = html.replace("__FONT_FACES__", font_faces())
    html = html.replace("__AR_SECTION__", ar)
    html = html.replace("__TR_SECTION__", tr)
    html = html.replace("__AR_FILENAME__", ar_filename)
    html = html.replace("__TR_FILENAME__", tr_filename)
    html = html.replace("__PAGE_TITLE__", page_title)

    OUT.write_text(html, encoding="utf-8")
    print("saved", OUT, len(html) / 1024, "KB")
    print("AR filename:", ar_filename)
    print("TR filename:", tr_filename)


if __name__ == "__main__":
    main()
