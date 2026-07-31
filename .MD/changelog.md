# Changelog

## 2026-07-31

- Remoção da seção de CTA de Reserva (`.cta-reservation` / `#reserva` com "Sua mesa está pronta para receber bons momentos") de [index.html](file:///g:/Meu%20Drive/.PROJETOS/Sites%20Institucionais/site-villa-plaza-restaurante/index.html) a pedido do usuário.
- Criação e integração da nova Seção Banner de Reserva próxima ao Rodapé (`.reserva-banner-rodape` / `#reserva-banner-rodape`), utilizando a foto de ambiente oficial `assets/ambiente/ambiente-interior-mezanino.webp` com overlay escuro refinado, tipografia idêntica ao design enviado pelo cliente:
  - Marca superior com linhas douradas (`── VILLA PLAZA ──`).
  - Título em 2 níveis ("Faça sua" em Cormorant Garamond itálico elegante e "RESERVA" em Montserrat negrito em caixa alta).
  - Tags de experiência centralizadas com delimitadores de ponto (`MESA • EXPERIÊNCIA • MOMENTOS ESPECIAIS`).
  - Divisor ornamental inferior com losango dourado central (`─── ◇ ───`).
  - Botão minimalista dourado retangular com borda fina (`FAÇA SUA RESERVA 📅`) e ícone de calendário.
  - Efeito hover com ligeiro zoom suave na foto de fundo e acionamento automático do modal de reservas ao clicar no banner ou no botão.

- Ajuste de dimensão da Seção 3 Showcase de Experiências (`.showcase-section`): altura expandida para a tela inteira (`height: 100vh; min-height: 100vh;` em todos os breakpoints), proporcionando imersão total em tela cheia para o carrossel de Almoço, Jantar, Happy Hour e Eventos.
- Reorganização do Header Desktop e Mobile: transferência dos ícones de redes sociais (Facebook, Instagram, WhatsApp) e do separador vertical `|` para a esquerda ao lado do link "Sobre" (`.header-left-side`). Unificação dos links "Contato" e "Localização" no lado direito em um único botão/link "CONTATO & LOCALIZAÇÃO" apontando diretamente para o rodapé (`#localizacao`).
- Atualização do fundo e altura da seção Cardápio (`.cardapio-split-section` em `#cardapio`): altura ajustada para `100vh` (`height: 100vh; min-height: 100vh;`) e integração da nova imagem de fundo personalizada fornecida pelo cliente (`cardapio-bg.jpg`), apresentando o emblema circular "VP" com efeito luminoso em vermelho vinho e dourado.
- Reestruturação total da seção "Momentos para Compartilhar" (`.villa-moments-section`) exatamente igual ao print de referência: uso exclusivo das fotografias oficiais do acervo do projeto (`assets/gastronomia/gastronomia-buffet-pratos-quentes.webp` para o buffet e `assets/experiencias/experiencia-chopp-heineken.webp` para a tiragem de chopp na torneira), fundo preto absoluto (`#000000`), divisão split 50/50 full bleed (sem margens). As 2 fotos oficiais na esquerda ocupam 25% + 25% da largura total da tela do topo ao fim da seção. Textos e ícones alinhados à direita com fundo preto, subtítulo dourado, título serifado/manuscrito em branco e dourado, 3 destaques operacionais com ícones dourados e botão com moldura dourada sutil.
- Remoção da sombra (`box-shadow`) do mapa e dos estados de hover no rodapé, garantindo um visual minimalista e clean.
- Redesign luxuoso e refinamento estético total da Seção CTA de Reserva no Rodapé (`.cta-reservation` / `#reserva`), inspirado no modelo de alta gastronomia: inclusão de ornamento Fleur-de-lis em gradiente dourado no topo, linhas com diamantes com título "Villa Plaza", hierarquia tipográfica serifada em dois níveis ("Sua mesa está" em Cormorant Garamond leve / "pronta para receber" em tamanho expandido com gradiente dourado metálico), divisor ornamental central com nó/laço barroco SVG, tipografia cursiva fluida em "bons momentos" (Google Fonts Alex Brush / Great Vibes / Pinyon Script), iluminação radial ambiente no fundo e botão de reserva premium com efeito de brilho e elevação em hover.
- Padronização rigorosa da Seção 2 Momentos para Compartilhar (`index.html` / `style.css`) idêntica ao Anexo 1:
  - Topo/Subtítulo (`.sobre-header-tag`): reestruturado em 2 linhas com `.sobre-sub` ("BUFFET, HAPPY HOUR") e `.sobre-brand` ("E ACOLHIMENTO").
  - Título Principal (`.villa-moments-title`): 3 linhas com equilíbrio sutil de destaques (somente `REFEIÇÕES` e `momentos` em dourado `#D3B97B`, enquanto `MUITO MAIS QUE` e `PARA COMPARTILHAR.` são mantidos em branco puro `#FFFFFF`).
  - Divisor Ornamental (`.sobre-divider-diamond`): incluído logo abaixo do título com linhas em gradiente dourado e diamante central (`◆`), mantendo paridade 100% exata com o Anexo 1.
  - Botão de Reserva (`.btn-villa-moments-reserve`): estado de hover ajustado para preenchimento em Vermelho Vinho Oficial (`#57101D`), texto em branco puro (`#FFFFFF`) e sombra difusa em vinho (`rgba(87, 16, 29, 0.6)`).
- Refinamento Tipográfico do Carrossel de Experiências (`.showcase-subtitle`): peso da fonte do subtítulo (`BUFFET VARIADO E CONTEMPORÂNEO`) reduzido de `700` (negrito espesso) para `400` (regular fino), conferindo um acabamento delicado e elegante.







- Ajuste e alinhamento estrito dos rótulos e títulos da galeria de destaques (`.vp-feature-grid-section`): substituição dos textos desalinhados para corresponder com precisão a 100% das imagens exibidas (`FEIJOADA TRADICIONAL`, `ISCAS & PETISCOS`, `PIZZAS ARTESANAIS`, `BUFFET COMPLETO` e `PORÇÕES & PETISCOS`).
- Substituição da imagem do mapa do rodapé (`assets/mapa-vila-plaza.png`) pelo novo design de mapa personalizado fornecido pelo cliente.
- Padronização estrita da cor Vermelho Vinho Oficial (`#57101D`) em 100% do site: substituição de todas as variações de vermelho, bordô, vinho escuro (`#3D0B14`, `#7A1428`, `#961B33`, `#701424`, `#4A0E17`, `#61131F`, `#2b060b`, `#230408`) e gradientes/sobreposições RGBA correspondentes para o tom oficial unificado `#57101D` (`rgba(87, 16, 29, ...)`).
- Ajuste fino da tipografia e cor do texto do Hero ("UM LUGAR PRA VOLTAR SEMPRE"): tamanho reduzido para `11px`, espaçamento entre letras ampliado para `0.5em` e cor definida para Dourado Champanhe `#F1D093`, sem sombra escura, obtendo um acabamento super delicado, minimalista e refinado.
- Aplicação do estilo Vermelho Vinho Oficial no botão do Header (`.btn-header-reserve`) com preenchimento em gradiente Vinho (`#7A1428` a `#57101D`), texto em Branco puro (`#FFFFFF`) e borda dourada sutil. Ícones sociais atualizados para a cor Creme (`#F1E6D5`) com brilho em Branco Puro (`#FFFFFF`) no hover.
- Aplicação da Seção 3 Showcase Carrossel de Experiências (`secao-cards-vp.html`) logo após a Seção 2 Sobre Nós em `index.html`, com estilo visual alinhado à referência (título serifado com linhas divisórias horizontais, subtítulo dourado rastreado, transição de imagens de fundo e navegação por setas semi-transparentes).
- Implementação de suporte completo a **Mouse Drag** (clicar e arrastar no Desktop com cursor `grab`/`grabbing`), **Touch Swipe** em dispositivos móveis e otimização responsiva para telas pequenas (`gap`, tamanhos de fonte e alinhamento).
- Remoção da seção temporária "Nossa Essência" (fundo vinho / foto à esquerda) de `index.html` a pedido do usuário.
- Correção do aninhamento de tags HTML, mantendo a estrutura 100% limpa, responsiva e vertical.

## 2026-07-30

- Reestruturação do Header centralizado com logo Villa Plaza no centro e menus divididos.
- Aplicação da nova logo `logo-villa-plaza-white.webp` no site inteiro (Header, Hero S1, Footer S9 e JSON-LD).
- Integração do vídeo oficial `hero-video-villa-plaza.mp4` e inclusão do slogan "UM LUGAR PRA VOLTAR SEMPRE" com ornamento de diamantes na seção Hero.
- Transformação da seção de Destaques (`.hero-highlights-strip`) em um **Marquee Infinito Horizontal Fluido**: animação CSS contínua (`@keyframes marqueeInfinite`) sem travamentos ou interrupções, expansão para 8 itens de experiência (Almoço, Jantar, Happy Hour, Atendimento, Carta de Vinhos, Gastronomia, Ambiente e Eventos), pausa inteligente ao passar o mouse, máscaras laterais com desfoque suave na cor Vinho `#57101D` e correção da cor dos ícones para Dourado `#D3B97B` garantindo 100% de visibilidade padrão (sem depender do hover).

## 2026-07-08

- Sincronização inicial automática e mapeamento da estrutura do projeto.
