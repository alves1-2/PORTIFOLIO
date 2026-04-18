// Global function for menu toggle (works reliably on every click)
function toggleMenu() {
  const sideNav = document.getElementById('sideNav');
  const manuBtn = document.getElementById('manuBtn');

  if (!sideNav || !manuBtn) {
    console.warn('Menu elements not found:', { sideNav: !!sideNav, manuBtn: !!manuBtn });
    return false;
  }

  // Get current state
  const isCurrentlyOpen = sideNav.classList.contains('open');
  console.log('Menu toggle called. Currently open:', isCurrentlyOpen);

  // Toggle the state
  if (isCurrentlyOpen) {
    // Close the menu
    sideNav.classList.remove('open');
    manuBtn.setAttribute('aria-expanded', 'false');
    console.log('Menu closed');
  } else {
    // Open the menu
    sideNav.classList.add('open');
    manuBtn.setAttribute('aria-expanded', 'true');
    console.log('Menu opened');
  }

  // Prevent event bubbling if called from an event
  if (typeof event !== 'undefined' && event) {
    event.stopPropagation();
  }

  // Return the new state (true = open, false = closed)
  return !isCurrentlyOpen;
}

// Pay Now: copy payment details and attempt to open dialer (mobile) or Skype (desktop)
function initiatePaymentDial() {
  showPaymentModal({
    amount: 2700,
    phone: '0793758208',
    ussd: '*182*1*1*0793758208*2700#',
    reference: 'ALVES-PREMIUM',
  });
}

// New: KWISHYURA deep-link + clipboard helper
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function showToast(message, duration = 2300) {
  let existing = document.getElementById('copiedToast');
  if (existing) existing.remove();
  const d = document.createElement('div');
  d.id = 'copiedToast';
  d.textContent = message;
  d.style.position = 'fixed';
  d.style.bottom = '24px';
  d.style.left = '50%';
  d.style.transform = 'translateX(-50%)';
  d.style.background = 'rgba(0,0,0,0.8)';
  d.style.color = '#fff';
  d.style.padding = '10px 14px';
  d.style.borderRadius = '6px';
  d.style.zIndex = 9999;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), duration);
}

