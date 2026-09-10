from pathlib import Path
import glob

# 1. Depth 1 pages
depth1_fixes = {
    'about-us/index.html': ("url('images/temples/omkareshwar.jpg')", "url('../images/temples/omkareshwar.jpg')"),
    'contact-us/index.html': ("url('images/temples/omkareshwar.jpg')", "url('../images/temples/omkareshwar.jpg')"),
    'gallery/index.html': ("url('images/temples/omkareshwar.jpg')", "url('../images/temples/omkareshwar.jpg')"),
    'reviews/index.html': ("url('images/temples/mahakaleshwar-ujjain.jpg')", "url('../images/temples/mahakaleshwar-ujjain.jpg')"),
    'temples/index.html': ("url('images/temples/temples-banner.jpg')", "url('../images/temples/temples-banner.jpg')"),
    'track-delivery/index.html': ("url('images/temples/omkareshwar.jpg')", "url('../images/temples/omkareshwar.jpg')"),
}

for filepath, (old_val, new_val) in depth1_fixes.items():
    p = Path(filepath)
    if p.exists():
        content = p.read_text(encoding='utf-8')
        if old_val in content:
            content = content.replace(old_val, new_val)
            p.write_text(content, encoding='utf-8')
            print(f"Fixed depth 1: {filepath}")
        else:
            print(f"Old val not found in {filepath}")

# 2. Depth 2 temple pages
temple_pages = glob.glob('temples/*/index.html')
for tp in temple_pages:
    p = Path(tp)
    content = p.read_text(encoding='utf-8')
    changed = False
    if "url('../images/temples/" in content:
        content = content.replace("url('../images/temples/", "url('../../images/temples/")
        changed = True
    
    # Check kedarnath, siddhivinayak, tirupati
    if 'kedarnath' in tp and 'temple-hero-kedarnath' in content:
        if 'style="' not in content.split('temple-hero-kedarnath')[1][:100]:
            content = content.replace(
                'class="temple-hero-section temple-hero-kedarnath"',
                'class="temple-hero-section temple-hero-kedarnath" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0.25) 100%), url(\'../../images/temples/kedarnath.jpg\') center/cover no-repeat;"'
            )
            changed = True
            
    if 'siddhivinayak' in tp and 'temple-hero-siddhivinayak' in content:
        if 'style="' not in content.split('temple-hero-siddhivinayak')[1][:100]:
            content = content.replace(
                'class="temple-hero-section temple-hero-siddhivinayak"',
                'class="temple-hero-section temple-hero-siddhivinayak" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0.25) 100%), url(\'../../images/temples/siddhivinayak.jpg\') center/cover no-repeat;"'
            )
            changed = True
            
    if 'tirupati-balaji' in tp and 'temple-hero-tirupati' in content:
        if 'style="' not in content.split('temple-hero-tirupati')[1][:100]:
            content = content.replace(
                'class="temple-hero-section temple-hero-tirupati"',
                'class="temple-hero-section temple-hero-tirupati" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0.25) 100%), url(\'../../images/temples/tirupati.jpg\') center/cover no-repeat;"'
            )
            changed = True
            
    if changed:
        p.write_text(content, encoding='utf-8')
        print(f"Fixed depth 2 temple: {tp}")

print("Fix step 1 completed successfully.")
