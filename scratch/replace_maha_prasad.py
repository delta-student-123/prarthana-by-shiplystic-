import os, re

root_dir = '.'
modified_files = []
total_replacements = 0

pattern = re.compile(r'Maha\s+Prasad|Mahaprasad')

for root, dirs, files in os.walk(root_dir):
    if any(p in root for p in ['.git', '.gemini', 'node_modules', 'scratch']):
        continue
    for file in files:
        if file.endswith(('.html', '.js')):
            fpath = os.path.join(root, file)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            matches = pattern.findall(content)
            if matches:
                # Replace with 'Prasad'
                new_content = pattern.sub('Prasad', content)
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                modified_files.append((fpath, len(matches)))
                total_replacements += len(matches)

print(f"Replacement complete! Modified {len(modified_files)} files with {total_replacements} replacements.")
for f, cnt in sorted(modified_files):
    print(f"  {f}: {cnt}")
