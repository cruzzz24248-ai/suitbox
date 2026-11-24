/* Intro SuitBox: planta com cotas que vira módulo. Sai sozinha em ~1,9 s; também sai com "Pular", toque/clique em qualquer parte, Esc, Enter ou Espaço. */
(function () {
  var d = document, h = d.documentElement, el = d.getElementById('intro');
  if (!el) return;
  if (!h.classList.contains('intro-on')) { el.parentNode.removeChild(el); return; }
  try { sessionStorage.setItem('sb-intro', '1'); } catch (e) {}
  var done = false, t = setTimeout(function () { end(false); }, 1900);
  function end(fast) {
    if (done) return; done = true; clearTimeout(t);
    if (fast) el.classList.add('fast');
    el.classList.add('out');
    h.classList.remove('intro-wait');           // libera a rolagem e o título do hero
    if (d.activeElement && d.activeElement.blur) d.activeElement.blur();
    setTimeout(function () { h.classList.remove('intro-on'); if (el.parentNode) el.parentNode.removeChild(el); }, fast ? 450 : 600);
  }
  var sk = el.querySelector('.i-skip');
  if (sk) { try { sk.focus({ preventScroll: true }); } catch (e) {} }
  el.addEventListener('click', function () { end(true); });
  d.addEventListener('keydown', function (e) { if (!done && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); end(true); } });
})();
