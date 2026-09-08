import shutil
import os

art_dir = r"C:\Users\Dell\.gemini\antigravity-ide\brain\a631707b-4650-4a1a-ae99-66d87dc29b16"
target_dir = r"d:\Prarthana by Shiplystic\images\temples"

mapping = {
    "vaishno_devi_shrine_1788870243924.jpg": "vaishno-devi.jpg",
    "siddhivinayak_temple_1788870263074.jpg": "siddhivinayak.jpg",
    "tirupati_balaji_temple_1788870283779.jpg": "tirupati.jpg",
    "jagannath_puri_temple_1788870306991.jpg": "jagannath-puri.jpg",
    "dwarkadhish_temple_1788870328112.jpg": "dwarkadhish.jpg",
    "badrinath_temple_1788870351873.jpg": "badrinath.jpg",
    "ayodhya_ram_mandir_1788870376048.jpg": "ayodhya.jpg",
    "kedarnath_temple_1788870397947.jpg": "kedarnath.jpg",
    "mathura_vrindavan_temple_1788870417718.jpg": "mathura-vrindavan.jpg"
}

for src_name, dest_name in mapping.items():
    src_path = os.path.join(art_dir, src_name)
    dest_path = os.path.join(target_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copyfile(src_path, dest_path)
        print(f"Copied {src_name} -> {dest_name} ({os.path.getsize(dest_path)} bytes)")
    else:
        print(f"NOT FOUND: {src_path}")

print("\nFiles in images/temples:")
for f in sorted(os.listdir(target_dir)):
    p = os.path.join(target_dir, f)
    print(f"  {f} ({os.path.getsize(p)} bytes)")
