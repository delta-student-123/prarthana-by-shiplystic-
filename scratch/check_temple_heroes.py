import glob
import re
from pathlib import Path

for f in sorted(glob.glob('temples/*/index.html')):
    content = Path(f).read_text(encoding='utf-8')
    m_section = re.search(r'<section\s+([^>]+)>', content)
    print(f)
    if m_section:
        attrs = m_section.group(1)
        urls = re.findall(r'url\([^)]+\)', attrs)
        classes = re.findall(r'class=["\']([^"\']+)["\']', attrs)
        print('  Classes:', classes)
        print('  URLs:', urls)
    print('-' * 40)
