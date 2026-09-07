# Shiplystic Prarthana - Devotional Puja & Doorstep Prasad Delivery Website

A premium, responsive, and feature-rich website for **Shiplystic Prarthana**, connecting devotees around the world with sacred Indian temples (Mahakaleshwar Ujjain, Omkareshwar, Mahalaxmi Kolhapur, Shirdi Sai Baba) for authentic priest Sankalps and doorstep Prasad delivery.

---

## 📁 Project Directory Layout

```
shiplystic-prarthana-website/
├── index.html                      # Home Main Landing Page
├── about.html                      # Our Mission, Story & Priest Values
├── gallery.html                    # Photo Gallery of Temples & Rituals
├── testimonials.html               # Devotee Reviews & Star Ratings
├── contact.html                    # Devotee Support Form & Helpline
│
├── services/
│   ├── index.html                  # Services overview
│   └── prarthana.html              # Main Prarthana Booking Portal & Multi-Step Form
│
├── temples/
│   ├── mahakaleshwar-ujjain.html   # Shri Mahakaleshwar Temple Ujjain
│   ├── omkareshwar.html            # Shri Omkareshwar Jyotirlinga
│   ├── mahalaxmi-kolhapur.html     # Shri Mahalaxmi Ambabai Kolhapur
│   └── sai-baba-shirdi.html        # Shirdi Sai Baba Samadhi Mandir
│
├── track.html                      # Track your Prarthana delivery & Priest status
├── faq.html                        # Frequently Asked Questions
│
├── css/
│   ├── style.css                   # Global styles (navbar, footer, colors, buttons)
│   ├── prarthana.css               # Booking wizard, radio cards, price summary
│   └── responsive.css              # Mobile & Tablet Media Queries
│
├── js/
│   ├── main.js                     # Global navbar toggle, tracking lookup, toast notifications
│   ├── prarthana.js                # Booking wizard state management & dynamic pricing
│   ├── temple-data.js              # Temple database objects array & package offerings
│   └── form-validation.js          # Client-side validation for Devotee Name & Gotra
│
└── images/
    └── temples/                    # Temple photography assets
```

---

## 🌟 Features & Highlights

1. **Sacred Divine Theme & Modern UX**:
   - Palette tailored with Pure Black (`#09090B`), Primary Red (`#DC2626`), Crimson Accent (`#EF4444`), and Crisp White background.
   - Glassmorphism navbar, sticky header shadows, glowing badges, and Google Fonts (`Cinzel` for headings & `Plus Jakarta Sans` for body).

2. **Interactive Prarthana Booking Portal (`services/prarthana.html`)**:
   - 4-step interactive wizard:
     - **Step 1**: Select Temple Sanctuary & Puja Package Offerings (Rudrabhishek, Bhasma Aarti, Kumkumarchana, etc.)
     - **Step 2**: Enter Primary Devotee Name, Gotra, Rashi, Family Names & Special Sankalp Wish
     - **Step 3**: Shipping Address, Pincode & Payment Simulation (UPI/GPay/Card)
     - **Step 4**: Instant Confirmation with unique Order Tracking ID generation saved to `localStorage`.

3. **Live Prasad Delivery Tracker (`track.html`)**:
   - Real-time tracking stepper showing order progress from `Sankalp Received` to `Priest Assigned`, `Puja Video Recorded`, `Packed`, and `Delivered`.
   - Reads tracking IDs generated during booking or allows searching any tracking ID.

4. **100% Fully Responsive Layout**:
   - Fluid break-points across Desktop, Tablet, and Mobile screens with slide-out hamburger navigation.

---

## 🚀 Local Execution

Simply open `index.html` in any web browser, or launch a lightweight local HTTP server:

```bash
# Python HTTP server
python -m http.server 8000

# Or Node.js serve
npx serve .
```

Open `http://localhost:8000` in your web browser.
