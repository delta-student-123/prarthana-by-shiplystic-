import os, re

img_files = []
for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', '.gemini', 'node_modules', 'scratch']):
        continue
    for file in files:
        if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.svg')):
            if 'maha' in file.lower() and 'prasad' in file.lower():
                img_files.append(os.path.join(root, file))

print('Image files with mahaprasad in name:', img_files)

src_matches = []
for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', '.gemini', 'node_modules', 'scratch']):
        continue
    for file in files:
        if file.endswith(('.html', '.js')):
            fpath = os.path.join(root, file)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            for m in re.finditer(r'src=[\'"][^\'"]*maha[\s\-_]*prasad[^\'"]*[\'"]', content, re.I):
                src_matches.append((fpath, m.group(0)))

print('Image src matches:', src_matches)
