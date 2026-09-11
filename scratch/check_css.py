import os, re

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', '.gemini', 'node_modules', 'scratch']):
        continue
    for file in files:
        if file.endswith('.css'):
            fpath = os.path.join(root, file)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            for m in re.finditer(r'maha[\s\-_]*prasad', content, re.I):
                print('CSS match in', fpath, ':', m.group(0))

print('CSS check done!')
