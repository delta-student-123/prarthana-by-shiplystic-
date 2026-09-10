/* ==========================================================================
   Shiplystic Prarthana - Booking Wizard Logic (v2 Repositioned)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  let selectedTemple = TEMPLE_DATA[0];
  let selectedPackage = TEMPLE_DATA[0].packages[0]; // Flat Rate ₹1,999

  // UI Elements
  const stepItems = document.querySelectorAll('.step-item');
  const templeGrid = document.getElementById('temple-radio-grid');
  const packageGrid = document.getElementById('package-grid');
  const summaryTempleName = document.getElementById('summary-temple');
  const summaryPujaPrice = document.getElementById('summary-puja-price');
  const summaryTotalPrice = document.getElementById('summary-total');

  // Coming Soon Temples List
  const COMING_SOON_TEMPLES = [
    'kashi-vishwanath',
    'somnath',
    'kedarnath',
    'vaishno-devi',
    'siddhivinayak-mumbai',
    'siddhivinayak',
    'tirupati-balaji',
    'tirupati',
    'jagannath-puri',
    'jagannath',
    'badrinath',
    'rameswaram',
    'ayodhya-ram-mandir',
    'ram-mandir'
  ];

  // Handle URL parameter for Temple and Special Occasion selection
  const urlParams = new URLSearchParams(window.location.search);
  const paramTemple = urlParams.get('temple');
  if (paramTemple) {
    const found = TEMPLE_DATA.find(t => t.id.toLowerCase() === paramTemple.toLowerCase());
    if (found) {
      if (COMING_SOON_TEMPLES.includes(found.id.toLowerCase())) {
        setTimeout(() => {
          if (typeof showComingSoon === 'function') {
            showComingSoon();
          }
        }, 350);
      } else {
        selectedTemple = found;
        if (found.packages && found.packages.length > 0) {
          selectedPackage = found.packages[0];
        }
      }
    }
  }

  const paramOccasion = urlParams.get('occasion');
  const occasionSelect = document.getElementById('specialOccasion');
  if (paramOccasion && occasionSelect) {
    for (let opt of occasionSelect.options) {
      if (opt.value.toLowerCase() === paramOccasion.toLowerCase()) {
        occasionSelect.value = opt.value;
        break;
      }
    }
  }

  // Render Temples
  function renderTemples() {
    if (!templeGrid) return;
    templeGrid.innerHTML = '';

    TEMPLE_DATA.forEach(t => {
      const isComingSoon = COMING_SOON_TEMPLES.includes(t.id.toLowerCase());
      const isSelected = t.id === selectedTemple.id;
      const card = document.createElement('div');
      card.className = `temple-radio-card ${isSelected ? 'selected' : ''}`;
      const isSub = window.location.pathname.includes('/book-prarthana') || window.location.pathname.includes('/services/') || window.location.pathname.includes('/temples/');
      const imgSrc = isSub ? t.image : t.image.replace('../', '');
      const fallbackSrc = isSub ? '../images/temples/mahakaleshwar-ujjain.jpg' : 'images/temples/mahakaleshwar-ujjain.jpg';
      card.innerHTML = `
        <input type="radio" name="temple-select" id="t-${t.id}" ${isSelected ? 'checked' : ''}>
        <img src="${imgSrc}" alt="${t.name}" class="temple-radio-thumb" onerror="this.onerror=null; this.src='${fallbackSrc}';">
        <div class="temple-radio-info">
          <h4>${t.name} ${isComingSoon ? '<span style="font-size:0.55rem; font-weight:800; background:#FEE2E2; color:#DC2626; padding:1px 5px; border-radius:4px; vertical-align:middle; margin-left:3px; letter-spacing:0.2px; display:inline-block;">COMING SOON</span>' : ''}</h4>
          <p>${t.deity} • ${t.location}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        if (isComingSoon) {
          if (typeof showComingSoon === 'function') {
            showComingSoon();
          }
          return;
        }
        selectedTemple = t;
        selectedPackage = t.packages[0];
        document.querySelectorAll('.temple-radio-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input');
        if (radio) radio.checked = true;
        renderPackages();
        updateSummary();
      });

      templeGrid.appendChild(card);
    });
  }

  // Render Packages
  function renderPackages() {
    if (!packageGrid) return;
    packageGrid.innerHTML = '';

    selectedTemple.packages.forEach(pkg => {
      const card = document.createElement('div');
      card.className = `package-card selected popular`;
      card.style.gridColumn = "span 3";
      card.innerHTML = `
        <div class="package-title">${pkg.name}</div>
        <div class="package-price">₹${pkg.price.toLocaleString('en-IN')} <span style="font-size:0.85rem; color: var(--text-muted); font-weight: normal;">(incl. ₹501 Direct Temple Donation)</span></div>
        <ul class="package-features">
          ${pkg.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      `;
      packageGrid.appendChild(card);
    });
  }

  // Update Summary Sidebar
  function updateSummary() {
    if (summaryTempleName) summaryTempleName.textContent = selectedTemple.name;
    const totalCost = selectedPackage.price;

    if (summaryPujaPrice) summaryPujaPrice.textContent = `₹${totalCost.toLocaleString('en-IN')}`;
    if (summaryTotalPrice) summaryTotalPrice.textContent = `₹${totalCost.toLocaleString('en-IN')}`;
  }

  // Next / Previous Step Navigation
  const btnStep1Next = document.getElementById('btn-step1-next');
  const btnStep2Back = document.getElementById('btn-step2-back');
  const btnStep2Next = document.getElementById('btn-step2-next');
  const btnStep3Back = document.getElementById('btn-step3-back');
  const bookingForm = document.getElementById('prarthana-booking-form');

  const panel1 = document.getElementById('step-panel-1');
  const panel2 = document.getElementById('step-panel-2');
  const panel3 = document.getElementById('step-panel-3');
  const panel4 = document.getElementById('step-panel-4');

  function goToStep(step) {
    currentStep = step;
    stepItems.forEach((item, index) => {
      if (index + 1 === step) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (panel1) panel1.style.display = step === 1 ? 'block' : 'none';
    if (panel2) panel2.style.display = step === 2 ? 'block' : 'none';
    if (panel3) panel3.style.display = step === 3 ? 'block' : 'none';
    if (panel4) panel4.style.display = step === 4 ? 'block' : 'none';

    window.scrollTo({ top: 250, behavior: 'smooth' });
  }

  if (btnStep1Next) {
    btnStep1Next.addEventListener('click', () => {
      if (selectedTemple && COMING_SOON_TEMPLES.includes(selectedTemple.id.toLowerCase())) {
        if (typeof showComingSoon === 'function') {
          showComingSoon();
        }
        return;
      }
      goToStep(2);
    });
  }
  if (btnStep2Back) btnStep2Back.addEventListener('click', () => goToStep(1));
  if (btnStep2Next) btnStep2Next.addEventListener('click', () => goToStep(3));
  if (btnStep3Back) btnStep3Back.addEventListener('click', () => goToStep(2));

  // Form Submission & Order Generation
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        devoteeName: document.getElementById('devoteeName')?.value || '',
        gotra: document.getElementById('gotra')?.value || '',
        sankalp: document.getElementById('sankalp')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        address: document.getElementById('address')?.value || '',
        city: document.getElementById('city')?.value || '',
        pincode: document.getElementById('pincode')?.value || ''
      };

      const validation = FormValidator.validateDevoteeForm(formData);
      if (!validation.isValid) {
        alert("Please fix the following issues:\n\n• " + validation.errors.join("\n• "));
        return;
      }

      // Generate Order ID & Save Tracking Object
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const trackingId = `PRARTHANA-${randomId}`;

      const newOrder = {
        id: trackingId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        temple: selectedTemple.name,
        deity: selectedTemple.deity,
        package: selectedPackage.name,
        total: 1999,
        donation: 501,
        devotee: formData.devoteeName,
        gotra: formData.gotra,
        status: "Booking Confirmed & Temple Forwarded",
        statusStep: 1,
        history: [
          { status: "1. Select Temple & Online Booking", time: "Completed", done: true },
          { status: "2. Devotee Details & Form Review", time: "Completed", done: true },
          { status: "3. Temple Forwarded & Priest Assigned", time: "In Progress", done: true },
          { status: "4. Temple Puja Execution & ₹501 Donation", time: "Pending", done: false },
          { status: "5. Official Receipt / Proof Issued", time: "Pending", done: false },
          { status: "6. Prasad Arrangement by Temple", time: "Pending", done: false },
          { status: "7. Secure Packaging", time: "Pending", done: false },
          { status: "8. Courier Dispatch via Multi-Carrier Network", time: "Pending", done: false },
          { status: "9. Doorstep Delivery", time: "Pending", done: false }
        ]
      };

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('shiplystic_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('shiplystic_orders', JSON.stringify(existingOrders));
      localStorage.setItem('latest_order_id', trackingId);

      // Display Confirmation Panel (Step 4)
      document.getElementById('confirm-order-id').textContent = trackingId;
      document.getElementById('confirm-devotee').textContent = formData.devoteeName;
      document.getElementById('confirm-temple').textContent = selectedTemple.name;
      document.getElementById('confirm-amount').textContent = `₹1,999`;
      
      const trackLink = document.getElementById('confirm-track-btn');
      if (trackLink) {
        trackLink.href = `../track.html?id=${trackingId}`;
      }

      goToStep(4);
    });
  }

  // Initial Setup
  renderTemples();
  renderPackages();
  updateSummary();
});
