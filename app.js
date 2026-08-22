// KOLOHAGA Brand Guide Interactive Engine (2-Slide Mobile-Optimized Edition)
document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const totalPages = 2;

  const pageViews = document.querySelectorAll('.page-view');
  const pageIndicators = document.querySelectorAll('.page-dot-btn');
  const navPrevBtns = document.querySelectorAll('.btn-prev-page');
  const navNextBtns = document.querySelectorAll('.btn-next-page');
  const currentPageBadge = document.getElementById('current-page-num');
  const progressBar = document.getElementById('top-progress-bar');

  // ============================================================
  // CINEMATIC SCROLL REVEAL ENGINE (INTERSECTION OBSERVER)
  // ============================================================
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    reveals.forEach(el => {
      scrollObserver.observe(el);
      // Immediately reveal elements already near top of viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 30) {
        el.classList.add('is-revealed');
      }
    });
  }

  function updatePage(pageIndex) {
    if (pageIndex < 1) pageIndex = 1;
    if (pageIndex > totalPages) pageIndex = totalPages;
    currentPage = pageIndex;

    // Update views with spring page transitions
    pageViews.forEach((view, idx) => {
      if (idx + 1 === currentPage) {
        view.classList.add('active');
        // Reset and trigger smooth reveals for newly active slide
        setTimeout(() => {
          view.querySelectorAll('.reveal-on-scroll').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 20) {
              el.classList.add('is-revealed');
            }
          });
        }, 50);
      } else {
        view.classList.remove('active');
      }
    });

    // Update iOS Segmented Navigation Bar indicators
    pageIndicators.forEach((dot, idx) => {
      const pageNum = idx + 1;
      if (pageNum === currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Top Progress Bar
    if (progressBar) {
      const progressPercent = (currentPage / totalPages) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Update Page Number Display Badge if exists
    if (currentPageBadge) {
      currentPageBadge.textContent = `0${currentPage} / 0${totalPages}`;
    }

    // Scroll to top smoothly with iOS physics
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Expose to global scope for inline button handlers
  window.goToPage = updatePage;

  // Next and Prev handlers
  navNextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        updatePage(currentPage + 1);
      } else {
        updatePage(1); // loop back to slide 1
      }
    });
  });

  navPrevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentPage > 1) {
        updatePage(currentPage - 1);
      }
    });
  });

  pageIndicators.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updatePage(idx + 1);
    });
  });

  // Keyboard navigation (Arrow keys + numbers 1, 2)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === '2') {
      updatePage(2);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === '1') {
      updatePage(1);
    }
  });

  // --- Background Theme Switchers (iOS Segmented Control) ---
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stageId = btn.dataset.stage;
      const theme = btn.dataset.theme;
      const stage = document.getElementById(stageId);
      if (!stage) return;

      const parentGroup = btn.closest('.theme-switcher-group');
      if (parentGroup) {
        parentGroup.querySelectorAll('.theme-btn').forEach(b => {
          b.classList.remove('active');
        });
        btn.classList.add('active');
      }

      // Toggle stage classes
      stage.classList.remove('theme-dark', 'theme-light', 'theme-forest');
      stage.classList.add(`theme-${theme}`);

      // Swap images based on theme
      const adaptiveImgs = stage.querySelectorAll('.adaptive-logo-img');
      adaptiveImgs.forEach(img => {
        if (theme === 'light') {
          if (img.dataset.darkSrc) img.src = img.dataset.darkSrc;
        } else {
          if (img.dataset.lightSrc) img.src = img.dataset.lightSrc;
        }
      });
    });
  });

  // ============================================================
  // TAB SWITCHER IN SLIDE 2 (LOGO 1 VS LOGO 2)
  // ============================================================
  window.switchLogoTab = function(tabName) {
    const btnL1 = document.getElementById('tab-btn-logo1');
    const btnL2 = document.getElementById('tab-btn-logo2');
    const contentL1 = document.getElementById('logo1-tab-content');
    const contentL2 = document.getElementById('logo2-tab-content');

    if (tabName === 'logo1') {
      if (btnL1) btnL1.classList.add('active');
      if (btnL2) btnL2.classList.remove('active');
      if (contentL1) {
        contentL1.classList.remove('hidden');
        contentL1.classList.add('reveal-on-scroll', 'is-revealed');
      }
      if (contentL2) contentL2.classList.add('hidden');
    } else {
      if (btnL2) btnL2.classList.add('active');
      if (btnL1) btnL1.classList.remove('active');
      if (contentL2) {
        contentL2.classList.remove('hidden');
        contentL2.classList.add('reveal-on-scroll', 'is-revealed');
      }
      if (contentL1) contentL1.classList.add('hidden');
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  // ============================================================
  // 3D HOLOGRAM EXPLODER ENGINE (LOGO 1)
  // ============================================================
  const l1ExplodeSlider = document.getElementById('logo1-explode-slider');
  const l1ExplodedStack = document.getElementById('logo1-exploded-stack');
  const l1StageContainer = document.getElementById('logo1-stage-container');

  function updateLogo1Layers(val) {
    const factor = val / 100;
    const layer0 = l1ExplodedStack?.querySelector('.layer-0');
    const layer1 = l1ExplodedStack?.querySelector('.layer-1');
    const layer2 = l1ExplodedStack?.querySelector('.layer-2');

    if (layer0) layer0.style.transform = `translateZ(0px) translateY(0px)`;
    if (layer1) layer1.style.transform = `translateZ(${factor * 90}px) translateY(${-factor * 45}px)`;
    if (layer2) layer2.style.transform = `translateZ(${factor * 180}px) translateY(${-factor * 90}px)`;

    const valDisplay = document.getElementById('logo1-explode-val');
    if (valDisplay) valDisplay.textContent = `${Math.round(val)}%`;
  }

  if (l1ExplodeSlider && l1ExplodedStack) {
    updateLogo1Layers(parseFloat(l1ExplodeSlider.value || 0));

    l1ExplodeSlider.addEventListener('input', (e) => {
      updateLogo1Layers(parseFloat(e.target.value));
    });
  }

  // Interactive Mouse Parallax Tilt (Logo 1)
  if (l1StageContainer && l1ExplodedStack) {
    l1StageContainer.addEventListener('mousemove', (e) => {
      const rect = l1StageContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = 18 - (y / rect.height) * 16;
      const rotY = -14 + (x / rect.width) * 16;

      l1ExplodedStack.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(2deg)`;
    });

    l1StageContainer.addEventListener('mouseleave', () => {
      l1ExplodedStack.style.transform = 'rotateX(18deg) rotateY(-14deg) rotateZ(2deg)';
    });
  }

  // ============================================================
  // 3D HOLOGRAM EXPLODER ENGINE (LOGO 2)
  // ============================================================
  const l2ExplodeSlider = document.getElementById('logo2-explode-slider');
  const l2ExplodedStack = document.getElementById('logo2-exploded-stack');
  const l2StageContainer = document.getElementById('logo2-stage-container');

  function updateLogo2Layers(val) {
    const factor = val / 100;
    const layerGreen = l2ExplodedStack?.querySelector('.layer-green');
    const layerGold = l2ExplodedStack?.querySelector('.layer-gold');

    if (layerGreen) layerGreen.style.transform = `translateZ(0px) translateY(0px)`;
    if (layerGold) layerGold.style.transform = `translateZ(${factor * 110}px) translateY(${-factor * 40}px) translateX(${factor * 20}px)`;

    const valDisplay = document.getElementById('logo2-explode-val');
    if (valDisplay) valDisplay.textContent = `${Math.round(val)}%`;
  }

  if (l2ExplodeSlider && l2ExplodedStack) {
    updateLogo2Layers(parseFloat(l2ExplodeSlider.value || 0));

    l2ExplodeSlider.addEventListener('input', (e) => {
      updateLogo2Layers(parseFloat(e.target.value));
    });
  }

  // Interactive Mouse Parallax Tilt (Logo 2)
  if (l2StageContainer && l2ExplodedStack) {
    l2StageContainer.addEventListener('mousemove', (e) => {
      const rect = l2StageContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = 18 - (y / rect.height) * 16;
      const rotY = -14 + (x / rect.width) * 16;

      l2ExplodedStack.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(2deg)`;
    });

    l2StageContainer.addEventListener('mouseleave', () => {
      l2ExplodedStack.style.transform = 'rotateX(18deg) rotateY(-14deg) rotateZ(2deg)';
    });
  }

  // ============================================================
  // SMART LAYER HIGHLIGHTING
  // ============================================================
  function highlightLayerInStack(stackEl, targetLayer) {
    if (!stackEl) return;
    const layers = stackEl.querySelectorAll('.exploded-layer-item');

    if (targetLayer === 'all') {
      layers.forEach(l => {
        l.style.opacity = '1';
        l.style.filter = '';
      });
    } else {
      layers.forEach(l => {
        if (l.classList.contains(targetLayer)) {
          l.style.opacity = '1';
          l.style.filter = 'drop-shadow(0 0 20px rgba(5,155,102,0.8))';
        } else {
          l.style.opacity = '0.35';
          l.style.filter = 'grayscale(60%)';
        }
      });
    }
  }

  // Logo 1 Layer Cards Click
  const l1Cards = document.querySelectorAll('.logo1-object-card');
  l1Cards.forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.layerTarget;
      l1Cards.forEach(c => {
        c.classList.remove('bg-emerald-50/50', 'border-emerald-300');
        c.classList.add('bg-white');
      });
      card.classList.add('bg-emerald-50/50', 'border-emerald-300');
      card.classList.remove('bg-white');

      highlightLayerInStack(l1ExplodedStack, target);
    });
  });

  window.selectLayerL1 = function(targetClass) {
    l1Cards.forEach(c => {
      if (c.dataset.layerTarget === targetClass) {
        c.click();
      }
    });
  };

  // Logo 2 Layer Cards Click
  const l2Cards = document.querySelectorAll('.logo2-object-card');
  l2Cards.forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.layerTarget;
      l2Cards.forEach(c => {
        c.classList.remove('bg-emerald-50/50', 'border-emerald-300');
        c.classList.add('bg-white');
      });
      card.classList.add('bg-emerald-50/50', 'border-emerald-300');
      card.classList.remove('bg-white');

      highlightLayerInStack(l2ExplodedStack, target);
    });
  });

  window.selectLayerL2 = function(targetClass) {
    l2Cards.forEach(c => {
      if (c.dataset.layerTarget === targetClass) {
        c.click();
      }
    });
  };

  // ============================================================
  // COLOR SWATCH 1-TAP COPIER WITH HAPTIC TOOLTIP
  // ============================================================
  const copyBtns = document.querySelectorAll('.copy-color-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = btn.dataset.copyValue;
      if (!val) return;

      navigator.clipboard.writeText(val).then(() => {
        const tooltip = btn.querySelector('.copy-tooltip');
        if (tooltip) {
          tooltip.classList.add('show');
          setTimeout(() => {
            tooltip.classList.remove('show');
          }, 1800);
        }
      });
    });
  });

  // ============================================================
  // LIVE FONT PLAYGROUND CONTROLLER
  // ============================================================
  const fontInput = document.getElementById('live-type-input');
  const fontPreview = document.getElementById('live-type-preview');
  const sizeSlider = document.getElementById('live-type-size-slider');
  const sizeValDisplay = document.getElementById('live-type-size-val');
  const weightBtns = document.querySelectorAll('.font-weight-btn');

  if (fontInput && fontPreview) {
    fontInput.addEventListener('input', (e) => {
      fontPreview.textContent = e.target.value || 'KOLOHAGA';
    });
  }

  if (sizeSlider && fontPreview) {
    sizeSlider.addEventListener('input', (e) => {
      const sz = e.target.value;
      fontPreview.style.fontSize = `${sz}px`;
      if (sizeValDisplay) sizeValDisplay.textContent = `${sz}px`;
    });
  }

  weightBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      weightBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const weight = btn.dataset.weight;
      if (fontPreview) {
        fontPreview.classList.remove('font-extrabold', 'font-bold', 'font-semibold', 'font-normal');
        fontPreview.classList.add(weight);
      }
    });
  });

  // Initialize Scroll Reveals
  initScrollReveals();
});
