import os
import glob
import re

html_files = glob.glob("**/*.html", recursive=True)

twitter_pattern = re.compile(r'^\s*<a\s+href="https://twitter\.com"[^>]*>.*?</a>\s*\r?\n?', re.MULTILINE | re.DOTALL)

modified = []

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'twitter.com' in content:
        new_content = twitter_pattern.sub('', content)
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            modified.append(filepath)

print("Removed Twitter icon from files:")
for m in modified:
    print(" -", m)
