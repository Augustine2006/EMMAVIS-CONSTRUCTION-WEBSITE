/* =========================================================
   EMMAVIS CONSTRUCTION LTD — Site scripts (shared across all pages)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Page loader ---------- */
  const loader = document.getElementById('pageLoader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-hidden'), 350);
    });
    setTimeout(() => loader.classList.add('is-hidden'), 2500);
  }

  /* ---------- Topbar scroll state ---------- */
  const topbar = document.getElementById('topbar');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    const y = window.scrollY;
    if (topbar) topbar.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('is-shown', y > 600);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Drawer nav ---------- */
  const hamburger = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('drawerNav');
  const overlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('[data-nav]');

  function openDrawer() {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }
  if (hamburger && drawer && overlay) {
    hamburger.addEventListener('click', () => {
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
    overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
    navLinks.forEach(link => link.addEventListener('click', closeDrawer));
  }

  // Highlight the nav link matching the current page (multi-page site,
  // so this is based on the file name rather than in-page scroll position)
  const currentFile = (location.pathname.split('/').pop() || 'index.html');
  navLinks.forEach(link => {
    const linkFile = link.getAttribute('href').split('/').pop();
    if (linkFile === currentFile || (linkFile === 'index.html' && currentFile === '')) {
      link.classList.add('active');
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Animated counters (home page hero) ---------- */
  const statBlock = document.getElementById('statBlock');
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return; // non-numeric stat, leave as-is
    const duration = 1400;
    const start = performance.now();
    if (!el.firstChild || el.firstChild.nodeType !== Node.TEXT_NODE) {
      el.insertBefore(document.createTextNode('0'), el.firstChild);
    }
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.firstChild.nodeValue = value;
      if (progress < 1) requestAnimationFrame(tick);
      else el.firstChild.nodeValue = target;
    }
    requestAnimationFrame(tick);
  }
  if (statBlock) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.num[data-count]').forEach(animateCount);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statObserver.observe(statBlock);
  }

  /* =========================================================
     PROJECTS — data, render, filter, modal (projects.html)
     ========================================================= */
  const projectGrid = document.getElementById('projectGrid');
  if (projectGrid) {
    const projects = [
      {
        title: 'Family Residence',
        cat: 'residential', catLabel: 'Residential',
        location: 'Berekum, Bono Region',
        status: 'Completed',
        services: 'Construction, Building Design',
        desc: 'A family home built from foundation to finish, featuring open-plan living areas and a covered outdoor terrace designed for the local climate.',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/3d (12).jpg'
      },
      {
        title: 'King Of Amankokwa Residential',
        cat: 'commercial', catLabel: 'Commercial',
        location: 'Berekum, Bono Region',
        status: 'Ongoing',
        services: 'Construction, Project Management',
        desc: 'A Two Storey Building Under Construction.',
       img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (23).jpg'
      },
      {
        title: 'Bank With Store Rooms',
        cat: 'commercial', catLabel: 'Commercial',
        location: 'Berekum, Bono Region',
        status: 'Completed',
        services: 'Construction, Architecture',
        desc: 'A two-storey office block currently under construction.',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (12).jpg'
      },
      {
        title: 'Villa Concept',
        cat: 'architecture', catLabel: 'Architecture',
        location: 'Takoradi, Western Region',
        status: 'Design Phase',
        services: 'Architecture, Building Design',
        desc: 'A contemporary villa concept designed around the natural slope of the site, maximizing cross-ventilation and views.',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/3d (1).png'
      },
      {
        title: 'Proposed Residential Building Drawings',
        cat: 'drawings', catLabel: 'Drawings',
        location: 'Accra, Greater Accra Region',
        status: 'Coming up',
        services: 'Building Drawings',
        desc: 'Proposed Residential Project',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/bd (12).jpeg'
      },
      {
        title: 'Government School Building',
        cat: 'construction', catLabel: 'Construction',
        location: 'Senase, Bono Region',
        status: 'Completed',
        services: 'Construction, Project Management',
        desc: 'A structural School building.',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (22).jpg'
      },
      {
        title: 'Market',
        cat: 'residential', catLabel: 'Residential',
        location: 'Berekum, Bono Region',
        status: 'Ongoing',
        services: 'Construction, Renovation',
        desc: 'A Structured market at Berekum - Bono region .',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (27).jpg'
      },
      {
        title: 'Berekum Market',
        cat: 'commercial', catLabel: 'Commercial',
        location: 'Berekum, Bono Region',
        status: 'Completed',
        services: 'Construction, Structural Support',
        desc: 'Berekum Main market.',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (7).jpg'
      },
      {
        title: 'School Building',
        cat: 'commercial', catLabel: 'Commercial',
        location: 'Berekum, Bono Region',
        status: 'Completed',
        services: 'Construction, Structural Support',
        desc: 'School Building At Berekum.',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (15).jpg'
      },
      {
        title: 'Bank',
        cat: 'commercial', catLabel: 'Commercial',
        location: 'Berekum, Bono Region',
        status: 'Completed',
        services: 'Construction, Structural Support',
        desc: 'A Three Storey Building.',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (5).jpg'
      },
      {
        title: 'School Building',
        cat: 'Commercial', catLabel: 'Commercial',
        location: 'Berekum, Bono Region',
        status: 'Completed',
        services: 'Construction, Structural Support',
        desc: 'A New Class Room Block.',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (11).jpg'
      },
      {
        title: 'Villa',
        cat: 'Residential', catLabel: 'Residential',
        location: 'Berekum, Bono Region',
        status: 'Completed',
        services: 'Construction, Structural Support',
        desc: 'A completed Building.',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (13).jpg'
      },
      {
        title: 'Church Building',
        cat: 'commercial', catLabel: 'Commercial',
        location: 'Berekum, Bono Region',
        status: 'Completed',
        services: 'Construction, Structural Support',
        desc: 'Church .',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (8).jpg'
      },
      {
        title: '',
        cat: 'Residential', catLabel: 'Residential',
        location: 'Berekum, Bono Region',
        status: 'Completed',
        services: 'Construction, Structural Support',
        desc: '',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (14).jpg'
      },
      {
        title: '',
        cat: 'commercial', catLabel: 'Commercial',
        location: 'Berekum, Bono Region',
        status: 'Completed',
        services: 'Construction, Structural Support',
        desc: '',
        img: './images/IMAGES FOR EMMAVIS CONSTRUCTION/pr (6).jpg'
      }
      
    ];

    function renderProjects() {
      projectGrid.innerHTML = projects.map((p, i) => `
        <div class="project-card" data-cat="${p.cat}" data-index="${i}" tabindex="0" role="button" aria-label="View details for ${p.title}">
          <img src="${p.img}" alt="${p.title}" loading="lazy">
          <div class="project-scrim"></div>
          <div class="project-info">
            <div class="cat">${p.catLabel}</div>
            <h3>${p.title}</h3>
            <div class="loc">${p.location}</div>
          </div>
        </div>
      `).join('');
    }
    renderProjects();

    const filterBtns = document.querySelectorAll('#filterRow .filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('#projectGrid .project-card').forEach(card => {
          const match = filter === 'all' || card.getAttribute('data-cat') === filter;
          card.classList.toggle('hide', !match);
        });
      });
    });

    const modal = document.getElementById('projectModal');
    const modalImg = document.getElementById('modalImg');
    const modalCat = document.getElementById('modalCat');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalServices = document.getElementById('modalServices');
    const modalLocation = document.getElementById('modalLocation');
    const modalStatus = document.getElementById('modalStatus');
    const modalClose = document.getElementById('modalClose');

    function openProjectModal(index) {
      const p = projects[index];
      modalImg.src = p.img;
      modalImg.alt = p.title;
      modalCat.textContent = p.catLabel;
      modalTitle.textContent = p.title;
      modalDesc.textContent = p.desc;
      modalServices.textContent = p.services;
      modalLocation.textContent = p.location;
      modalStatus.textContent = p.status;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeProjectModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    projectGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (card) openProjectModal(parseInt(card.getAttribute('data-index'), 10));
    });
    projectGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.project-card');
        if (card) { e.preventDefault(); openProjectModal(parseInt(card.getAttribute('data-index'), 10)); }
      }
    });
    if (modalClose) modalClose.addEventListener('click', closeProjectModal);
    if (modal) {
      modal.addEventListener('click', (e) => { if (e.target === modal) closeProjectModal(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProjectModal(); });
    }
  }

  /* =========================================================
     MEDIA GALLERIES (gallery.html + workers.html)
     Photos/videos are added as plain <img>/<video> tags in the HTML.
     This builds the grid (10 photos, 10 videos, repeat), adds the
     watermark, lazy loading and the full-screen viewer automatically.
     ========================================================= */
  const mediaGrid = document.querySelector('.media-grid');
  if (mediaGrid) {
    const photoSrc = document.querySelector('[data-media-photos]');
    const videoSrc = document.querySelector('[data-media-videos]');
    const batch = Math.max(1, parseInt(mediaGrid.getAttribute('data-batch'), 10) || 10);
    const photos = photoSrc ? Array.from(photoSrc.querySelectorAll('img')) : [];
    const videos = videoSrc ? Array.from(videoSrc.querySelectorAll('video')) : [];

    // Load video data only when a video is close to the screen (keeps 100+ videos light)
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.preload = 'metadata';
          entry.target.load();
          videoObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '400px' });

    function wrapMedia(el, type) {
      const fig = document.createElement('figure');
      fig.className = 'wm-item ' + (type === 'video' ? 'is-video' : 'is-photo');
      if (type === 'photo') {
        el.loading = 'lazy';
        el.decoding = 'async';
        if (!el.alt) el.alt = 'EMMAVIS CONSTRUCTION LTD';
      } else {
        el.controls = true;
        el.setAttribute('playsinline', '');
        el.preload = 'none';
        videoObserver.observe(el);
      }
      fig.appendChild(el);
      return fig;
    }

    // Order: <batch> photos, then <batch> videos, repeating until both run out
    const frag = document.createDocumentFragment();
    let p = 0, v = 0;
    while (p < photos.length || v < videos.length) {
      for (let i = 0; i < batch && p < photos.length; i++) frag.appendChild(wrapMedia(photos[p++], 'photo'));
      for (let i = 0; i < batch && v < videos.length; i++) frag.appendChild(wrapMedia(videos[v++], 'video'));
    }
    mediaGrid.appendChild(frag);

    // Full-screen viewer (photos)
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const viewable = Array.from(mediaGrid.querySelectorAll('.wm-item.is-photo img'));
    let current = 0;

    function showPhoto(i) {
      if (!viewable.length) return;
      current = (i + viewable.length) % viewable.length;
      lbImg.src = viewable[current].currentSrc || viewable[current].src;
      lbImg.alt = viewable[current].alt;
    }
    function openViewer(i) {
      showPhoto(i);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeViewer() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    if (lightbox && lbImg) {
      mediaGrid.addEventListener('click', (e) => {
        const img = e.target.closest('.wm-item.is-photo img');
        if (img) openViewer(viewable.indexOf(img));
      });
      document.getElementById('lbClose').addEventListener('click', closeViewer);
      document.getElementById('lbPrev').addEventListener('click', () => showPhoto(current - 1));
      document.getElementById('lbNext').addEventListener('click', () => showPhoto(current + 1));
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeViewer(); });
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowLeft') showPhoto(current - 1);
        if (e.key === 'ArrowRight') showPhoto(current + 1);
      });
    }
  }

  /* =========================================================
     TESTIMONIAL CAROUSEL (testimonials.html)
     ========================================================= */
  const tTrack = document.getElementById('tTrack');
  if (tTrack) {
    const tSlides = document.querySelectorAll('.t-slide');
    const tControls = document.getElementById('tControls');
    const tPrev = document.getElementById('tPrev');
    const tNext = document.getElementById('tNext');
    let tIndex = 0;
    let tTimer;

    tSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 't-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      tControls.appendChild(dot);
    });
    const tDots = document.querySelectorAll('.t-dot');

    function goToSlide(i) {
      tIndex = (i + tSlides.length) % tSlides.length;
      tTrack.style.transform = `translateX(-${tIndex * 100}%)`;
      tDots.forEach((d, idx) => d.classList.toggle('active', idx === tIndex));
      resetAutoplay();
    }
    function resetAutoplay() {
      clearInterval(tTimer);
      tTimer = setInterval(() => goToSlide(tIndex + 1), 6000);
    }
    tPrev.addEventListener('click', () => goToSlide(tIndex - 1));
    tNext.addEventListener('click', () => goToSlide(tIndex + 1));
    resetAutoplay();
  }

  /* =========================================================
     CONTACT FORM (contact.html)
     ========================================================= */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formSuccess = document.getElementById('formSuccess');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      // NOTE: wire this up to a real backend / email service (e.g. Formspree,
      // a serverless function, or your own API) to actually deliver inquiries.
      formSuccess.classList.add('is-shown');
      contactForm.reset();
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

});
