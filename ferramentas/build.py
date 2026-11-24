#!/usr/bin/env python3
"""Regenera o site a partir de js/data.js.  Uso:  python3 ferramentas/build.py
- cabeçalho/rodapé iguais em todas as páginas
- index, modelos, comparador e as 22 páginas modelo-*.html
- as demais páginas só recebem cabeçalho/rodapé novos (o conteúdo delas fica como está)."""
import re, json, glob, os, html
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
M = json.loads(re.search(r'var M=(\[.*?\]);', open('js/data.js', encoding='utf8').read(), re.S).group(1))
WA = 'https://wa.me/554891953531'
FONT = '<link rel="preload" href="fonts/archivo-var.woff" as="font" type="font/woff" crossorigin>'  # Archivo local (css/style.css tem o @font-face)
FAV = ''  # ícones e metas sociais são inseridos na passada final (ver o fim do arquivo)

NAV = [('index.html', 'Início', 'm'), ('modelos.html', 'Modelos', ''), ('investimento.html', 'Investimento', ''),
       ('como-funciona.html', 'Como funciona', ''), ('sobre.html', 'A SuitBox', ''), ('contato.html', 'Contato', '')]

# páginas que foram fundidas em outras; os links antigos são reescritos
REMOVED = ['projetos.html', 'acompanhamento.html', 'garantias.html', 'guia-do-terreno.html', 'faq.html', 'comparador.html']
REMAP = {'guia-do-terreno.html': 'como-funciona.html#terreno', 'faq.html': 'como-funciona.html#faq', 'garantias.html': 'sobre.html#garantias',
         'comparador.html': 'modelos.html#comparar', 'projetos.html': 'modelos.html', 'acompanhamento.html': 'como-funciona.html'}
def remap(t):
    for k, v in REMAP.items(): t = t.replace('href="%s"' % k, 'href="%s"' % v)
    return t
for f in REMOVED:
    if os.path.exists(f): os.remove(f)
if os.path.exists('js/projetos.js'): os.remove('js/projetos.js')

NF = ('<div class="nf"><a href="' + WA + '">WhatsApp +55 48 9195-3531</a><a href="https://instagram.com/suitboxbrasil" target="_blank" rel="noopener">Instagram @suitboxbrasil</a><span>Fábrica em Criciúma/SC</span></div>')

def header(active):
    links = ''.join('<a href="%s" class="%s%s"%s>%s</a>' % (h, c, ' on' if h == active else '', ' aria-current="page"' if h == active else '', t) for h, t, c in NAV)
    return ('<a class="skip" href="#main">Pular para o conteúdo</a><header><div class="w"><a href="index.html" class="logo" aria-label="SuitBox, início"><img src="img/logo/suitbox-logo.svg" alt="SuitBox" width="150" height="28"></a>'
            '<button id="mb" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav"><i></i><i></i><i></i></button>'
            '<nav id="nav">%s<a class="btn" href="%s">%s%s</a>%s</nav></div></header>' % (links, WA, WAI, 'Solicitar orçamento', NF))

WAI = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>'

