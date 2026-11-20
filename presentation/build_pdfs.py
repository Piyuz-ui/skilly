"""Rebuild every presentation PDF from its HTML source.

Usage (from the project folder):
    python3 presentation/build_pdfs.py

Needs Google Chrome installed. Edit slides in presentation/deck/slides/*.html
(speaker notes live in each slide's <aside>), handouts in presentation/handouts/,
then run this script. Output goes to presentation/pdf/.
"""
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

HERE = pathlib.Path(__file__).resolve().parent
DECK = HERE / "deck"
OUT = HERE / "pdf"
FONTS = ("https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600"
         "&family=Manrope:wght@400;600;700&display=swap")

CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
]


def find_chrome():
    for c in CHROME_CANDIDATES:
        if pathlib.Path(c).exists() or shutil.which(c):
            return c
    sys.exit("Google Chrome not found. Install it, or edit CHROME_CANDIDATES.")


def slides():
    deck = json.loads((DECK / "deck.json").read_text())
    for i, sid in enumerate(deck["order"], 1):
        yield i, (DECK / "slides" / f"{sid}.html").read_text()


def deck_html():
    css = (DECK / "deck.css").read_text()
    body = "".join(re.sub(r"<aside>.*?</aside>", "", h, flags=re.S) for _, h in slides())
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="{FONTS}"><style>
@page {{ size: 1920px 1080px; margin: 0; }}
html, body {{ margin: 0; padding: 0; background: #120C17; }}
* {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
h1, h2, h3, p {{ margin: 0; }}
{css}
section {{ width: 1920px; height: 1080px; position: relative; overflow: hidden; break-after: page; }}
*, *::before, *::after {{ animation: none !important; transition: none !important; }}
</style></head><body>{body}</body></html>"""


def notes_html():
    rows = []
    for i, h in slides():
        t = re.search(r"<h[12][^>]*>(.*?)</h[12]>", h, re.S).group(1)
        t = re.sub(r"<[^>]+>", "", re.sub(r"<br\s*/?>", " ", t))
        n = re.search(r"<aside>(.*?)</aside>", h, re.S)
        paras = "".join(f"<p>{x}</p>" for x in (n.group(1) if n else "").split("\n") if x.strip())
        rows.append(f'<div class="s"><div class="k">Slide {i}</div><h2>{t}</h2>{paras}</div>')
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="{FONTS}"><style>
@page {{ size: A4; margin: 18mm; }}
body {{ font-family: Manrope, Arial, sans-serif; color: #1A1020; font-size: 11.5pt; line-height: 1.5; }}
h1 {{ font-family: Fredoka, Arial; font-size: 24pt; margin: 0 0 14pt; }}
.s {{ break-inside: avoid; border-top: 1.5pt solid #CDB9EC; padding: 10pt 0 6pt; }}
.k {{ font-size: 8.5pt; letter-spacing: 1.5pt; text-transform: uppercase; color: #8A5FB8; font-weight: 700; }}
h2 {{ font-family: Fredoka, Arial; font-size: 14pt; margin: 2pt 0 6pt; }} p {{ margin: 0 0 6pt; }}
</style></head><body><h1>Skilly · speaker notes</h1>{''.join(rows)}</body></html>"""


def render(chrome, html_path, pdf_path):
    subprocess.run([chrome, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    "--virtual-time-budget=8000", f"--print-to-pdf={pdf_path}",
                    html_path.as_uri()], check=True, capture_output=True)
    print("wrote", pdf_path.relative_to(HERE.parent))


def main():
    chrome = find_chrome()
    OUT.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        for name, html in [("Skilly-Round3-Pitch", deck_html()),
                           ("Skilly-Round3-Speaker-Notes", notes_html())]:
            src = tmp / f"{name}.html"
            src.write_text(html)
            render(chrome, src, OUT / f"{name}.pdf")
    render(chrome, HERE / "handouts" / "judges-qa.html", OUT / "Skilly-Judges-QA.pdf")
    render(chrome, HERE / "handouts" / "final-5min-pitch.html", OUT / "Skilly-Final-5min-Pitch.pdf")


if __name__ == "__main__":
    main()
