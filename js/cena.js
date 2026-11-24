/* Como funciona: o módulo (desenho isométrico) muda a cada etapa enquanto você rola.
   Textos das etapas vêm do HTML (build.py); aqui ficam o desenho, a legenda, o "quem faz" e a barra de etapas. */
(function () {
  var d = document, root = d.getElementById('scn'), box = d.getElementById('pscene');
  if (!root || !box) return;
  var RM = matchMedia('(prefers-reduced-motion:reduce)').matches, ls = root.querySelector('.sl');
  var DOTS = ['Modelo', 'Plano', 'Terreno', 'Fábrica', 'Transporte', 'Instalação'];
  var WHO = ['Você escolhe', 'SuitBox e você', 'Por conta do cliente', 'SuitBox', 'SuitBox', 'SuitBox'];
  var CAP = [
    'Você escolhe o modelo, a medida e o uso. São módulos de 14,4 a 47 m².',
    'Definimos personalização, prazos e condições antes de produzir.',
    'Seis sapatas por módulo, ou uma base maciça de 10 cm. Fundação e pontos de ligação ficam a cargo do cliente.',
    'Em Criciúma/SC, as peças de concreto são produzidas e montadas em ambiente controlado.',
    'O módulo sai pronto da fábrica e segue até o seu terreno.',
    'O módulo é posicionado sobre a fundação e entregue.'
  ];
  var SHOW = { gnd: [1, 2, 3, 4, 5, 6], shed: [4], wire: [1, 2], ap: [2], ghost: [3], utils: [3], fund: [3, 6], pieces: [4], road: [5], truck: [5], mod6: [6], crane: [6], tag1: [1], tag3: [3], tag4: [4], tag5: [5], tag6: [6] };

  var C = Math.cos(Math.PI / 6), S = .5, K = 24, OX = 250, OY = 214, L = 4.8, W = 3.2, H = 3, tx = 0, ty = 0, tz = 0;
  function P(x, y, z) { x += tx; y += ty; z += tz; return [OX + (x - y) * C * K, OY + (x + y) * S * K - z * K]; }
  function pt(a) { return a[0].toFixed(1) + ',' + a[1].toFixed(1); }
  function poly(ps, cls) { return '<polygon class="' + cls + '" points="' + ps.map(pt).join(' ') + '"/>'; }
  function line(a, b, cls) { return '<line class="' + (cls || '') + '" x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '"/>'; }
  function box3(x0, y0, z0, x1, y1, z1, c) {
    return poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], c + ' t') +
      poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], c + ' l') +
      poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], c + ' r');
  }
  function fl(x0, z0, x1, z1, c) { return poly([P(x0, W, z0), P(x1, W, z0), P(x1, W, z1), P(x0, W, z1)], c); }
  function fr(y0, z0, y1, z1, c) { return poly([P(L, y0, z0), P(L, y1, z0), P(L, y1, z1), P(L, y0, z1)], c); }
  /* etiqueta (pílula) com ponteiro */
  function tag(p, t, dx, dy) {
    var w = t.length * 6.6 + 18, x = p[0] + dx, y = p[1] + dy;
    return line(p, [x, y], 'tl') + '<circle class="td" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3"/><rect class="tg" x="' + (x - w / 2).toFixed(1) + '" y="' + (y - 11).toFixed(1) + '" width="' + w.toFixed(1) + '" height="22" rx="11"/><text class="tt" x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="middle">' + t + '</text>';
  }
  /* janela da fachada: começa depois da porta (que termina em 2,3) para nunca se sobrepor */
  var WA = 2.95, WB = 4.35;
  function fx(x, y0, z0, y1, z1, c) { return poly([P(x, y0, z0), P(x, y1, z0), P(x, y1, z1), P(x, y0, z1)], c); }
  function fy(y, x0, z0, x1, z1, c) { return poly([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)], c); }
  function openings(cls) {
    return fl(.5, .05, 2.3, 2.25, cls) + fl(WA, .9, WB, 2.05, cls) + fr(.9, .9, 2.3, 2.05, cls);
  }
  /* módulo completo: concreto com juntas de painel, platibanda, porta de correr, janelas, degrau */
  function module(dx, dz, dy, nostep) {
    tx = dx; tz = dz; ty = dy || 0;
    var s = box3(0, 0, 0, L, W, H, 'cn'), wm = (WA + WB) / 2, hp = P(1.62, W, 1.15);
    s += poly([P(.12, .12, H), P(L - .12, .12, H), P(L - .12, W - .12, H), P(.12, W - .12, H)], 'rf');
    s += line(P(2.62, W, 0), P(2.62, W, H - .32), 'jn') + line(P(0, W, H - .32), P(L, W, H - .32), 'jn') + line(P(L, 0, H - .32), P(L, W, H - .32), 'jn') + line(P(L, W / 2, 0), P(L, W / 2, H - .32), 'jn');
    if (!nostep) s += box3(.4, W, 0, 2.4, W + .55, .2, 'st');
    /* porta de correr */
    s += fl(.5, .2, 2.3, 2.25, 'fm') + fl(.62, .3, 2.18, 2.15, 'gl') + fl(.62, 1.05, 2.18, 1.4, 'rl') + line(P(1.4, W, .3), P(1.4, W, 2.15), 'mu');
    s += '<circle class="hd" cx="' + hp[0].toFixed(1) + '" cy="' + hp[1].toFixed(1) + '" r="2.2"/>';
    /* janela da fachada */
    s += fl(WA, .9, WB, 2.05, 'fm') + fl(WA + .1, 1, WB - .1, 1.95, 'gl') + line(P(wm, W, 1), P(wm, W, 1.95), 'mu') + fl(WA - .15, .78, WB + .15, .9, 'sl2');
    /* janela da lateral */
    s += fr(.9, .9, 2.3, 2.05, 'fm') + fr(1, 1, 2.2, 1.95, 'gl') + line(P(L, 1.6, 1), P(L, 1.6, 1.95), 'mu');
    tx = 0; tz = 0; ty = 0; return s;
  }
  function wire(cls) {
    return poly([P(0, 0, H), P(L, 0, H), P(L, W, H), P(0, W, H)], cls) + poly([P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)], cls) + poly([P(L, 0, 0), P(L, W, 0), P(L, W, H), P(L, 0, H)], cls);
  }
  function dim(p, q, t, ang) {
    var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2 + 17;
    return line(p, q) + line([p[0] - 4, p[1] - 4], [p[0] + 4, p[1] + 4]) + line([q[0] - 4, q[1] - 4], [q[0] + 4, q[1] + 4]) +
      '<text x="' + mx.toFixed(1) + '" y="' + my.toFixed(1) + '" transform="rotate(' + ang + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1) + ')" text-anchor="middle">' + t + '</text>';
  }
  function offs(ex, ey, ez) { return '--dx:' + ((ex - ey) * C * K).toFixed(1) + 'px;--dy:' + ((ex + ey) * S * K - ez * K).toFixed(1) + 'px'; }
  function plant(x, y) { var p = P(x, y, 0); return '<ellipse class="sw2" cx="' + p[0].toFixed(1) + '" cy="' + (p[1] + 2).toFixed(1) + '" rx="13" ry="5"/><circle class="pl" cx="' + (p[0] - 4).toFixed(1) + '" cy="' + (p[1] - 8).toFixed(1) + '" r="9"/><circle class="pl2" cx="' + (p[0] + 5).toFixed(1) + '" cy="' + (p[1] - 12).toFixed(1) + '" r="8"/>'; }

  function L3(a, b, cls) { return line(P(a[0], a[1], a[2]), P(b[0], b[1], b[2]), cls); }
  function lerp3(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  /* roda em perspectiva isométrica: círculo no plano x-z, com espessura, aro e cubo */
  function ring(xc, y, zc, r) { var a = [], i; for (i = 0; i < 30; i++) a.push(P(xc + r * Math.cos(i / 30 * 6.2832), y, zc + r * Math.sin(i / 30 * 6.2832))); return a; }
  function wheel(xc, yc, zc, r, th) {
    return poly(ring(xc, yc - th, zc, r), 'wl') + poly(ring(xc, yc, zc, r), 'wl') + poly(ring(xc, yc, zc, r * .6), 'rm') + poly(ring(xc, yc, zc, r * .22), 'hb');
  }
  /* treliça (lança do guindaste) */
  function truss(a, b, h, n, cls) {
    var s = '', i, u0, u1, up = function (p) { return [p[0], p[1], p[2] + h]; };
    s += L3(a, b, cls) + L3(up(a), up(b), cls) + L3(a, up(a), 'lz') + L3(b, up(b), 'lz');
    for (i = 0; i < n; i++) {
      u0 = lerp3(a, b, i / n); u1 = lerp3(a, b, (i + 1) / n);
      s += L3(u0, up(u0), 'lz') + (i % 2 ? L3(up(u0), u1, 'lz') : L3(u0, up(u1), 'lz'));
    }
    return s;
  }
  /* torre treliçada: duas faces visíveis com contraventamento em X */
  function mast(x0, y0, x1, y1, z1) {
    var s = '', n = 11, h = z1 / n, i, z;
    s += poly([P(x0, y1, 0), P(x1, y1, 0), P(x1, y1, z1), P(x0, y1, z1)], 'crf') + poly([P(x1, y0, 0), P(x1, y1, 0), P(x1, y1, z1), P(x1, y0, z1)], 'crf');
    for (i = 0; i < n; i++) {
      z = i * h;
      s += L3([x0, y1, z], [x1, y1, z + h], 'lz') + L3([x1, y1, z], [x0, y1, z + h], 'lz') + L3([x1, y0, z], [x1, y1, z + h], 'lz') + L3([x1, y1, z], [x1, y0, z + h], 'lz') + L3([x0, y1, z + h], [x1, y1, z + h], 'lz') + L3([x1, y0, z + h], [x1, y1, z + h], 'lz');
    }
    return s + L3([x0, y1, 0], [x0, y1, z1], 'lq') + L3([x1, y1, 0], [x1, y1, z1], 'lq') + L3([x1, y0, 0], [x1, y0, z1], 'lq');
  }

  function art() {
    var s = '', i, j, t = .25, xs = [.2, L / 2 - .35, L - .9], ys = [.35, W - 1.05], fs = [];
    s += '<svg viewBox="0 0 520 392" role="img" aria-label="Desenho do módulo em cada etapa do processo"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8cc4ea"/><stop offset="1" stop-color="#e3f1fa"/></linearGradient></defs>';
    /* chão com malha e vegetação */
    s += '<g class="e gnd">' + poly([P(-3.4, -1.8, 0), P(L + 2.4, -1.8, 0), P(L + 2.4, W + 1.8, 0), P(-3.4, W + 1.8, 0)], 'gd');
    for (i = -3; i <= L + 2; i++) s += line(P(i, -1.8, 0), P(i, W + 1.8, 0), 'gl2');
    for (j = -1; j <= W + 1; j++) s += line(P(-3.4, j, 0), P(L + 2.4, j, 0), 'gl2');
    s += plant(-2.6, W + 1.1) + plant(L + 1.7, W + .7) + '</g>';
    /* 4: fábrica ao fundo (galpão com telhado de duas águas e portões) */
    var sx0 = -2.8, sx1 = L + .2, sy0 = -5.8, sy1 = -2.6, sz = 3.6, rz = 4.7, ym = (sy0 + sy1) / 2;
    s += '<g class="e shed">' +
      poly([P(sx1, sy0, 0), P(sx1, sy1, 0), P(sx1, sy1, sz), P(sx1, ym, rz), P(sx1, sy0, sz)], 'sh2 r') +
      poly([P(sx0, sy1, 0), P(sx1, sy1, 0), P(sx1, sy1, sz), P(sx0, sy1, sz)], 'sh2 l') +
      poly([P(sx0, ym, rz), P(sx1, ym, rz), P(sx1, sy0, sz), P(sx0, sy0, sz)], 'rfb') +
      poly([P(sx0, sy1, sz), P(sx1, sy1, sz), P(sx1, ym, rz), P(sx0, ym, rz)], 'rfa') +
      line(P(sx0, sy1, sz - .35), P(sx1, sy1, sz - .35), 'jn') +
      poly([P(-2.2, sy1, .1), P(-.6, sy1, .1), P(-.6, sy1, 2.6), P(-2.2, sy1, 2.6)], 'sdr') +
      poly([P(0, sy1, .1), P(L - .4, sy1, .1), P(L - .4, sy1, 2.6), P(0, sy1, 2.6)], 'sdr') +
      [.7, 1.3, 1.9].map(function (z) { return line(P(0, sy1, z), P(L - .4, sy1, z), 'jn'); }).join('') +
      poly([P(sx1, -5.3, 1.5), P(sx1, -3.1, 1.5), P(sx1, -3.1, 2.6), P(sx1, -5.3, 2.6)], 'sdr') + '</g>';
    /* 1-2: modelo em linhas; 2: medidas e aberturas */
    s += '<g class="e wire">' + wire('wf') + '</g>';
    s += '<g class="e ap">' + openings('wf') + '<g class="dm">' + dim(P(0, W + 1.1, 0), P(L, W + 1.1, 0), '4,8 m', 30) + dim(P(L + 1.1, 0, 0), P(L + 1.1, W, 0), '3,2 m', -30) + '</g></g>';
    s += '<g class="e tag1">' + tag(P(L, W / 2, H), 'Modelo + medida + uso', 40, -38) + '</g>';
    /* 3: fundação (6 sapatas), módulo fantasma e pontos de ligação */
    s += '<g class="e ghost">' + wire('wf g') + '</g>';
    xs.forEach(function (x) { ys.forEach(function (y) { fs.push([x, y]); }); });
    fs.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]); });
    s += '<g class="e utils">' + line(P(.6, W + 1.6, 0), P(.6, W - .2, 0), 'uw') + line(P(.6, W + 1.6, 0), P(-1.4, W + 1.6, 0), 'uw') + line(P(1.5, W + 1.6, 0), P(1.5, W - .2, 0), 'ue') + line(P(1.5, W + 1.6, 0), P(1.5, W + 2.4, 0), 'ue') + '<circle class="uc w" cx="' + P(.6, W - .2, 0)[0].toFixed(1) + '" cy="' + P(.6, W - .2, 0)[1].toFixed(1) + '" r="4.5"/><circle class="uc e2" cx="' + P(1.5, W - .2, 0)[0].toFixed(1) + '" cy="' + P(1.5, W - .2, 0)[1].toFixed(1) + '" r="4.5"/></g>';
    s += '<g class="e fund">' + fs.map(function (f) { return box3(f[0], f[1], 0, f[0] + .7, f[1] + .7, .3, 'fd'); }).join('') + '</g>';
    s += '<g class="e tag3">' + tag(P(L - .55, .7, .3), 'Sapatas ×6', 56, -46) + tag(P(-1.4, W + 1.6, 0), 'Água e esgoto', -34, 30) + tag(P(1.5, W + 2.4, 0), 'Elétrica', 52, 10) + '</g>';
    /* 4: peças de concreto se encaixando */
    s += '<g class="e pieces">' +
      '<g class="pp" style="' + offs(0, -1.8, 0) + '">' + box3(0, 0, t, L, t, H - t, 'cn') + '</g>' +
      '<g class="pp" style="' + offs(0, 0, 0) + '">' + box3(0, 0, 0, L, W, t, 'cn') + '</g>' +
      '<g class="pp" style="' + offs(0, 1.8, 0) + '">' + box3(0, W - t, t, L, W, H - t, 'cn') + '</g>' +
      '<g class="pp" style="' + offs(1.8, 0, 0) + '">' + box3(L - t, t, t, L, W - t, H - t, 'cn') + '</g>' +
      '<g class="pp" style="' + offs(0, 0, 2.4) + '">' + box3(0, 0, H - t, L, W, H, 'cn') + '</g></g>';
    s += '<g class="e tag4">' + tag(P(L / 2, sy1, sz), 'Fábrica · Criciúma/SC', 24, -34) + '</g>';
    /* 5: estrada + caminhão plataforma (cabine, chassi, carroceria, rodas, cintas) levando o módulo */
    var yb0 = W + 2.1, yb1 = yb0 + W, wy = yb1 + .1, st = '', m5 = module(-1.63, 1, yb0, true), pv = P(.1, yb0 + W / 2, 1);
    s += '<g class="e road">' + poly([P(-8, W + 1.8, 0), P(L + 5, W + 1.8, 0), P(L + 5, W + 5.8, 0), P(-8, W + 5.8, 0)], 'rd') +
      line(P(-8, W + 3.8, 0), P(L + 5, W + 3.8, 0), 'rdl') + line(P(-8, W + 2.05, 0), P(L + 5, W + 2.05, 0), 'rde') + line(P(-8, W + 5.55, 0), P(L + 5, W + 5.55, 0), 'rde') + '</g>';
    [-.7, 2.1].forEach(function (x) { st += '<polyline class="sp" points="' + [P(x, yb1 + .03, 1), P(x, yb1 + .03, 1 + H), P(x, yb0, 1 + H)].map(pt).join(' ') + '"/>'; });
    s += '<g class="e truck"><g transform="translate(26 12)">' +
      '<polygon points="' + [P(-2.7, yb0 + .1, 0), P(4.8, yb0 + .1, 0), P(4.8, yb1 + .5, 0), P(-2.7, yb1 + .5, 0)].map(pt).join(' ') + '" fill="rgba(20,26,32,.22)" stroke="none"/>' +   /* sombra no asfalto */
      box3(-2.5, yb0 + .25, .5, 4.4, yb1 - .25, .85, 'gr') +                         /* chassi */
      box3(-2.5, yb0, .85, 2.7, yb1, 1, 'bd') +                                       /* carroceria */
      '<g transform="translate(' + pv[0].toFixed(1) + ' ' + pv[1].toFixed(1) + ') scale(.88) translate(' + (-pv[0]).toFixed(1) + ' ' + (-pv[1]).toFixed(1) + ')">' + m5 + st + '</g>' +   /* módulo: vem antes da cabine */
      box3(2.85, yb0 + .1, .55, 4.35, yb1 - .1, 3.4, 'bl') +                          /* cabine cobre parte do módulo */
      fx(4.35, yb0 + .3, 2.05, yb1 - .3, 3.1, 'cg') + fx(4.35, yb0 + .7, .85, yb1 - .7, 1.6, 'gk') +
      fx(4.35, yb0 + .3, 1, yb0 + .65, 1.35, 'lp') + fx(4.35, yb1 - .65, 1, yb1 - .3, 1.35, 'lp') +
      fy(yb1 - .1, 3.1, 2.05, 4.15, 3.1, 'cg') + fy(yb1 - .1, 2.95, .8, 4.25, 3.25, 'dr') + line(P(3.2, yb1 - .1, 1.5), P(3.45, yb1 - .1, 1.5), 'cb2') +
      box3(4.35, yb0 + .1, .5, 4.62, yb1 - .1, .9, 'gr') + box3(4.1, yb1 - .1, 2, 4.28, yb1 + .2, 2.55, 'gr') +
      wheel(-1.8, wy, .6, .6, .4) + wheel(-.5, wy, .6, .6, .4) + wheel(3.55, wy, .6, .6, .4) + '</g></g>';
    s += '<g class="e tag5">' + tag((function (a) { return [a[0] + 26, a[1] + 12]; })(P(.6, yb1, 1 + H * .88)), 'A caminho do terreno', 100, -62) + '</g>';
    /* 6: guindaste de torre e módulo descendo sobre a fundação */
    var T = [6.4, -1.4], zj = 7.9, tip = [T[0] - 4.6, T[1] + 3.45, zj], ce = [7.8, -2.45, zj], ap = [T[0], T[1], 9.6], hk = P(L / 2, W / 2, 6.5), tp = [L / 2, W / 2, zj - .3];
    s += '<g class="e crane">' + box3(5.8, -1.8, 0, 7, -.8, .3, 'fd') + mast(6.1, -1.7, 6.7, -1.1, 7.6) + box3(5.95, -1.85, 7.6, 6.85, -.95, 7.9, 'gr') +
      box3(6.45, -1.25, 7.9, 6.85, -.95, 8.4, 'cr') + fy(-.95, 6.52, 8.02, 6.78, 8.3, 'cg') +
      truss([T[0], T[1], zj], tip, .5, 11, 'jc') + truss([T[0], T[1], zj], ce, .5, 3, 'jc') + box3(7.4, -2.65, 7.3, 7.95, -2.15, 7.9, 'gr') +
      L3(ap, [T[0], T[1], zj], 'cb') + L3(ap, lerp3([T[0], T[1], zj + .5], [tip[0], tip[1], zj + .5], .5), 'cb') + L3(ap, [tip[0], tip[1], zj + .5], 'cb') + L3(ap, [ce[0], ce[1], zj + .5], 'cb') +
      box3(L / 2 - .22, W / 2 - .22, zj - .3, L / 2 + .22, W / 2 + .22, zj, 'gr') + L3(tp, [L / 2, W / 2, 6.5], 'cb') + '</g>';
    var top = [P(0, 0, H + .3), P(L, 0, H + .3), P(L, W, H + .3), P(0, W, H + .3)];
    s += '<g class="e mod6">' + module(0, .3) + top.map(function (a) { return line(a, hk, 'cb'); }).join('') + '<circle class="hb" cx="' + hk[0].toFixed(1) + '" cy="' + hk[1].toFixed(1) + '" r="4.5"/></g>';
    s += '<g class="e tag6">' + tag(P(0, W, H + .3), 'Içado sobre a fundação', -70, -44) + '</g>';
    return s + '</svg>';
  }

  var titles = [].map.call(ls.children, function (li) { return li.querySelector('h3').textContent; });
  [].forEach.call(ls.children, function (li, i) { var h = li.querySelector('h3'), e = d.createElement('em'); e.className = 'who' + (i === 2 ? ' cli' : ''); e.textContent = WHO[i]; h.insertAdjacentElement('afterend', e); });
  box.innerHTML = '<div class="sh"><span class="sk"></span><strong class="sti"></strong></div><div class="bar"><i></i></div>' + art() +
    '<p class="sc" aria-live="polite"></p><ol class="sd">' +
    DOTS.map(function (n, i) { return '<li><button type="button" data-k="' + (i + 1) + '" aria-label="Ir para a etapa ' + (i + 1) + ': ' + titles[i] + '"><i>' + (i + 1) + '</i><span>' + n + '</span></button></li>'; }).join('') + '</ol>' +
    '<div class="nv"><button type="button" data-n="-1">← Anterior</button><button type="button" data-n="1">Próxima →</button></div>';
  var sd = box.querySelector('.sd'), parts = box.querySelectorAll('.e'), cur = 1;

  function go(k) {
    cur = k;
    [].forEach.call(ls.children, function (l) { l.classList.toggle('on', +l.dataset.i === k); l.classList.toggle('done', +l.dataset.i < k); });
    [].forEach.call(parts, function (g) { g.classList.toggle('on', SHOW[g.classList[1]].indexOf(k) > -1); });
    [].forEach.call(sd.querySelectorAll('button'), function (b, j) {
      b.classList.toggle('on', j + 1 === k); b.classList.toggle('done', j + 1 < k);
      b.firstChild.textContent = j + 1 < k ? '✓' : j + 1;
      if (j + 1 === k) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    sd.style.setProperty('--pg', (k - 1) / 5);
    box.querySelector('.bar i').style.width = (k / 6 * 100) + '%';
    box.querySelector('.sk').textContent = 'Etapa ' + k + ' de 6';
    box.querySelector('.sti').textContent = titles[k - 1];
    box.querySelector('.sc').textContent = CAP[k - 1];
    var nb = box.querySelectorAll('.nv button'); nb[0].disabled = k === 1; nb[1].disabled = k === 6;
  }
  go(1);
  function jump(k) { ls.children[k - 1].scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' }); }
  sd.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) jump(+b.dataset.k); });
  box.querySelector('.nv').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && !b.disabled) jump(Math.max(1, Math.min(6, cur + +b.dataset.n))); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) go(+e.target.dataset.i); }); }, { rootMargin: '-42% 0px -42% 0px' });
    [].forEach.call(ls.children, function (l) { io.observe(l); });
  } else go(6);
})();
