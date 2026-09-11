import os

target_old = '<a href="https://facebook.com" target="_blank" rel="noopener" class="footer-social-link" aria-label="Facebook">'
target_new = '<a href="https://www.facebook.com/shiplystic/" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Facebook @shiplystic" title="Follow @shiplystic on Facebook">'

updated_files = []

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'scratch' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if target_old in content:
                new_content = content.replace(target_old, target_new)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                updated_files.append(filepath)

print(f"Successfully updated Facebook links in {len(updated_files)} files!")
for f in updated_files[:10]:
    print(" ", f)