# ---------- barra inferior (celular): abas de navegação ----------
TABS = [('index.html', 'Início', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.2 12 4l8 7.2V20h-5.2v-5.6H9.2V20H4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>'), ('modelos.html', 'Modelos', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 20 8v8l-8 4.5L4 16V8zM4 8l8 4.5L20 8M12 12.5v8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>'), ('modelos.html#comparar', 'Comparador', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h13M14.5 4.5 18 8l-3.5 3.5M19 16H6M9.5 12.5 6 16l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'), ('investimento.html', 'Investimento', '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.5" y="3.5" width="13" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 7.5h7M9 12h.01M12 12h.01M15 12h.01M9 15.5h.01M12 15.5h.01M15 15.5h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>')]
BAR = ('<div class="btm" id="btm" role="navigation" aria-label="Navegação rápida">' + ''.join('<a href="%s" data-t="%s">%s<span>%s</span></a>' % (h, h, i, t) for h, t, i in TABS) +
       '<button type="button" id="bmenu" aria-label="Abrir menu">' + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>' + '<span>Menu</span></button></div>')

FOOT = ('<a class="wa" href="%s" aria-label="Falar no WhatsApp">' + WAI + '<span>Falar no WhatsApp</span></a>'
        '<footer><div class="w fg"><div><div class="logo"><img src="img/logo/suitbox-logo-branco.svg" alt="SuitBox" width="200" height="37"></div><p style="margin-top:14px;max-width:22em">Construção modular em concreto.<br>Fábrica em Criciúma/SC.</p></div>'
        '<div><h4>Explorar</h4><a href="modelos.html">Modelos</a><a href="modelos.html#comparar">Comparar modelos</a><a href="investimento.html">Investimento</a></div>'
        '<div><h4>Confiança</h4><a href="sobre.html">A SuitBox</a><a href="sobre.html#garantias">Garantias</a><a href="como-funciona.html">Como funciona</a><a href="como-funciona.html#terreno">Guia do terreno</a><a href="como-funciona.html#faq">Perguntas frequentes</a></div>'
        '<div><h4>Contato</h4><a href="%s">WhatsApp +55 48 9195-3531</a><a href="https://instagram.com/suitboxbrasil" target="_blank" rel="noopener">Instagram @suitboxbrasil</a><a href="contato.html">Fale conosco</a></div></div>'
        '<div class="mark" aria-hidden="true">SuitBox</div><div class="w legal">© 2026 SuitBox Construção Modular. Todos os direitos reservados. As imagens são ilustrativas.</div></footer>') % (WA, WA) + BAR

SCRIPTS = '<script src="js/config.js"></script><script src="js/data.js"></script><script src="js/analytics.js"></script><script src="js/main.js"></script><script src="js/ui.js"></script>%s<script src="js/interacao.js"></script></body></html>'

def page(file, title, desc, main, active, body='', extra_js=''):
    t = html.escape(title)
    d = html.escape(desc, quote=True)
    out = ('<!DOCTYPE html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
           '<title>%s</title><meta name="description" content="%s"><meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:type" content="website">'
           '%s%s'
           '<link rel="stylesheet" href="css/style.css"><link rel="stylesheet" href="css/tema.css"></head>\n<body%s>\n%s\n<main id="main">%s</main>\n%s\n') % (t, d, t, d, FAV, FONT, ' class="%s"' % body if body else '', header(active), main, FOOT)
    open(file, 'w', encoding='utf8').write(remap(out + SCRIPTS % extra_js))

def money(s): return float(s.replace('.', '').replace(',', '.'))
def card(m, ov=False):
    f = m['s'][0]; a = ' e '.join(x[0] for x in m['s'])
    return ('<a class="pc%s" href="modelo-%s.html"><div class="ph2"><img src="img/models/%s.jpg" alt="%s" loading="lazy"><span class="tg">%s</span></div><div class="pi"><h3>%s</h3>'
            '<div class="pr2"><span>%s m²</span><span>a partir de <b>R$ %s</b></span></div></div></a>') % (' ov' if ov else '', m['slug'], m['slug'], m['n'], m['c'], m['n'], a, f[1])

# ---------- HOME ----------
home = '''<section class="hero"><div class="w hero-in"><div>
<h1>Espaços prontos, feitos em concreto.</h1>
<p class="lead">Módulos pré-fabricados em Criciúma/SC, instalados no seu terreno. Para hospedar, empreender ou morar.</p>
<div class="row"><a class="btn" href="modelos.html">Ver os 22 modelos</a><a class="btn o" href="#monte">Monte o seu módulo</a></div>
<p class="hero-note">Os módulos podem ser montados, desmontados e levados para outro terreno.</p></div>
<div class="show" id="show"><div class="show-f"><img src="img/models/locacao.jpg" alt="Projeto de locação modular com 8 módulos"></div></div></div></section>
<div class="facts"><div class="w"><div><b>Concreto fck 50 MPa</b><span>Painéis de concreto armado, aço CA-50</span></div><div><b>ABNT NBR 9062</b><span>Projeto conforme a norma de pré-moldados</span></div><div><b>Fábrica em Criciúma/SC</b><span>Produção em ambiente controlado</span></div><div><b>Montagem e desmontagem</b><span>Módulos relocáveis e ampliáveis</span></div></div></div>
<section class="conc cfg" id="monte"><div class="w two"><div><h2>Monte o seu módulo.</h2><p class="lead">Escolha o uso e a medida: o desenho muda e o valor aparece na hora, com os preços reais do catálogo.</p></div><div class="sheet"><div class="sheet-h"><b>Monte o seu módulo</b><div class="seg" id="use" role="group" aria-label="Uso"><button type="button" class="on" data-u="hosp">Hospedagem</button><button type="button" data-u="neg">Negócio</button><button type="button" data-u="res">Residência</button></div></div>
<div class="sheet-sz"><span>Medida</span><div class="seg" id="sz" role="group" aria-label="Medida"></div></div>
<div class="stage" id="stage"></div>
<div class="plate"><div><small>Área</small><b id="p-area"></b></div><div><small>Medidas</small><b id="p-med"></b></div><div class="pr"><small>A partir de, + frete</small><b id="p-pr"></b></div></div>
<div class="chips" id="chips"></div>
<div class="chips"><a class="btn wa-b" id="hq" href="%(wa)s" style="color:#fff;padding:12px 20px">Pedir orçamento desta medida</a><span id="p-w"></span></div></div></div></section>
<section><div class="w"><div class="head"><h2>22 modelos para hospedar, empreender e morar.</h2><a class="btn l" href="modelos.html">Ver todos os modelos</a></div><div class="bento" id="feat"></div></div></section>
<section class="dark"><div class="w"><h2>Fábrica em vez de canteiro.</h2><div class="vs">
<div class="r"><div></div><div>Obra convencional</div><div>SuitBox</div></div>
<div class="r"><div>Execução</div><div>No local, sujeita a variações</div><div>Em fábrica, em ambiente controlado</div></div>
<div class="r"><div>Mão de obra e prazo</div><div>Mais mão de obra e prazos longos</div><div>Menos mão de obra e orçamento mais previsível</div></div>
<div class="r"><div>Resíduos e entorno</div><div>Mais resíduos e transtornos no entorno</div><div>Menos resíduos e menor interferência no local</div></div>
<div class="r"><div>Estrutura</div><div>Fixa</div><div>Desmontável e relocável</div></div></div></div></section>
<section><div class="w two"><div><h2>Renda com pouca manutenção.</h2><p class="lead">Projeto de locação modular: 8 módulos de 23 m², 4 na base e 4 na parte superior, com escadas e corredores pré-moldados, formando várias unidades para alugar.</p><div class="row" style="margin-top:30px"><a class="btn" href="investimento.html">Calcular rentabilidade</a></div></div>
<div class="sheet"><img class="mimg" src="img/models/locacao.jpg" alt="Projeto de locação modular com 8 módulos" style="aspect-ratio:16/9">
<div class="plate" style="grid-template-columns:1fr 1fr"><div><small>Projeto completo</small><b>8 módulos de 23 m²</b></div><div class="pr"><small>Valor, + frete</small><b>R$ 660.000</b></div></div></div></div></section>
%%SCN%%
<section id="video" class="sx" hidden></section>
<section id="depo" class="sx" hidden></section>
<section id="insta" class="sx" hidden></section>
<section><div class="w"><div class="cta g"><div><h2>Conte o que você quer construir.</h2><p>Nossa equipe responde pelo WhatsApp com o modelo, a medida e o valor que combinam com o seu projeto.</p><div class="row"><a class="btn wa-b" href="%(wa)s">Falar no WhatsApp</a><a class="btn o" href="https://instagram.com/suitboxbrasil" target="_blank" rel="noopener">Ver o Instagram @suitboxbrasil</a></div></div><img src="img/models/piscina.jpg" alt="SuitBox Piscina" loading="lazy"></div></div></section>''' % {'wa': WA}

# ---------- MODELOS (com comparador) ----------
CTA = lambda t, p, flush=True: '<section%s><div class="w"><div class="cta"><h2>%s</h2><p>%s</p><div class="row"><a class="btn wa-b" href="%s">Falar no WhatsApp</a></div></div></div></section>' % (' style="padding-top:0"' if flush else '', t, p, WA)
page('modelos.html', 'Modelos | SuitBox', 'Catálogo SuitBox: 22 modelos de módulos de concreto para hospedagem, negócios e residências. Compare dois modelos lado a lado.',
     '<section><div class="w"><h1>Nossos modelos</h1><p class="lead" style="margin-top:18px">Hospedagem, negócios e residências, em módulos de 14,4 a 47 m². Valores sem frete e sem fundação.</p></div></section>'
     '<section><div class="w"><div style="display:flex;gap:16px;justify-content:space-between;flex-wrap:wrap;align-items:flex-start"><div class="tabs" id="tabs"><button class="on" data-c="">Todos</button><button data-c="Chalés e Hospedagem">Chalés e hospedagem</button><button data-c="Negócios">Negócios</button><button data-c="Residenciais">Residenciais</button></div><a class="btn o" href="#comparar">Comparar dois modelos</a></div><p class="count" id="cnt"></p><div class="grid" id="cat"></div></div></section>'
     '<section class="conc" id="comparar"><div class="w"><h2>Comparar modelos</h2><p class="lead" style="margin-bottom:30px">Escolha dois modelos e compare tamanhos, valores e itens inclusos.</p><div class="two" style="gap:28px"><label>Modelo A<select id="ca"></select></label><label>Modelo B<select id="cb"></select></label></div><br><div class="sc"><table id="ct"></table></div><br><a class="btn wa-b" href="%s">Pedir orçamento</a></div></section>' % WA, 'modelos.html')

# ---------- COMO FUNCIONA (processo + terreno + perguntas frequentes) ----------
faq = [('Quais modelos estão disponíveis?', 'Chalés e hospedagem, negócios e residenciais. Veja a página de <a href="modelos.html" style="color:var(--azul2);font-weight:600">Modelos</a>.'),
       ('Como é feito o transporte e a instalação?', 'Os módulos são fabricados em Criciúma/SC e transportados prontos até o local. O frete é cobrado à parte do valor do módulo. Prazos: consulte nossa equipe.'),
       ('Como preparar o terreno?', 'Fundação em 6 sapatas por módulo ou base maciça de no mínimo 10 cm com tela Q92, mais pontos hidrossanitários e elétricos. É responsabilidade do cliente e não está incluída no valor do módulo.'),
       ('Quais são as garantias e prazos?', 'Para prazos e condições de garantia do seu projeto, fale com nossa equipe pelo WhatsApp.'),
       ('Posso personalizar o módulo?', 'Sim. Pintura, pisos, divisórias internas e mobiliário são personalizáveis. Portas e janelas padrão acompanham o módulo e podem ser retiradas com desconto proporcional. As imagens do catálogo são ilustrativas. O módulo de 14,4 m² pode ser ampliado para 23 m² mesmo após a instalação.'),
       ('Os módulos podem ser mudados de lugar?', 'Sim. Nas construções 100% em módulos, eles podem ser desmontados e relocados. Em construções mistas, deixam de ser móveis e devem respeitar os limites de carga do projeto.')]
steps = [('Seleção do modelo', 'Escolha o módulo ideal para o seu projeto.'), ('Planejamento', 'Definição de personalização, prazos e condições.'),
         ('Preparação do terreno', 'Fundação e pontos de ligação, a cargo do cliente. <a href="#terreno" style="color:var(--azul2);font-weight:600">Ver o guia do terreno</a>.'),
         ('Fabricação', 'Produção em concreto na fábrica de Criciúma/SC.'), ('Transporte', 'Logística até o seu terreno.'), ('Instalação', 'Montagem eficiente e entrega do módulo.')]
page('como-funciona.html', 'Como funciona | SuitBox', 'Do pedido à instalação: as etapas, como preparar o terreno e as perguntas frequentes sobre os módulos SuitBox.',
     '<section><div class="w"><h1>Como funciona</h1><p class="lead" style="margin-top:18px">Fabricamos em Criciúma/SC e instalamos no seu terreno. Veja as etapas, o que preparar antes da entrega e as dúvidas mais comuns.</p></div></section>'
     '<section><div class="w"><div class="head"><h2>Do pedido à instalação</h2><p class="lead" style="max-width:24em">Seis etapas, da escolha do modelo à entrega. Role a página e veja o módulo ganhar forma.</p></div><div class="scn" id="scn"><div class="pscene" id="pscene"></div><ol class="sl">%s</ol></div></div></section>' % ''.join('<li data-i="%d"><b>0%d</b><div><h3>%s</h3><p class="mu">%s</p></div></li>' % (i + 1, i + 1, x[0], x[1]) for i, x in enumerate(steps)) +
     '<section class="conc" id="terreno"><div class="w"><h2>Preparando o terreno</h2><p class="lead" style="margin-bottom:44px">Os módulos chegam prontos de Criciúma/SC. Antes da instalação, o terreno precisa estar preparado com fundação e pontos de ligação.</p>'
     '<div class="two"><img class="mimg" src="img/guia/fundacoes.jpg" alt="Módulo sobre base com placas solares"><div><h3 style="font-size:28px;margin-bottom:6px">Fundações</h3><div class="steps"><div><b>Opção 1: sapatas</b><p class="mu">Construção de 6 sapatas de concreto para cada módulo.</p></div><div><b>Opção 2: base maciça</b><p class="mu">Base com no mínimo 10 cm de espessura e tela de aço Q92 ou superior.</p></div></div></div></div>'
     '<div style="margin-top:56px;max-width:46em"><h3 style="font-size:28px;margin-bottom:10px">Pontos de ligação</h3><p class="mu">Deixe prontos os pontos para as instalações hidrossanitárias e elétricas. É possível adicionar até 4 placas solares e 1 reservatório de água de 500 l.</p><p style="margin-top:14px"><b>Importante:</b> todas estas etapas ficam aos cuidados do cliente e não estão incluídas nos valores das unidades. Antes de instalar, consulte a prefeitura da sua cidade sobre as licenças e alvarás exigidos no local.</p></div></div></section>'
     '<section id="faq"><div class="w two" style="align-items:start"><div><h2>Perguntas frequentes</h2><p class="lead">Não achou o que procurava? Fale com a nossa equipe.</p></div><div>%s</div></div></section>' % ''.join('<details><summary>%s</summary><p>%s</p></details>' % x for x in faq) +
     CTA('Dúvidas sobre o seu terreno?', 'Fale com nossa equipe antes de iniciar a fundação.'), 'como-funciona.html', '', '<script src="js/cena.js"></script>')
SCN = '<section class="proc"><div class="w"><div class="head"><h2>Do pedido à instalação.</h2><p class="lead" style="max-width:24em">Seis etapas. Role e veja o módulo ganhar forma.</p></div><div class="scn" id="scn"><div class="pscene" id="pscene"></div><ol class="sl">%s</ol></div></div></section>' % ''.join('<li data-i="%d"><b>0%d</b><div><h3>%s</h3><p class="mu">%s</p></div></li>' % (i + 1, i + 1, x[0], x[1]) for i, x in enumerate(steps))
home = home.replace('%SCN%', SCN)
page('index.html', 'SuitBox | Construção Modular em Concreto', 'Módulos de concreto pré-fabricados para hospedagem, negócios e residências. Fábrica em Criciúma/SC. Escolha a medida e veja o valor.', home, 'index.html', 'home', '<script src="js/fx.js"></script><script src="js/cena.js"></script><script src="js/secoes.js"></script>')

# ---------- A SUITBOX (empresa + módulo + garantias) ----------
why = [('Execução rápida', 'Pré-montagem em fábrica, com prazos reduzidos e menos interrupções.'), ('Qualidade controlada', 'Rigorosos padrões de controle, sem as variações de uma obra no local.'),
       ('Sustentabilidade', 'Uso otimizado de recursos, menos resíduos e materiais recicláveis.'), ('Custo controlado', 'Menos mão de obra no local e mais previsibilidade no orçamento.'),
       ('Menor interferência', 'Menos movimentação de materiais e menos transtornos no entorno.'), ('Menos manutenção', 'Precisão na execução e materiais de alta qualidade.'),
       ('Maior resistência', 'Projetados para suportar grandes cargas e condições adversas.'), ('Possibilidade de locomoção', 'Podem ser desmontados e relocados para novos espaços.')]
gar = [('ABNT NBR 9062', 'Peças projetadas conforme a norma de projeto e execução de estruturas de concreto pré-moldado.'), ('Concreto fck 50 MPa', 'Painéis de concreto armado com resistência característica mínima de 50 MPa.'),
       ('Aço CA-50', 'Armadura em aço CA-50.'), ('Concreto impermeabilizado', 'Módulos de hospedagem entregues em concreto impermeabilizado.')]
esq = [('Janela de correr', '2 folhas, alumínio branco, 1,2 × 1 m'), ('Janela maxim-ar', 'Alumínio, 40 × 40 cm'), ('Porta de correr', 'Alumínio, 1,5 × 2,1 m'), ('Porta balcão', 'Alumínio branco, 2 × 2,1 m')]
cards = lambda l: '<div class="grid c4">%s</div>' % ''.join('<div class="card"><div class="b"><h3>%s</h3><p>%s</p></div></div>' % x for x in l)
page('sobre.html', 'A SuitBox | Construção modular em concreto', 'Fábrica em Criciúma/SC. Módulos pré-fabricados em concreto fck 50 MPa, conforme ABNT NBR 9062. Conheça a empresa, o módulo e as garantias.',
     '<section><div class="w"><h1>Uma nova forma de construir.</h1><p class="lead" style="margin-top:18px">Projeto iniciado em 2020 e empresa fundada em 2025. Fábrica em Criciúma/SC, com soluções pré-fabricadas em concreto. Todo o processo ocorre em ambiente controlado de fábrica antes do transporte dos módulos para o local da obra.</p></div></section>'
     '<section style="padding-bottom:0"><div class="w"><div class="feat" style="margin:0"><div><b>2020</b>Projeto iniciado</div><div><b>2025</b>Fundação</div><div><b>Criciúma/SC</b>Nossa fábrica</div><div><b>Concreto fck 50 MPa</b>Norma ABNT NBR 9062</div></div></div></section>'
     '<section><div class="w"><h2>Por que modular</h2>%s</div></section>' % cards(why) +
     '<section class="conc"><div class="w two"><img class="mimg" src="img/guia/modulos.jpg" alt="Peças do módulo de concreto" style="background:#fff"><div><h2>O módulo</h2><p class="mu">Cada módulo é composto por quatro ou cinco peças de concreto pré-moldado: 4,8 × 3,2 m (14,4 m², 12.000 kg) ou 7,2 × 3,2 m (23 m², 18.000 kg). O de 14,4 m² pode ser ampliado para 23 m² adicionando um módulo, mesmo após a instalação.</p><p class="mu" style="margin-top:14px">Painéis de concreto armado com fck mínimo de 50 MPa e aço CA-50. Acabamento liso ou texturizado. Conexões por insertos metálicos e chumbadores, que permitem montagem e desmontagem. Peças projetadas conforme a ABNT NBR 9062 (Projeto e Execução de Estruturas de Concreto Pré-Moldado).</p></div></div></section>'
     '<section id="garantias"><div class="w"><h2>Garantias e certificações</h2><p class="lead" style="margin-bottom:36px">Especificações técnicas informadas pela SuitBox para seus módulos.</p>%s<div id="docs" style="margin-top:24px"></div></div></section>' % cards(gar) +
     '<section class="conc"><div class="w"><h2>Esquadrias padrão</h2><p class="lead" style="margin-bottom:36px">Cada módulo vem com portas e janelas padrão. É possível retirá-las com desconto proporcional.</p>%s<p class="fine">Referência do catálogo. As imagens são ilustrativas e podem mostrar acabamentos que não fazem parte da entrega padrão.</p></div></section>' % cards(esq) +
     CTA('Quer conhecer o módulo de perto?', 'Fale com a nossa equipe e tire as suas dúvidas.', False), 'sobre.html', '', '<script src="js/secoes.js"></script>')

# ---------- INVESTIMENTO ----------
page('investimento.html', 'Investimento | SuitBox', 'Simule o investimento em módulos SuitBox e o faturamento estimado de locação. Projeto completo de 8 módulos por R$ 660.000 + frete.',
     '<section><div class="w"><h1>Investimento</h1><p class="lead" style="margin-top:18px">Escolha o modelo e o número de unidades, ajuste diária e ocupação e veja o valor dos módulos ao lado do faturamento estimado.</p></div></section>'
     '<section><div class="w"><div class="calcx"><div class="ci">'
     '<fieldset><legend>O seu investimento</legend><label for="im">Modelo e medida</label><select id="im"></select>'
     '<div class="rg"><label for="r1">Número de unidades</label><output id="o1" for="r1"></output></div><input type="range" id="r1" min="1" max="20" value="4"></fieldset>'
     '<fieldset><legend>A sua operação</legend><div class="rg" style="margin-top:0"><label for="r2">Diária média</label><output id="o2" for="r2"></output></div><input type="range" id="r2" min="100" max="1500" step="10" value="350">'
     '<div class="rg"><label for="r3">Ocupação média</label><output id="o3" for="r3"></output></div><input type="range" id="r3" min="10" max="100" value="60"></fieldset>'
     '<p class="fine">Cálculo ilustrativo, com 30 dias por mês. Não considera custos operacionais, impostos e manutenção. Valores a validar com a SuitBox.</p></div>'
     '<div class="out"><div><small>Investimento nos módulos</small><b id="inv"></b><span>Sem frete e sem fundação</span></div>'
     '<div><small>Faturamento mensal estimado</small><b id="m"></b></div><div><small>Faturamento anual estimado</small><b id="a"></b></div>'
     '<div><small>Faturamento bruto igual ao valor dos módulos em</small><b id="pay"></b><span>Estimativa bruta, antes de custos, impostos, frete e fundação</span></div>'
     '<div class="oq"><a class="btn wa-b iq" href="#">Pedir análise deste cenário</a></div></div>'
     '<div class="chart"><h3>Faturamento bruto acumulado</h3><p class="mu">Cada barra soma o faturamento estimado até aquele ano. Ela fica azul quando passa o valor dos módulos.</p><div id="ch"></div><div class="cq"><a class="btn wa-b iq" href="#">Pedir análise deste cenário</a></div></div></div></div></section>'
     '<section class="conc"><div class="w two"><div class="sheet"><img class="mimg" src="img/models/locacao.jpg" alt="Projeto de locação modular com 8 módulos" style="aspect-ratio:16/9">'
     '<div class="plate" style="grid-template-columns:1fr 1fr"><div><small>Projeto completo</small><b>8 módulos de 23 m²</b></div><div class="pr"><small>Valor, + frete</small><b>R$ 660.000</b></div></div></div>'
     '<div><h2>Projeto de locação modular</h2><p class="lead">4 módulos na base e 4 na parte superior, com escadas e corredores em pré-moldado, formando diversas unidades para alugar.</p><p class="mu" style="margin-top:14px">Módulos móveis, expansíveis e de baixa manutenção.</p><div class="row" style="margin-top:28px"><a class="btn wa-b" href="%s?text=Ol%%C3%%A1!%%20Quero%%20saber%%20mais%%20sobre%%20o%%20projeto%%20de%%20loca%%C3%%A7%%C3%%A3o%%20modular.">Pedir orçamento do projeto</a></div></div></div></section>' % WA +
     CTA('Quer avaliar o seu projeto de locação?', 'Fale com a nossa equipe e veja qual combinação de módulos faz sentido para o seu terreno.', False), 'investimento.html')

# ---------- CONTATO ----------
page('contato.html', 'Contato | SuitBox', 'Fale com a SuitBox pelo WhatsApp +55 48 9195-3531. Fábrica em Criciúma/SC.',
     '<section><div class="w"><h1>Vamos construir o seu projeto?</h1><p class="lead" style="margin-top:18px">Conte o que você tem em mente e a nossa equipe responde pelo WhatsApp.</p></div></section>'
     '<section><div class="w two" style="align-items:start;gap:56px"><div><a class="btn wa-b" href="%s" style="margin-bottom:34px">Chamar no WhatsApp</a>'
     '<dl class="info"><div><dt>WhatsApp</dt><dd><a href="%s">+55 48 9195-3531</a></dd></div><div><dt>Instagram</dt><dd><a href="https://instagram.com/suitboxbrasil" target="_blank" rel="noopener">@suitboxbrasil</a></dd></div><div><dt>Fábrica</dt><dd>Criciúma/SC</dd></div></dl></div>'
     '<form id="f" class="sheet" style="padding:32px"><label>Nome<input required autocomplete="name"></label><label>E-mail<input type="email" required autocomplete="email"></label><label>Mensagem<textarea rows="5" placeholder="Qual modelo, medida e cidade do terreno?"></textarea></label>'
     '<button class="btn wa-b" type="submit">Enviar pelo WhatsApp</button><p class="fine">Ao enviar, abrimos o WhatsApp com a sua mensagem pronta.</p></form></div></section>' % (WA, WA), 'contato.html')

# ---------- MODELO (mantém as seções do meio de cada página) ----------
for i, m in enumerate(M):
    f = 'modelo-%s.html' % m['slug']
    old = open(f, encoding='utf8').read() if os.path.exists(f) else ''
    mm = re.search(r'<main>(.*)</main>', old, re.S)
    mid = ''
    if mm:
        parts = mm.group(1).split('</section>')
        keep = [p for p in parts[1:-1] if 'Outros modelos' not in p and p.strip()]
        mid = ''.join(p + '</section>' for p in keep)
    same = [x for x in M if x['c'] == m['c'] and x is not m]
    k = [x for x in same if M.index(x) > i] + [x for x in same if M.index(x) < i]
    others = ''.join(card(x) for x in k[:3])
    sz = ''.join('<button type="button">%s m²</button>' % s[0] for s in m['s'])
    hero = ('<section><div class="w"><p class="crumb"><a href="modelos.html">Modelos</a> / %s</p><div class="mh"><div class="fr"><img src="img/models/%s.jpg" alt="%s"></div><div>'
            '<h1>%s</h1><p class="lead" style="font-size:18px">%s</p><div class="pbox"><div class="seg" id="msz" data-n="%s" data-s=\'%s\'%s>%s</div>'
            '<div class="pv"><small>A partir de</small><b id="mp"></b><span>+ frete</span></div>'
            '<dl class="specs"><div><dt>Área</dt><dd id="ma"></dd></div><div><dt>Medidas</dt><dd id="mm"></dd></div><div><dt>Peso</dt><dd id="mw"></dd></div><div><dt>Linha</dt><dd>%s</dd></div></dl></div>'
            '<div class="row"><a class="btn wa-b" id="mq" href="%s">Pedir orçamento</a><a class="btn l" href="modelos.html?a=__S__#comparar">Comparar modelos</a></div>'
            '<p class="fine">Valores sem frete e sem fundação. Imagens ilustrativas.</p></div></div></div></section>') % (
        m['c'], m['slug'], m['n'], m['n'], m['d'], m['n'], json.dumps(m['s'], ensure_ascii=False), '' if len(m['s']) > 1 else ' hidden', sz, m['c'], WA)
    hero = hero.replace('__S__', m['slug'])
    mbar = '<div class="mbar" id="mbar"><div><small>A partir de</small><b id="mbp"></b></div><a class="btn wa-b" id="mq2" href="%s">Pedir orçamento</a></div>' % WA
    more = '<section class="conc"><div class="w"><h2>Outros modelos</h2><div class="grid">%s</div></div></section>' % others
    page(f, '%s | SuitBox' % m['n'], m['d'], hero + mid + more + mbar, 'modelos.html', 'modelo')

# ---------- demais páginas: só cabeçalho, rodapé e fonte ----------
done = {'index.html', 'modelos.html', 'como-funciona.html', 'sobre.html', 'investimento.html', 'contato.html'} | {'modelo-%s.html' % m['slug'] for m in M}
for f in glob.glob('*.html'):
    if f in done: continue
    s = open(f, encoding='utf8').read()
    s = re.sub(r'<header>.*?</header>', lambda _: header(f), s, flags=re.S)
    s = re.sub(r'<a class="wa"[^>]*>.*?</a>\s*<footer>.*?</footer>', lambda _: FOOT, s, flags=re.S)
    s = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2[^>]*>', FONT, s)
    s = s.replace('[Garantias, certificações e prazos: a confirmar com a SuitBox.]', 'Para prazos e condições de garantia do seu projeto, fale com nossa equipe pelo WhatsApp.')
    s = s.replace('<script>document.documentElement.className="js"</script>', '')
    open(f, 'w', encoding='utf8').write(remap(s))
# ---------- ícones, imagem de compartilhamento (OG) e intro da home ----------
# SITE: endereço final do site, com barra no fim (ex.: 'https://www.suitbox.com.br/').
# O WhatsApp, o Instagram e o Facebook só leem og:image com URL ABSOLUTA: enquanto SITE estiver vazio, a imagem não aparece ao compartilhar.
SITE = 'https://suitbox.vercel.app/'
OLDFAV = '<link rel="icon" type="image/svg+xml" href="img/logo/suitbox-icone.svg"><link rel="apple-touch-icon" href="img/logo/favicon-192.png">'
ICONS = ('<link rel="icon" href="favicon.ico" sizes="48x48"><link rel="icon" type="image/svg+xml" href="img/icons/favicon.svg">'
         '<link rel="icon" type="image/png" sizes="32x32" href="img/icons/favicon-32.png"><link rel="icon" type="image/png" sizes="16x16" href="img/icons/favicon-16.png">'
         '<link rel="apple-touch-icon" sizes="180x180" href="img/icons/apple-touch-icon.png"><link rel="mask-icon" href="img/icons/safari-pinned-tab.svg" color="#1456d1">'
         '<link rel="manifest" href="site.webmanifest"><meta name="theme-color" content="#f3f7fc"><meta name="application-name" content="SuitBox"><meta name="apple-mobile-web-app-title" content="SuitBox">')
OG_IMG = 'img/og/suitbox-og.jpg'
OG_ALT = 'SuitBox: espaços prontos, feitos em concreto. Módulos pré-fabricados em Criciúma/SC.'
INTRO_HEAD = ('<link rel="stylesheet" href="css/intro.css"><script>(function(){try{var h=document.documentElement;'
              'if(location.search.indexOf("intro")<0&&(sessionStorage.getItem("sb-intro")||location.hash||matchMedia("(prefers-reduced-motion:reduce)").matches))return;'
              'h.classList.add("intro-on","intro-wait");setTimeout(function(){h.classList.remove("intro-on","intro-wait")},5200)}catch(e){}})()</script>')
def intro_svg():
    """Desenho da intro: o mesmo módulo do hero (js/fx.js: isometria, cores, esquadrias, cotas, plantas), 3,2 x 4,8 m,
    que nasce como planta com cotas e se levanta painel a painel. Mantenha as cores iguais às de js/fx.js."""
    C, S, k = 0.866025, 0.5, 30
    L, W, H = 4.8, 3.2, 3.0
    ox, oy = 0.0, 0.0
    def P(x, y, z): return (ox + (x - y) * C * k, oy + (x + y) * S * k - z * k)
    def pts(*a): return ' '.join('%.1f,%.1f' % p for p in a)
    def poly(pp, a=''): return '<polygon points="%s" %s/>' % (pts(*pp), a)
    def line(a, b, e=''): return '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" %s/>' % (a[0], a[1], b[0], b[1], e)
    # --- geometria (igual ao hero) ---
    top = [P(0, 0, H), P(L, 0, H), P(L, W, H), P(0, W, H)]
    floor = [P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0)]
    fw, hw = L / 2, W / 2
    lf = [[P(i * fw, W, 0), P((i + 1) * fw, W, 0), P((i + 1) * fw, W, H), P(i * fw, W, H)] for i in range(2)]
    en = [[P(L, i * hw, 0), P(L, (i + 1) * hw, 0), P(L, (i + 1) * hw, H), P(L, i * hw, H)] for i in range(2)]
    door = [P(.5, W, .05), P(2.3, W, .05), P(2.3, W, 2.25), P(.5, W, 2.25)]
    ew = [P(L, .9, .9), P(L, 2.3, .9), P(L, 2.3, 2.05), P(L, .9, 2.05)]
    sh = [P(0, W, 0), P(L, W, 0), P(L + 1.6, W + 1.3, 0), P(1.6, W + 1.3, 0)]
    roof = [P(.12, .12, H), P(L - .12, .12, H), P(L - .12, W - .12, H), P(.12, W - .12, H)]
    step = [P(.4, W, 0), P(2.4, W, 0), P(2.4, W + .55, 0), P(.4, W + .55, 0)]
    joints = ''
    xj = 1.6
    while xj < L - .2:
        joints += line(P(xj, W, 0), P(xj, W, H)); xj += 1.6
    joints += line(P(0, W, H - .32), P(L, W, H - .32)) + line(P(L, 0, H - .32), P(L, W, H - .32)) + line(P(L, W / 2, 0), P(L, W / 2, H - .32))
    def plant(x, y):
        p = P(x, y, 0)
        return ('<ellipse cx="%.1f" cy="%.1f" rx="14" ry="5" fill="rgba(30,36,41,.12)"/><circle cx="%.1f" cy="%.1f" r="9" fill="#7cb87a"/>'
                '<circle cx="%.1f" cy="%.1f" r="8" fill="#5fa05e"/>') % (p[0], p[1] + 2, p[0] - 4, p[1] - 8, p[0] + 5, p[1] - 12)
    o = 1.1
    a1, a2, b1, b2 = P(0, W + o, 0), P(L, W + o, 0), P(L + o, 0, 0), P(L + o, W, 0)
    def dim(p, q, t, ang):
        mx, my = (p[0] + q[0]) / 2, (p[1] + q[1]) / 2
        return ('<g stroke="#55647f" stroke-width="1">' + line(p, q) + line((p[0] - 4, p[1] - 4), (p[0] + 4, p[1] + 4)) + line((q[0] - 4, q[1] - 4), (q[0] + 4, q[1] + 4)) + '</g>'
                '<text x="%.1f" y="%.1f" transform="rotate(%d %.1f %.1f)" text-anchor="middle" font-size="13" font-weight="600" fill="#0a1b3d" font-family="Archivo,Arial,sans-serif">%s</text>'
                % (mx, my + 18, ang, mx, my + 18, t))
    # --- enquadramento ---
    xs = [p[0] for p in top + floor + sh + [a1, a2, b1, b2, P(-1.2, W + .9, 0), P(L + 1.1, -.6, 0)]]
    ys = [p[1] for p in top + floor + sh + [a1, a2, b1, b2]] + [P(-1.2, W + .9, 0)[1] - 24, P(L + 1.1, -.6, 0)[1] - 24, a1[1] + 26, a2[1] + 26]
    x0, x1, y0, y1 = min(xs) - 22, max(xs) + 22, min(ys) - 10, max(ys) + 6
    vb = '%.0f %.0f %.0f %.0f' % (x0, y0, x1 - x0, y1 - y0)
    fr = 'fill="url(#igl)" stroke="#b5804a" stroke-width="3"'
    J = 'stroke="#1e2429" stroke-opacity=".5" stroke-width="1" stroke-linejoin="round"'
    def panel(cls, pp, color):
        return ('<g class="pn %s">' % cls + poly(pp, 'fill="%s"' % color) + poly(pp, 'fill="#000" filter="url(#icn)"') + poly(pp, 'fill="none" ' + J) + '</g>')
    s = ['<svg class="i-mod" viewBox="%s" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' % vb]
    s.append('<defs><linearGradient id="igl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd9a3"/><stop offset="1" stop-color="#f2a65a"/></linearGradient>'
             '<filter id="ibl"><feGaussianBlur stdDeviation="6"/></filter>'
             '<filter id="icn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2"/>'
             '<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .3 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>')
    # 1) planta: contorno azul que se desenha + cotas (as cotas ficam, como no hero)
    s.append('<g class="p-sh">' + poly(sh, 'fill="rgba(10,27,61,.22)" filter="url(#ibl)"') + '</g>')
    s.append('<g class="p-plan"><polygon class="p-fill" points="%s"/><path class="p-line" pathLength="1" d="M%sZ"/></g>' % (pts(*floor), ' L'.join('%.1f,%.1f' % p for p in floor)))
    s.append('<g class="p-cota">' + dim(a1, a2, '4,8 m', 30) + dim(b1, b2, '3,2 m', -30) + '</g>')
    # 2) painéis de concreto (cores do hero: frente #a9c3e8, lateral #7c9fd2) sobem um a um
    s.append(panel('f1', lf[0], '#a9c3e8') + panel('f2', lf[1], '#a9c3e8') + panel('e1', en[0], '#7c9fd2') + panel('e2', en[1], '#7c9fd2'))
    s.append('<g class="p-jn" stroke="#1e2429" stroke-opacity=".22" stroke-width="1">' + joints + '</g>')
    # 3) laje de cobertura desce, depois porta/janelas, degrau e plantas
    s.append('<g class="p-roof">' + poly(top, 'fill="#f6faff" ' + J) + poly(roof, 'fill="#eef3fa" stroke="#1e2429" stroke-opacity=".3"') + '</g>')
    s.append('<g class="p-step">' + poly(step, 'fill="#c9d3e3" stroke="#1e2429" stroke-opacity=".3"') + '</g>')
    s.append('<g class="p-det">' + poly(door, fr) + poly(ew, fr)
             + '<circle cx="%.1f" cy="%.1f" r="2.6" fill="#1e2429"/>' % P(2.0, W, 1.15)
             + '<g stroke="#b5804a" stroke-width="2">' + line(P(1.4, W, .2), P(1.4, W, 2.1)) + line(P(.5, W, 1.2), P(2.3, W, 1.2))
             + line(P(L, 1.6, .95), P(L, 1.6, 2.0)) + '</g></g>')
    s.append('<g class="p-pl">' + plant(-1.2, W + .9) + plant(L + 1.1, -.6) + '</g>')
    s.append('</svg>')
    return ''.join(s)

INTRO = ('<!--sb-intro--><div id="intro" role="dialog" aria-modal="true" aria-label="Abertura SuitBox"><button type="button" class="i-skip">Pular</button><div class="i-in">'
         + intro_svg() +
         '<img class="i-logo" src="img/logo/suitbox-logo.svg" alt="SuitBox" width="250" height="48"><p class="i-tag">Fabricado em Criciúma. Instalado no seu terreno.</p></div>'
         '</div><!--/sb-intro-->')

def headx(f, s):
    t = re.search(r'<title>(.*?)</title>', s, re.S).group(1)
    d = re.search(r'<meta name="description" content="(.*?)">', s, re.S).group(1)
    url = SITE + ('' if f == 'index.html' else f)
    soc = ('<meta property="og:site_name" content="SuitBox"><meta property="og:locale" content="pt_BR">'
           + ('<meta property="og:url" content="%s">' % url if SITE else '')
           + '<meta property="og:image" content="%s%s"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="%s">' % (SITE, OG_IMG, OG_ALT)
           + '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="%s"><meta name="twitter:description" content="%s"><meta name="twitter:image" content="%s%s">' % (t, d, SITE, OG_IMG))
    return '<!--sb-head-->' + ICONS + soc + (INTRO_HEAD if f == 'index.html' else '') + '<!--/sb-head-->'

for f in glob.glob('*.html'):
    s = open(f, encoding='utf8').read()
    s = re.sub(r'<!--sb-head-->.*?<!--/sb-head-->', '', s, flags=re.S).replace(OLDFAV, '')
    s = s.replace(FONT, headx(f, s) + FONT, 1)
    if f == 'index.html':
        s = re.sub(r'<!--sb-intro-->.*?<!--/sb-intro-->', '', s, flags=re.S)
        s = s.replace('<body class="home">\n', '<body class="home">\n' + INTRO + '\n', 1)
        s = s.replace('<script src="js/intro.js"></script>', '')
        s = s.replace('<script src="js/config.js"></script>', '<script src="js/intro.js"></script><script src="js/config.js"></script>', 1)
    open(f, 'w', encoding='utf8').write(s)

open('site.webmanifest', 'w', encoding='utf8').write(json.dumps({
    'name': 'SuitBox | Construção Modular em Concreto', 'short_name': 'SuitBox', 'lang': 'pt-BR',
    'description': 'Módulos de concreto pré-fabricados para hospedagem, negócios e residências. Fábrica em Criciúma/SC.',
    'start_url': 'index.html', 'scope': './', 'display': 'standalone', 'background_color': '#06193f', 'theme_color': '#f3f7fc',
    'icons': [{'src': 'img/icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
              {'src': 'img/icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
              {'src': 'img/icons/icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}]},
    ensure_ascii=False, indent=2))

if SITE:
    pgs = sorted(glob.glob('*.html'))
    open('sitemap.xml', 'w', encoding='utf8').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join('<url><loc>%s%s</loc></url>\n' % (SITE, '' if f == 'index.html' else f) for f in pgs) + '</urlset>\n')
    open('robots.txt', 'w', encoding='utf8').write('User-agent: *\nAllow: /\nSitemap: %ssitemap.xml\n' % SITE)
print('ok', len(glob.glob('*.html')), 'páginas')
