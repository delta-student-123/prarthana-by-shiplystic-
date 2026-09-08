import re
import os

with open('js/temple-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

images = re.findall(r'image:\s*["\']([^"\']+)["\']', content)
print(f"Found {len(images)} images in temple-data.js:")
all_ok = True
for img in images:
    cleaned = img.replace('../', '')
    exists = os.path.exists(cleaned)
    if not exists:
        all_ok = False
    status = 'OK' if exists else 'MISSING'
    size = os.path.getsize(cleaned) if exists else 0
    print(f"  [{status}] {img} -> {cleaned} ({size:,} bytes)")

print("\nAll temple images present:", all_ok)
