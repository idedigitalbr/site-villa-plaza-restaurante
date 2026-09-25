# Changelog

## 2026-09-25

- **Ajuste na Seção de Experiências (Almoço)**:
  - Atualizada a imagem de fundo do slide de Almoço (`#experiencia`, slide `data-index="0"`) de `assets/gastronomia/buffet-churrasco-v0.webp` para a imagem oficial do buffet de saladas `assets/gastronomia/gastronomia-buffet-saladas.webp`.
  - Preservado o overlay com gradiente suave (`linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55))`) garantindo legibilidade perfeita da tipografia e ornamentos dourados.

- **Atualização dos Horários no Rodapé Oficial**:
  - Horário de funcionamento corrigido nas páginas `index.html` e `termos-e-privacidade.html` para:
    - **Segunda à sábado**: `12h às 15h / 19h às 23h`.
    - Removido bloco obsoleto de Domingo.
  - Sincronizado o Schema.org (`openingHoursSpecification` JSON-LD) em `index.html`.
  - Suíte de testes automatizados expandida (`tests/footer-and-legal.test.mjs`) com 21/21 testes aprovados.

## 2026-09-04

- **Roteamento e Apontamento para o Domínio Oficial (`villaplaza.com.br` e `www.villaplaza.com.br`)**:
  - Atualizada a regra de roteamento do Traefik no `docker-compose.yml` para incluir `Host(\`villaplaza.suporteide.digital\`) || Host(\`villaplaza.com.br\`) || Host(\`www.villaplaza.com.br\`)`.
  - Habilitada emissão e renovação automática de certificado SSL Let's Encrypt para os novos domínios no proxy reverso Traefik.
  - Validação de conectividade DNS via Cloudflare e deploy automatizado na VPS.

- **Alinhamento e Diagramação Visual Fiel do Rodapé Principal (5 Colunas)**:
  - **Equalização da Linha de Base dos Títulos (Baselines)**:
    - Equalizada a coordenada vertical inicial dos títulos das colunas 2 (`LOCALIZAÇÃO`), 4 (`HORÁRIO DE FUNCIONAMENTO`) e 5 (`FALE CONOSCO`), garantindo linha de base perfeitamente nivelada no topo.
  - **Fidelidade Estrita ao Modelo Visual de Referência (`media_1788545863614.png`)**:
    - Removidos os ornamentos estelares residuais (`.footer-title-star`) das colunas 4 e 5, preservando o ornamento estelar exclusivamente nas colunas 1 (sob o logotipo) e 2 (sob `LOCALIZAÇÃO`).
    - **Coluna 5 ("FALE CONOSCO")**: Reestruturada para posicionar o ícone em contorno dourado (`.footer-whatsapp-icon-gold`) e o número de contato `(91) 9215-9505` (`.footer-whatsapp-number`) lado a lado na mesma linha horizontal via flexbox (`gap: 0.75rem`), seguido do botão pill-shaped (`border-radius: 50px`) `CHAMAR NO WHATSAPP`.
    - **Coluna 4 ("HORÁRIO DE FUNCIONAMENTO")**: Centralização rigorosa de todos os blocos de horário e dias (`Segunda a Sábado` e `Domingo`), removendo recuos laterais assimétricos.
    - **Coluna 3 (Mapa)**: Moldura com cantos arredondados (`border-radius: 12px`), borda dourada elegante (`rgba(211, 185, 123, 0.35)`) e centralização geométrica perfeita.
    - **Unificação e Limpeza de CSS**: Eliminado bloco legado duplicado em `style.css` que sobrescrevia propriedades das colunas e da barra inferior.
    - Sincronização espelhada em `index.html` e `termos-e-privacidade.html`.
    - 19/19 testes automatizados aprovados com sucesso (`node --test tests/*.test.mjs`).


  - Atualizada a barra inferior do rodapé (`.footer-bottom`) em padrão tripartido com centralização exata via CSS Grid (`grid-template-columns: 1fr auto 1fr`):
    - **Esquerda**: `Copyright © 2026 Villa Plaza Restaurante – Todos os direitos reservados` em cor preta (`#000000`).
    - **Centro**: Link `Termos & Privacidade` perfeitamente centralizado no eixo horizontal da página em cor preta (`#000000`), direcionando para `termos-e-privacidade.html`.
    - **Direita**: Créditos da agência `Desenvolvido por:` em cor preta (`#000000`) acompanhado da logomarca oficial da **IDE Digital** (`assets/logos/logo-idedigital.png`) preta com fundo transparente.
  - Fundo branco limpo (`#FFFFFF`) com divisor sutil, tipografia preta uniforme e responsividade com empilhamento limpo em dispositivos móveis.
  - **Criação da Página Oficial de Termos de Uso & Política de Privacidade (`termos-e-privacidade.html`)**:
    - Cabeçalho institucional e rodapé idênticos ao site oficial.
    - Seção de Política de Privacidade em total conformidade com a LGPD (Lei nº 13.709/2018), detalhando finalidade de reservas, segurança, retenção, direitos dos titulares e uso responsável de cookies técnicos.
    - Seção de Termos e Condições de Uso contendo regras de reservas, tolerância de pontualidade (15 minutos), cancelamento, propriedade intelectual e sazonalidade de insumos do cardápio e buffet.
    - Suporte a rotas limpas no servidor web via diretório de fallback `termos-e-privacidade/index.html`.
    - Botão de impressão direta do documento em PDF (`window.print()`) e botão flutuante para voltar ao topo.
    - Suíte de testes automatizados expandida (`tests/footer-and-legal.test.mjs`), com 19/19 testes aprovados.

