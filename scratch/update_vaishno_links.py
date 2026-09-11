import os
import re

count = 0
for root, dirs, files in os.walk('.'):
    # skip git and scratch
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Pattern for mega-item linking to book-prarthana for Mata Vaishno Devi Shrine
            pattern = re.compile(
                r'<a\s+href="[^"]*book-prarthana[^"]*"\s+class="mega-item">\s*<div\s+class="mega-item-title">Mata Vaishno Devi Shrine</div>',
                re.MULTILINE
            )
            
            replacement = '<a href="/temples/vaishno-devi" class="mega-item">\n                        <div class="mega-item-title">Mata Vaishno Devi Shrine</div>'
            
            new_content, n = pattern.subn(replacement, content)
            if n > 0:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += n
                print(f"Updated {n} occurrences in {filepath}")

print(f"Total updated: {count}")
