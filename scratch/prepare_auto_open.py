with open(r"d:\Prarthana by Shiplystic\index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Fix relative paths for scratch subfolder
content = content.replace('href="css/', 'href="../css/')
content = content.replace('src="js/', 'src="../js/')
content = content.replace('src="images/', 'src="../images/')

# Add style to dismiss cookie banner and position dropdown cleanly for screenshot
override_style = '''
<style>
  #cookie-consent-banner { display: none !important; }
</style>
'''
content = content.replace('</head>', override_style + '\n</head>')

auto_open_script = '''
<script>
window.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('header nav');
  if (nav) nav.classList.add('mobile-open');
  const dropdown = document.querySelector('.dropdown');
  if (dropdown) dropdown.classList.add('open');
  const toggle = document.querySelector('.mobile-toggle');
  if (toggle) toggle.textContent = '✕';
});
</script>
'''

test_html = content.replace('</body>', auto_open_script + '\n</body>')

with open(r"d:\Prarthana by Shiplystic\scratch\auto_open_mob.html", "w", encoding="utf-8") as f:
    f.write(test_html)

print("auto_open_mob.html updated")
