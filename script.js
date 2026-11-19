document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------------------------
     1. ШАПКА, ПРОГРЕСС-БАР ЧТЕНИЯ И ПОДСВЕТКА АКТИВНОГО РАЗДЕЛА
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const scrollLine = document.getElementById('scrollLine');
  const burgerBtn = document.getElementById('burgerBtn');
  const mobNav = document.getElementById('mobNav');
  const navItems = document.querySelectorAll('[data-sec]');
  const secList = ['insurance', 'calculator', 'catalog', 'portfolio', 'reviews', 'faq', 'contacts']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function onScroll() {
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollLine && maxScroll > 0) {
      scrollLine.style.width = Math.min(100, (y / maxScroll) * 100) + '%';
    }
    header.classList.toggle('is-scrolled', y > 20);

    let active = '';
    secList.forEach((sec) => {
      if (y >= sec.offsetTop - 150) active = sec.id;
    
  /* --------------------------------------------------------------------------
     FALLBACK ДЛЯ КАРТИНОК: ЕСЛИ ВНЕШНЕЕ ФОТО НЕ ЗАГРУЗИЛОСЬ, СТАВИМ SVG-ЗАГЛУШКУ
     -------------------------------------------------------------------------- */
  function makeCeilingFallbackDataUrl(title, bgA, bgB, accent, mode) {
    let shape = '';
    if (mode === 'lines') {
      shape = `<line x1="110" y1="85" x2="690" y2="85" stroke="#ebd089" stroke-width="12" stroke-linecap="round"/>
               <line x1="180" y1="155" x2="620" y2="155" stroke="#ffffff" stroke-width="9" stroke-linecap="round"/>`;
    } else if (mode === 'floating') {
      shape = `<rect x="70" y="55" width="660" height="205" rx="14" fill="none" stroke="#ebd089" stroke-width="10"/>`;
    } else if (mode === 'shadow') {
      shape = `<rect x="70" y="55" width="660" height="205" fill="#f5f2eb" stroke="#122923" stroke-width="12"/>
               <rect x="230" y="135" width="340" height="18" rx="5" fill="#122923"/>`;
    } else {
      shape = `<circle cx="240" cy="145" r="24" fill="${accent}"/>
               <circle cx="400" cy="145" r="24" fill="${accent}"/>
               <circle cx="560" cy="145" r="24" fill="${accent}"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgA}"/><stop offset="100%" stop-color="${bgB}"/>
      </linearGradient></defs>
      <rect width="800" height="600" fill="url(#g)"/>
      ${shape}
      <rect x="60" y="345" width="680" height="185" rx="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)"/>
      <text x="95" y="425" fill="#ffffff" font-family="sans-serif" font-size="34" font-weight="700">${title}</text>
      <text x="95" y="475" fill="rgba(255,255,255,0.82)" font-family="sans-serif" font-size="22">Студия Sturov • Воронеж • от 139 ₽/м²</text>
    </svg>`.trim();
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  const fallbackUrls = [
    makeCeilingFallbackDataUrl('Теневой потолок', '#1c3d34', '#122923', '#ebd089', 'shadow'),
    makeCeilingFallbackDataUrl('Потолки со световыми линиями', '#3a231c', '#181412', '#ebd089', 'lines'),
    makeCeilingFallbackDataUrl('Парящий потолок LED', '#1b2832', '#10171d', '#ebd089', 'floating'),
    makeCeilingFallbackDataUrl('Матовый потолок «Карэ Нуар»', '#3a352c', '#1e1b16', '#ebd089', 'spots'),
    makeCeilingFallbackDataUrl('Глянцевый потолок', '#253844', '#131d24', '#ffffff', 'spots'),
    makeCeilingFallbackDataUrl('Двухуровневые и фотопечать', '#4a2518', '#1f120e', '#ebd089', 'lines')
  ];

  document.querySelectorAll('img').forEach((img, idx) => {
    const applyFallback = () => {
      if (img.dataset.fbApplied) return;
      img.dataset.fbApplied = '1';
      img.src = fallbackUrls[idx % fallbackUrls.length];
    };
    img.addEventListener('error', applyFallback);
    if (img.complete && img.naturalWidth === 0) applyFallback();
  });

});

    const subnav = document.querySelector('.mob-subnav');
    navItems.forEach((el) => {
      const isAct = el.dataset.sec === active;
      el.classList.toggle('is-active', isAct);
      if (isAct && el.classList.contains('mob-subnav__link') && subnav) {
        const targetLeft = el.offsetLeft - (subnav.clientWidth - el.clientWidth) / 2;
        subnav.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function toggleMobNav(forceClose = false) {
    const open = forceClose ? false : !mobNav.classList.contains('is-open');
    mobNav.classList.toggle('is-open', open);
    burgerBtn.classList.toggle('is-open', open);
    burgerBtn.setAttribute('aria-expanded', String(open));
    mobNav.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('lock-scroll', open);
  }

  burgerBtn.addEventListener('click', () => toggleMobNav());
  mobNav.querySelectorAll('a, button').forEach((el) => el.addEventListener('click', () => toggleMobNav(true)));

  /* --------------------------------------------------------------------------
     2. ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ ПРОКРУТКЕ (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const animatedEls = document.querySelectorAll('.anim-up, .anim-scale');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || '0';
          entry.target.style.transitionDelay = delay + 'ms';
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animatedEls.forEach((el) => io.observe(el));
  } else {
    animatedEls.forEach((el) => el.classList.add('is-in'));
  }

  /* --------------------------------------------------------------------------
     3. ВИТРИНА ФОТОГРАФИЙ В HERO С ПЛАВНЫМ FADE-ПЕРЕХОДОМ
     -------------------------------------------------------------------------- */
  const heroSlides = [
    {
      tag: 'Теневой профиль EuroKRAAB + треки',
      title: 'Гостиная с теневым потолком «Карэ Нуар»',
      sub: 'Идеально ровный зазор без плинтусов и вставок',
      img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
    },
    {
      tag: 'Встроенные световые линии LED',
      title: 'Кухня-гостиная со световыми линиями',
      sub: 'Равномерный основной свет без громоздких люстр',
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85'
    },
    {
      tag: 'Парящий контур с подсветкой',
      title: 'Современная гостиная с парящим потолком',
      sub: 'Мягкая контурная подсветка по периметру стен',
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
    },
    {
      tag: 'Классическое матовое полотно',
      title: 'Спальня с матовым потолком «Карэ Нуар»',
      sub: 'Благородная фактура без бликов и запаха',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85'
    }
  ];

  const heroImg = document.getElementById('heroShowcaseImg');
  const heroTag = document.getElementById('heroShowcaseTag');
  const heroTitle = document.getElementById('heroShowcaseTitle');
  const heroSub = document.getElementById('heroShowcaseSub');
  const switcherBtns = document.querySelectorAll('.switcher-btn');

  switcherBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.slide);
      const s = heroSlides[idx];
      if (!s) return;
      switcherBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      heroImg.classList.add('is-fading');
      setTimeout(() => {
        heroImg.src = s.img;
        heroTag.textContent = s.tag;
        heroTitle.textContent = s.title;
        heroSub.textContent = s.sub;
        heroImg.classList.remove('is-fading');
      }, 180);
    });
  });

  /* --------------------------------------------------------------------------
     4. КАЛЬКУЛЯТОР СТОИМОСТИ С ПЛАВНОЙ АНИМАЦИЕЙ ЦЕНЫ И СЕРТИФИКАТОМ 7 000 ₽
     -------------------------------------------------------------------------- */
  const areaSlider = document.getElementById('areaSlider');
  const areaBadge = document.getElementById('areaBadge');
  const typeOpts = document.querySelectorAll('.type-opt');
  const lampsCountEl = document.getElementById('lampsCount');
  const cornersCountEl = document.getElementById('cornersCount');
  const certToggle = document.getElementById('certToggle');
  const oldPriceText = document.getElementById('oldPriceText');
  const newPriceText = document.getElementById('newPriceText');

  const state = { area: 18, price: 490, label: 'Матовый / Глянец', lamps: 6, corners: 4 };
  let displayedSum = 9820;
  let priceAnimId = null;

  function animatePrice(target) {
    if (priceAnimId) cancelAnimationFrame(priceAnimId);
    const start = displayedSum;
    const diff = target - start;
    const duration = 260;
    const startTime = performance.now();

    newPriceText.classList.add('is-pop');
    setTimeout(() => newPriceText.classList.remove('is-pop'), 180);

    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      displayedSum = Math.round(start + diff * eased);
      newPriceText.textContent = displayedSum.toLocaleString('ru-RU') + ' ₽';
      if (t < 1) priceAnimId = requestAnimationFrame(step);
    }
    priceAnimId = requestAnimationFrame(step);
  }

  function updateCalc() {
    const total = Math.max(4500, state.area * state.price + state.lamps * 650 + Math.max(0, state.corners - 4) * 350);
    const discount = certToggle.checked ? Math.min(7000, Math.round(total * 0.45)) : 0;
    const finalSum = total - discount;

    areaBadge.textContent = state.area + ' м²';
    lampsCountEl.textContent = state.lamps;
    cornersCountEl.textContent = state.corners;
    oldPriceText.style.display = discount > 0 ? 'block' : 'none';
    oldPriceText.textContent = total.toLocaleString('ru-RU') + ' ₽';
    animatePrice(finalSum);
  }

  areaSlider.addEventListener('input', (e) => { state.area = Number(e.target.value); updateCalc(); });
  typeOpts.forEach((opt) => {
    opt.addEventListener('click', () => {
      typeOpts.forEach((o) => o.classList.remove('is-active'));
      opt.classList.add('is-active');
      state.price = Number(opt.dataset.price);
      state.label = opt.querySelector('strong').textContent;
      updateCalc();
    });
  });
  document.querySelectorAll('[data-step]').forEach((b) => {
    b.addEventListener('click', () => {
      const dir = Number(b.dataset.dir);
      if (b.dataset.step === 'lamps') state.lamps = Math.max(0, Math.min(40, state.lamps + dir));
      if (b.dataset.step === 'corners') state.corners = Math.max(4, Math.min(20, state.corners + dir));
      updateCalc();
    });
  });
  certToggle.addEventListener('change', updateCalc);
  updateCalc();

  /* --------------------------------------------------------------------------
     5. ФИЛЬТР КАТАЛОГА ПОТОЛКОВ
     -------------------------------------------------------------------------- */
  const tabPills = document.querySelectorAll('.tab-pill');
  const ceilingCards = document.querySelectorAll('.ceiling-card');
  tabPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      tabPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      const cat = pill.dataset.cat;
      ceilingCards.forEach((card) => {
        card.classList.toggle('is-hidden', cat !== 'all' && !(card.dataset.groups || '').includes(cat));
      });
    });
  });

  /* --------------------------------------------------------------------------
     6. ПОРТФОЛИО И ЛАЙТБОКС
     -------------------------------------------------------------------------- */
  const portfolioData = [
    {
      place: 'ЖК «Современник» • Воронеж',
      name: 'Теневой потолок «Карэ Нуар» и трековое освещение, 24 м²',
      img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
    },
    {
      place: 'Московский проспект • Воронеж',
      name: 'Кухня-гостиная 29 м² со встроенными световыми линиями',
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85'
    },
    {
      place: 'Ленинский проспект • Воронеж',
      name: 'Парящий потолок с тёплой LED-подсветкой в спальне, 18 м²',
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
    },
    {
      place: 'Коминтерновский р-н • Воронеж',
      name: 'Классический матовый потолок «Карэ Нуар» без запаха, 21 м²',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85'
    },
    {
      place: 'Центральный р-н • Воронеж',
      name: 'Влагостойкий потолок для кухни-столовой с точечным светом',
      img: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85'
    },
    {
      place: 'ЖК «Олимпийский» • Воронеж',
      name: 'Комбинированный свет в просторной гостиной, 32 м²',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
    }
  ];

  const worksGrid = document.getElementById('worksGrid');
  const lbModal = document.getElementById('lbModal');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  let curLb = 0;

  portfolioData.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'work-tile anim-up';
    btn.dataset.delay = String((i % 3) * 90);
    btn.innerHTML = `
      <img src="${item.img}" alt="${item.name}" loading="lazy">
      <div class="work-tile__info">
        <span class="work-tile__place">${item.place}</span>
        <div class="work-tile__name">${item.name}</div>
      </div>
    `;
    btn.addEventListener('click', () => {
      curLb = i;
      showLb();
      openModal(lbModal);
    });
    worksGrid.appendChild(btn);
  });

  // Подключаем вновь созданные карточки портфолио к IntersectionObserver
  if ('IntersectionObserver' in window) {
    const workObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (entry.target.dataset.delay || '0') + 'ms';
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    worksGrid.querySelectorAll('.work-tile').forEach((tile) => workObs.observe(tile));
  }

  function showLb() {
    curLb = (curLb + portfolioData.length) % portfolioData.length;
    lbImg.src = portfolioData[curLb].img;
    lbCaption.textContent = `${portfolioData[curLb].place} — ${portfolioData[curLb].name}`;
  }

  document.getElementById('lbPrev').addEventListener('click', () => { curLb--; showLb(); });
  document.getElementById('lbNext').addEventListener('click', () => { curLb++; showLb(); });

  /* --------------------------------------------------------------------------
     7. FAQ АККОРДЕОН И ПЕРЕКЛЮЧАТЕЛЬ ОФИСОВ НА КАРТЕ
     -------------------------------------------------------------------------- */
  document.querySelectorAll('.faq-box').forEach((box) => {
    const q = box.querySelector('.faq-q');
    const a = box.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const opened = box.classList.contains('is-open');
      document.querySelectorAll('.faq-box').forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a').style.maxHeight = '0px';
      });
      if (!opened) {
        box.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  const officeMap = document.getElementById('officeMap');
  const officeSwitches = document.querySelectorAll('.office-switch');
  officeSwitches.forEach((sw) => {
    sw.addEventListener('click', () => {
      officeSwitches.forEach((s) => s.classList.remove('is-active'));
      sw.classList.add('is-active');
      officeMap.src = sw.dataset.map;
    });
  });

  /* --------------------------------------------------------------------------
     8. МОДАЛЬНЫЕ ОКНА И ВАЛИДАЦИЯ ФОРМЫ
     -------------------------------------------------------------------------- */
  const leadModal = document.getElementById('leadModal');
  const policyModal = document.getElementById('policyModal');
  const modalTitle = document.getElementById('modalTitle');
  const subjectField = document.getElementById('subjectField');
  const leadForm = document.getElementById('leadForm');
  const nameField = document.getElementById('nameField');
  const phoneField = document.getElementById('phoneField');
  const okBanner = document.getElementById('okBanner');

  function openModal(el) {
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock-scroll');
  }

  function closeAll() {
    document.querySelectorAll('.modal-bg.is-open').forEach((m) => {
      m.classList.remove('is-open');
      m.setAttribute('aria-hidden', 'true');
    });
    document.body.classList.remove('lock-scroll');
  }

  document.querySelectorAll('[data-lead]').forEach((btn) => {
    btn.addEventListener('click', () => {
      modalTitle.textContent = btn.dataset.lead;
      subjectField.value = btn.dataset.lead;
      okBanner.classList.remove('is-show');
      openModal(leadModal);
    });
  });

  document.getElementById('saveCalcBtn').addEventListener('click', () => {
    modalTitle.textContent = 'Закрепить расчёт и сертификат 7 000 ₽';
    subjectField.value = `Расчёт: ${state.label}, ${state.area} м², сумма ${newPriceText.textContent}`;
    okBanner.classList.remove('is-show');
    openModal(leadModal);
  });

  document.getElementById('policyTrigger').addEventListener('click', () => openModal(policyModal));
  document.querySelectorAll('[data-close]').forEach((btn) => btn.addEventListener('click', closeAll));
  document.querySelectorAll('.modal-bg').forEach((bg) => bg.addEventListener('click', (e) => { if (e.target === bg) closeAll(); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

  phoneField.addEventListener('input', (e) => {
    let d = e.target.value.replace(/\D/g, '');
    if (!d) { e.target.value = ''; return; }
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    let out = '+7';
    if (d.length > 1) out += ' (' + d.slice(1, 4);
    if (d.length >= 4) out += ') ' + d.slice(4, 7);
    if (d.length >= 7) out += '-' + d.slice(7, 9);
    if (d.length >= 9) out += '-' + d.slice(9, 11);
    e.target.value = out;
    e.target.closest('.inp-group').classList.remove('has-bad');
    e.target.classList.remove('is-bad');
  });

  nameField.addEventListener('input', () => {
    nameField.closest('.inp-group').classList.remove('has-bad');
    nameField.classList.remove('is-bad');
  });

  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    if (nameField.value.trim().length < 2) {
      nameField.classList.add('is-bad');
      nameField.closest('.inp-group').classList.add('has-bad');
      valid = false;
    }
    if (phoneField.value.replace(/\D/g, '').length !== 11) {
      phoneField.classList.add('is-bad');
      phoneField.closest('.inp-group').classList.add('has-bad');
      valid = false;
    }
    if (!valid) return;

    okBanner.textContent = `Спасибо, ${nameField.value.trim()}! Заявка отправлена — менеджер Sturov свяжется с вами в течение 10 минут.`;
    okBanner.classList.add('is-show');
    leadForm.reset();
  });
});
