# SuitBox – site institucional

Abra `index.html` (no Spck: Run / Live Preview).

## Páginas
- `index.html`: home com o configurador "Monte o seu módulo"
- `modelos.html`: catálogo com filtros e comparador (`#comparar`)
- `modelo-<slug>.html`: uma página por modelo (22)
- `investimento.html`: calculadora de rentabilidade
- `como-funciona.html`: etapas, guia do terreno (`#terreno`) e perguntas frequentes (`#faq`)
- `sobre.html`: a empresa, o módulo, garantias (`#garantias`) e esquadrias padrão
- `contato.html`: formulário (envia pelo WhatsApp)

## Estrutura
- `css/style.css`: sistema visual (cores, tipografia Archivo, componentes)
- `js/data.js`: catálogo de modelos e preços (**editar aqui**)
- `js/main.js`: catálogo, comparador, calculadora (com gráfico), seletor de tamanho dos modelos, formulário e menu
- `js/fx.js`: hero "Monte o seu módulo" (desenho isométrico + valores reais do catálogo)
- `js/ui.js`: acabamento geral (barra de leitura, cabeçalho ao rolar, entrada dos blocos, botão de topo, barra de preço do modelo no celular)
- `js/cena.js`: cena do módulo em Como funciona (desenho isométrico rico; muda a cada etapa ao rolar, com legenda, "quem faz", barra de progresso e botões Anterior/Próxima)
- `js/secoes.js`: seção de documentos (aparece só quando `CFG.DOCS` tem itens)
- `js/config.js`: WhatsApp, Instagram, GA4, vídeo da fábrica, depoimentos e documentos
- `img/models`, `img/guia`: fotos
- `ferramentas/build.py`: regenera cabeçalho/rodapé em todas as páginas, a home, modelos, como-funciona, sobre e as 22 páginas de modelo a partir de `js/data.js`.
  Depois de mudar `data.js`: `python3 ferramentas/build.py`

## Seções opcionais (aparecem só com conteúdo em `js/config.js`)
- `VIDEO_ID` (vídeo da fábrica) e `TESTIMONIALS` (depoimentos) e `IG_POSTS` (até 3 publicações do Instagram): aparecem na home, antes da chamada final.
- `DOCS`: documentos em A SuitBox > Garantias.
- `SITE` em `ferramentas/build.py`: com o endereço preenchido, o build também gera `sitemap.xml` e `robots.txt`.

## Pendências de conteúdo
- Documentos de garantia/certificados: `CFG.DOCS` em `js/config.js`. Enquanto estiver vazio, a seção não aparece.
- Fotos: os renders têm ~700 px de largura. Para banners em tela cheia, peça imagens em alta resolução.

WhatsApp: +55 48 9195-3531

## Intro, ícones e imagem de compartilhamento (OG)
- `css/intro.css` + `js/intro.js`: intro da home (~2,4 s, com botão "Pular", Esc ou clique). Aparece uma vez por sessão; use `index.html?intro` para rever. Não aparece com `prefers-reduced-motion` nem quando a URL tem `#seção`.
- `img/icons/`: favicon (SVG + PNG 16/32/48), `apple-touch-icon.png`, ícones do app (192/512/maskable) e `safari-pinned-tab.svg`. Na raiz: `favicon.ico` e `site.webmanifest`.
- `img/og/suitbox-og.jpg`: imagem 1200×630 para WhatsApp/Instagram/Facebook/Google.
- **Importante:** em `ferramentas/build.py` preencha `SITE = 'https://seu-dominio.com.br/'` e rode `python3 ferramentas/build.py`. O og:image precisa de URL absoluta; sem isso a imagem não aparece ao compartilhar.
- O `build.py` reinsere ícones, metas sociais e a intro em todas as páginas, então nada se perde ao regenerar.

## Barra inferior no celular (≤700 px)
- Abas fixas: Início, Modelos, Comparador, Investimento e Menu (abre o mesmo menu do cabeçalho). A aba ativa é marcada por `js/ui.js`.
- O botão redondo de WhatsApp é o único botão flutuante (fica acima das abas; some só no hero da home e nas páginas de modelo).
- Nas páginas de modelo a barra de preço fica acima das abas.
- Markup em `ferramentas/build.py` (`BAR`), estilos no fim de `css/tema.css`, comportamento no fim de `js/ui.js`.

## Ajustes de layout (fim de `css/tema.css`)
- Ritmo vertical das páginas internas (sem vão entre cabeçalho e título).
- No celular o hero da home ocupa a primeira tela inteira, acima da barra inferior (no desktop o hero continua como antes).
- No celular: cartões e números mais compactos (≤560 px).
