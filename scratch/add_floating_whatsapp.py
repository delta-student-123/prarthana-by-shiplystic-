import os
import re

ROOT_DIR = r"d:\Prarthana by Shiplystic"

WA_HTML = '''  <!-- Floating WhatsApp Support Button -->
  <a id="whatsapp-float-btn" href="https://wa.me/919422799941?text=Hello%20Shiplystic%20Prarthana,%20I%20would%20like%20to%20inquire%20about%20Prarthana%20services" target="_blank" rel="noopener noreferrer" class="whatsapp-float-btn" aria-label="Chat on WhatsApp" title="Chat on WhatsApp with Devotee Support">
    <span class="whatsapp-float-pulse"></span>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
  </a>
'''

def update_html_files():
    count = 0
    for root, dirs, files in os.walk(ROOT_DIR):
        if 'node_modules' in root or '.git' in root or 'scratch' in root or 'dist' in root:
            continue
        for f in files:
            if f.endswith('.html'):
                file_path = os.path.join(root, f)
                with open(file_path, 'r', encoding='utf-8') as fp:
                    content = fp.read()
                
                if 'id="whatsapp-float-btn"' in content or 'class="whatsapp-float-btn"' in content:
                    continue
                
                # Insert right before </body>
                if '</body>' in content:
                    new_content = content.replace('</body>', WA_HTML + '\n</body>')
                    with open(file_path, 'w', encoding='utf-8') as fp:
                        fp.write(new_content)
                    count += 1
                    print(f"Updated: {os.path.relpath(file_path, ROOT_DIR)}")
    print(f"Total HTML files updated: {count}")

def update_js_main():
    js_path = os.path.join(ROOT_DIR, "js", "main.js")
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()
    
    if 'initWhatsAppFloat' in js:
        print("initWhatsAppFloat already in js/main.js")
        return
    
    snippet = '''
// Floating WhatsApp Support Button Initializer (Site-wide safety fallback)
function initWhatsAppFloat() {
  if (document.getElementById('whatsapp-float-btn')) return;
  const waBtn = document.createElement('a');
  waBtn.id = 'whatsapp-float-btn';
  waBtn.className = 'whatsapp-float-btn';
  waBtn.href = 'https://wa.me/919422799941?text=Hello%20Shiplystic%20Prarthana,%20I%20would%20like%20to%20inquire%20about%20Prarthana%20services';
  waBtn.target = '_blank';
  waBtn.rel = 'noopener noreferrer';
  waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  waBtn.setAttribute('title', 'Chat on WhatsApp with Devotee Support');
  waBtn.innerHTML = `
    <span class="whatsapp-float-pulse"></span>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
  `;
  document.body.appendChild(waBtn);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhatsAppFloat);
} else {
  initWhatsAppFloat();
}
'''
    with open(js_path, 'a', encoding='utf-8') as f:
        f.write(snippet)
    print("Updated js/main.js")

if __name__ == '__main__':
    update_html_files()
    update_js_main()