// Enhanced Contact form submit handler with advanced validation
function submitContactForm() {
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('contactSubmit');

  if (!form || !formStatus || !submitBtn) return;

  // Get form values
  const name = (document.getElementById('contactName') || {}).value || '';
  const email = (document.getElementById('contactEmail') || {}).value || '';
  const subject = (document.getElementById('contactSubject') || {}).value || '';
  const message = (document.getElementById('contactMessage') || {}).value || '';

  // Clear previous status
  formStatus.textContent = '';
  formStatus.className = 'form-status';

  // Enhanced validation
  if (!name.trim()) {
    showFormError('Nyamuneka andika amazina yawe');
    document.getElementById('contactName').focus();
    return;
  }

  if (!email.trim()) {
    showFormError('Nyamuneka andika email yawe');
    document.getElementById('contactEmail').focus();
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    showFormError('Nyamuneka andika email yuzuye');
    document.getElementById('contactEmail').focus();
    return;
  }

  if (!subject) {
    showFormError('Nyamuneka hitamo insanganyamatsiko');
    document.getElementById('contactSubject').focus();
    return;
  }

  if (!message.trim()) {
    showFormError('Nyamuneka andika ubutumwa bwawe');
    document.getElementById('contactMessage').focus();
    return;
  }

  if (message.trim().length < 10) {
    showFormError('Ubutumwa bugomba kuba ubufite inyuguti 10 cyangwa zirenga');
    document.getElementById('contactMessage').focus();
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Iri kohereza...';
  formStatus.textContent = 'Iri kohereza ubutumwa bwawe...';
  formStatus.className = 'form-status loading';

  const payload = {
    name: name.trim(),
    email: email.trim(),
    subject: subject,
    message: message.trim(),
    createdAt: Date.now(),
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  try {
    // Simulate network delay for better UX
    setTimeout(() => {
      if (db && db.ref) {
        db.ref('contacts').push(payload);
      } else {
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push(payload);
        localStorage.setItem('contacts', JSON.stringify(contacts));
      }

      // Success state
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa fa-check"></i> Byoherejwe!';
      formStatus.textContent =
        'Ubutumwa bwoherejwe neza — turagushimira! Turagusubiza mu masaha 24.';
      formStatus.className = 'form-status success';

      // Reset form
      form.reset();

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa fa-send"></i> Ohereza ubutumwa';
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 3000);
    }, 1500); // Simulate 1.5 second processing time
  } catch (e) {
    console.error('contact submit failed', e);
    showFormError('Ntibyashobotse kohereza ubutumwa. Ongera ugerageze.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa fa-send"></i> Ohereza ubutumwa';
  }
}

function showFormError(message) {
  const formStatus = document.getElementById('formStatus');
  if (formStatus) {
    formStatus.textContent = message;
    formStatus.className = 'form-status error';
  }
}

function initiateKwishyura() {
  showPaymentModal({
    amount: 2700,
    phone: '0793758208',
    ussd: '*182*1*1*0793758208*2700#',
    reference: 'ALVES-PREMIUM',
  });
}

// Show a modal allowing user to confirm/edit USSD before dialing
function showPaymentModal(opts) {
  const modal = document.getElementById('paymentConfirmModal');
  if (!modal) return;

  const fromPhoneEl = document.getElementById('modalFromPhone');
  const amountEl = document.getElementById('modalAmount');
  const ussdEl = document.getElementById('modalUssd');
  const copyBtn = document.getElementById('modalCopyBtn');
  const cancelBtn = document.getElementById('modalCancelBtn');
  const dialBtn = document.getElementById('modalDialBtn');
  const modalToMaskedEl = document.getElementById('modalToMasked');
  const staticRecipientEl = document.getElementById('staticRecipient');

  // do not display recipient; ask user to enter their own (from) phone
  try {
    if (fromPhoneEl) fromPhoneEl.value = localStorage.getItem('userPhone') || '';
  } catch (e) {}
  amountEl.value = opts.amount || '';
  ussdEl.value = opts.ussd || '';

  // helper to mask phone numbers (show only last 4 digits)
  function maskPhone(phone) {
    if (!phone) return '••••';
    const digits = phone.toString().replace(/\D/g, '');
    if (digits.length <= 4) return '••••' + digits;
    return '••••' + digits.slice(-4);
  }

  // populate masked recipient displays; keep full number only in JS (not in DOM)
  let recipientFull = opts.phone || '';
  try {
    if (modalToMaskedEl) modalToMaskedEl.textContent = maskPhone(recipientFull);
    if (staticRecipientEl) staticRecipientEl.textContent = maskPhone(recipientFull);
    if (localStorage.getItem('paymentVerified') === 'true') {
      // reveal full number after payment
      if (modalToMaskedEl && recipientFull) modalToMaskedEl.textContent = recipientFull;
      if (staticRecipientEl && recipientFull) staticRecipientEl.textContent = recipientFull;
    }
  } catch (e) {
    console.warn('recipient masking failed', e);
  }

  // Handler helpers
  function onCopy() {
    const from = fromPhoneEl && fromPhoneEl.value ? fromPhoneEl.value : '(your phone)';
    const text = `Dial: ${ussdEl.value}\nAmount: ${amountEl.value} RWF\nTo: ${recipientFull}\nFrom: ${from}\nRef: ${opts.reference || ''}`;
    copyToClipboard(text)
      .then(() => showToast("Amakuru y'iyishyurwa yanditswe muri clipboard"))
      .catch(() => showToast('Ntibyashobotse gukoporora; kopiya ubwawe'));
    // persist payer phone for convenience
    try {
      if (fromPhoneEl && fromPhoneEl.value) localStorage.setItem('userPhone', fromPhoneEl.value);
    } catch (e) {}
  }

  function onCancel() {
    copyBtn.removeEventListener('click', onCopy);
    cancelBtn.removeEventListener('click', onCancel);
    dialBtn.removeEventListener('click', onDial);
    modal.style.display = 'none';
  }

  function onDial() {
    // Instead of attempting to open the dialer, immediately copy details to clipboard for privacy
    onCopy();
    showToast('Payment instructions copied to clipboard');

    // show instructions step as fallback
    const s1 = document.getElementById('step1');
    const s2 = document.getElementById('step2');
    if (s1) s1.style.display = 'none';
    if (s2) s2.style.display = 'block';
    onCancel();
  }

  copyBtn.addEventListener('click', onCopy);
  cancelBtn.addEventListener('click', onCancel);
  dialBtn.addEventListener('click', onDial);

  modal.style.display = 'flex';
}

function goToStep3() {
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step3').style.display = 'block';
  document.getElementById('paymentCode').focus();
}

function goBackToStep1() {
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step3').style.display = 'none';
  document.getElementById('paymentCode').value = '';
}

// ===== Payment Verification =====
function verifyPayment(btn) {
  const code = document.getElementById('paymentCode').value.trim();

  // Validate code format (6 digits)
  if (code.length !== 6 || !/^\d+$/.test(code)) {
    alert("❌ Kode ntizwi! Injiza kode y'imibare 6 yemewe.");
    return;
  }

  // Simulate verification with success animation
  const verifyBtn = btn || document.querySelector('.verify-btn');
  if (verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Birimo kwemezwa...';
  }

  // Simulate API call delay
  setTimeout(() => {
    const confirmMsg = `✅ Iyishyurwa yemejwe!\n\nKode: ${code}\n\nKonti yawe yahawe uburenganzira bwa Premium mu gihe cy'ukwezi kumwe!`;
    alert(confirmMsg);

    paymentVerified = true;
    localStorage.setItem('paymentVerified', 'true');
    localStorage.setItem('paymentCode', code);
    localStorage.setItem('paymentDate', new Date().toISOString());

    // Save transaction to payments list for charting
    try {
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      payments.push({ amount: 2700, code: code, date: new Date().toISOString() });
      localStorage.setItem('payments', JSON.stringify(payments));
    } catch (e) {
      console.error('Failed to save payment record', e);
    }

    // Show video platform
    const wall = document.getElementById('paymentWall');
    if (wall) wall.style.display = 'none';
    const vp = document.getElementById('videoPlatform');
    if (vp) vp.style.display = 'block';

    // (chart removed) -- no-op

    // Reset button
    if (verifyBtn) {
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = '<i class="fa fa-check-circle"></i> Emeza kandi ukomeze';
    }
  }, 1500);
}

// ===== Check Payment Status =====
function checkPaymentStatus() {
  if (localStorage.getItem('paymentVerified') === 'true') {
    paymentVerified = true;
    document.getElementById('paymentWall').style.display = 'none';
    document.getElementById('videoPlatform').style.display = 'block';
  }
}

// Payments/chart code removed — charts and Chart.js are no longer used.

// Dark mode toggle
function setTheme(dark) {
  const root = document.documentElement;
  if (dark) {
    root.setAttribute('data-theme', 'dark');
    document.getElementById('darkModeToggle').textContent = '☀️';
    document.getElementById('darkModeToggle').setAttribute('aria-pressed', 'true');
    localStorage.setItem('darkMode', 'true');
  } else {
    root.removeAttribute('data-theme');
    document.getElementById('darkModeToggle').textContent = '🌙';
    document.getElementById('darkModeToggle').setAttribute('aria-pressed', 'false');
    localStorage.setItem('darkMode', 'false');
  }
}

// Lightbox handlers
function openLightbox(src) {
  const modal = document.getElementById('lightboxModal');
  const player = document.getElementById('lightboxPlayer');
  if (!modal || !player) return;
  // Save last focused element to restore focus on close
  openLightbox._lastFocused = document.activeElement;
  player.pause();
  player.querySelector('source').src = src;
  player.load();
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  modal.setAttribute('aria-modal', 'true');
  // prevent background scroll
  document.documentElement.style.overflow = 'hidden';

  // focus the close button
  const closeBtn = document.getElementById('lightboxClose');
  if (closeBtn) closeBtn.focus();

  // attach simple focus trap
  function trap(e) {
    if (e.key !== 'Tab') return;
    const focusables = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  modal._trapHandler = trap;
  document.addEventListener('keydown', trap);

  player.play().catch(() => {});
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  const player = document.getElementById('lightboxPlayer');
  if (!modal || !player) return;
  player.pause();
  player.currentTime = 0;
  player.querySelector('source').src = '';
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  // restore scrolling
  document.documentElement.style.overflow = '';
  // remove focus trap
  if (modal._trapHandler) {
    document.removeEventListener('keydown', modal._trapHandler);
    modal._trapHandler = null;
  }
  // restore focus
  try {
    const last = openLightbox._lastFocused;
    if (last && typeof last.focus === 'function') last.focus();
  } catch (e) {}
}

// ===== Load Videos to Grid =====
function loadVideos() {
  const grid = document.getElementById('videosGrid');
  grid.innerHTML = '';

  videosDatabase.forEach((video) => {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.innerHTML = `
      <div class="video-card-thumbnail">
        <i class="fa fa-play-circle"></i>
      </div>
      <div class="video-card-info">
        <h4>${video.title}</h4>
        <p>${video.description}</p>
        <div class="video-meta">
          <span><i class="fa fa-eye"></i> ${video.views.toLocaleString()}</span>
          <span><i class="fa fa-clock-o"></i> ${video.duration}</span>
        </div>
      </div>
    `;
    videoCard.onclick = () => playVideo(video);
    grid.appendChild(videoCard);
  });
}

// ===== Play Video =====
function playVideo(video) {
  const player = document.getElementById('mainPlayer');
  player.src = video.src;
  document.getElementById('currentVideoTitle').textContent = video.title;
  document.getElementById('currentVideoDesc').textContent = video.description;
  document.getElementById('videoViews').textContent = video.views.toLocaleString();

  document.getElementById('videosGrid').style.display = 'none';
  document.getElementById('watchHistory').style.display = 'none';
  document.getElementById('playerSection').style.display = 'block';

  // Track watch history
  saveWatchHistory(video);

  player.play();
}

// ===== Save Watch History =====
function saveWatchHistory(video) {
  if (!currentUser) return;

  const watchRef = db.ref(`watchHistory/${currentUser.uid}/${video.id}`);
  watchRef.set({
    videoId: video.id,
    title: video.title,
    watchedAt: Date.now(),
    duration: video.duration,
  });
}

// ===== Back to Library =====
function backToLibrary() {
  document.getElementById('playerSection').style.display = 'none';
  document.getElementById('videosGrid').style.display = 'grid';
  document.getElementById('watchHistory').style.display = 'block';
  document.getElementById('mainPlayer').pause();
  loadWatchHistory();
}

// ===== Load Watch History =====
function loadWatchHistory() {
  if (!currentUser) return;

  const historyRef = db.ref(`watchHistory/${currentUser.uid}`);
  historyRef.limitToLast(5).on('value', function (snapshot) {
    const container = document.getElementById('historyContainer');
    container.innerHTML = '';

    snapshot.forEach(function (child) {
      const item = child.val();
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-info">
          <h5>${item.title}</h5>
          <small>Watched: ${new Date(item.watchedAt).toLocaleDateString()}</small>
        </div>
      `;
      container.appendChild(historyItem);
    });
  });
}

// Payments chart removed: barchart functionality is no longer used.

// ===== DOM Ready Events =====
document.addEventListener('DOMContentLoaded', function () {
  // Initialize menu button state
  const manuBtn = document.getElementById('manuBtn');
  const sideNav = document.getElementById('sideNav');

  if (manuBtn) {
    // Ensure initial ARIA state
    manuBtn.setAttribute('aria-expanded', 'false');
    console.log('Menu button initialized successfully');
  }

  if (sideNav) {
    // Ensure initial state
    sideNav.classList.remove('open');
    console.log('Side navigation initialized successfully');
  }

  // If opened via file://, show a small banner offering Local Mode
  if (location.protocol === 'file:') {
    const b = document.getElementById('localRunBanner');
    if (b) b.style.display = 'block';
  }
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Search Videos
  const searchVideos = document.getElementById('searchVideos');
  if (searchVideos) {
    searchVideos.addEventListener('keyup', function (e) {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.video-card');

      cards.forEach((card) => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
      });
    });
  }

  // Check Auth State
  auth.onAuthStateChanged((user) => {
    if (user) {
      showVideoLibrary(user);
    }
  });

  // Menu toggle (uses class `open` for responsive behavior)
  const manuBtn = document.getElementById('manuBtn');
  const sideNav = document.getElementById('sideNav');
  const closeNav = document.getElementById('closeNav');

  if (manuBtn && sideNav) {
    // Use the global toggleMenu function for consistency
    const handleMenuToggle = (e) => {
      e.stopPropagation();
      toggleMenu(); // Call the global function
    };

    // Mouse click support (desktop and mobile safari)
    manuBtn.addEventListener('click', handleMenuToggle);

    // Touch support for better mobile UX
    manuBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      toggleMenu(); // Call the global function
    });

    // Keyboard support: Space and Enter keys
    manuBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleMenu(); // Call the global function
      }
    });

    // Close button in nav header
    if (closeNav) {
      const closeMenuHandler = (e) => {
        e.stopPropagation();
        // Close the menu by calling toggleMenu if it's open
        if (sideNav.classList.contains('open')) {
          toggleMenu();
        }
      };

      closeNav.addEventListener('click', closeMenuHandler);
      closeNav.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (sideNav.classList.contains('open')) {
          toggleMenu();
        }
      });
    }

    // Close side nav when clicking/tapping outside
    document.addEventListener('click', (e) => {
      if (!sideNav.classList.contains('open')) return;
      const clickedInside = sideNav.contains(e.target) || manuBtn.contains(e.target);
      if (!clickedInside) {
        toggleMenu(); // Close the menu
      }
    });

    // Close on touch outside (mobile)
    document.addEventListener('touchstart', (e) => {
      if (!sideNav.classList.contains('open')) return;
      const clickedInside = sideNav.contains(e.target) || manuBtn.contains(e.target);
      if (!clickedInside) {
        toggleMenu(); // Close the menu
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sideNav.classList.contains('open')) {
        toggleMenu(); // Close the menu
        manuBtn.focus(); // Return focus to menu button
      }
    });
  }

  // Smooth nav behavior: close mobile side nav when a nav-link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  if (navLinks && navLinks.length) {
    navLinks.forEach((lnk) => {
      const closeHandler = () => {
        if (sideNav && sideNav.classList.contains('open')) {
          toggleMenu(); // Close the menu
        }
      };

      // Click support
      lnk.addEventListener('click', closeHandler);

      // Touch support for mobile
      lnk.addEventListener('touchend', closeHandler);
    });
  }

  // Active nav highlighting while scrolling
  const sections = Array.from(document.querySelectorAll('section[id]'));
  function updateActiveNav() {
    const fromTop = window.scrollY + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.id;
      const link = document.querySelector('.nav-link[href="#' + id + '"]');
      if (!link) return;
      if (fromTop >= top && fromTop < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Throttle updates with requestAnimationFrame for smoothness
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });
  // initial call
  updateActiveNav();

  // Dark mode init and toggle
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) {
    const preferred = localStorage.getItem('darkMode') === 'true';
    setTheme(preferred);
    darkToggle.addEventListener('click', () =>
      setTheme(localStorage.getItem('darkMode') !== 'true')
    );
  }

  // Lightbox close handlers
  const lbClose = document.getElementById('lightboxClose');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  const lbModal = document.getElementById('lightboxModal');
  if (lbModal)
    lbModal.addEventListener('click', (e) => {
      if (e.target === lbModal) closeLightbox();
    });

  // Video thumbnail click -> open lightbox (delegated)
  document.addEventListener('click', function (e) {
    const thumb = e.target.closest && e.target.closest('.video-thumb');
    if (thumb) {
      const src = thumb.getAttribute('data-video-src');
      if (src) openLightbox(src);
    }
  });
  // Keyboard activation for thumbnails (Enter/Space)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const active = document.activeElement;
      if (active && active.classList && active.classList.contains('video-thumb')) {
        e.preventDefault();
        const src = active.getAttribute('data-video-src');
        if (src) openLightbox(src);
      }
    }
  });
  // Escape closes lightbox
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // Download button handler (delegated) to trigger browser download reliably
  document.addEventListener('click', function (e) {
    const btn = e.target.closest && e.target.closest('.download-btn');
    if (!btn) return;
    e.preventDefault();
    const href = btn.getAttribute('href');
    const filename = href ? href.split('/').pop() : 'download';
    // Create temporary anchor to trigger download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = href;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 500);
    showToast('Gutangira gukuramo: ' + filename);
  });

  // Contact form submit binding
  const contactBtn = document.getElementById('contactSubmit');
  if (contactBtn) {
    contactBtn.addEventListener('click', function (e) {
      e.preventDefault();
      submitContactForm();
    });
  }
});

// Enable a lightweight local mode so the site is usable when opened by double-click (file://)
function enableLocalMode() {
  paymentVerified = true;
  localStorage.setItem('paymentVerified', 'true');

  // Create a fake user to allow viewing the library without Firebase
  const fakeUser = { uid: 'local-user', displayName: 'LocalUser', email: 'local@local' };
  showVideoLibrary(fakeUser);
  showToast("Uburyo bwa lokale bwakoreshejwe — isomero ry'amafilime riraboneka");

  // Hide the local banner
  const b = document.getElementById('localRunBanner');
  if (b) b.style.display = 'none';
}
