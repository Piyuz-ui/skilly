"""Builds Skilly's app icons into public/ (run: python3 scripts/make-icons.py).
Plum-to-violet rounded square, white rounded "S", pink drip, soft bubble."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'public')
FONT = '/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf'
S = 1024  # master size

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def master(rounded=True, details=True):
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    # diagonal gradient: deep plum → violet
    grad = Image.new('RGB', (S, S))
    gp = grad.load()
    c1, c2 = (43, 24, 50), (138, 100, 184)
    for y in range(S):
        for x in range(S):
            gp[x, y] = lerp(c1, c2, min(1, (x * 0.35 + (S - y) * 0.65) / S))
    mask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.23) if rounded else 0, fill=255)
    img.paste(grad, (0, 0), mask)
    d = ImageDraw.Draw(img)
    # soft glass bubble, top-right (left off tiny favicons, where it turns to mush)
    bub = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bub)
    bd.ellipse([int(S * .66), int(S * .1), int(S * .9), int(S * .34)], fill=(255, 255, 255, 38), outline=(255, 255, 255, 90), width=6)
    bd.ellipse([int(S * .71), int(S * .15), int(S * .77), int(S * .2)], fill=(255, 255, 255, 150))
    if details:
        img.alpha_composite(bub)
    # the S
    font = ImageFont.truetype(FONT, int(S * 0.66))
    box = d.textbbox((0, 0), 'S', font=font)
    w, h = box[2] - box[0], box[3] - box[1]
    x, y = (S - w) / 2 - box[0] - S * 0.02, (S - h) / 2 - box[1] - S * 0.02
    shadow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).text((x + 10, y + 18), 'S', font=font, fill=(20, 8, 26, 120))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(14)))
    d.text((x, y), 'S', font=font, fill=(250, 246, 252, 255))
    # pink drip hanging from the lower curve of the S (like the site's wordmark)
    if details:
        sb = d.textbbox((x, y), 'S', font=font)
        cx, top = sb[0] + (sb[2] - sb[0]) * 0.70, sb[3] - S * 0.045
        r = S * 0.04
        pink = (236, 142, 164, 255)
        # teardrop: narrow neck from the letter, swelling into a round drop
        d.polygon([(cx - r * 0.28, top), (cx + r * 0.28, top), (cx + r * 0.98, top + r * 1.9), (cx - r * 0.98, top + r * 1.9)], fill=pink)
        d.ellipse([cx - r, top + r * 1.2, cx + r, top + r * 3.2], fill=pink)
    if rounded:
        img.putalpha(Image.composite(img.getchannel('A'), Image.new('L', (S, S), 0), mask))
    return img

rounded = master(True)
tiny = master(True, details=False)
square = master(False)  # iOS adds its own rounded corners; it must be opaque
def save(im, name, size, opaque=False):
    out = im.resize((size, size), Image.LANCZOS)
    if opaque:
        bg = Image.new('RGB', out.size, (43, 24, 50)); bg.paste(out, mask=out.getchannel('A')); out = bg
    out.save(os.path.join(OUT, name))

save(square, 'apple-touch-icon.png', 180, opaque=True)
save(square, 'apple-touch-icon-precomposed.png', 180, opaque=True)
save(rounded, 'icon-192.png', 192)
save(rounded, 'icon-512.png', 512)
save(square, 'icon-maskable-512.png', 512, opaque=True)
save(tiny, 'favicon-32.png', 32)
tiny.resize((64, 64), Image.LANCZOS).save(os.path.join(OUT, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print('icons written to public/')
