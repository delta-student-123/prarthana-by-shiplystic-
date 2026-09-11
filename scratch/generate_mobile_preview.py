import os

with open(r"d:\Prarthana by Shiplystic\index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Extract header
start_idx = html.find('<header class="site-header">')
end_idx = html.find('</header>') + len('</header>')
header_html = html[start_idx:end_idx]

# Make nav mobile-open and dropdown open by default for preview
header_html = header_html.replace('<nav class="header-nav">', '<nav class="header-nav mobile-open">')
header_html = header_html.replace('<li class="dropdown shiplystic-mega-dropdown-wrapper">', '<li class="dropdown shiplystic-mega-dropdown-wrapper open">')

preview_page = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mobile Dropdown Preview</title>
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/responsive.css">
  <style>
    body {{
      margin: 0;
      padding: 0;
      background: #71717A;
      font-family: 'Inter', -apple-system, sans-serif;
    }}
  </style>
</head>
<body>
  {header_html}
  <script src="../js/main.js"></script>
</body>
</html>
'''

with open(r"d:\Prarthana by Shiplystic\scratch\mobile_preview.html", "w", encoding="utf-8") as f:
    f.write(preview_page)
print("mobile_preview.html generated successfully")
