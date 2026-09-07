import os
import glob
import re

root_files = ['index.html', 'about.html', 'contact.html', 'faq.html', 'gallery.html', 'testimonials.html', 'track.html']
services_files = ['services/index.html', 'services/prarthana.html']
temples_files = glob.glob("temples/*.html")

def process_files(files, target_href, current_page_file):
    modified = []
    for filepath in files:
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already added
        if 'Services Overview' in content.split('<nav>')[1].split('</nav>')[0]:
            continue

        is_active_page = (filepath.replace('\\', '/') == current_page_file)
        active_cls = " active" if is_active_page else ""
        
        link_html = f'<li><a href="{target_href}" class="nav-link{active_cls}">Services Overview</a></li>'

        # Regex to find Home menu item inside nav: <li><a href="..." class="nav-link...">Home</a></li>
        pattern = re.compile(r'(<li><a\s+href="[^"]*"\s+class="nav-link[^"]*">\s*Home\s*</a>\s*</li>)', re.MULTILINE)

        if pattern.search(content):
            new_content = pattern.sub(rf'\1\n          {link_html}', content, count=1)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            modified.append(filepath)
    return modified

mod_root = process_files(root_files, 'services/index.html', '')
mod_services = process_files(services_files, 'index.html', 'services/index.html')
mod_temples = process_files(temples_files, '../services/index.html', '')

print("Modified files:")
for m in mod_root + mod_services + mod_temples:
    print(" -", m)
