import shutil
from pathlib import Path

# Paths to generated images
gen_step1 = Path(r"C:\Users\Dell\.gemini\antigravity-ide\brain\7ef0fe58-b2d1-42c0-9d85-f9d465a6e72a\process_step1_temple_1789045465444.jpg")
gen_step2 = Path(r"C:\Users\Dell\.gemini\antigravity-ide\brain\7ef0fe58-b2d1-42c0-9d85-f9d465a6e72a\process_step2_puja_1789045617048.jpg")
gen_step3 = Path(r"C:\Users\Dell\.gemini\antigravity-ide\brain\7ef0fe58-b2d1-42c0-9d85-f9d465a6e72a\process_step3_prasad_1789045787845.jpg")
gen_step4 = Path(r"C:\Users\Dell\.gemini\antigravity-ide\brain\7ef0fe58-b2d1-42c0-9d85-f9d465a6e72a\process_step4_delivery_1789045822040.jpg")

backup_dir = Path("images/backup")
backup_dir.mkdir(parents=True, exist_ok=True)

# Target files
t1 = Path("images/process-step1-temple.jpg")
t2 = Path("images/process-step2-puja.jpg")
t3 = Path("images/process-step3-prasad.jpg")
t4 = Path("images/sidebar-prasad-box.jpg")
t4_alt = Path("images/process-step4-delivery.jpg")

# Backup existing
for t in [t1, t2, t3, t4]:
    if t.exists():
        shutil.copy2(t, backup_dir / t.name)
        print(f"Backed up {t} to {backup_dir}")

# Copy new images
shutil.copy2(gen_step1, t1)
print(f"Updated {t1}")

shutil.copy2(gen_step2, t2)
print(f"Updated {t2}")

shutil.copy2(gen_step3, t3)
print(f"Updated {t3}")

shutil.copy2(gen_step4, t4)
shutil.copy2(gen_step4, t4_alt)
print(f"Updated {t4} and {t4_alt}")

print("All 4 process images replaced successfully!")
