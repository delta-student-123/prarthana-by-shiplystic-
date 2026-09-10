import sys
import glob
from pathlib import Path
import re

sys.stdout.reconfigure(encoding='utf-8')

for html_path in sorted(glob.glob('**/*.html', recursive=True)):
    # Skip scratch
    if 'scratch' in html_path:
        continue
    text = Path(html_path).read_text(encoding='utf-8')
    if 'breadcrumb' in text.lower():
        print(f"=== {html_path} ===")
        lines = text.splitlines()
        for i, line in enumerate(lines):
            if 'breadcrumb' in line.lower():
                start = max(0, i - 12)
                end = min(len(lines), i + 15)
                print(f"--- Line {i+1} ---")
                for j in range(start, end):
                    line_str = lines[j].strip()
                    if any(k in line_str.lower() for k in ['section', 'banner', 'style=', 'class=', '<img', 'url(']):
                        print(f"  {j+1}: {line_str}")
                break
