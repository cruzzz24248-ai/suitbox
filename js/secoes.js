/* Seções opcionais: só aparecem quando há conteúdo em js/config.js (DOCS, VIDEO_ID, TESTIMONIALS, IG_POSTS). */
(function () {
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function show(id, html) { var e = document.getElementById(id); if (!e) return null; e.innerHTML = html; e.hidden = false; return e; }

  var d = document.getElementById('docs');
  if (d && CFG.DOCS.length) {
    d.innerHTML = '<h3 style="margin-bottom:16px">Documentos</h3><div class="grid">' + CFG.DOCS.map(function (x) { return '<a class="card" href="' + esc(x.url) + '"><div class="b"><h3>' + esc(x.titulo) + '</h3><p>Baixar documento</p></div></a>'; }).join('') + '</div>';
  }

  /* Vídeo da fábrica: só carrega o YouTube quando a pessoa clica (mais rápido e sem cookies antes). */
  if (CFG.VIDEO_ID) {
    var v = show('video', '<div class="w two"><div><h2>Conheça a fábrica.</h2><p class="lead">Veja como os módulos são produzidos em Criciúma/SC.</p></div>' +
      '<button type="button" class="vid" id="vbtn" aria-label="Reproduzir o vídeo da fábrica"><img src="https://i.ytimg.com/vi/' + esc(CFG.VIDEO_ID) + '/hqdefault.jpg" alt="" loading="lazy"><span class="vp" aria-hidden="true"></span></button></div>');
    if (v) document.getElementById('vbtn').onclick = function () {
      this.outerHTML = '<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(CFG.VIDEO_ID) + '?autoplay=1&rel=0" title="Vídeo da fábrica SuitBox" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>';
      if (window.gtag) gtag('event', 'video_play', { page: location.pathname });
    };
  }

  if (CFG.TESTIMONIALS.length) {
    show('depo', '<div class="w"><div class="head"><h2>Quem já tem uma SuitBox.</h2></div><div class="grid">' + CFG.TESTIMONIALS.map(function (t) {
      return '<figure class="card dep"><div class="b"><blockquote>' + esc(t.texto) + '</blockquote><figcaption><b>' + esc(t.nome) + '</b>' +
        [t.cidade, t.modelo].filter(Boolean).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</figcaption></div></figure>';
    }).join('') + '</div></div>');
  }

  /* Instagram: coloque em CFG.IG_POSTS os códigos das publicações (ex.: 'C8abcDEfGhi', o trecho depois de /p/). */
  if (CFG.IG_POSTS && CFG.IG_POSTS.length) {
    show('insta', '<div class="w"><div class="head"><h2>No Instagram.</h2><a class="btn o" href="' + esc(CFG.IG) + '" target="_blank" rel="noopener">@suitboxbrasil</a></div><div class="igs">' +
      CFG.IG_POSTS.slice(0, 3).map(function (c) { return '<iframe src="https://www.instagram.com/p/' + esc(c) + '/embed" title="Publicação do Instagram" loading="lazy" scrolling="no"></iframe>'; }).join('') + '</div></div>');
  }
})();
