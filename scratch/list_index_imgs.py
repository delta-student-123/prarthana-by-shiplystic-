from pathlib import Path
import re

html = Path('index.html').read_text(encoding='utf-8')
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']([^>]*)', html)
for src, rest in imgs:
    m_alt = re.search(r'alt=["\']([^"\']*)["\']', rest)
    alt = m_alt.group(1) if m_alt else ''
    print(f"{src} | alt: {alt}")
