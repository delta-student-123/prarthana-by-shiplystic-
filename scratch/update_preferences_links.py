import os

workspace = r"d:\Prarthana by Shiplystic"
target_str = '<a href="#" onclick="openCookiePreferences(); return false;">Cookies Preferences</a>'
replacement = '<a href="/cookie-preferences">Cookies Preferences</a>'

updated_files = []
for root, dirs, files in os.walk(workspace):
    if any(x in root for x in ["scratch", ".git", ".gemini"]):
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

print(f"Updated {len(updated_files)} files with dedicated /cookie-preferences link.")
for uf in updated_files[:10]:
    print(" -", os.path.relpath(uf, workspace))
if len(updated_files) > 10:
    print(f" ... and {len(updated_files) - 10} more files.")
