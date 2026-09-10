from pathlib import Path
import glob
import re

# 1. Sync temples/<slug>.html from temples/<slug>/index.html
temple_dirs = glob.glob('temples/*/')
for td in sorted(temple_dirs):
    slug = Path(td).name
    index_file = Path(td) / 'index.html'
    legacy_file = Path(f"temples/{slug}.html")
    
    if index_file.exists():
        content = index_file.read_text(encoding='utf-8')
        # In temples/<slug>.html, depth is 1 (inside temples/)
        # So ../../ becomes ../
        # e.g. ../../css/style.css -> ../css/style.css
        # e.g. ../../images/ -> ../images/
        # e.g. ../../favicon.ico -> ../favicon.ico
        # e.g. ../../site.webmanifest -> ../site.webmanifest
        legacy_content = content.replace('../../', '../')
        legacy_file.write_text(legacy_content, encoding='utf-8')
        print(f"Synced full content to {legacy_file}")

# 2. Sync root legacy files from subfolder index files
root_mappings = {
    'about.html': 'about-us/index.html',
    'contact.html': 'contact-us/index.html',
    'track.html': 'track-delivery/index.html',
    'temples.html': 'temples/index.html',
    'gallery.html': 'gallery/index.html',
    'reviews.html': 'reviews/index.html',
}

for legacy_name, sub_index in root_mappings.items():
    sub_p = Path(sub_index)
    leg_p = Path(legacy_name)
    if sub_p.exists():
        content = sub_p.read_text(encoding='utf-8')
        # In root legacy file, depth is 0 (root)
        # So ../ becomes '' or ./
        # e.g. ../css/style.css -> css/style.css
        # e.g. ../images/ -> images/
        # e.g. ../favicon.ico -> favicon.ico
        root_content = content.replace('../css/', 'css/').replace('../images/', 'images/').replace('../js/', 'js/').replace('../site.webmanifest', 'site.webmanifest').replace('../favicon.ico', 'favicon.ico')
        leg_p.write_text(root_content, encoding='utf-8')
        print(f"Synced full content to {leg_p}")

print("Sync completed successfully.")
