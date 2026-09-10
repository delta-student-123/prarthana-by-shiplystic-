import urllib.request
import urllib.parse
import glob
from pathlib import Path
import re

BASE_SERVER = "http://127.0.0.1:5500"

html_files = sorted(glob.glob('**/*.html', recursive=True))
css_files = sorted(glob.glob('**/*.css', recursive=True))

errors = []

print("=== CHECKING CSS FILES ===")
for css in css_files:
    if 'scratch' in css:
        continue
    css_rel = css.replace('\\', '/')
    css_url = f"{BASE_SERVER}/{css_rel}"
    content = Path(css).read_text(encoding='utf-8')
    urls = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', content)
    for u in urls:
        if u.startswith('data:') or u.startswith('http'):
            continue
        resolved = urllib.parse.urljoin(css_url, u)
        try:
            req = urllib.request.Request(resolved)
            res = urllib.request.urlopen(req)
            if res.status != 200:
                errors.append(('CSS', css, u, resolved, res.status))
        except urllib.error.HTTPError as e:
            errors.append(('CSS', css, u, resolved, e.code))
        except Exception as e:
            errors.append(('CSS', css, u, resolved, str(e)))

print("=== CHECKING HTML FILES ===")
for html in html_files:
    if 'scratch' in html:
        continue
    html_rel = html.replace('\\', '/')
    html_url = f"{BASE_SERVER}/{html_rel}"
    content = Path(html).read_text(encoding='utf-8')
    
    # Check style url(...)
    urls = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', content)
    for u in urls:
        if u.startswith('data:') or u.startswith('http'):
            continue
        resolved = urllib.parse.urljoin(html_url, u)
        try:
            req = urllib.request.Request(resolved)
            res = urllib.request.urlopen(req)
            if res.status != 200:
                errors.append(('HTML-STYLE-URL', html, u, resolved, res.status))
        except urllib.error.HTTPError as e:
            errors.append(('HTML-STYLE-URL', html, u, resolved, e.code))
        except Exception as e:
            errors.append(('HTML-STYLE-URL', html, u, resolved, str(e)))

    # Check img src
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    for s in img_srcs:
        if s.startswith('data:') or s.startswith('http'):
            continue
        resolved = urllib.parse.urljoin(html_url, s)
        try:
            req = urllib.request.Request(resolved)
            res = urllib.request.urlopen(req)
            if res.status != 200:
                errors.append(('IMG-SRC', html, s, resolved, res.status))
        except urllib.error.HTTPError as e:
            errors.append(('IMG-SRC', html, s, resolved, e.code))
        except Exception as e:
            errors.append(('IMG-SRC', html, s, resolved, str(e)))

    # Check link href
    link_hrefs = re.findall(r'<link[^>]+href=["\']([^"\']+)["\']', content)
    for h in link_hrefs:
        if h.startswith('data:') or h.startswith('http') or h.endswith('site.webmanifest'):
            continue
        resolved = urllib.parse.urljoin(html_url, h)
        try:
            req = urllib.request.Request(resolved)
            res = urllib.request.urlopen(req)
            if res.status != 200:
                errors.append(('LINK-HREF', html, h, resolved, res.status))
        except urllib.error.HTTPError as e:
            errors.append(('LINK-HREF', html, h, resolved, e.code))
        except Exception as e:
            errors.append(('LINK-HREF', html, h, resolved, str(e)))

print(f"\nTotal Errors Found: {len(errors)}")
for typ, f, orig, res_url, err in errors:
    print(f"[{typ}] {f}\n   Asset: {orig}\n   Resolved: {res_url}\n   Status: {err}\n")
