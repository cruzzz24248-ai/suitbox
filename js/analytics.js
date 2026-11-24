(function () {
  function track(n, p) { if (window.gtag) gtag('event', n, p || {}); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (a && a.href.indexOf('wa.me') > -1) track('whatsapp_click', { link_text: (a.textContent || '').trim().slice(0, 40), page: location.pathname });
  });
  document.addEventListener('submit', function (e) { if (e.target.id === 'f') track('form_submit', { page: location.pathname }); });
  var used = false;
  document.addEventListener('input', function (e) { if (!used && /^r[123]$/.test(e.target.id)) { used = true; track('calculator_use'); } });
  if (!CFG.GA_ID) return;
  function load() {
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CFG.GA_ID; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', CFG.GA_ID, { anonymize_ip: true });
  }
  var v = null; try { v = localStorage.getItem('sb_consent'); } catch (x) {}
  if (v === 'yes') return load();
  if (v === 'no') return;
  var b = document.createElement('div'); b.className = 'consent';
  b.innerHTML = '<span>Usamos cookies de medição para entender como o site é utilizado.</span><button class="btn" id="cy">Aceitar</button><button class="btn l" id="cn">Recusar</button>';
  document.body.appendChild(b);
  function set(x) { try { localStorage.setItem('sb_consent', x); } catch (e) {} b.remove(); if (x === 'yes') load(); }
  document.getElementById('cy').onclick = function () { set('yes'); };
  document.getElementById('cn').onclick = function () { set('no'); };
})();
