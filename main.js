const header = document.getElementById('header');
      const scrollUp = document.getElementById('scrollUp');
      window.addEventListener('scroll', () => {
         header.classList.toggle('scrolled', scrollY > 50);
         header.classList.toggle('at-top', scrollY <= 50);
         scrollUp.classList.toggle('show', scrollY > 300);
      });
      header.classList.add('at-top');
      scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

      const navToggle = document.getElementById('navToggle');
      const navDrawer = document.getElementById('navDrawer');
      const navDrawerClose = document.getElementById('navDrawerClose');
      const navOverlay = document.getElementById('navOverlay');

      function openDrawer() { navDrawer.classList.add('open'); navOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
      function closeDrawer() { navDrawer.classList.remove('open'); navOverlay.classList.remove('open'); document.body.style.overflow = ''; }

      navToggle.addEventListener('click', openDrawer);
      navDrawerClose.addEventListener('click', closeDrawer);
      navOverlay.addEventListener('click', closeDrawer);

      document.querySelectorAll('.nav__drawer-link').forEach(link => {
         link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            closeDrawer();
            setTimeout(() => {
               const target = document.querySelector(href);
               if (target) target.scrollIntoView({ behavior: 'smooth' });
            }, 300);
         });
      });

      function handleSubscribe() {
         const input = document.getElementById('emailInput');
         const msg = document.getElementById('emailMsg');
         const val = input.value.trim();
         const show = (text, ok) => {
            msg.style.display = 'block';
            msg.style.background = ok ? '#edfaf1' : '#fff0f0';
            msg.style.color = ok ? '#1a7a3e' : '#c1273a';
            msg.style.border = ok ? '1px solid #a8e6be' : '1px solid #f5b8be';
            msg.innerHTML = (ok ? '✅ ' : '⚠️ ') + text;
         };
         if (!val) { show('Por favor, digite seu e-mail antes de assinar.', false); input.focus(); return; }
         if (!val.includes('@')) { show('E-mail inválido: falta o símbolo @. Ex: nome@email.com', false); input.focus(); return; }
         const parts = val.split('@');
         if (parts[0].length === 0) { show('E-mail inválido: insira um nome antes do @.', false); input.focus(); return; }
         if (!parts[1] || !parts[1].includes('.')) { show('E-mail inválido: o domínio precisa ter um ponto. Ex: nome@gmail.com', false); input.focus(); return; }
         if (parts[1].split('.').pop().length < 2) { show('E-mail inválido: extensão muito curta. Ex: .com, .br, .net', false); input.focus(); return; }
         const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
         if (!re.test(val)) { show('Formato de e-mail inválido. Verifique e tente novamente.', false); input.focus(); return; }
         show('Obrigado! Seu e-mail <strong>' + val + '</strong> foi cadastrado com sucesso. 🎉', true);
         input.value = '';
         input.disabled = true;
         document.getElementById('subBtn').disabled = true;
         document.getElementById('subBtn').style.opacity = '0.5';
         setTimeout(() => {
            input.disabled = false;
            document.getElementById('subBtn').disabled = false;
            document.getElementById('subBtn').style.opacity = '1';
            msg.style.display = 'none';
         }, 5000);
      }

      document.addEventListener('DOMContentLoaded', () => {
         const ei = document.getElementById('emailInput');
         if (ei) ei.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubscribe(); });
      });

      document.querySelectorAll('.menu__flt').forEach(btn => {
         btn.addEventListener('click', () => {
            document.querySelectorAll('.menu__flt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.f;
            document.querySelectorAll('.menu__card').forEach(card => {
               card.style.display = (f === 'all' || card.dataset.cat === f) ? 'block' : 'none';
            });
         });
      });

      const obs = new IntersectionObserver(entries => {
         entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
      // ===== LIGHTBOX =====
      (function() {
        // Build lightbox DOM
        const lb = document.createElement('div');
        lb.id = 'lightbox';
        lb.innerHTML = `
          <div class="lb__overlay"></div>
          <div class="lb__wrap">
            <button class="lb__close"><i class="ri-close-line"></i></button>
            <button class="lb__prev"><i class="ri-arrow-left-s-line"></i></button>
            <button class="lb__next"><i class="ri-arrow-right-s-line"></i></button>
            <div class="lb__img-wrap">
              <img class="lb__img" src="" alt="">
            </div>
            <div class="lb__caption">
              <span class="lb__name"></span>
              <span class="lb__counter"></span>
            </div>
          </div>
        `;
        document.body.appendChild(lb);

        const lbEl     = document.getElementById('lightbox');
        const lbImg    = lb.querySelector('.lb__img');
        const lbName   = lb.querySelector('.lb__name');
        const lbCount  = lb.querySelector('.lb__counter');
        const lbClose  = lb.querySelector('.lb__close');
        const lbPrev   = lb.querySelector('.lb__prev');
        const lbNext   = lb.querySelector('.lb__next');
        const lbOverlay = lb.querySelector('.lb__overlay');

        let items = [];
        let current = 0;

        function getVisibleCards() {
          return [...document.querySelectorAll('.menu__card')]
            .filter(c => c.style.display !== 'none');
        }

        function open(idx) {
          items = getVisibleCards();
          current = idx;
          show();
          lbEl.classList.add('lb--open');
          document.body.style.overflow = 'hidden';
        }

        function close() {
          lbEl.classList.remove('lb--open');
          document.body.style.overflow = '';
        }

        function show() {
          const card = items[current];
          const img  = card.querySelector('.menu__card-thumb img');
          const name = card.querySelector('.menu__card-name').textContent;
          const sub  = card.querySelector('.menu__card-sub').textContent;
          const price = card.querySelector('.menu__card-price').textContent;
          lbImg.src = img.src;
          lbImg.alt = name;
          lbName.innerHTML = `<strong>${name}</strong> <span>${sub}</span> <em>${price}</em>`;
          lbCount.textContent = `${current + 1} / ${items.length}`;
          lbPrev.style.opacity = current === 0 ? '.3' : '1';
          lbNext.style.opacity = current === items.length - 1 ? '.3' : '1';
        }

        function prev() { if (current > 0) { current--; show(); } }
        function next() { if (current < items.length - 1) { current++; show(); } }

        // Attach click to each card thumb
        document.querySelectorAll('.menu__card').forEach((card, i) => {
          card.querySelector('.menu__card-thumb').style.cursor = 'zoom-in';
          card.querySelector('.menu__card-thumb').addEventListener('click', () => {
            const visible = getVisibleCards();
            const idx = visible.indexOf(card);
            if (idx !== -1) open(idx);
          });
        });

        lbClose.addEventListener('click', close);
        lbOverlay.addEventListener('click', close);
        lbPrev.addEventListener('click', prev);
        lbNext.addEventListener('click', next);

        // Keyboard navigation
        document.addEventListener('keydown', e => {
          if (!lbEl.classList.contains('lb--open')) return;
          if (e.key === 'Escape') close();
          if (e.key === 'ArrowLeft') prev();
          if (e.key === 'ArrowRight') next();
        });

        // Touch swipe
        let touchX = null;
        lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; });
        lb.addEventListener('touchend', e => {
          if (touchX === null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
          touchX = null;
        });
      })();