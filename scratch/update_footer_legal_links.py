import os
import re

# Update js/main.js with legal modal functions
main_js_path = r"d:\Prarthana by Shiplystic\js\main.js"

legal_modal_js = """
/* ==========================================================================
   Shiplystic Prarthana - Legal Policies, Cookies & Sitemap Modals
   ========================================================================== */

// Helper to inject modal container
function ensureLegalModalContainer() {
  if (!document.getElementById('legal-modal-overlay')) {
    const modalHTML = `
      <div id="legal-modal-overlay" style="position: fixed; inset: 0; background: rgba(9, 9, 11, 0.75); backdrop-filter: blur(8px); display: none; align-items: center; justify-content: center; z-index: 99999; padding: 1.5rem; opacity: 0; transition: opacity 0.3s ease;">
        <div id="legal-modal-box" style="background: #FFFFFF; width: 100%; max-width: 650px; max-height: 85vh; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); display: flex; flex-direction: column; overflow: hidden; transform: translateY(20px); transition: transform 0.3s ease; border: 1px solid #E5E7EB;">
          <div style="padding: 1.25rem 1.75rem; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; background: #FAFAFA;">
            <h3 id="legal-modal-title" style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #111827; font-family: 'Georgia', 'Playfair Display', serif;">Policy</h3>
            <button onclick="closeLegalModal()" style="background: #FEF2F2; border: none; color: #DC2626; width: 32px; height: 32px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 800; transition: all 0.2s;" onmouseenter="this.style.background='#DC2626'; this.style.color='#FFF';" onmouseleave="this.style.background='#FEF2F2'; this.style.color='#DC2626';">✕</button>
          </div>
          <div id="legal-modal-content" style="padding: 1.75rem; overflow-y: auto; color: #374151; font-size: 0.95rem; line-height: 1.6;">
          </div>
          <div style="padding: 1rem 1.75rem; border-top: 1px solid #F1F5F9; background: #FAFAFA; display: flex; justify-content: flex-end;">
            <button onclick="closeLegalModal()" class="btn btn-red" style="padding: 0.6rem 1.5rem; border-radius: 50px; font-size: 0.88rem; font-weight: 800;">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

window.openLegalModal = function(type) {
  ensureLegalModalContainer();
  const overlay = document.getElementById('legal-modal-overlay');
  const modalBox = document.getElementById('legal-modal-box');
  const title = document.getElementById('legal-modal-title');
  const content = document.getElementById('legal-modal-content');

  let titleText = type;
  let bodyHTML = '';

  if (type === 'Privacy Policy') {
    titleText = '🔒 Privacy Policy';
    bodyHTML = `
      <p style="margin-bottom: 1rem;">At <strong>Shiplystic Prarthana</strong>, we prioritize the confidentiality and sanctity of your personal and spiritual information.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">1. Information We Collect</h4>
      <p>We collect devotee details including Name, Sankalp Gotra, Family Member Names, Shipping Address, Email, and Phone Number strictly for ritual execution and Prasad express delivery.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">2. Sankalp Video Proof Privacy</h4>
      <p>Personalized ritual video proof recorded by authentic temple priests is stored securely and shared only with the booking devotee via private stream/link.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">3. Data Protection</h4>
      <p>Your address and phone details are encrypted during express transit via Shiplystic logistics partners. We never sell or share your data with third parties.</p>
    `;
  } else if (type === 'Terms of Service') {
    titleText = '📜 Terms of Service';
    bodyHTML = `
      <p style="margin-bottom: 1rem;">Welcome to <strong>Shiplystic Prarthana</strong>. By booking a Puja or Prasad service, you agree to these service terms.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">1. Ritual Execution & Authenticity</h4>
      <p>All Pujas and Sankalps are performed by revered Vedic priests at authorized temple sanctums. Names and Gotras provided during booking will be chanted during the ritual.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">2. Sanctum Prasad Express Dispatch</h4>
      <p>Prasad (Vibhuti, Kumkum, Ladoos, Dry Fruits, Dry Flowers) is collected directly post-Aarti and dispatched in tamper-evident sealed packaging via Shiplystic Express Delivery.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">3. Delivery Timelines</h4>
      <p>Express domestic delivery takes 2–5 business days depending on location. Real-time GPS tracking is updated on the Track Delivery page.</p>
    `;
  } else if (type === 'Refund Policy') {
    titleText = '🛡️ Refund & Cancellation Policy';
    bodyHTML = `
      <p style="margin-bottom: 1rem;">We offer a transparent <strong>100% Money-Back Guarantee</strong> for your peace of mind.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">1. Full Refund Eligibility</h4>
      <p>You are eligible for a 100% refund if a Puja cannot be performed due to unexpected temple sanctum closures, VIP lockdowns, or natural disasters.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">2. Cancellation Window</h4>
      <p>Bookings can be cancelled up to 24 hours prior to the scheduled Puja date for a full refund by contacting our Devotee Support at <strong>+91 9422799941</strong>.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">3. Damaged Prasad Package</h4>
      <p>If your Prasad box arrives damaged or tampered, we will re-dispatch a fresh sanctum Prasad box free of charge or issue a full refund.</p>
    `;
  } else if (type === 'Cookies Policy') {
    titleText = '🍪 Cookies Policy';
    bodyHTML = `
      <p style="margin-bottom: 1rem;">Shiplystic Prarthana uses cookies and session storage to provide a seamless booking and delivery tracking experience.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">1. Essential Cookies</h4>
      <p>Necessary for site security, user authentication, cart persistence, and tracking number lookups.</p>
      <h4 style="color: #111827; margin: 1.2rem 0 0.4rem; font-weight: 800;">2. Performance & Preferences</h4>
      <p>Used to remember your preferred temple filters, selected gotra options, and currency settings.</p>
    `;
  } else if (type === 'Sitemap') {
    titleText = '🗺️ Website Sitemap';
    bodyHTML = `
      <p style="margin-bottom: 1rem; font-weight: 700; color: #DC2626;">Quick Navigation Links:</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div>
          <h5 style="color: #111827; margin-bottom: 0.5rem; font-weight: 800;">Main Pages</h5>
          <ul style="padding-left: 1.2rem; margin: 0;">
            <li><a href="index.html" style="color: #DC2626;">Home</a></li>
            <li><a href="services/index.html" style="color: #DC2626;">Services Overview</a></li>
            <li><a href="services/prarthana.html" style="color: #DC2626;">Book Prarthana Service</a></li>
            <li><a href="track.html" style="color: #DC2626;">Track Delivery</a></li>
            <li><a href="about.html" style="color: #DC2626;">About Us</a></li>
            <li><a href="contact.html" style="color: #DC2626;">Contact Support</a></li>
            <li><a href="faq.html" style="color: #DC2626;">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h5 style="color: #111827; margin-bottom: 0.5rem; font-weight: 800;">Featured Sanctums</h5>
          <ul style="padding-left: 1.2rem; margin: 0;">
            <li><a href="temples/mahakaleshwar-ujjain.html" style="color: #DC2626;">Mahakaleshwar Ujjain</a></li>
            <li><a href="temples/omkareshwar.html" style="color: #DC2626;">Omkareshwar Jyotirlinga</a></li>
            <li><a href="temples/mahalaxmi-kolhapur.html" style="color: #DC2626;">Mahalaxmi Kolhapur</a></li>
            <li><a href="temples/sai-baba-shirdi.html" style="color: #DC2626;">Sai Baba Shirdi</a></li>
          </ul>
        </div>
      </div>
    `;
  }

  title.innerHTML = titleText;
  content.innerHTML = bodyHTML;

  overlay.style.display = 'flex';
  setTimeout(() => {
    overlay.style.opacity = '1';
    modalBox.style.transform = 'translateY(0)';
  }, 10);
};

window.openCookiePreferences = function() {
  ensureLegalModalContainer();
  const overlay = document.getElementById('legal-modal-overlay');
  const modalBox = document.getElementById('legal-modal-box');
  const title = document.getElementById('legal-modal-title');
  const content = document.getElementById('legal-modal-content');

  title.innerHTML = '⚙️ Cookies Preferences';
  content.innerHTML = `
    <p style="margin-bottom: 1.2rem;">Manage your cookie settings to control data collection on Shiplystic Prarthana.</p>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="background: #FAFAFA; border: 1px solid #E5E7EB; padding: 1rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: 800; color: #111827;">Essential Cookies</div>
          <div style="font-size: 0.8rem; color: #6B7280;">Required for checkout, tracking, & security</div>
        </div>
        <span style="background: #DC2626; color: #FFF; font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 50px;">Always Active</span>
      </div>

      <div style="background: #FAFAFA; border: 1px solid #E5E7EB; padding: 1rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: 800; color: #111827;">Performance & Analytics</div>
          <div style="font-size: 0.8rem; color: #6B7280;">Helps us optimize page loading & service speed</div>
        </div>
        <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: #DC2626; cursor: pointer;">
      </div>

      <div style="background: #FAFAFA; border: 1px solid #E5E7EB; padding: 1rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: 800; color: #111827;">Functional Preferences</div>
          <div style="font-size: 0.8rem; color: #6B7280;">Remembers your selected gotra & temple filters</div>
        </div>
        <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: #DC2626; cursor: pointer;">
      </div>
    </div>
    <div style="margin-top: 1.5rem; text-align: center;">
      <button onclick="alert('Cookie preferences saved successfully!'); closeLegalModal();" class="btn btn-red" style="padding: 0.75rem 2rem; border-radius: 50px; font-weight: 800;">Save Preferences</button>
    </div>
  `;

  overlay.style.display = 'flex';
  setTimeout(() => {
    overlay.style.opacity = '1';
    modalBox.style.transform = 'translateY(0)';
  }, 10);
};

window.closeLegalModal = function() {
  const overlay = document.getElementById('legal-modal-overlay');
  const modalBox = document.getElementById('legal-modal-box');
  if (overlay && modalBox) {
    overlay.style.opacity = '0';
    modalBox.style.transform = 'translateY(20px)';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  }
};
"""

