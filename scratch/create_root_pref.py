with open(r'd:\Prarthana by Shiplystic\cookie-preferences\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('href="../favicon.ico', 'href="favicon.ico')
content = content.replace('href="../images/', 'href="images/')
content = content.replace('href="../site.webmanifest', 'href="site.webmanifest')
content = content.replace('href="../css/', 'href="css/')
content = content.replace('src="../images/', 'src="images/')
content = content.replace('src="../js/', 'src="js/')

with open(r'd:\Prarthana by Shiplystic\cookie-preferences.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Generated cookie-preferences.html successfully!')
