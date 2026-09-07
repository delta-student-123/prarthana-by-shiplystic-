import os
import glob
import re

html_files = glob.glob("**/*.html", recursive=True)

# Match <li><a href="..." class="nav-link...">Book Prarthana</a></li> with optional trailing newline
pattern = re.compile(r'^\s*<li>\s*<a\s+href="[^"]*"\s+class="nav-link[^"]*">\s*Book Prarthana\s*</a>\s*</li>\r?\n?', re.MULTILINE)

modified_files = []

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = pattern.sub('', content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        modified_files.append(filepath)

print(f"Modified {len(modified_files)} files:")
for m in modified_files:
    print(" -", m)
