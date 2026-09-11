import os, re
from collections import Counter

counts = Counter()
for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', '.gemini', 'node_modules', 'scratch']):
        continue
    for file in files:
        if file.endswith(('.html', '.js', '.json')):
            fpath = os.path.join(root, file)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            for m in re.finditer(r'maha[\s\-_]*prasad', content, re.I):
                counts[m.group(0)] += 1

for k, v in counts.most_common():
    print(f"{repr(k)}: {v}")