with open(main_js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

if "openLegalModal" not in js_content:
    with open(main_js_path, "a", encoding="utf-8") as f:
        f.write("\n" + legal_modal_js)
    print("Updated js/main.js with legal modal functions.")

# HTML Footer Replacement Pattern
new_footer_bottom = """      <div class="footer-bottom" style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.2rem; color: #71717A; font-size: 0.85rem;">
        <div>© 2026 Shiplystic Prarthana. All rights reserved.</div>
        <div style="display: flex; gap: 1.2rem; flex-wrap: wrap; align-items: center;">
          <a href="#" onclick="openLegalModal('Privacy Policy'); return false;" style="color: #A1A1AA; text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='#FFF'" onmouseleave="this.style.color='#A1A1AA'">Privacy Policy</a>
          <span style="color: #3F3F46;">•</span>
          <a href="#" onclick="openLegalModal('Terms of Service'); return false;" style="color: #A1A1AA; text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='#FFF'" onmouseleave="this.style.color='#A1A1AA'">Terms of Service</a>
          <span style="color: #3F3F46;">•</span>
          <a href="#" onclick="openLegalModal('Refund Policy'); return false;" style="color: #A1A1AA; text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='#FFF'" onmouseleave="this.style.color='#A1A1AA'">Refund Policy</a>
          <span style="color: #3F3F46;">•</span>
          <a href="#" onclick="openLegalModal('Cookies Policy'); return false;" style="color: #A1A1AA; text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='#FFF'" onmouseleave="this.style.color='#A1A1AA'">Cookies Policy</a>
          <span style="color: #3F3F46;">•</span>
          <a href="#" onclick="openCookiePreferences(); return false;" style="color: #A1A1AA; text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='#FFF'" onmouseleave="this.style.color='#A1A1AA'">Cookies Preferences</a>
          <span style="color: #3F3F46;">•</span>
          <a href="#" onclick="openLegalModal('Sitemap'); return false;" style="color: #A1A1AA; text-decoration: none; transition: color 0.2s;" onmouseenter="this.style.color='#FFF'" onmouseleave="this.style.color='#A1A1AA'">Sitemap</a>
        </div>
      </div>"""

def update_html_footer(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Pattern matching <div class="footer-bottom"...> ... </div>
    pattern = r'<div class="footer-bottom".*?</div>\s*</div>\s*</footer>'
    replacement = f"{new_footer_bottom}\n    </div>\n  </footer>"
    
    new_html, count = re.subn(pattern, replacement, html, flags=re.DOTALL)
    if count > 0:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_html)
        print(f"Updated footer in {os.path.basename(file_path)}")
    else:
        print(f"Pattern not matched in {os.path.basename(file_path)}")

# Update across all html files
base_dir = r"d:\Prarthana by Shiplystic"
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".html"):
            full_path = os.path.join(root, file)
            update_html_footer(full_path)
