import re

with open(r"d:\Prarthana by Shiplystic\index.html", "r", encoding="utf-8") as f:
    html = f.read()

m = re.search(r'(<section id="how-it-works".*?</section>)', html, re.DOTALL)
if m:
    section_html = m.group(1)
    
    test_page = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/responsive.css">
</head>
<body style="margin: 0; background: #FAFAFA;">
  {section_html}
</body>
</html>
'''
    with open(r"d:\Prarthana by Shiplystic\scratch\test_cards.html", "w", encoding="utf-8") as out:
        out.write(test_page)
    print("test_cards.html created successfully")
else:
    print("how-it-works section not found")
