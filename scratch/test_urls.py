import urllib.request

urls = [
    'http://127.0.0.1:5500/sitemap/',
    'http://127.0.0.1:5500/sitemap.html',
    'http://127.0.0.1:5500/css/sitemap.css',
    'http://127.0.0.1:5500/cookie-preferences/',
    'http://127.0.0.1:5500/cookies-policy/',
    'http://127.0.0.1:5500/refund-policy/',
    'http://127.0.0.1:5500/terms-of-service/',
    'http://127.0.0.1:5500/privacy-policy/'
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            print(f"{u} -> {resp.status} OK ({len(resp.read())} bytes)")
    except Exception as e:
        print(f"{u} -> Failed: {e}")
