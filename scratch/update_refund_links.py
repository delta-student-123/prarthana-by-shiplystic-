import os

workspace = r"d:\Prarthana by Shiplystic"
target_str = '<a href="#" onclick="openLegalModal(\'Refund Policy\'); return false;">Refund Policy</a>'
replacement = '<a href="/refund-policy">Refund Policy</a>'

updated_files = []
for root, dirs, files in os.walk(workspace):
    if "scratch" in root or ".git" in root or ".gemini" in root:
        continue
    for file in files:
        if file.endswith(".html"):
            fpath = os.path.join(root, file)
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
            if target_str in content:
                content = content.replace(target_str, replacement)
                with open(fpath, "w", encoding="utf-8") as f:
                    f.write(content)
                updated_files.append(fpath)

print(f"Updated {len(updated_files)} files.")
