/* ==========================================================================
   Shiplystic Prarthana - Global Scripts (js/main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
    });
  }

  // Active Link Highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPath)) {
      link.classList.add('active');
    }
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

