# Cardápio PDF no Modal - Design

**Data:** 2026-08-14

## Objetivo

Exibir o arquivo `CARDÁPIO VILLA PLAZA.pdf (1)-1.pdf` dentro do modal de cardápio já existente, mantendo a identidade visual, a rolagem das páginas e os gatilhos atuais do site.

## Escopo

- Adicionar uma cópia versionada do PDF em `assets/CardapioMenu/cardapio-villa-plaza.pdf`.
- Corrigir o estado de renderização usado pelo visualizador PDF.js em `index.html`.
- Fazer o visualizador procurar o novo caminho canônico do PDF.
- Preservar o fallback atual para a imagem do cardápio quando PDF.js ou o PDF não estiverem disponíveis.
- Não alterar outras seções, navegação, reservas, conteúdo, layout geral ou a estrutura de estilos existente.

## Abordagem

O modal existente continuará usando PDF.js, renderizando todas as 12 páginas em canvas dentro de `#menuPdfContainer`. O arquivo será servido como um ativo estático local, evitando dependência de um endereço externo. A variável de controle `isPdfRendering` será inicializada antes de `initCustomPdfViewer()` para eliminar o `ReferenceError` que interrompe o carregamento atual.

O modal manterá os comportamentos existentes: abertura pelos elementos `.trigger-menu-modal`, fechamento pelo botão, clique no overlay e tecla Escape, além do bloqueio de rolagem da página enquanto estiver aberto.

## Tratamento de falhas

Se PDF.js não carregar, se o worker falhar ou se o PDF não puder ser obtido, o fallback de imagem existente continuará sendo exibido. Nenhuma alteração será feita no conteúdo da imagem ou nos demais modais.

## Validação

- Confirmar que o PDF local possui 12 páginas e está no caminho esperado.
- Validar que o HTML aponta para o arquivo local e declara o estado de renderização antes do uso.
- Servir o site localmente e abrir o modal para confirmar que as páginas aparecem e podem ser roladas.
- Confirmar que o `git diff` contém apenas o PDF, `index.html` e este documento de especificação.
