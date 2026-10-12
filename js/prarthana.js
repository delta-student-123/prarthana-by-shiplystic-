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

  // Search & Filter UI Elements
  const searchInput = document.getElementById('temple-search-input');
  const searchClear = document.getElementById('temple-search-clear');
  const searchCount = document.getElementById('temple-search-count');
  const noResultsEl = document.getElementById('temple-no-results');
  const noResultsMsg = document.getElementById('temple-no-results-msg');
  const resetSearchBtn = document.getElementById('temple-reset-search-btn');
  const chipButtons = document.querySelectorAll('.temple-chip-btn');

  let currentSearchQuery = '';
  let currentCategoryFilter = 'all';

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

  // Render Temples with Live Search & Filtering
  function renderTemples() {
    if (!templeGrid) return;
    templeGrid.innerHTML = '';

    const query = currentSearchQuery.trim().toLowerCase();

    const filteredTemples = TEMPLE_DATA.filter(t => {
      const isComingSoon = COMING_SOON_TEMPLES.includes(t.id.toLowerCase());
      const deityStr = (t.deity || '').toLowerCase();
      const nameStr = (t.name || '').toLowerCase();
      const tagStr = (t.tag || '').toLowerCase();
      const locStr = (t.location || '').toLowerCase();
      const idStr = t.id.toLowerCase();

      // Category chip filter
      if (currentCategoryFilter === 'jyotirlinga') {
        const isJyotirlinga = tagStr.includes('jyotirlinga') || 
          ['mahakaleshwar-ujjain', 'kashi-vishwanath', 'somnath', 'kedarnath', 'omkareshwar', 'rameswaram', 'badrinath'].includes(idStr);
        if (!isJyotirlinga) return false;
      } else if (currentCategoryFilter === 'shiva') {
        const isShiva = deityStr.includes('shiva') || deityStr.includes('mahakal') || deityStr.includes('kedar') || deityStr.includes('someshwar') || nameStr.includes('shiva');
        if (!isShiva) return false;
      } else if (currentCategoryFilter === 'devi') {
        const isDevi = deityStr.includes('devi') || deityStr.includes('durga') || deityStr.includes('laxmi') || deityStr.includes('shakti') || deityStr.includes('vaishno') || nameStr.includes('devi') || nameStr.includes('mahalaxmi');
        if (!isDevi) return false;
      } else if (currentCategoryFilter === 'vishnu') {
        const isVishnu = deityStr.includes('krishna') || deityStr.includes('vishnu') || deityStr.includes('venkateswara') || deityStr.includes('ram') || deityStr.includes('balaji') || deityStr.includes('jagannath') || nameStr.includes('krishna') || nameStr.includes('dwarkadhish') || nameStr.includes('balaji') || nameStr.includes('tirupati') || nameStr.includes('puri') || nameStr.includes('mathura') || nameStr.includes('ram');
        if (!isVishnu) return false;
      } else if (currentCategoryFilter === 'active') {
        if (isComingSoon) return false;
      }

      // Live search text query
      if (query) {
        const matchName = nameStr.includes(query);
        const matchDeity = deityStr.includes(query);
        const matchLoc = locStr.includes(query);
        const matchTag = tagStr.includes(query);
        const matchId = idStr.includes(query);
        return matchName || matchDeity || matchLoc || matchTag || matchId;
      }

      return true;
    });

    // Update count badge
    if (searchCount) {
      if (query) {
        searchCount.innerHTML = `Found <strong>${filteredTemples.length}</strong> of ${TEMPLE_DATA.length}`;
      } else if (currentCategoryFilter !== 'all') {
        searchCount.innerHTML = `Showing <strong>${filteredTemples.length}</strong> of ${TEMPLE_DATA.length}`;
      } else {
        searchCount.innerHTML = `Showing all <strong>${TEMPLE_DATA.length}</strong> temples`;
      }
    }

    // Handle Empty State
    if (filteredTemples.length === 0) {
      if (noResultsEl) {
        noResultsEl.style.display = 'block';
        if (noResultsMsg) {
          if (query) {
            noResultsMsg.textContent = `No temples match "${currentSearchQuery}". Try searching by deity (Shiva, Vishnu, Devi) or city (Varanasi, Ujjain, Katra).`;
          } else {
            noResultsMsg.textContent = `No temples match the selected filter category.`;
          }
        }
      }
      return;
    } else {
      if (noResultsEl) noResultsEl.style.display = 'none';
    }

    filteredTemples.forEach(t => {
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

  // Temple Search & Filter Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (searchClear) {
        searchClear.style.display = currentSearchQuery.length > 0 ? 'inline-flex' : 'none';
      }
      renderTemples();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      currentSearchQuery = '';
      searchClear.style.display = 'none';
      renderTemples();
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (searchClear) searchClear.style.display = 'none';
      currentSearchQuery = '';
      currentCategoryFilter = 'all';
      chipButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all');
      });
      renderTemples();
    });
  }

  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      chipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.dataset.filter || 'all';
      renderTemples();
    });
  });

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

      // Generate Order ID
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const trackingId = `PRARTHANA-${randomId}`;

      const submitBtn = document.getElementById('btn-submit-booking');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Confirm & Pay ₹1,999 ➔';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Connecting to Cashfree Checkout... ⏳';
      }

      function completeOrder(orderIdToUse) {
        const newOrder = {
          id: orderIdToUse,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          temple: selectedTemple.name,
          templeKey: selectedTemple.id,
          deity: selectedTemple.deity,
          package: selectedPackage.name,
          total: 1999,
          donation: 501,
          devotee: formData.devoteeName,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          gotra: formData.gotra,
          sankalp: formData.sankalp || 'Shri ' + selectedTemple.name + ' Puja & Gotra Sankalp (Pass-Through Dakshina)',
          paymentMode: 'Online (Cashfree / UPI Gateway)',
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

        const existingOrders = JSON.parse(localStorage.getItem('shiplystic_orders') || '[]');
        existingOrders.unshift(newOrder);
        localStorage.setItem('shiplystic_orders', JSON.stringify(existingOrders));
        localStorage.setItem('latest_order_id', orderIdToUse);

        // Display Confirmation Panel (Step 4)
        document.getElementById('confirm-order-id').textContent = orderIdToUse;
        document.getElementById('confirm-devotee').textContent = formData.devoteeName;
        document.getElementById('confirm-temple').textContent = selectedTemple.name;
        document.getElementById('confirm-amount').textContent = `₹1,999`;
        
        const trackLink = document.getElementById('confirm-track-btn');
        if (trackLink) {
          trackLink.href = `../track.html?id=${orderIdToUse}`;
        }

        const downloadReceiptBtn = document.getElementById('btn-download-receipt');
        if (downloadReceiptBtn) {
          downloadReceiptBtn.onclick = () => {
            if (typeof openDonationReceiptModal === 'function') {
              openDonationReceiptModal(newOrder);
            } else if (typeof downloadDonationReceipt === 'function') {
              downloadDonationReceipt(orderIdToUse);
            }
          };
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        goToStep(4);

        // 100% Zero-Click Automated WhatsApp PDF Delivery via Meta Cloud API
        sendAutomatedWhatsAppReceipt(newOrder);
      }

      // Dynamic backend host: when testing on VS Code Live Server (port 5500/5501), forward API calls to localhost:3000
      const apiBase = (window.location.port === '5500' || window.location.port === '5501') ? 'http://localhost:3000' : '';

      // Call Cashfree backend to initiate payment session
      fetch(`${apiBase}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: trackingId,
          orderAmount: 1999,
          customerName: formData.devoteeName,
          customerPhone: formData.phone,
          customerEmail: formData.email
        })
      })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          let errJson;
          try { errJson = JSON.parse(text); } catch (e) {}
          throw new Error(errJson?.error?.message || errJson?.error || `Server responded with status ${res.status}: ${text || 'API not reachable'}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data.success || !data.payment_session_id) {
          const errMsg = data.error?.message || (typeof data.error === 'string' ? data.error : 'Failed to initialize payment session.');
          throw new Error(errMsg);
        }

        if (typeof Cashfree !== 'undefined') {
          const cashfree = Cashfree({ mode: data.mode === 'production' ? 'production' : 'sandbox' });
          cashfree.checkout({
            paymentSessionId: data.payment_session_id,
            redirectTarget: '_modal'
          }).then((result) => {
            if (result.error) {
              alert("Payment notice: " + (result.error.message || 'Payment window closed or cancelled.'));
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
              }
              return;
            }
            // Successful payment
            completeOrder(trackingId);
          });
        } else {
          // Fallback if Cashfree CDN is blocked
          alert("Cashfree SDK not detected. Completing order directly.");
          completeOrder(trackingId);
        }
      })
      .catch(err => {
        console.error("Cashfree order error:", err);
        alert("Payment Gateway Notice: " + err.message + "\n\n(Tip: When running locally, ensure 'node server.js' or 'vercel dev' is running).");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      });
    });
  }

  // Initial Setup
  renderTemples();
  renderPackages();
  updateSummary();
});