- **Atualização Completa do Cardápio Digital (Edição 04/09/2026)**:
  - Processado e integrado o novo cardápio oficial (`CARDÁPIO VILLA PLAZA-4-SET-2026.pdf`), sincronizado canonicamente como `assets/CardapioMenu/cardapio-villa-plaza.pdf`.
  - Renderizadas e otimizadas todas as 12 páginas em altíssima resolução para desktop (`assets/CardapioMenu/pages/page-01.png` a `page-12.png` em 1489x2106).
  - Renderizadas e otimizadas todas as 12 páginas para visualização mobile no Flipbook (`assets/CardapioMenu/pages/mobile/page-01.webp` a `page-12.webp` em 1862x2632).
  - Atualizado o versionamento de cache busting para scripts e estilos do Flipbook (`menu-flipbook.css?v=20260904_v1` e `menu-flipbook.js?v=20260904_v1`).
  - Suíte de testes de integridade do Flipbook (`tests/menu-flipbook.test.mjs`) 100% aprovada (14/14 testes passando).

- **Remoção do Identificador Social no Rodapé**:
  - Removido o texto `@villaplazabelem` (`.footer-handle`) da coluna de redes sociais/logo no rodapé.
  - Ajustado o espaçamento inferior dos ícones de redes sociais (`.footer-socials`) para manter alinhamento vertical limpo e centralizado.


