import os
from PIL import Image

logo1 = Image.open(r"d:\Prarthana by Shiplystic\images\logo\shiplystic-logo-horizontal.png")
logo2 = Image.open(r"d:\Prarthana by Shiplystic\images\logo\shiplystic-logo-horizontal-white.png")

print("Logo 1 size & mode:", logo1.size, logo1.mode)
print("Logo 2 size & mode:", logo2.size, logo2.mode)