// 100% Zero-Click Automated WhatsApp Delivery Handler (Meta WhatsApp Cloud API)
async function sendAutomatedWhatsAppReceipt(order) {
  const badge = document.getElementById('whatsapp-auto-delivery-badge');
  const titleEl = document.getElementById('whatsapp-auto-title');
  const descEl = document.getElementById('whatsapp-auto-desc');

  if (badge) badge.style.display = 'flex';

  const userPhone = order.phone || '';
  let cleanPhone = userPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

  if (descEl) {
    descEl.innerHTML = `Preparing official ₹501 Temple Donation Receipt PDF for <strong>+${cleanPhone}</strong>... ⏳`;
  }

  try {
    let pdfBase64 = null;
    if (typeof html2pdf !== 'undefined' && typeof generateDonationReceiptHtml === 'function') {
      try {
        const offscreenDiv = document.createElement('div');
        offscreenDiv.style.position = 'fixed';
        offscreenDiv.style.left = '-9999px';
        offscreenDiv.style.top = '0';
        offscreenDiv.style.width = '680px';
        offscreenDiv.innerHTML = generateDonationReceiptHtml(order);
        document.body.appendChild(offscreenDiv);

        const receiptEl = offscreenDiv.querySelector('.temple-receipt-container');
        if (receiptEl) {
          const opt = {
            margin: [6, 6, 6, 6],
            filename: `Temple_Donation_Receipt_${(order.id || '').replace(/[^0-9]/g, '')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#F4EFE6', scrollY: 0, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          const pdfBlob = await html2pdf().set(opt).from(receiptEl).output('blob');
          if (pdfBlob) {
            pdfBase64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(pdfBlob);
            });
          }
        }
        document.body.removeChild(offscreenDiv);
      } catch (genErr) {
        console.warn('Background PDF render note:', genErr);
      }
    }

    if (descEl) {
      descEl.innerHTML = `Delivering PDF directly to WhatsApp (+${cleanPhone}) via Cloud API... 🚀`;
    }

    const apiBase = (window.location.port === '5500' || window.location.port === '5501') ? 'http://localhost:3000' : '';
    const res = await fetch(`${apiBase}/api/send-whatsapp-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: cleanPhone,
        orderId: order.id,
        devoteeName: order.devotee,
        templeName: order.temple,
        amount: order.donation || 501,
        date: order.date,
        purpose: order.sankalp,
        pdfBase64: pdfBase64
      })
    });

    if (!res.ok) {
      console.warn('WhatsApp API returned non-200 status:', res.status);
      return;
    }

    const data = await res.json();

    if (data.success) {
      if (titleEl) titleEl.textContent = '✅ Delivered to WhatsApp!';
      if (descEl) descEl.innerHTML = `Official ₹501 Temple Donation Receipt PDF sent directly to <strong>+${cleanPhone}</strong>. Check your WhatsApp!`;
      if (badge) {
        badge.style.background = '#ECFDF5';
        badge.style.borderColor = '#10B981';
      }
    } else if (data.configured === false) {
      if (titleEl) titleEl.textContent = '⚡ WhatsApp Cloud API Ready';
      if (descEl) {
        descEl.innerHTML = `Devotee <strong>+${cleanPhone}</strong> queued for automated delivery.<br><span style="font-size:0.75rem; color:#4B5563;">(Awaiting Meta <code>WHATSAPP_PHONE_NUMBER_ID</code> & <code>WHATSAPP_ACCESS_TOKEN</code> in .env to deliver live)</span>`;
      }
      if (badge) {
        badge.style.background = '#EFF6FF';
        badge.style.borderColor = '#3B82F6';
      }
    } else {
      if (titleEl) titleEl.textContent = '📲 WhatsApp PDF Ready';
      if (descEl) descEl.innerHTML = `Receipt generated for <strong>+${cleanPhone}</strong>. Click "Send to WhatsApp" below to forward.`;
    }
  } catch (err) {
    console.error('Automated WhatsApp dispatch error:', err);
    if (titleEl) titleEl.textContent = '📲 WhatsApp Receipt Ready';
    if (descEl) descEl.innerHTML = `Receipt generated for <strong>+${cleanPhone}</strong>. Use the buttons below to download or share.`;
  }
}

