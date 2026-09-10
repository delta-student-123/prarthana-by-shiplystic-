/* ==========================================================================
   Shiplystic Prarthana - Global Scripts (js/main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navEl = document.querySelector('header nav');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navEl) {
    // Open / close on hamburger click
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navEl.classList.toggle('mobile-open');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on backdrop click
    navEl.addEventListener('click', (e) => {
      if (e.target === navEl) {
        navEl.classList.remove('mobile-open');
        mobileToggle.innerHTML = '☰';
        document.body.style.overflow = '';
      }
    });

    // Close on nav link click
    if (navLinks) {
      navLinks.querySelectorAll('a:not(.dropdown > a)').forEach(link => {
        link.addEventListener('click', () => {
          navEl.classList.remove('mobile-open');
          mobileToggle.innerHTML = '☰';
          document.body.style.overflow = '';
        });
      });
    }

    // Dropdown toggle (tap to open/close on mobile, navigate naturally on desktop)
    document.querySelectorAll('.dropdown > .nav-link').forEach(dropLink => {
      dropLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          const parent = dropLink.parentElement;
          const isOpen = parent.classList.toggle('open');

          // Flip arrow indicator
          if (isOpen && dropLink.innerHTML.includes('▾')) {
            dropLink.innerHTML = dropLink.innerHTML.replace('▾', '▴');
          } else if (!isOpen && dropLink.innerHTML.includes('▴')) {
            dropLink.innerHTML = dropLink.innerHTML.replace('▴', '▾');
          }
        }
        // On desktop, clicking "Temples ▾" naturally opens the Temples page (temples.html)
      });
    });

    // Ensure clicking inside the mega menu (tabs, background, cards) never closes it prematurely
    document.querySelectorAll('.shiplystic-mega-menu').forEach(menu => {
      menu.addEventListener('click', (e) => {
        // If clicking a genuine link (temple page link, explore all link), let it navigate naturally
        if (e.target.closest('a')) {
          return;
        }
        e.stopPropagation();
      });
    });

    // Close pinned desktop dropdown when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.shiplystic-mega-dropdown-wrapper')) {
        document.querySelectorAll('.shiplystic-mega-dropdown-wrapper.open').forEach(el => {
          el.classList.remove('open');
        });
      }
    });

    // Desktop Hover-Intent Grace Period (allows smooth diagonal cursor movement to tabs 3 & 4)
    const initMegaDropdownHover = () => {
      const wrappers = document.querySelectorAll('.shiplystic-mega-dropdown-wrapper');
      wrappers.forEach(wrapper => {
        let closeTimer = null;
        const menu = wrapper.querySelector('.shiplystic-mega-menu');

        const openDropdown = () => {
          if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
          }
          wrapper.classList.add('open');
        };

        const closeDropdownWithGrace = () => {
          if (closeTimer) clearTimeout(closeTimer);
          // 350ms grace period allows smooth diagonal mouse movement across tabs without accidental closing
          closeTimer = setTimeout(() => {
            wrapper.classList.remove('open');
          }, 350);
        };

        wrapper.addEventListener('mouseenter', openDropdown);
        wrapper.addEventListener('mouseleave', closeDropdownWithGrace);

        if (menu) {
          menu.addEventListener('mouseenter', openDropdown);
          menu.addEventListener('mouseleave', closeDropdownWithGrace);
        }
      });
    };
    initMegaDropdownHover();
  }

  // Shiplystic Mega Dropdown Tab Switcher (Ultra-responsive event delegation on mouseover, mouseenter & click)
  const initMegaDropdownTabs = () => {
    const sidebars = document.querySelectorAll('.mega-sidebar');
    sidebars.forEach(sidebar => {
      const container = sidebar.closest('.shiplystic-mega-menu');
      if (!container) return;

      const activateTab = (btn) => {
        const targetId = btn.getAttribute('data-target');
        if (!targetId) return;

        container.querySelectorAll('.mega-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        container.querySelectorAll('.mega-panel').forEach(p => {
          if (p.id === targetId) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });
      };

      // Event delegation catches all movements into tabs (Devi & Shakti Peeths, Char Dham, etc.)
      sidebar.addEventListener('mouseover', (e) => {
        const btn = e.target.closest('.mega-tab-btn');
        if (btn && !btn.classList.contains('active')) {
          activateTab(btn);
        }
      });

      sidebar.addEventListener('mouseenter', (e) => {
        const btn = e.target.closest('.mega-tab-btn');
        if (btn) {
          activateTab(btn);
        }
      }, true);

      sidebar.addEventListener('click', (e) => {
        const btn = e.target.closest('.mega-tab-btn');
        if (btn) {
          e.preventDefault();
          e.stopPropagation();
          activateTab(btn);
        }
      });
    });
  };
  initMegaDropdownTabs();

  // Active Link Highlight - ensure only the ONE current menu item is marked active
  try {
    const rawPath = window.location.pathname.replace(/\\/g, '/');
    const cleanPath = rawPath.split('?')[0].split('#')[0];
    const filename = cleanPath.split('/').filter(Boolean).pop() || 'index.html';
    const isServicesSection = cleanPath.includes('/services/');
    const isTemplesSection = cleanPath.includes('/temples/') || filename === 'temples.html';

    const headerNavLinks = Array.from(document.querySelectorAll('.nav-links > li > .nav-link'));
    if (headerNavLinks.length > 0) {
      let activeLink = null;

      if (isTemplesSection) {
        activeLink = headerNavLinks.find(l => {
          const href = (l.getAttribute('href') || '').toLowerCase();
          return href.includes('temples.html') || l.textContent.trim().startsWith('Temples');
        });
      } else if (isServicesSection) {
        activeLink = headerNavLinks.find(l => {
          const href = (l.getAttribute('href') || '').toLowerCase();
          return href.includes('services/') || (href.endsWith('index.html') && l.textContent.trim().startsWith('Services')) || l.textContent.trim().startsWith('Services');
        });
      } else if (filename === 'index.html' || cleanPath.endsWith('/')) {
        activeLink = headerNavLinks.find(l => {
          const href = (l.getAttribute('href') || '').toLowerCase();
          return l.textContent.trim() === 'Home' && !href.includes('services/');
        });
      } else {
        activeLink = headerNavLinks.find(l => {
          const href = (l.getAttribute('href') || '').trim();
          const target = href.split('/').filter(Boolean).pop();
          return target === filename;
        });
      }

      if (activeLink) {
        headerNavLinks.forEach(link => {
          if (link === activeLink) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }

      // Add click handler so clicking a menu item highlights it immediately
      headerNavLinks.forEach(link => {
        link.addEventListener('click', () => {
          headerNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        });
      });
    }
  } catch (err) {
    console.warn('Active nav link highlight error:', err);
  }

  // Global Coming Soon Modal Controls
  window.showComingSoon = function() {
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeComingSoon = function() {
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const csModal = document.getElementById('comingSoonModal');
  if (csModal) {
    csModal.addEventListener('click', function(e) {
      if (e.target === this) window.closeComingSoon();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.closeComingSoon();
  });

  // Interactive Occasion Tab Switcher
  window.switchOccasionTab = function(tabId, btnElement) {
    var buttons = document.querySelectorAll('.occasion-tab-btn');
    buttons.forEach(function(btn) { btn.classList.remove('active'); });
    if (btnElement) btnElement.classList.add('active');

    var contents = document.querySelectorAll('.occasion-tab-content');
    contents.forEach(function(content) {
      content.style.display = 'none';
      content.classList.remove('active');
    });

    var target = document.getElementById('tab-' + tabId);
    if (target) {
      target.style.display = 'flex';
      target.classList.add('active');
    }
  };

  // Sticky Header Shadow
  const header = document.querySelector('.header-nav');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  }

  // Hero Background Multi-Image Slider
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  const sliderDots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval;

  if (bgSlides.length > 0) {
    function goToSlide(index) {
      bgSlides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      sliderDots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active-dot');
        } else {
          dot.classList.remove('active-dot');
        }
      });
      currentSlide = index;
    }

    function nextSlide() {
      const nextIndex = (currentSlide + 1) % bgSlides.length;
      goToSlide(nextIndex);
    }

    slideInterval = setInterval(nextSlide, 4500);

    sliderDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        goToSlide(index);
        slideInterval = setInterval(nextSlide, 4500);
      });
    });
  }

  // Interactive How It Works Stepper Slider
  const stepperData = [
    {
      step: "01",
      phase: "Phase 1: Devotee Action",
      phaseClass: "phase-1-badge",
      title: "Select Temple",
      desc: "Begin your Prarthana journey by choosing your preferred participating temple from revered Jyotirlingas, Shakti Peethas, and sacred shrines across India.",
      highlights: ["✓ 100+ Verified Participating Temples", "✓ Direct Temple Trust Pass-Through", "✓ Authentic Priest Conducted Pujas"],
      icon: "🛕",
      visualTitle: "Participating Temple Selection",
      ctaText: "Start Your Prarthana ➔",
      ctaLink: "services/prarthana.html"
    },
    {
      step: "02",
      phase: "Phase 1: Devotee Action",
      phaseClass: "phase-1-badge",
      title: "Enter Devotee Details",
      desc: "Provide your name, gotra, nakshatra, and personal prayer intentions so the temple pandit ji can recite your official sankalp during the sacred ritual.",
      highlights: ["✓ Personal Name & Gotra Sankalp", "✓ Custom Prayer Intention Included", "✓ Dedicated Priest Assignment"],
      icon: "✍️",
      visualTitle: "Official Devotee Sankalp Form",
      ctaText: "Book Prarthana Now 📅",
      ctaLink: "services/prarthana.html"
    },
    {
      step: "03",
      phase: "Phase 1: Devotee Action",
      phaseClass: "phase-1-badge",
      title: "Complete Booking",
      desc: "Securely confirm your flat-rate ₹1,999 Prarthana booking with full transparency covering temple donation, receipt, packaging, and doorstep delivery.",
      highlights: ["✓ All-Inclusive Flat Rate ₹1,999", "✓ Secure Transparent Payment", "✓ Instant Booking Confirmation"],
      icon: "💳",
      visualTitle: "Transparent Flat-Rate Checkout",
      ctaText: "Complete Booking ➔",
      ctaLink: "services/prarthana.html"
    },
    {
      step: "04",
      phase: "Phase 2: Temple Process",
      phaseClass: "phase-2-badge",
      title: "Temple Donation",
      desc: "Your ₹501 donation is directly passed to the respective temple trust according to applicable temple procedures and guidelines.",
      highlights: ["✓ Direct ₹501 Temple Trust Pass-Through", "✓ Official Trust Compliance", "✓ Authentic Priest Allocation"],
      icon: "🌸",
      visualTitle: "Temple Trust Donation Transfer",
      ctaText: "Learn About Transparency ➔",
      ctaLink: "about.html"
    },
    {
      step: "05",
      phase: "Phase 2: Temple Process",
      phaseClass: "phase-2-badge",
      title: "Receipt / Proof",
      desc: "Official donation receipt or proof is generated and shared digitally with you as issued or available by the temple trust.",
      highlights: ["✓ Official Temple Donation Proof", "✓ Digital Receipt Shared via Email/WhatsApp", "✓ Verified Transparency Record"],
      icon: "📜",
      visualTitle: "Verified Temple Receipt",
      ctaText: "View Sample Proof ➔",
      ctaLink: "gallery.html"
    },
    {
      step: "06",
      phase: "Phase 2: Temple Process",
      phaseClass: "phase-2-badge",
      title: "Prasad Arranged",
      desc: "Sacred Maha Prasad (bhasma, kumkum, sacred dry fruits, chandan) is arranged subject to temple availability directly from the temple.",
      highlights: ["✓ Authentic Temple Maha Prasad", "✓ Subject to Temple Availability", "✓ Pure & Sacred Handling"],
      icon: "🪔",
      visualTitle: "Blessed Temple Maha Prasad",
      ctaText: "Explore Package Details ➔",
      ctaLink: "services/prarthana.html"
    },
    {
      step: "07",
      phase: "Phase 3: Fulfillment",
      phaseClass: "phase-3-badge",
      title: "Securely Packed",
      desc: "The blessed Maha Prasad is placed inside tamper-evident, eco-friendly protective packaging to ensure maximum hygiene and safety in transit.",
      highlights: ["✓ Tamper-Evident Protective Box", "✓ Hygienic & Eco-Friendly Packaging", "✓ Complete Sacred Protection"],
      icon: "🔒",
      visualTitle: "Hygienic Sealed Prasad Box",
      ctaText: "Packaging Details ➔",
      ctaLink: "about.html"
    },
    {
      step: "08",
      phase: "Phase 3: Delivery",
      phaseClass: "phase-3-badge",
      title: "Dispatched",
      desc: "Your shipment is handed over to Shiplystic Multi-Carrier Logistics Network for fast, reliable, and trackable express dispatch.",
      highlights: ["✓ Shiplystic Express Dispatch", "✓ Live Tracking Reference ID", "✓ Multi-Carrier Network Routing"],
      icon: "🚚",
      visualTitle: "Shiplystic Express Dispatch",
      ctaText: "Track Shipment 📦",
      ctaLink: "track.html"
    },
    {
      step: "09",
      phase: "Phase 3: Delivery",
      phaseClass: "phase-3-badge",
      title: "Delivered to Your Doorstep",
      desc: "Your sacred Maha Prasad and donation proof are safely delivered directly to your doorstep with devotion and care.",
      highlights: ["✓ Safe Doorstep Handover", "✓ Zero OTP / Payment Link Request", "✓ Devotional Fulfillment Complete"],
      icon: "🏠",
      visualTitle: "Doorstep Prasad Handover",
      ctaText: "Track Your Order 📦",
      ctaLink: "track.html"
    }
  ];

  let currentStepIdx = 0;
  const stepperNodes = document.querySelectorAll('.stepper-node');
  const progressFill = document.querySelector('.stepper-progress-fill');

  function renderStep(idx) {
    if (idx < 0 || idx >= stepperData.length) return;
    currentStepIdx = idx;
    const data = stepperData[idx];

    // Update Progress Line Fill width
    if (progressFill) {
      const percentage = ((idx + 1) / stepperData.length) * 100;
      progressFill.style.width = `${percentage}%`;
    }

    // Update Stepper Nodes state
    stepperNodes.forEach((node, i) => {
      if (i === idx) {
        node.classList.add('active');
        node.classList.remove('completed');
      } else if (i < idx) {
        node.classList.remove('active');
        node.classList.add('completed');
      } else {
        node.classList.remove('active', 'completed');
      }
    });

    // Update Showcase Panel Content
    const phaseBadge = document.getElementById('step-showcase-phase');
    const titleEl = document.getElementById('step-showcase-title');
    const descEl = document.getElementById('step-showcase-desc');
    const highlightsEl = document.getElementById('step-showcase-highlights');
    const ctaEl = document.getElementById('step-showcase-cta');
    const visualSide = document.querySelector('.step-visual-side');

    if (phaseBadge) {
      phaseBadge.textContent = data.phase;
      phaseBadge.className = `step-phase-badge ${data.phaseClass}`;
    }
    if (titleEl) titleEl.textContent = `${data.step}. ${data.title}`;
    if (descEl) descEl.textContent = data.desc;
    if (highlightsEl) {
      highlightsEl.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');
    }
    if (ctaEl) {
      ctaEl.textContent = data.ctaText;
      ctaEl.setAttribute('href', data.ctaLink);
    }

    if (visualSide) {
      const mockups = [
        // STEP 1
        `<div class="step-visual-top-bar">
          <span class="step-visual-title-badge">🛕 STEP 1 PREVIEW</span>
          <span style="font-size:0.75rem; color:#A1A1AA;">100+ Sacred Temples</span>
        </div>
        <div class="step-visual-content-box">
          <div style="display:flex; gap:0.8rem; align-items:center; margin-bottom:0.8rem;">
            <div style="font-size:2rem; background:rgba(220,38,38,0.2); padding:0.4rem 0.6rem; border-radius:10px;">🛕</div>
            <div>
              <div style="font-weight:800; color:#FFF; font-size:0.95rem;">Shri Mahakaleshwar Temple</div>
              <div style="font-size:0.76rem; color:#94A3B8;">📍 Ujjain, MP • Jyotirlinga</div>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:0.6rem 0.8rem; border-radius:8px;">
            <span style="font-size:0.82rem; color:#FEF2F2; font-weight:700;">Flat Rate: ₹1,999</span>
            <span style="font-size:0.72rem; background:#DC2626; color:#FFF; padding:0.2rem 0.6rem; border-radius:50px; font-weight:700;">Selected ✓</span>
          </div>
        </div>
        <div class="step-visual-footer">
          <span>✓ Temple Trust Partnership</span>
          <span style="color:#DC2626;">⭐⭐⭐⭐⭐ 4.9</span>
        </div>`,

        // STEP 2
        `<div class="step-visual-top-bar">
          <span class="step-visual-title-badge">✍️ STEP 2 PREVIEW</span>
          <span style="font-size:0.75rem; color:#A1A1AA;">Official Sankalp Form</span>
        </div>
        <div class="step-visual-content-box">
          <div style="font-size:0.78rem; color:#94A3B8; margin-bottom:0.4rem;">Devotee Sankalp Entry:</div>
          <div style="background:rgba(0,0,0,0.3); padding:0.8rem; border-radius:8px; font-size:0.82rem; color:#FFF; line-height:1.6;">
            <div>👤 <strong>Devotee:</strong> Ramesh Sharma</div>
            <div>📜 <strong>Gotra:</strong> Kashyap Gotra</div>
            <div>🌸 <strong>Sankalp:</strong> Family Health, Peace & Prosperity</div>
          </div>
        </div>
        <div class="step-visual-footer">
          <span style="color:#34D399;">✓ Verified Sankalp Entry</span>
          <span>Pandit Ji Assigned</span>
        </div>`,

        // STEP 3
        `<div class="step-visual-top-bar">
          <span class="step-visual-title-badge">💳 STEP 3 PREVIEW</span>
          <span style="font-size:0.75rem; color:#A1A1AA;">Transparent Checkout</span>
        </div>
        <div class="step-visual-content-box">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#CBD5E1; margin-bottom:0.4rem;">
            <span>Direct Temple Trust Donation</span>
            <strong style="color:#FEF2F2;">₹501.00</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#CBD5E1; margin-bottom:0.4rem;">
            <span>Puja Proof & Sealed Packaging</span>
            <span>Included</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#CBD5E1; margin-bottom:0.6rem;">
            <span>Shiplystic Express Delivery</span>
            <span>Included</span>
          </div>
          <div style="border-top:1px solid rgba(255,255,255,0.15); padding-top:0.6rem; display:flex; justify-content:space-between; font-weight:800; color:#FFF; font-size:0.92rem;">
            <span>Total Package Price</span>
            <span style="color:#EF4444;">₹1,999.00</span>
          </div>
        </div>
        <div class="step-visual-footer">
          <span style="color:#34D399;">🔒 256-Bit Encrypted</span>
          <span>Instant Receipt</span>
        </div>`,
        // STEP 4
        `<div class="step-visual-top-bar">
          <span class="step-visual-title-badge">🌸 STEP 4 PREVIEW</span>
          <span style="font-size:0.75rem; color:#A1A1AA;">Temple Sanctuary</span>
        </div>
        <div class="step-visual-content-box" style="text-align:center;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">🪔</div>
          <div style="font-weight:800; color:#FFF; font-size:0.92rem; margin-bottom:0.3rem;">Authentic Temple Puja Conducted</div>
          <div style="font-size:0.76rem; color:#94A3B8;">Conducted strictly inside the garbhagriha by genuine temple trust pandit ji.</div>
        </div>
        <div class="step-visual-footer">
          <span style="color:#EF4444;">✓ 100% Genuine Priests</span>
          <span>Official Trust Receipt</span>
        </div>`,

        // STEP 5
        `<div class="step-visual-top-bar">
          <span class="step-visual-title-badge">📷 STEP 5 PREVIEW</span>
          <span style="font-size:0.75rem; color:#A1A1AA;">Digital Video Proof Player</span>
        </div>
        <div class="step-visual-content-box" style="text-align:center; padding:1.2rem; background:rgba(0,0,0,0.5);">
          <div style="width:44px; height:44px; border-radius:50%; background:#DC2626; color:#FFF; display:flex; align-items:center; justify-content:center; margin:0 auto 0.6rem; font-size:1.1rem; box-shadow:0 0 15px rgba(220,38,38,0.6);">▶</div>
          <div style="font-weight:800; color:#FFF; font-size:0.82rem;">Mahakal_Sankalp_Proof.mp4</div>
          <div style="font-size:0.72rem; color:#94A3B8; margin-top:0.2rem;">Devotee Recitation: Ramesh Sharma (Kashyap Gotra)</div>
        </div>
        <div class="step-visual-footer">
          <span style="color:#34D399;">✓ Sent via WhatsApp & Email</span>
          <span>HD Proof Video</span>
        </div>`,

        // STEP 6
        `<div class="step-visual-top-bar">
          <span class="step-visual-title-badge">🪔 STEP 6 PREVIEW</span>
          <span style="font-size:0.75rem; color:#A1A1AA;">Maha Prasad Contents</span>
        </div>
        <div class="step-visual-content-box">
          <div style="font-size:0.78rem; color:#94A3B8; margin-bottom:0.5rem;">Authentic Temple Prasad Package:</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.76rem; color:#FFF;">
            <div style="background:rgba(255,255,255,0.06); padding:0.4rem; border-radius:6px;">✨ Sacred Bhasma</div>
            <div style="background:rgba(255,255,255,0.06); padding:0.4rem; border-radius:6px;">🌸 Holy Kumkum</div>
            <div style="background:rgba(255,255,255,0.06); padding:0.4rem; border-radius:6px;">🎗️ Blessed Thread</div>
            <div style="background:rgba(255,255,255,0.06); padding:0.4rem; border-radius:6px;">🌰 Sacred Dry Fruits</div>
          </div>
        </div>
        <div class="step-visual-footer">
          <span>✓ Handed over by Priests</span>
          <span style="color:#EF4444;">Fresh & Blessed</span>
        </div>`,

        // STEP 7
        `<div class="step-visual-top-bar">
          <span class="step-visual-title-badge">🔒 STEP 7 PREVIEW</span>
          <span style="font-size:0.75rem; color:#A1A1AA;">Protective Sealed Box</span>
        </div>
        <div class="step-visual-content-box" style="text-align:center;">
          <div style="font-size:2.5rem; margin-bottom:0.4rem;">📦</div>
          <div style="font-weight:800; color:#FFF; font-size:0.88rem; margin-bottom:0.2rem;">Shiplystic Tamper-Proof Box</div>
          <div style="font-size:0.74rem; color:#34D399; font-weight:700;">🔒 Holographic Security Seal</div>
          <div style="font-size:0.72rem; color:#94A3B8; margin-top:0.2rem;">Sanitized Packaging Protocol</div>
        </div>
        <div class="step-visual-footer">
          <span>✓ Sealed in Devotion</span>
          <span style="color:#34D399;">Eco-Friendly Outer</span>
        </div>`,

        // STEP 8
        `<div class="step-visual-top-bar">
          <span class="step-visual-title-badge">🚚 STEP 8 PREVIEW</span>
          <span style="font-size:0.75rem; color:#A1A1AA;">Shiplystic Logistics</span>
        </div>
        <div class="step-visual-content-box">
          <div style="display:flex; align-items:center; gap:0.8rem; margin-bottom:0.6rem;">
            <div style="font-size:1.8rem;">🚚</div>
            <div>
              <div style="font-weight:800; color:#34D399; font-size:0.85rem;">Out for Delivery • Arriving Tomorrow</div>
              <div style="font-size:0.74rem; color:#94A3B8;">Tracking: PRARTHANA-892341</div>
            </div>
          </div>
          <div style="background:rgba(0,0,0,0.3); padding:0.4rem 0.7rem; border-radius:6px; font-size:0.74rem; color:#CBD5E1;">
            📍 Doorstep Prasad Delivery in Progress
          </div>
        </div>
        <div class="step-visual-footer">
          <span style="color:#EF4444;">✓ Multi-Carrier Ecosystem</span>
          <span>Live GPS Track</span>
        </div>`
      ];

      visualSide.innerHTML = mockups[idx];
    }

    // Update Prev / Next Buttons state
    const prevBtn = document.getElementById('stepper-prev-btn');
    const nextBtn = document.getElementById('stepper-next-btn');

    if (prevBtn) prevBtn.disabled = (idx === 0);
    if (nextBtn) nextBtn.disabled = (idx === stepperData.length - 1);
  }

  // Stepper Node Clicks
  stepperNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      renderStep(index);
    });
  });

  // Prev / Next Button Controls
  const prevBtn = document.getElementById('stepper-prev-btn');
  const nextBtn = document.getElementById('stepper-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStepIdx > 0) renderStep(currentStepIdx - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStepIdx < stepperData.length - 1) renderStep(currentStepIdx + 1);
    });
  }

  // Toast Notification System
  window.showToast = function(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  };

  // FAQ Accordions
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      item.classList.toggle('open');
    });
  });

  // Live Order Tracking Lookup Handler (for track.html)
  const trackForm = document.getElementById('tracking-search-form');
  if (trackForm) {
    // Check URL parameters for id
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('id');

    if (orderIdParam) {
      const input = document.getElementById('tracking-input');
      if (input) input.value = orderIdParam;
      renderTrackingResult(orderIdParam);
    }

    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputVal = document.getElementById('tracking-input').value.trim();
      if (inputVal) {
        renderTrackingResult(inputVal);
      }
    });
  }
});

// Render Tracking Stepper Result
function renderTrackingResult(orderId) {
  const resultCard = document.getElementById('tracking-result-card');
  const errorCard = document.getElementById('tracking-error-card');

  if (!resultCard) return;

  const orders = JSON.parse(localStorage.getItem('shiplystic_orders') || '[]');
  const foundOrder = orders.find(o => o.id.toUpperCase() === orderId.toUpperCase());

  // Default Mock fallback if not in localStorage
  const displayOrder = foundOrder || {
    id: orderId.toUpperCase(),
    date: "02 Sep 2026",
    temple: "Shri Mahakaleshwar Temple, Ujjain",
    package: "Mahakal Bhasma Aarti Sankalp",
    total: 2650,
    devotee: "Ramesh Sharma",
    gotra: "Kashyap",
    status: "Puja Performed & Prasad Packed",
    statusStep: 3,
    history: [
      { status: "Order Placed & Sankalp Received", time: "02 Sep, 09:30 AM", done: true },
      { status: "Pandit Ji Assigned at Temple", time: "02 Sep, 10:15 AM", done: true },
      { status: "Puja Performed & Video Recorded", time: "02 Sep, 11:45 AM", done: true },
      { status: "Prasad Hygienically Packed", time: "02 Sep, 01:20 PM", done: true },
      { status: "In Transit via Shiplystic Express", time: "Expected 03 Sep", done: false },
      { status: "Delivered to Doorstep", time: "Expected 04 Sep", done: false }
    ]
  };

  if (errorCard) errorCard.style.display = 'none';
  const initialInfo = document.getElementById('track-initial-info');
  if (initialInfo) initialInfo.style.display = 'none';
  resultCard.style.display = 'block';

  document.getElementById('track-res-id').textContent = displayOrder.id;
  document.getElementById('track-res-temple').textContent = displayOrder.temple;
  document.getElementById('track-res-package').textContent = displayOrder.package;
  document.getElementById('track-res-devotee').textContent = displayOrder.devotee;
  document.getElementById('track-res-gotra').textContent = displayOrder.gotra;
  document.getElementById('track-res-status').textContent = displayOrder.status;

  const timelineContainer = document.getElementById('track-timeline');
  if (timelineContainer) {
    timelineContainer.innerHTML = '';
    displayOrder.history.forEach((step, idx) => {
      const stepDiv = document.createElement('div');
      stepDiv.style.display = 'flex';
      stepDiv.style.gap = '1rem';
      stepDiv.style.alignItems = 'flex-start';
      stepDiv.style.marginBottom = '1.5rem';
      stepDiv.style.position = 'relative';

      stepDiv.innerHTML = `
        <div style="
          width: 32px; 
          height: 32px; 
          border-radius: 50%; 
          background: ${step.done ? '#DC2626' : '#E5E7EB'}; 
          color: ${step.done ? '#FFF' : '#6B7280'};
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: bold;
          flex-shrink: 0;
          z-index: 2;
        ">
          ${step.done ? '✓' : idx + 1}
        </div>
        <div>
          <h4 style="font-size: 1rem; color: ${step.done ? '#DC2626' : '#9CA3AF'}; margin-bottom: 0.2rem;">${step.status}</h4>
          <span style="font-size: 0.82rem; color: #6B7280;">${step.time}</span>
        </div>
      `;
      timelineContainer.appendChild(stepDiv);
    });
  }
}

// Xpressbees Tracking Mode Switcher Pill Handler
function selectTrackPill(mode) {
  const awbPill = document.getElementById('pill-awb') || document.getElementById('track-pill-awb');
  const orderPill = document.getElementById('pill-order') || document.getElementById('track-pill-order');
  const inputs = document.querySelectorAll('.xpress-input');

  if (mode === 'awb') {
    if (awbPill) { awbPill.className = 'xpress-pill active'; }
    if (orderPill) { orderPill.className = 'xpress-pill inactive'; }
    inputs.forEach(input => input.placeholder = 'Enter AWB number (e.g. AWB-98214)...');
  } else {
    if (awbPill) { awbPill.className = 'xpress-pill inactive'; }
    if (orderPill) { orderPill.className = 'xpress-pill active'; }
    inputs.forEach(input => input.placeholder = 'Enter Order ID (e.g. PRAR-98214-IND)...');
  }
}



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
            <li><a href="/" style="color: #DC2626;">Home</a></li>
            <li><a href="/services" style="color: #DC2626;">Services Overview</a></li>
            <li><a href="/book-prarthana" style="color: #DC2626;">Book Prarthana Service</a></li>
            <li><a href="/track-delivery" style="color: #DC2626;">Track Delivery</a></li>
            <li><a href="/about-us" style="color: #DC2626;">About Us</a></li>
            <li><a href="/contact-us" style="color: #DC2626;">Contact Support</a></li>
            <li><a href="/faqs" style="color: #DC2626;">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h5 style="color: #111827; margin-bottom: 0.5rem; font-weight: 800;">Featured Sanctums</h5>
          <ul style="padding-left: 1.2rem; margin: 0;">
            <li><a href="/temples/mahakaleshwar-ujjain" style="color: #DC2626;">Mahakaleshwar Ujjain</a></li>
            <li><a href="/temples/omkareshwar" style="color: #DC2626;">Omkareshwar Jyotirlinga</a></li>
            <li><a href="/temples/mahalaxmi-kolhapur" style="color: #DC2626;">Mahalaxmi Kolhapur</a></li>
            <li><a href="/temples/sai-baba-shirdi" style="color: #DC2626;">Sai Baba Shirdi</a></li>
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
      <button onclick="saveCookiePreferences();" class="btn btn-red" style="padding: 0.75rem 2rem; border-radius: 50px; font-weight: 800; cursor: pointer;">Save Preferences</button>
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

// Global Coming Soon Modal Handlers
window.showComingSoon = function() {
  const modal = document.getElementById('comingSoonModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeComingSoon = function() {
  const modal = document.getElementById('comingSoonModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close modal on clicking backdrop or pressing Escape
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('comingSoonModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeComingSoon();
      }
    });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('comingSoonModal');
    if (modal && modal.classList.contains('active')) {
      window.closeComingSoon();
    }
  }
});

// ============================================================
// COOKIE CONSENT SYSTEM ("ASK FOR COOKIES")
// ============================================================
window.saveCookiePreferences = function() {
  try {
    localStorage.setItem('shiplystic_cookie_consent', 'customized');
  } catch (e) {
    console.warn('LocalStorage unavailable for cookie consent', e);
  }
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) {
    banner.classList.remove('show');
    setTimeout(() => {
      if (banner.parentNode) banner.remove();
    }, 400);
  }
  window.closeLegalModal();
};

function initCookieConsentBanner() {
  try {
    const consent = localStorage.getItem('shiplystic_cookie_consent');
    if (consent) return; // User already made a choice
  } catch (e) {
    // If localStorage is disabled/restricted, proceed to display
  }

  // Prevent duplicate insertion
  if (document.getElementById('cookie-consent-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'cookie-consent-banner';
  banner.className = 'cookie-consent-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie Consent');
  banner.innerHTML = `
    <div class="cookie-consent-header">
      <div class="cookie-consent-title">
        <span class="cookie-consent-title-icon">🍪</span>
        <span>We Value Your Privacy</span>
      </div>
      <button class="cookie-consent-close" id="cookie-banner-close-btn" aria-label="Close Cookie Notice">✕</button>
    </div>
    <div class="cookie-consent-body">
      We use cookies to ensure seamless temple ritual bookings, express prasad delivery tracking, and personalizing your devotional journey. Learn more in our <a href="#" onclick="openLegalModal('Cookies Policy'); return false;">Cookies Policy</a>.
    </div>
    <div class="cookie-consent-actions">
      <button class="btn-cookie-accept" id="cookie-accept-all-btn">Accept All</button>
      <button class="btn-cookie-reject" id="cookie-reject-btn">Decline Non-Essential</button>
      <button class="btn-cookie-preferences" id="cookie-customize-btn">Manage Preferences</button>
    </div>
  `;

  document.body.appendChild(banner);

  // Smooth slide-up transition after 800ms
  setTimeout(() => {
    banner.classList.add('show');
  }, 800);

  const closeBanner = () => {
    banner.classList.remove('show');
    setTimeout(() => {
      if (banner.parentNode) banner.remove();
    }, 400);
  };

  document.getElementById('cookie-accept-all-btn')?.addEventListener('click', () => {
    try {
      localStorage.setItem('shiplystic_cookie_consent', 'accepted');
    } catch (e) {}
    closeBanner();
  });

  document.getElementById('cookie-reject-btn')?.addEventListener('click', () => {
    try {
      localStorage.setItem('shiplystic_cookie_consent', 'declined');
    } catch (e) {}
    closeBanner();
  });

  document.getElementById('cookie-customize-btn')?.addEventListener('click', () => {
    if (typeof window.openCookiePreferences === 'function') {
      window.openCookiePreferences();
    }
  });

  document.getElementById('cookie-banner-close-btn')?.addEventListener('click', () => {
    try {
      localStorage.setItem('shiplystic_cookie_consent', 'dismissed');
    } catch (e) {}
    closeBanner();
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieConsentBanner);
} else {
  initCookieConsentBanner();
}



