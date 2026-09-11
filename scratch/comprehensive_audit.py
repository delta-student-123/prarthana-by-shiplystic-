import os, re

root_dir = '.'
pattern = re.compile(r'maha[\s\-_]*prasad', re.IGNORECASE)
found_any = False

for root, dirs, files in os.walk(root_dir):
    if any(p in root for p in ['.git', '.gemini', 'node_modules', 'scratch']):
        continue
    for file in files:
        if file.endswith(('.html', '.js', '.css', '.json', '.txt')):
            fpath = os.path.join(root, file)
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            matches = list(pattern.finditer(content))
            if matches:
                found_any = True
                print(f"FOUND in {fpath}:")
                for m in matches:
                    start = max(0, m.start() - 20)
                    end = min(len(content), m.end() + 20)
                    print(f"   ...{repr(content[start:end])}...")

if not found_any:
    print("SUCCESS: Zero occurrences of 'Maha Prasad' or 'Mahaprasad' remain across the entire website!")
