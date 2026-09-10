import glob
import re
from pathlib import Path

for f in sorted(glob.glob('**/*.html', recursive=True)):
    if 'scratch' in f:
        continue
    txt = Path(f).read_text(encoding='utf-8')
    # search for breadcrumb block
    blocks = re.findall(r'(<nav[^>]*aria-label=["\']breadcrumb["\'][^>]*>.*?</nav>)', txt, re.DOTALL)
    for b in blocks:
        if '<img' in b:
            print(f"Found img in breadcrumb in {f}:")
            print(b)
