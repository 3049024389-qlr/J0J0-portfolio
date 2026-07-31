// greeting
(function() {
  const el = document.getElementById('greeting');
  if (!el) return;
  const h = new Date().getHours();
  let msg;
  if (h >= 5 && h < 12) msg = 'Good morning.';
  else if (h >= 12 && h < 18) msg = 'Good afternoon.';
  else if (h >= 18 && h < 22) msg = 'Good evening.';
  else msg = 'Time to rest.';
  el.textContent = msg;
})();

// cards on homepage
document.querySelectorAll('.project-card').forEach(function(card) {
  const label = document.createElement('div');
  label.className = 'card-label';
  label.innerHTML = `
    <div class="num">${card.dataset.n}</div>
    <div class="title">${card.dataset.t}</div>
    <div class="sub">${card.dataset.s}</div>
  `;
  card.appendChild(label);
});

// hero slideshow
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.querySelector('.hero-dots');
  const prevBtn = document.querySelector('.hero-prev');
  const nextBtn = document.querySelector('.hero-next');
  const fullscreenBtn = document.querySelector('.hero-fullscreen');
  const hero = document.querySelector('.project-hero');
  if (!slides.length) return;

  let current = 0;
  let dots = [];

  slides.forEach(function(_, i) {
    const dot = document.createElement('div');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function(e) { e.stopPropagation(); goTo(i); });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  if (prevBtn) prevBtn.addEventListener('click', function(e) { e.stopPropagation(); goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function(e) { e.stopPropagation(); goTo(current + 1); });

  if (hero) {
    hero.addEventListener('click', function() {
      const src = slides[current].style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
      openZoom(src, -1);
    });
  }

  let timer = setInterval(function() { goTo(current + 1); }, 5000);
  if (hero) {
    hero.addEventListener('mouseenter', function() { clearInterval(timer); });
    hero.addEventListener('mouseleave', function() {
      timer = setInterval(function() { goTo(current + 1); }, 5000);
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const src = slides[current].style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
      openZoom(src, -1);
    });
  }
})();

// zoom overlay
(function() {
  const overlay = document.getElementById('zoomOverlay');
  const zoomImg = document.getElementById('zoomImg');
  const zoomClose = document.getElementById('zoomClose');
  const zoomPrev = document.getElementById('zoomPrev');
  const zoomNext = document.getElementById('zoomNext');
  if (!overlay) return;

  const galleryItems = Array.from(document.querySelectorAll('.gallery-item[data-src], .board-grid-item[data-src]'));
  const sketchItems = Array.from(document.querySelectorAll('.sketch-slide-item[data-src]'));
  const allZoomable = galleryItems.concat(sketchItems);
  const boardItem = document.querySelector('.board-thumb[data-src]');
  let currentIndex = 0;
  let inBoard = false;

  window.openZoom = function(src, index) {
    zoomImg.src = src;
    overlay.classList.add('active');
    if (index >= 0) { currentIndex = index; inBoard = false; }
  };

  allZoomable.forEach(function(item, i) {
    item.addEventListener('click', function() {
      currentIndex = i; inBoard = false;
      zoomImg.src = item.dataset.src;
      overlay.classList.add('active');
    });
  });

  if (boardItem) {
    boardItem.addEventListener('click', function() {
      inBoard = true;
      zoomImg.src = boardItem.dataset.src;
      overlay.classList.add('active');
    });
  }

  function closeZoom() { overlay.classList.remove('active'); }
  function prevZoom() {
    if (inBoard || !allZoomable.length) return;
    currentIndex = (currentIndex - 1 + allZoomable.length) % allZoomable.length;
    zoomImg.src = allZoomable[currentIndex].dataset.src;
  }
  function nextZoom() {
    if (inBoard || !allZoomable.length) return;
    currentIndex = (currentIndex + 1) % allZoomable.length;
    zoomImg.src = allZoomable[currentIndex].dataset.src;
  }

  zoomClose.addEventListener('click', closeZoom);
  if (zoomPrev) zoomPrev.addEventListener('click', prevZoom);
  if (zoomNext) zoomNext.addEventListener('click', nextZoom);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeZoom(); });
  document.addEventListener('keydown', function(e) {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeZoom();
    if (e.key === 'ArrowLeft') prevZoom();
    if (e.key === 'ArrowRight') nextZoom();
  });
})();

// drag scroll for sketch slider
(function() {
  const sliders = document.querySelectorAll('.sketch-slider-container');
  sliders.forEach(function(slider) {
    let isDown = false, startX, scrollLeft;
    slider.addEventListener('mousedown', function(e) {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', function() { isDown = false; });
    slider.addEventListener('mouseup', function() { isDown = false; });
    slider.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      slider.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  });
})();

// sidebar scroll
(function() {
  const sidebar = document.getElementById('sidebar');
  const introSection = document.getElementById('intro');
  if (!sidebar || !introSection) return;

  const links = sidebar.querySelectorAll('.sidebar-link');
  const sections = Array.from(links).map(function(link) {
    const id = link.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  function onScroll() {
    const introBottom = introSection.getBoundingClientRect().bottom;
    if (introBottom < 0) {
      sidebar.classList.add('visible');
    } else {
      sidebar.classList.remove('visible');
    }
    let active = sections[0];
    sections.forEach(function(section) {
      if (section && section.getBoundingClientRect().top <= 100) {
        active = section;
      }
    });
    links.forEach(function(link) {
      const id = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', active && active.id === id);
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll();
})();