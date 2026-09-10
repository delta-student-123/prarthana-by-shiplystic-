import urllib.request
import urllib.parse
import glob
from pathlib import Path
import re

BASE_SERVER = "http://127.0.0.1:5500"

html_files = glob.glob('**/*.html', recursive=True)
broken_assets = []

for f in sorted(html_files):
    if 'scratch' in f:
        continue
    # compute URL path relative to server root
    rel_path = f.replace('\\', '/')
    page_url = f"{BASE_SERVER}/{rel_path}"
    
    content = Path(f).read_text(encoding='utf-8')
    
    # 1. find all url(...) in inline styles or style tags
    urls_in_style = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', content)
    for u in urls_in_style:
        if u.startswith('data:') or u.startswith('http'):
            continue
        resolved = urllib.parse.urljoin(page_url, u)
        try:
            req = urllib.request.Request(resolved, headers={'User-Agent': 'Mozilla/5.0'})
            res = urllib.request.urlopen(req)
            if res.status != 200:
                broken_assets.append((f, u, resolved, res.status))
        except urllib.error.HTTPError as e:
            broken_assets.append((f, u, resolved, e.code))
        except Exception as e:
            broken_assets.append((f, u, resolved, str(e)))

    # 2. find all img src
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    for src in img_srcs:
        if src.startswith('data:') or src.startswith('http'):
            continue
        resolved = urllib.parse.urljoin(page_url, src)
        try:
            req = urllib.request.Request(resolved, headers={'User-Agent': 'Mozilla/5.0'})
            res = urllib.request.urlopen(req)
            if res.status != 200:
                broken_assets.append((f, src, resolved, res.status))
        except urllib.error.HTTPError as e:
            broken_assets.append((f, src, resolved, e.code))
        except Exception as e:
            broken_assets.append((f, src, resolved, str(e)))

print(f"Total broken assets found: {len(broken_assets)}")
for f, original, resolved, err in broken_assets:
    print(f"File: {f}\n  Original: {original}\n  Resolved: {resolved}\n  Error: {err}\n")
