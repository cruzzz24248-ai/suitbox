(function () {
  function $(i) { return document.getElementById(i); }
  var WA = (window.CFG && CFG.WA) || '554891953531';
  function num(s) { return parseFloat(String(s).replace(/\./g, '').replace(',', '.')); }
  function min(m) { return Math.min.apply(null, m.s.map(function (x) { return num(x[1]); })); }
  function brl(n) { return 'R$ ' + Math.round(n).toLocaleString('pt-BR'); }
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* número que "corre" até o novo valor (respeita movimento reduzido) */
  function tw(el, to, fmt) {
    if (!el) return; fmt = fmt || String;
    var from = el._v == null ? to : el._v; el._v = to; cancelAnimationFrame(el._r);
    if (RM || from === to) { el.textContent = fmt(to); return; }
    var t0 = performance.now();
    (function f(t) { var p = Math.min(1, (t - t0) / 450), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(from + (to - from) * e); if (p < 1) el._r = requestAnimationFrame(f); })(t0);
  }
  window.SB = { num: num, brl: brl, $: $, tw: tw };

  /* cartão de modelo: .pc (empilhado) ou .pc.ov (foto inteira) */
  function pc(m, ov, w) {
    var f = m.s[0], extra = m.s.length > 1 ? ' · ' + m.s.map(function (x) { return x[0]; }).join(' e ') + ' m²' : ' · ' + f[0] + ' m²';
    return '<a class="pc' + (ov ? ' ov' : '') + '" href="modelo-' + m.slug + '.html"><div class="ph2"><img src="img/models/' + m.slug + '.jpg" alt="' + m.n + '" loading="lazy"><span class="tg">' + m.c + '</span></div>' +
      '<div class="pi"><h3>' + m.n + '</h3><div class="pr2"><span>' + (m.s.length > 1 ? m.s.map(function (x) { return x[0]; }).join(' e ') + ' m²' : f[0] + ' m²') + '</span><span>a partir de <b>R$ ' + f[1] + '</b></span></div></div></a>';
  }
  window.SB.pc = pc; window.SB.min = min;

  var feat = $('feat');
  if (feat) feat.innerHTML = ['serra', 'piscina', 'lounge', 'terraco', 'duplex', 'gourmet', 'residencial-47', 'cafe', 'barber'].map(function (s, i) {
    return pc(M.filter(function (x) { return x.slug === s; })[0], true);
  }).join('');

  if ($('cat')) {
    var cnt = $('cnt');
    var cat = function (c) {
      var l = M.filter(function (m) { return !c || m.c == c; });
      $('cat').innerHTML = l.map(function (m) { return pc(m); }).join('');
      if (cnt) cnt.textContent = l.length + (l.length === 1 ? ' modelo' : ' modelos');
    };
    cat('');
    $('tabs').onclick = function (e) {
      if (e.target.tagName != 'BUTTON') return;
      [].forEach.call(this.children, function (b) { b.classList.remove('on'); });
      e.target.classList.add('on'); cat(e.target.dataset.c);
    };
  }

  /* comparador: foto, tamanhos, preço, preço por m² e diferença */
  if ($('ct')) {
    var o = M.map(function (m, i) { return '<option value="' + i + '">' + m.n + '</option>'; }).join('');
    $('ca').innerHTML = o; $('cb').innerHTML = o; $('cb').value = 1;
    var qa = (location.search.match(/[?&]a=([\w-]+)/) || [])[1], ia = -1;
    M.forEach(function (x, i) { if (x.slug === qa) ia = i; });
    if (ia > -1) { var ib = -1; M.forEach(function (x, i) { if (ib < 0 && i !== ia && x.c === M[ia].c) ib = i; }); $('ca').value = ia; $('cb').value = ib > -1 ? ib : (ia ? 0 : 1); }
    var sizes = function (m) { return m.s.map(function (x) { return x[0] + ' m²' + (x[2] ? ' (' + x[2].split('·')[0].trim() + ')' : ''); }).join('<br>'); };
    var prices = function (m) { return m.s.map(function (x) { return 'R$ ' + x[1]; }).join('<br>'); };
    var perm2 = function (m) { return m.s.map(function (x) { return brl(num(x[1]) / num(x[0])) + '/m²'; }).join('<br>'); };
    var head = function (m) { return '<a href="modelo-' + m.slug + '.html"><img src="img/models/' + m.slug + '.jpg" alt="' + m.n + '" style="aspect-ratio:4/3;object-fit:cover;width:100%;margin-bottom:12px"><span style="font:650 19px var(--sans)">' + m.n + '</span></a>'; };
    var pm = function (m) { return Math.min.apply(null, m.s.map(function (x) { return num(x[1]) / num(x[0]); })); };
    var cell = function (t, best, bold) { return '<td' + (best ? ' class="best"' : '') + '>' + (bold ? '<b>' + t + '</b>' : t) + (best ? '<span class="bdg">menor valor</span>' : '') + '</td>'; };
    var cmp = function () {
      var a = M[$('ca').value], b = M[$('cb').value], pa = min(a), pb = min(b), qa = pm(a), qb = pm(b), dif = pa === pb ? 'Mesmo valor de entrada' : (pa < pb ? a.n : b.n) + ' custa ' + brl(Math.abs(pa - pb)) + ' a menos (menor tamanho)';
      $('ct').innerHTML = '<tr><th></th><th>' + head(a) + '</th><th>' + head(b) + '</th></tr>' +
        '<tr><td>Linha</td><td>' + a.c + '</td><td>' + b.c + '</td></tr>' +
        '<tr><td>Tamanhos</td><td>' + sizes(a) + '</td><td>' + sizes(b) + '</td></tr>' +
        '<tr><td>Valor (+ frete)</td>' + cell(prices(a), pa < pb, 1) + cell(prices(b), pb < pa, 1) + '</tr>' +
        '<tr><td>Valor por m²</td>' + cell(perm2(a), qa < qb) + cell(perm2(b), qb < qa) + '</tr>' +
        '<tr><td>Incluso</td><td>' + a.i + '</td><td>' + b.i + '</td></tr>' +
        '<tr><td>Diferença</td><td colspan="2">' + dif + '</td></tr>';
    };
    $('ca').onchange = $('cb').onchange = cmp; cmp();
  }

  /* página de modelo: seletor de tamanho */
  var ms = $('msz');
  if (ms) {
    var S = JSON.parse(ms.dataset.s), nm = ms.dataset.n;
    var pick = function (i) {
      var x = S[i];
      [].forEach.call(ms.children, function (b, k) { b.classList.toggle('on', k === i); });
      tw($('mp'), num(x[1]), brl); if ($('mbp')) $('mbp').textContent = 'R$ ' + x[1]; $('ma').textContent = x[0] + ' m²';
      $('mm').textContent = x[2] ? x[2].split('·')[0].trim() : 'Sob consulta';
      $('mw').textContent = x[2] && x[2].indexOf('·') > -1 ? x[2].split('·')[1].trim() : 'Sob consulta';
      $('mq').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá! Tenho interesse no ' + nm + ' de ' + x[0] + ' m².');
      if ($('mq2')) $('mq2').href = $('mq').href;
    };
    ms.onclick = function (e) { if (e.target.tagName === 'BUTTON') pick([].indexOf.call(ms.children, e.target)); };
    pick(0);
  }

  /* calculadora: valor dos módulos (catálogo) x faturamento estimado */
  if ($('r1')) {
    var im = $('im'), cats = {}, order = [];
    M.forEach(function (x, i) { x.s.forEach(function (z, j) { if (!cats[x.c]) { cats[x.c] = ''; order.push(x.c); } cats[x.c] += '<option value="' + i + ':' + j + '">' + x.n + ' · ' + z[0] + ' m² · R$ ' + z[1] + '</option>'; }); });
    im.innerHTML = order.map(function (c) { return '<optgroup label="' + c + '">' + cats[c] + '</optgroup>'; }).join('');
    var meses = function (n) { return n < 24 ? Math.round(n) + ' meses' : (n / 12).toFixed(1).replace('.', ',') + ' anos'; };
    var pct = function (el) { el.style.setProperty('--p', ((el.value - el.min) / (el.max - el.min) * 100) + '%'); };
    /* barras: faturamento bruto acumulado por ano x valor dos módulos */
    var chart = function (inv, m) {
      var box = $('ch'), first = !box.firstChild, W = Math.max(280, Math.round(box.clientWidth) || 600);
      if (!(m > 0)) { box.innerHTML = ''; return; }
      var N = Math.max(3, Math.min(10, Math.ceil(inv / (m * 12)) + 1)), top = Math.max(inv, m * 12 * N) * 1.12, bw = (W - 40) / N, y0 = 220, i, v, h, x, w, r, y, hit = 0,
          sh = function (n) { return n >= 1e6 ? 'R$ ' + (n / 1e6).toFixed(1).replace('.', ',') + ' mi' : 'R$ ' + Math.round(n / 1e3) + ' mil'; },
          s = '<svg viewBox="0 0 ' + W + ' 266" role="img" aria-label="Faturamento bruto acumulado por ano, comparado ao valor dos módulos"><defs><linearGradient id="cbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c6cacf"/><stop offset="1" stop-color="#e6e6e1"/></linearGradient><linearGradient id="cbo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#43a0e6"/><stop offset="1" stop-color="#0f4c7a"/></linearGradient></defs>';
      for (i = 1; i <= 4; i++) s += '<line class="gr" x1="10" x2="' + (W - 10) + '" y1="' + (y0 - i * 47.5) + '" y2="' + (y0 - i * 47.5) + '"/>';
      for (i = 1; i <= N; i++) {
        v = m * 12 * i; h = v / top * 190; x = 20 + (i - 1) * bw + bw * .14; w = bw * .72; y = y0 - h; r = Math.min(8, h / 2, w / 2);
        if (v >= inv && !hit) hit = i;
        s += '<path class="cb2' + (v >= inv ? ' ok' : '') + (first ? ' in' : '') + '" style="--d:' + (i * 55) + 'ms" d="M' + x.toFixed(1) + ',' + y0 + 'V' + (y + r).toFixed(1) + 'Q' + x.toFixed(1) + ',' + y.toFixed(1) + ' ' + (x + r).toFixed(1) + ',' + y.toFixed(1) + 'H' + (x + w - r).toFixed(1) + 'Q' + (x + w).toFixed(1) + ',' + y.toFixed(1) + ' ' + (x + w).toFixed(1) + ',' + (y + r).toFixed(1) + 'V' + y0 + 'Z"><title>Ano ' + i + ': ' + brl(v) + '</title></path>' +
          (bw >= 46 || i === hit || i === N ? '<text class="vl' + (v >= inv ? ' ok' : '') + '" x="' + (x + w / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle">' + sh(v) + '</text>' : '') +
          '<text x="' + (x + w / 2).toFixed(1) + '" y="238" text-anchor="middle">Ano ' + i + '</text>';
      }
      if (hit) { x = 20 + (hit - 1) * bw + bw * .5; s += '<text class="hit" x="' + x.toFixed(1) + '" y="254" text-anchor="middle">supera o valor</text>'; }
      var ly = (y0 - inv / top * 190).toFixed(1);
      box.innerHTML = s + '<line class="ref" x1="10" x2="' + (W - 10) + '" y1="' + ly + '" y2="' + ly + '"/><line class="ref" x1="10" x2="34" y1="12" y2="12"/><text class="rl" x="40" y="16">Valor dos módulos: ' + brl(inv) + '</text><line class="bas" x1="10" x2="' + (W - 10) + '" y1="220" y2="220"/></svg>';
    };
    var calc = function () {
      var u = +$('r1').value, d = +$('r2').value, p = +$('r3').value, m = u * d * 30 * p / 100, k = im.value.split(':'), mo = M[k[0]], inv = num(mo.s[k[1]][1]) * u;
      ['r1', 'r2', 'r3'].forEach(function (i) { pct($(i)); });
      $('o1').textContent = u; $('o2').textContent = 'R$ ' + d; $('o3').textContent = p + '%';
      tw($('inv'), inv, brl); tw($('m'), m, brl); tw($('a'), m * 12, brl);
      $('pay').textContent = m > 0 ? meses(inv / m) : '—';
      chart(inv, m);
      var href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá! Simulei na calculadora: ' + u + ' × ' + mo.n + ' (' + mo.s[k[1]][0] + ' m²), diária de R$ ' + d + ' e ocupação de ' + p + '%. Valor dos módulos ' + brl(inv) + ', faturamento bruto estimado de ' + brl(m) + ' por mês. Quero uma análise do meu projeto.');
      [].forEach.call(document.querySelectorAll('.iq'), function (a) { a.href = href; });
    };
    ['r1', 'r2', 'r3'].forEach(function (i) { $(i).oninput = calc; }); im.onchange = calc; calc(); var rz; addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(calc, 150); });
  }

  if ($('f')) {
    $('f').onsubmit = function (e) {
      e.preventDefault();
      var i = this.querySelectorAll('input,textarea');
      location.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá! Sou ' + i[0].value + ' (' + i[1].value + '). ' + i[2].value);
    };
  }

  var mb = $('mb'), nav = $('nav');
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav && nav.classList.contains('o')) mb.click(); });
  if (nav) nav.addEventListener('click', function (e) { if (e.target.closest('a') && nav.classList.contains('o')) mb.click(); });
  if (mb) mb.onclick = function () {
    var o = nav.classList.toggle('o'); mb.setAttribute('aria-expanded', o); document.documentElement.classList.toggle('lock', o);
    document.body.style.overflow = o ? 'hidden' : '';
  };
})();
