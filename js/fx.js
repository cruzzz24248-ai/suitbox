/* Hero: "Monte o seu módulo" — desenho isométrico + dados reais do catálogo (js/data.js) */
(function () {
  var d = document, $ = function (i) { return d.getElementById(i); }, stage = $('stage');
  if (!stage || !window.M) return;
  var USE = { hosp: 'Chalés e Hospedagem', neg: 'Negócios', res: 'Residenciais' };
  var C = Math.cos(Math.PI / 6), S = .5, W = 3.2, H = 3;
  var st = { u: 'hosp', z: null };

  function sizesOf(u) {
    var seen = {}, out = [];
    M.forEach(function (m) { if (m.c === USE[u]) m.s.forEach(function (x) { if (!seen[x[0]]) { seen[x[0]] = 1; out.push(x[0]); } }); });
    return out.sort(function (a, b) { return SB.num(a) - SB.num(b); });
  }
  function draw(area, dims) {
    var L = Math.max(4.8, SB.num(area) / W), k = Math.min(40, 390 / ((L + W) * C), 250 / (H + (L + W + 1.1) * S)), ox = 260 + (W - L) / 2 * C * k;
    var oy = (380 - (H * k + (L + W + 1.1) * S * k + 24)) / 2 + H * k;
    function P(x, y, z) { return [ox + (x - y) * C * k, oy + (x + y) * S * k - z * k]; }
    function poly(pts, a) { return '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" ' + (a || '') + '/>'; }
    function line(a, b, extra) { return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" ' + (extra || '') + '/>'; }
    var top = [P(0, 0, H), P(L, 0, H), P(L, W, H), P(0, W, H)],
        lf = [P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)],
        en = [P(L, 0, 0), P(L, W, 0), P(L, W, H), P(L, 0, H)];
    var fr = 'fill="url(#gl)" stroke="#b5804a" stroke-width="3"';
    var door = [P(.5, W, .05), P(2.3, W, .05), P(2.3, W, 2.25), P(.5, W, 2.25)];
    var win = L > 6 ? [P(L - 2.8, W, .9), P(L - 1.2, W, .9), P(L - 1.2, W, 2.05), P(L - 2.8, W, 2.05)] : null;
    var ew = [P(L, .9, .9), P(L, 2.3, .9), P(L, 2.3, 2.05), P(L, .9, 2.05)];
    var sh = [P(0, W, 0), P(L, W, 0), P(L + 1.6, W + 1.3, 0), P(1.6, W + 1.3, 0)];
    var joints = '', xj, roof = [P(.12, .12, H), P(L - .12, .12, H), P(L - .12, W - .12, H), P(.12, W - .12, H)], step = [P(.4, W, 0), P(2.4, W, 0), P(2.4, W + .55, 0), P(.4, W + .55, 0)];
    for (xj = 1.6; xj < L - .2; xj += 1.6) joints += line(P(xj, W, 0), P(xj, W, H));
    joints += line(P(0, W, H - .32), P(L, W, H - .32)) + line(P(L, 0, H - .32), P(L, W, H - .32)) + line(P(L, W / 2, 0), P(L, W / 2, H - .32));
    function plant(x, y) { var p = P(x, y, 0); return '<ellipse cx="' + p[0].toFixed(1) + '" cy="' + (p[1] + 2).toFixed(1) + '" rx="14" ry="5" fill="rgba(30,36,41,.12)"/><circle cx="' + (p[0] - 4).toFixed(1) + '" cy="' + (p[1] - 8).toFixed(1) + '" r="9" fill="#7cb87a"/><circle cx="' + (p[0] + 5).toFixed(1) + '" cy="' + (p[1] - 12).toFixed(1) + '" r="8" fill="#5fa05e"/>'; }
    var plants = plant(-1.2, W + .9) + plant(L + 1.1, -.6);
    var o = 1.1, a1 = P(0, W + o, 0), a2 = P(L, W + o, 0), b1 = P(L + o, 0, 0), b2 = P(L + o, W, 0);
    function dim(p, q, t, ang) {
      var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      return '<g stroke="#5a656e" stroke-width="1">' + line(p, q) + line([p[0] - 4, p[1] - 4], [p[0] + 4, p[1] + 4]) + line([q[0] - 4, q[1] - 4], [q[0] + 4, q[1] + 4]) + '</g>' +
        '<text x="' + mx.toFixed(1) + '" y="' + (my + 18).toFixed(1) + '" transform="rotate(' + ang + ' ' + mx.toFixed(1) + ' ' + (my + 18).toFixed(1) + ')" text-anchor="middle" font-size="13" font-weight="600" fill="#1e2429" font-family="Archivo,Arial,sans-serif">' + t + '</text>';
    }
    var lt = dims ? dims.split('×')[1].trim().replace(/\s*m$/, '') + ' m' : 'área ' + area + ' m²',
        wt = dims ? dims.split('×')[0].trim() + ' m' : '';
    return '<svg viewBox="0 0 520 380" role="img" aria-label="Desenho do módulo de ' + area + ' m²" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd9a3"/><stop offset="1" stop-color="#f2a65a"/></linearGradient>' +
      '<filter id="bl"><feGaussianBlur stdDeviation="6"/></filter>' +
      '<filter id="cn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .3 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>' +
      '<g class="a-body">' + poly(sh, 'fill="rgba(10,27,61,.22)" filter="url(#bl)"') + '</g>' +
      '<g class="a-body">' + poly(lf, 'fill="#a9c3e8"') + poly(en, 'fill="#7c9fd2"') + '</g>' +
      '<g class="a-top">' + poly(top, 'fill="#f6faff"') + '</g>' +
      '<g class="a-body" filter="url(#cn)">' + poly(top, 'fill="#000"') + poly(lf, 'fill="#000"') + poly(en, 'fill="#000"') + '</g>' +
      '<g class="a-body" stroke="#1e2429" stroke-opacity=".5" stroke-width="1" fill="none">' + poly(top) + poly(lf) + poly(en) + '</g>' +
      '<g class="a-body" stroke="#1e2429" stroke-opacity=".22" stroke-width="1">' + joints + '</g>' +
      '<g class="a-body">' + poly(roof, 'fill="#eef3fa" stroke="#1e2429" stroke-opacity=".3"') + poly(step, 'fill="#c9d3e3" stroke="#1e2429" stroke-opacity=".3"') + '</g>' +
      '<g class="a-open">' + poly(door, fr) + poly(ew, fr) + (win ? poly(win, fr) : '') + '</g>' +
      '<g class="a-open"><circle cx="' + P(2.0, W, 1.15)[0].toFixed(1) + '" cy="' + P(2.0, W, 1.15)[1].toFixed(1) + '" r="2.6" fill="#1e2429"/>' +
      '<g stroke="#b5804a" stroke-width="2">' + line(P(1.4, W, .2), P(1.4, W, 2.1)) + line(P(.5, W, 1.2), P(2.3, W, 1.2)) + line(P(L, 1.6, .95), P(L, 1.6, 2.0)) + (win ? line(P(L - 2, W, .95), P(L - 2, W, 2.0)) : '') + '</g></g>' +
      '<g class="a-body">' + plants + '</g>' +
      '<g class="a-dim">' + dim(a1, a2, lt, 30) + (wt ? dim(b1, b2, wt, -30) : '') + '</g></svg>';
  }
  function chosen() {
    var out = [];
    M.forEach(function (m) { if (m.c !== USE[st.u]) return; m.s.forEach(function (x) { if (x[0] === st.z) out.push([m, x]); }); });
    return out;
  }
  function render() {
    var l = chosen(), x = l[0] ? l[0][1] : null, p = Math.min.apply(null, l.map(function (q) { return SB.num(q[1][1]); }));
    var dims = x && x[2] ? x[2].split('·')[0].trim() : '', peso = x && x[2] && x[2].indexOf('·') > -1 ? x[2].split('·')[1].trim() : '';
    stage.innerHTML = draw(st.z, dims);
    $('p-area').textContent = st.z + ' m²';
    $('p-med').textContent = dims || 'Sob consulta';
    SB.tw($('p-pr'), p, SB.brl);
    $('p-w').textContent = peso ? 'Peso: ' + peso : '';
    $('chips').innerHTML = '<span>' + l.length + (l.length === 1 ? ' modelo' : ' modelos') + ' nesta medida:</span>' + l.map(function (q) { return '<a href="modelo-' + q[0].slug + '.html">' + q[0].n.replace('SuitBox ', '') + '</a>'; }).join('');
    $('hq').href = 'https://wa.me/' + CFG.WA + '?text=' + encodeURIComponent('Olá! Quero um orçamento: ' + USE[st.u] + ', ' + st.z + ' m².');
  }
  function sizes() {
    var s = sizesOf(st.u); if (s.indexOf(st.z) < 0) st.z = s[0];
    $('sz').innerHTML = s.map(function (z) { return '<button type="button" data-z="' + z + '" class="' + (z === st.z ? 'on' : '') + '">' + z + ' m²</button>'; }).join('');
  }
  $('use').onclick = function (e) {
    var u = e.target.dataset && e.target.dataset.u; if (!u) return;
    st.u = u; [].forEach.call(this.children, function (b) { b.classList.toggle('on', b === e.target); }); sizes(); render();
  };
  $('sz').onclick = function (e) {
    var z = e.target.dataset && e.target.dataset.z; if (!z) return;
    st.z = z; [].forEach.call(this.children, function (b) { b.classList.toggle('on', b === e.target); }); render();
  };
  sizes(); render();
})();