- **Padronização dos Botões Arredondados (Pill Shape / 50px)**:
  - Todos os botões e CTAs do site foram padronizados com bordas totalmente arredondadas (`border-radius: 50px;`), mantendo a mesma identidade visual e elegância do botão "FAÇA SUA RESERVA" do menu header (`.btn-header-reserve`).
  - **Botão "VER CARDÁPIO" (`.btn-cardapio`)**: Atualizado de `4px` para `border-radius: 50px;` (desktop e mobile).
  - **Botão "CHAMAR NO WHATSAPP" do Rodapé (`.footer-whatsapp-btn`, `.footer-whatsapp-btn-gold`)**: Atualizado de `4px`/`6px` para `border-radius: 50px;` (desktop e mobile).
  - **Setas de Navegação do Carrossel (`.showcase-nav-arrow`)**: Atualizado de `4px` para `border-radius: 50px;` (círculo perfeito).
  - **Botões do Flipbook / Modal de Cardápio (`.flipbook-toolbar button/a`, `.flipbook-icon-button`, `#menuRetryBtn`)**: Atualizado para `border-radius: 50px;`.
  - **Botões Utilitários e de Ação (`.btn-gold-fill`, `.btn-gold-outline`, `.cta-reservation__btn`, etc.)**: Padronizados para `border-radius: 50px;`.
  - **Cache Busting**: Versões atualizadas no [index.html](file:///g:/Meu%20Drive/.PROJETOS/Sites%20Institucionais/site-villa-plaza-restaurante/index.html) (`style.css?v=20260904_rounded` e `menu-flipbook.css?v=20260904_rounded`).

- **Ajuste e Alinhamento de Localização no Rodapé**:
  - Atualizado o texto complementar do endereço na coluna de Localização do rodapé (`.footer-subtext`) para: `(Mezanino do +B Supermercados – Unidade Plaza)`.
  - Corrigido o alinhamento central do título `LOCALIZAÇÃO` e da coluna `.footer-col-contact` no desktop, alinhando perfeitamente o título com o ornamento estelar `— ✦ —` e o bloco de endereço.
  - Sincronizado o endereço no Schema JSON-LD (`streetAddress`) para refletir a Unidade Plaza na Av. Gov. José Malcher, 2388.
  - Atualizado o cache bust do CSS em `index.html` (`style.css?v=20260904_v1`).


- **Remoção do Card de Eventos do Carrossel Showcase de Experiências**:
  - Removido o slide de "EVENTOS" ("seus EVENTOS - ESPAÇOS VARIADOS E CLIMATIZADOS") de `index.html`.
  - Removida a imagem de background correspondente (`assets/experiencias/experiencia-atendimento-garcom.webp`) para manter a perfeita paridade 1:1 entre slides e fundos.
  - Carrossel mantido com os 3 cards gastronômicos: **Almoço**, **Jantar** e **Happy Hour**, com navegação por setas, arraste (drag/swipe) e clique totalmente preservados.

- **Remoção da Faixa de Transição Rotativa (Marquee Infinito)**:
  - Removida completamente a seção `<section id="destaques" class="hero-highlights-strip">` de `index.html` (tarja com os cards e ícones rotativos de Almoço, Jantar, Happy Hour, Atendimento, Carta de Vinhos, Gastronomia, Ambiente e Eventos).
  - Removidas todas as regras de estilo CSS, animação horizontal contínua (`@keyframes marqueeInfinite`) e media queries associadas em `style.css`.
  - Transição contínua e limpa entre a seção Hero e a seção Sobre Nós (`#sobre`).
  - Deploy em produção na VPS (`161.97.108.92` - container `villaplaza-web`) e sincronização no GitHub (Commit `0a885b6`).

## 2026-08-24

- **Ajustes de Paridade Mobile (Seções "Sobre Nós" e "Cardápio")**:
  - **Seção "Sobre Nós / Bem-vindo ao Villa Plaza" (`#sobre`)**:
    - Reorganização do fluxo vertical no mobile via `display: contents` para atender ao layout oficial: Header (`BEM-VINDO AO VILLA PLAZA`) centralizado -> Headline (`O PRAZER, elevado AO SEU MELHOR ENCONTRO.`) centralizado -> Foto do Ambiente (`assets/ambiente/sobre-nos-villa-plaza.webp`) full-width de ponta a ponta -> Parágrafos de apresentação com padding lateral no fundo creme.
    - Calibração de tamanho de fonte (`clamp(1.15rem, 4.3vw, 1.45rem)`) para manter `AO SEU MELHOR ENCONTRO.` em linha única centralizada sem quebras indevidas mesmo em telas compactas (360px).
  - **Seção "Cardápio à La Carte" (`#cardapio`)**:
    - Correção do fundo creme unificado (`#ECE5DC` com gradiente radial suave e textura noise SVG) no mobile.
    - Ocultação do bloco de vídeo/vinho escuro lateral no mobile (`.cardapio-right-video { display: none !important; }`), eliminando a caixa escura residual.
    - Criação de card/painel sutil no mobile para o bloco de texto (`— MENU —`, `CONFIRA O`, `NOSSO cardápio`, parágrafo e botão `VER CARDÁPIO`).
    - Posicionamento da foto do livro 3D aberto (`assets/CardapioMenu/cardapio-villa-plaza-open.png`) logo abaixo do botão, centralizada horizontalmente com sombra elegante (`drop-shadow`).
    - Remoção do override em telas <= 480px que forçava a imagem do cardápio para o canto inferior como miniatura.
  - **Desktop 100% Preservado**: Nenhuma alteração no layout desktop das seções.

- **Rodapé Mobile (`.footer-premium`)**:
  - Correção do fundo preto (`#080c0e`) que estava sendo aplicado via override mobile, restaurando a cor oficial Vermelho Vinho (`#57101D`) idêntica à versão desktop.
  - Alinhamento de todos os elementos visuais no mobile (logo branco, divisores com estrela dourada `✦`, ícones de redes sociais, títulos e dados de localização, moldura do mapa, horários de funcionamento, botão e número do WhatsApp) mantendo contraste e acabamento idênticos ao desktop.
  - Correção da barra inferior (`.footer-bottom`) com fundo branco, textos em vinho (`#57101D`) e separadores elegantes.
  - Atualização do parâmetro de cache bust no [index.html](file:///g:/Meu%20Drive/.PROJETOS/Sites%20Institucionais/site-villa-plaza-restaurante/index.html) (`style.css?v=20260824_v1`).

- **Seção 4 Cardápio Split (`.cardapio-split-section`)**:
  - Imagem do cardápio aberto (`.cardapio-menu-float`) ajustada para **70% da altura da seção (`height: 70vh; max-height: 70vh;`)**, trazendo proporção harmônica e equilibrada com os textos e o fundo.
  - Proporção da divisão em 62% creme / 38% vinho com lombada alinhada perfeitamente na divisa (`left: 62%; transform: translate(-50%, -50%)`).

- **Seção 2 Sobre Nós (`.sobre-section`)**: Ajuste de paridade 100% visual com o print de referência:
  - Mantida a altura imersiva de `100vh` em desktop com divisão exata de 42% (card creme) / 58% (foto do salão).
  - Conteúdo do card creme centralizado perfeitamente na vertical (`justify-content: center; height: 100%`) com padding lateral fluido.
  - Hierarquia tipográfica calibrada (`O PRAZER,`, `elevado`, `AO SEU MELHOR ENCONTRO.`, losango e parágrafos) em unidades proporcionais equilibradas.
  - Elimina o corte inferior em notebooks (1366px/1440px) e mantém a grandiosidade estética sem encolhimento excessivo em Full HD e 4K.
  - Ajuste de empilhamento fluido e limpo para tablets (<=1024px) e mobile (<=576px).

- **Seção 3 (Carrossel Showcase de Experiências)**: Atualização das imagens de fundo dos slides:
  - **Buffet (Almoço)**: Atualizado para `assets/gastronomia/buffet-churrasco-v0.webp`.
  - **Jantar**: Atualizado para `assets/gastronomia/prato-comida.webp`.
  - **Happy Hour**: Mantida foto atual da chopeira (`assets/experiencias/experiencia-chopp-heineken.webp`) aguardando nova imagem a ser enviada.

- Atualização e inserção dos links oficiais completos nos ícones de redes sociais do **Header Desktop**, **Menu Gaveta Mobile** e **Rodapé**:
  - **Facebook**: `https://www.facebook.com/villaplazabelem/`
  - **Instagram**: `https://www.instagram.com/villaplazabelem/`
  - **TikTok**: `https://www.tiktok.com/@villa.plaza` (substituído SVG preenchido sólido por vetor outline linear com traço `1.5px` idêntico aos demais ícones, equalizando peso visual, cor e opacidade).
  - **WhatsApp**: `https://api.whatsapp.com/send/?phone=559192159505&text&type=phone_number&app_absent=0`
  - Aplicação padrão de segurança `target="_blank"` e `rel="noopener noreferrer"` em todos os links externos.
- Configuração dos CTAs "FAÇA SUA RESERVA" e pontos de contato de reserva para direcionar diretamente para o WhatsApp oficial (`https://api.whatsapp.com/send/?phone=559192159505&text&type=phone_number&app_absent=0`) em nova guia (`target="_blank"` e `rel="noopener noreferrer"`):
  - Botão de Reserva do Header Desktop (`.btn-header-reserve`).
  - Item "Faça Sua Reserva" da Gaveta de Navegação Mobile (`.mobile-nav-link`).
  - Botão da Seção Mezanino no Rodapé (`.reserva-banner-rodape__btn`), restringindo o clique e cursor pointer exclusivamente ao botão e mantendo o restante da seção estático com cursor normal.
  - Links de WhatsApp do Header, Gaveta Mobile e Rodapé (`footer-whatsapp-number` e `footer-whatsapp-btn`).
  - Botão de contingência no modal de reservas.
- Remoção da seção "Momentos para Compartilhar" (`.villa-moments-section` / `#conceito`) de [index.html](file:///g:/Meu%20Drive/.PROJETOS/Sites%20Institucionais/site-villa-plaza-restaurante/index.html).
- Remoção da seção com o Mosaico de 6 Fotos (`.vp-feature-grid-section` / `#galeria`) de [index.html](file:///g:/Meu%20Drive/.PROJETOS/Sites%20Institucionais/site-villa-plaza-restaurante/index.html).
- Limpeza e remoção do bloco de script legado e não utilizado de galeria/lightbox em `index.html`.

## 2026-08-01

- Publicação e deploy automatizado do site em ambiente de produção na VPS no subdomínio [https://villaplaza.suporteide.digital/](https://villaplaza.suporteide.digital/).
- Configuração de DNS no Cloudflare (registro A com proxy ativo), Dockerfile Nginx alpine, docker-compose.yml com SSL automático via Traefik Proxy / Let's Encrypt.
- Geradas chaves SSH de deploy e cadastrados Repository Secrets no GitHub (`idedigitalbr/site-villa-plaza-restaurante`).

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
- Refinamento tipográfico e minimalista do slogan do Hero ("UM LUGAR PRA VOLTAR SEMPRE"): ajuste rigoroso de escala proporcional em todos os breakpoints (tamanho compacto de `0.72rem` / `11-12px`, espaçamento entre letras refinado `0.28em`, cor Dourado Champanhe `#F1D093`, sem quebras de linha desalinhadas e remoção do override em telas móveis <= 768px que ampliava o texto indevidamente), garantindo acabamento idêntico ao padrão minimalista dos destaques.
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
