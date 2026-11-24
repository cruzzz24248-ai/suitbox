/* Interatividade: título que sobe, luz que segue o mouse, inclinação 3D, linha do passo a passo */
(function () {
  var d = document, RM = matchMedia('(prefers-reduced-motion:reduce)').matches, fine = matchMedia('(hover:hover)').matches;

  var h1 = d.querySelector('.hero h1');
  if (h1 && !RM) {
    var t = h1.textContent.trim(), ws = t.split(/\s+/);
    h1.setAttribute('aria-label', t);
    h1.innerHTML = ws.map(function (w, i) {
      return '<span class="wd' + (i >= ws.length - 2 ? ' hl' : '') + '" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
  } else if (h1) {
    var ws2 = h1.textContent.trim().split(/\s+/);
    h1.innerHTML = ws2.slice(0, -2).join(' ') + ' <span class="wd hl"><span>' + ws2.slice(-2).join(' ') + '</span></span>';
  }

  /* celular: o botão de WhatsApp só aparece depois que o hero (que já tem os botões) sai da tela */
  var hr = d.querySelector('.hero');
  if (hr && 'IntersectionObserver' in window) new IntersectionObserver(function (es) {
    d.body.classList.toggle('hero-on', es[0].intersectionRatio > .5);
  }, { threshold: [0, .25, .5, .75, 1] }).observe(hr);

  /* hero: projetos da SuitBox em sequência (clique, setas ou toque nas miniaturas; pausa ao passar o mouse) */
  var sh = d.getElementById('show');
  if (sh && window.M) {
    var L = [{ s: 'locacao', c: 'Projeto de locação', n: '8 módulos de 23 m²', p: 'R$ 660.000', h: 'investimento.html' }];
    ['serra', 'piscina', 'lounge', 'terraco', 'gourmet'].forEach(function (k) {
      var m = M.filter(function (x) { return x.slug === k; })[0];
      if (m) L.push({ s: k, c: m.c, n: m.n, p: 'a partir de R$ ' + m.s[0][1], h: 'modelo-' + k + '.html' });
    });
    sh.setAttribute('role', 'group'); sh.setAttribute('aria-label', 'Projetos SuitBox');
    sh.innerHTML = '<div class="show-f">' + L.map(function (o, i) {
      return '<a class="sw' + (i ? '' : ' on') + '" href="' + o.h + '"' + (i ? ' tabindex="-1" aria-hidden="true"' : '') + '><img src="img/models/' + o.s + '.jpg" alt="' + o.n + '"><div class="cap"><small>' + o.c + '</small><b>' + o.n + '</b><span>' + o.p + '</span></div></a>';
    }).join('') + '</div><div class="show-t">' + L.map(function (o, i) {
      return '<button type="button" class="' + (i ? '' : 'on') + '" aria-label="Ver ' + o.n + '"><img src="img/models/' + o.s + '.jpg" alt=""></button>';
    }).join('') + '</div>';
    var sw = sh.querySelectorAll('.sw'), tb = sh.querySelectorAll('.show-t button'), cur = 0, tm, T = 6000;
    sh.style.setProperty('--t', T + 'ms');
    var go = function (i) {
      cur = (i + L.length) % L.length;
      [].forEach.call(sw, function (e, k) { var on = k === cur; e.classList.toggle('on', on); e.setAttribute('aria-hidden', on ? 'false' : 'true'); e.tabIndex = on ? 0 : -1; });
      [].forEach.call(tb, function (e, k) { e.classList.remove('on'); if (k === cur) { void e.offsetWidth; e.classList.add('on'); } });
      play();
    };
    var play = function () { clearTimeout(tm); if (!RM && !sh.classList.contains('hov')) tm = setTimeout(function () { go(cur + 1); }, T); };
    [].forEach.call(tb, function (b, k) { b.onclick = function () { go(k); }; });
    sh.addEventListener('mouseenter', function () { sh.classList.add('hov'); clearTimeout(tm); });
    sh.addEventListener('mouseleave', function () { sh.classList.remove('hov'); go(cur); });
    sh.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(cur + 1); if (e.key === 'ArrowLeft') go(cur - 1); });
    play();
  }

  if (!fine || RM) { var fl0 = d.querySelector('.flow'); if (fl0) fl0.style.setProperty('--p', 1); return; }

  var hero = d.querySelector('.hero');
  if (hero) hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', (e.clientX - r.left) + 'px'); hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  var st = d.getElementById('stage');
  if (st) {
    st.addEventListener('pointermove', function (e) {
      var r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      st.style.setProperty('--ry', (x * 14).toFixed(1) + 'deg'); st.style.setProperty('--rx', (-y * 10).toFixed(1) + 'deg');
    });
    st.addEventListener('pointerleave', function () { st.style.setProperty('--ry', '0deg'); st.style.setProperty('--rx', '0deg'); });
  }

  var ft = d.getElementById('feat');
  if (ft) {
    ft.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.pc'); if (!c) return;
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--ry', ((x - .5) * 8).toFixed(1) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 6).toFixed(1) + 'deg');
      c.style.setProperty('--gx', (x * 100).toFixed(0) + '%'); c.style.setProperty('--gy', (y * 100).toFixed(0) + '%');
    });
    ft.addEventListener('pointerout', function (e) {
      var c = e.target.closest && e.target.closest('.pc'); if (c) { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); }
    });
  }

  var fl = d.querySelector('.flow');
  if (fl) {
    var busy = false, go = function () {
      var r = fl.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (innerHeight * .45)));
      fl.style.setProperty('--p', p.toFixed(3)); busy = false;
    };
    addEventListener('scroll', function () { if (!busy) { busy = true; requestAnimationFrame(go); } }, { passive: true });
    go();
  }
})();
