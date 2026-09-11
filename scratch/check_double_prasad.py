import os, re

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', '.gemini', 'node_modules', 'scratch']):
        continue
    for file in files:
        if file.endswith(('.html', '.js', '.json')):
            fpath = os.path.join(root, file)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            # check if Maha Prasad Prasad or Mahaprasad Prasad exists
            for m in re.finditer(r'maha[\s\-_]*prasad\s+prasad', content, re.I):
                print('Double prasad in', fpath, ':', m.group(0))
            for m in re.finditer(r'prasad\s+maha[\s\-_]*prasad', content, re.I):
                print('Prasad maha in', fpath, ':', m.group(0))

print('Double check completed!')
