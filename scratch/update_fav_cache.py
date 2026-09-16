
import os
import re

count = 0
for root, dirs, files in os.walk('.'):
    if 'scratch' in root or '.git' in root or 'node_modules' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            filepath = os.path.join(root, f)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            
            new_content = re.sub(r'(favicon[^\s"\'>]+)\?v=[0-9]+', r'\1?v=5', content)
            new_content = re.sub(r'(apple-touch-icon[^\s"\'>]+)\?v=[0-9]+', r'\1?v=5', new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as fp:
                    fp.write(new_content)
                count += 1
                print('Updated to v=5:', filepath)

print(f'Total HTML files updated: {count}')
