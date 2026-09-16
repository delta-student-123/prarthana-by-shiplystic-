with open('contact-us/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

c_root = c.replace('../images/', 'images/')
c_root = c_root.replace('../css/', 'css/')
c_root = c_root.replace('../js/', 'js/')
c_root = c_root.replace('../favicon', 'favicon')
c_root = c_root.replace('../site.webmanifest', 'site.webmanifest')
c_root = c_root.replace('https://shiplystic.com/contact-us', 'https://shiplystic.com/contact')

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(c_root)

print('contact.html written successfully. Lines:', len(c_root.splitlines()))
