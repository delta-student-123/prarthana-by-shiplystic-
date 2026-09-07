import os
import glob
import re

html_files = glob.glob("**/*.html", recursive=True)

# Replace any footer logo img tag with proper shiplystic-logo-horizontal-white.png without filter
pattern = re.compile(r'<img\s+src="[^"]*images/logo/shiplystic-logo-[^"]*"\s+alt="Prarthana by Shiplystic"[^>]*>', re.MULTILINE)

modified = []

for filepath in html_files:
    clean_path = filepath.replace('\\', '/')
    prefix = '../' if ('services/' in clean_path or 'temples/' in clean_path) else ''
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<footer' in content:
        footer_parts = content.split('<footer')
        footer_html = footer_parts[1]
        
        # Replace img tag inside footer
        new_logo_tag = f'<img src="{prefix}images/logo/shiplystic-logo-horizontal-white.png" alt="Prarthana by Shiplystic" style="height: 48px; margin-bottom: 1rem;">'
        
        new_footer_html = pattern.sub(new_logo_tag, footer_html, count=1)
        
        if new_footer_html != footer_html:
            new_content = footer_parts[0] + '<footer' + new_footer_html
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            modified.append(filepath)

print("Updated footer logo to full color white-text variant in files:")
for m in modified:
    print(" -", m)
