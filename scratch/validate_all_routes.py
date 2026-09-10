import urllib.request
import urllib.parse
from pathlib import Path
import re

SERVER = "http://127.0.0.1:5500"

routes_to_test = [
    "/",
    "/about-us",
    "/contact-us",
    "/track-delivery",
    "/services",
    "/temples",
    "/gallery",
    "/reviews",
    "/temples/kedarnath",
    "/temples/somnath",
    "/temples/kashi-vishwanath",
    "/temples/mahakaleshwar-ujjain",
    "/temples/omkareshwar",
    "/temples/rameswaram",
    "/temples/tirupati-balaji",
    "/temples/siddhivinayak",
    "/temples/ayodhya-ram-mandir",
    "/temples/badrinath",
    "/temples/jagannath-puri",
    "/temples/dwarkadhish",
    "/temples/mahalaxmi-kolhapur",
    "/temples/sai-baba-shirdi",
    "/temples/dagdusheth-ganpati",
    "/temples/gajanan-maharaj-shegaon",
    "/temples/mathura-vrindavan",
]

failed_assets = []

for r in routes_to_test:
    url = f"{SERVER}{r}"
    if not r.endswith('/') and r != "":
        # also test with trailing slash
        test_urls = [url, f"{url}/"]
    else:
        test_urls = [url]

    for page_url in test_urls:
        try:
            req = urllib.request.Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})
            res = urllib.request.urlopen(req)
            html = res.read().decode('utf-8', errors='ignore')
            
            # Extract background urls
            bg_urls = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', html)
            for bg in bg_urls:
                if bg.startswith('data:') or bg.startswith('http'):
                    continue
                asset_url = urllib.parse.urljoin(page_url, bg)
                try:
                    ares = urllib.request.urlopen(urllib.request.Request(asset_url))
                    if ares.status != 200:
                        failed_assets.append((page_url, bg, asset_url, ares.status))
                except Exception as e:
                    failed_assets.append((page_url, bg, asset_url, str(e)))

        except Exception as e:
            failed_assets.append((page_url, 'PAGE_FAILED', page_url, str(e)))

print(f"\nAudit complete! Total failed assets: {len(failed_assets)}")
if failed_assets:
    for p, asset, full, err in failed_assets:
        print(f"FAILED on {p}:\n  Asset: {asset}\n  URL: {full}\n  Error: {err}\n")
else:
    print("ALL ROUTES AND ALL BREADCRUMB / HERO BANNER BACKGROUND IMAGES LOADED 100% SUCCESSFULLY (HTTP 200 OK)!")
