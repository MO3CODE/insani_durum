"""Build index.html: one self-contained page that renders the weekly
displacement report (Arabic, Turkish, English) from data, with an edit
panel, a weekly archive, and PNG / PDF / social-media exports.

Sources (all under src/):
  app/template.html, app/app.css, app/app.js   the page itself
  assets/                                      photo, logo, fonts, icons, libraries
  ../data/reports.json                         the reports baked in as the
                                               starting data (the live copy is
                                               fetched from api/data.js)

Everything is inlined (base64 data URIs / inline scripts) so the file also
works from a plain double-click (file://), with no CDN dependency and no
canvas-tainting issues for the PNG export.

Uses plain str.replace() with unique tokens instead of str.format(): the
CSS/JS (and the vendored libraries) are full of literal braces.

Run from the src/ folder:  python3 build_site.py
Needs: Pillow (pip install pillow). Optional: segno (pip install segno) for
the donation QR code on the story format — without it the QR is left out.
"""
import base64
import json
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
APP = HERE / "app"
ASSETS = HERE / "assets"
BG_PHOTO_SRC = ASSETS / "background.jpg"
BG_PHOTO_WEB = ASSETS / "background-web.jpg"
LOGO = ASSETS / "logo.png"
LOGO_WEB = ASSETS / "logo-web.png"
FONT_DIR = ASSETS / "fonts"
ICON_DIR = ASSETS / "icons"
HTML2CANVAS = ASSETS / "html2canvas.min.js"
FFLATE = ASSETS / "fflate.min.js"
SEED = HERE.parent / "data" / "reports.json"
OUT = HERE.parent / "index.html"

# Where the QR code on the story format leads, and the short address printed
# beside it (and in the post footer).
DONATE_URL = "https://guzeleser.org/bagis/kumbara-bagisi/"
SITE_LABEL = "guzeleser.org"

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


def build_web_images():
    """Recompress the 6000px original photo to ~2200px and the 1080px logo to
    240px: the page only ever shows them at print/screen size, so shipping the
    originals just bloats this self-contained file for no visible gain."""
    im = Image.open(BG_PHOTO_SRC).convert("RGB")
    if im.width > 2200:
        ratio = 2200 / im.width
        im = im.resize((2200, round(im.height * ratio)), Image.LANCZOS)
    im.save(BG_PHOTO_WEB, quality=85)

    logo = Image.open(LOGO)
    logo.thumbnail((240, 240), Image.LANCZOS)
    logo.save(LOGO_WEB, optimize=True)


def b64(path, mime):
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{data}"


def font_faces():
    blocks = []
    for weight in (400, 500, 600, 700):
        for subset in ("arabic", "latin", "latinext"):
            f = FONT_DIR / f"plex-arabic-{weight}-{subset}.woff2"
            uri = b64(f, "font/woff2")
            blocks.append(f"""@font-face {{
  font-family: 'IBM Plex Sans Arabic';
  font-style: normal;
  font-weight: {weight};
  font-display: swap;
  src: url('{uri}') format('woff2');
  unicode-range: {URANGES[subset]};
}}""")
    return "\n".join(blocks)


def icons():
    return {p.stem: p.read_text(encoding="utf-8").strip() for p in sorted(ICON_DIR.glob("*.svg"))}


def qr_svg():
    try:
        import segno
    except ImportError:
        print("segno not installed: story format will have no QR code")
        return None
    qr = segno.make(DONATE_URL, error="m")
    size = qr.symbol_size(scale=1, border=0)[0]
    # Built by hand rather than with qr.svg_inline(): explicit colours (no
    # currentColor) and a viewBox, so html2canvas draws it at any size.
    path = []
    for y, row in enumerate(qr.matrix):
        for x, dark in enumerate(row):
            if dark:
                path.append(f"M{x} {y}h1v1h-1z")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
            f'width="100%" height="100%" shape-rendering="crispEdges">'
            f'<path fill="#0E2A46" d="{"".join(path)}"/></svg>')


def script_json(value):
    # JSON inside an inline <script>: keep "</script>" from closing the tag.
    return json.dumps(value, ensure_ascii=False).replace("</", "<\\/")


def main():
    build_web_images()
    seed = json.loads(SEED.read_text(encoding="utf-8"))

    html = (APP / "template.html").read_text(encoding="utf-8")
    # The libraries go in first: later tokens must never be looked for inside them.
    replacements = [
        ("__HTML2CANVAS_JS__", HTML2CANVAS.read_text(encoding="utf-8")),
        ("__FFLATE_JS__", FFLATE.read_text(encoding="utf-8")),
        ("__APP_CSS__", (APP / "app.css").read_text(encoding="utf-8")),
        ("__APP_JS__", (APP / "app.js").read_text(encoding="utf-8")),
        ("__FONT_FACES__", font_faces()),
        ("__BG_URI__", b64(BG_PHOTO_WEB, "image/jpeg")),
        ("__LOGO_URI__", b64(LOGO_WEB, "image/png")),
        ("__SEED_JSON__", script_json(seed)),
        ("__ICONS_JSON__", script_json(icons())),
        ("__QR_JSON__", script_json(qr_svg())),
        ("__SITE_LABEL__", SITE_LABEL),
    ]
    for token, value in replacements:
        assert html.count(token) == 1, (token, html.count(token))
        html = html.replace(token, value)

    OUT.write_text(html, encoding="utf-8")
    print("saved", OUT, round(len(html.encode("utf-8")) / 1024), "KB")


if __name__ == "__main__":
    main()
