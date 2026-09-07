from PIL import Image

def analyze(path):
    img = Image.open(path).convert("RGBA")
    colors = img.getcolors(maxcolors=100000)
    red_count = 0
    black_count = 0
    white_count = 0
    for count, (r, g, b, a) in colors:
        if a < 50:
            continue
        if r > 180 and g < 100 and b < 100:
            red_count += count
        elif r < 50 and g < 50 and b < 50:
            black_count += count
        elif r > 200 and g > 200 and b > 200:
            white_count += count
    print(path, "-> Red:", red_count, "Black:", black_count, "White:", white_count)

analyze(r"d:\Prarthana by Shiplystic\images\logo\shiplystic-logo-horizontal.png")
analyze(r"d:\Prarthana by Shiplystic\images\logo\shiplystic-logo-horizontal-white.png")
