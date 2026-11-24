/* Acabamento geral: barra de leitura, cabeçalho ao rolar, entrada dos blocos, botão de topo e barra de preço (modelo, celular). */
(function () {
  var d = document, RM = matchMedia('(prefers-reduced-motion:reduce)').matches, h = d.querySelector('header');

  var pr = d.createElement('i'); pr.className = 'prog'; if (h) h.appendChild(pr);
  var up = d.createElement('button'); up.type = 'button'; up.className = 'up'; up.setAttribute('aria-label', 'Voltar ao topo');
  up.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6M6 11.5 12 5.5l6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  up.onclick = function () { scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); };
  d.body.appendChild(up);

  var busy = false;
  function onScroll() {
    var y = scrollY, max = Math.max(1, d.documentElement.scrollHeight - innerHeight);
    if (h) h.classList.toggle('sc', y > 12);
    pr.style.transform = 'scaleX(' + Math.min(1, y / max).toFixed(4) + ')';
    up.classList.toggle('on', y > 900);
    busy = false;
  }
  addEventListener('scroll', function () { if (!busy) { busy = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* entrada dos blocos: só cartões, faixas e perguntas (o hero tem a sua própria animação) */
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    d.querySelectorAll('.facts .w>div,.feat>div,.grid.c4>*,.flow>div,.vs .r,details,.info>div,.cta,.bento>*').forEach(function (el) {
      var i = [].indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(i, 4) * 70 + 'ms');
      el.classList.add('rv'); io.observe(el);
    });
  }

  /* modelo: a barra de preço aparece quando o preço sai da tela */
  var pb = d.querySelector('.pbox'), mb = d.getElementById('mbar');
  if (pb && mb && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var r = es[0]; mb.classList.toggle('on', !r.isIntersecting && r.boundingClientRect.top < 0);
    }).observe(pb);
  }
})();

/* botão de subir: some ao rolar para baixo e volta ao rolar para cima (o WhatsApp fica sempre visível); painel fixo da calculadora cede lugar ao gráfico */
(function () {
  var d = document, h = d.documentElement, last = scrollY;
  addEventListener('scroll', function () {
    var y = scrollY, dy = y - last; if (Math.abs(dy) < 6) return;
    h.classList.toggle('fl-h', dy > 0 && y > 120); last = y;
  }, { passive: true });
  var out = d.querySelector('.calcx .out'), ch = d.querySelector('.calcx .chart');
  if (out && ch) {
    var f = function () { out.classList.toggle('free', matchMedia('(max-width:980px)').matches && ch.getBoundingClientRect().top < out.offsetHeight + 110); };
    addEventListener('scroll', f, { passive: true }); addEventListener('resize', f); f();
  }
})();

/* celular: aba ativa da barra inferior e botão "Menu" (abre o mesmo menu do cabeçalho) */
(function () {
  var d = document, t = d.getElementById('btm'); if (!t) return;
  var file = (location.pathname.split('/').pop() || 'index.html'), mb = d.getElementById('mb'); if (file === 'contato.html') d.body.classList.add('contato');
  function mark() {
    var cmp = file === 'modelos.html' && location.hash === '#comparar';
    [].forEach.call(t.querySelectorAll('a'), function (a) {
      var h = a.getAttribute('data-t'), on = h === 'modelos.html#comparar' ? cmp : h === 'modelos.html' ? (!cmp && (file === 'modelos.html' || file.indexOf('modelo-') === 0)) : h === file;
      a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  mark(); addEventListener('hashchange', mark);
  var m = d.getElementById('bmenu');
  if (m && mb) m.onclick = function () { mb.click(); };
  if (mb) new MutationObserver(function () { m && m.classList.toggle('on', mb.getAttribute('aria-expanded') === 'true'); }).observe(mb, { attributes: true, attributeFilter: ['aria-expanded'] });
})();
