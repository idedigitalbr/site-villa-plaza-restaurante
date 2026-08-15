# Cardápio PDF no Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Fazer o modal de cardápio existente renderizar o PDF real do Villa Plaza, sem alterar as demais estruturas do site.

**Architecture:** Manter o modal e o renderer PDF.js existentes. Versionar o PDF como ativo estático em `assets/CardapioMenu/` e corrigir somente o estado de renderização e o caminho do arquivo em `index.html`; o fallback visual atual permanecerá intacto.

**Tech Stack:** HTML estático, JavaScript inline, CSS existente, PDF.js 3.11.174, PowerShell e Python/pypdf para validação do ativo.

## Global Constraints

- Alterar somente `index.html` e adicionar `assets/CardapioMenu/cardapio-villa-plaza.pdf` no runtime do site.
- Preservar navegação, reservas, demais modais, conteúdo, estilos e gatilhos existentes.
- Não criar dependência de URL externa para o PDF.
- Manter o fallback de imagem caso PDF.js ou o arquivo não carreguem.
- Não versionar `.codegraph/`.

### Task 1: Reproduzir o estado quebrado com uma verificação estática

**Files:**
- Test: comando PowerShell one-off; nenhum arquivo de teste permanente, pois o projeto não possui test runner.

- [ ] **Step 1: Executar a verificação antes da implementação**

```powershell
$pdf = Join-Path (Get-Location) 'assets/CardapioMenu/cardapio-villa-plaza.pdf'
$html = Get-Content -Raw index.html
if (-not (Test-Path -LiteralPath $pdf)) { throw "PDF canônico ausente: $pdf" }
if ($html -notmatch '(?m)^\s*let isPdfRendering\s*=\s*false\s*;') { throw 'Estado isPdfRendering não inicializado' }
if ($html -notmatch "assets/CardapioMenu/cardapio-villa-plaza\.pdf") { throw 'Caminho canônico do PDF ausente' }
Write-Output 'PASS'
```

- [ ] **Step 2: Confirmar a falha esperada**

Run from `C:\Users\Hesron\OneDrive\Área de Trabalho\villa plaza`.

Expected: FAIL because the PDF canonical file and `isPdfRendering` declaration do not exist yet.

### Task 2: Adicionar o ativo PDF canônico

**Files:**
- Create: `assets/CardapioMenu/cardapio-villa-plaza.pdf`

- [ ] **Step 1: Copiar o PDF fornecido para o caminho versionado**

Copy `C:\Users\Hesron\Downloads\CARDÁPIO VILLA PLAZA.pdf (1)-1.pdf` to `assets/CardapioMenu/cardapio-villa-plaza.pdf` without changing its bytes.

- [ ] **Step 2: Validar o ativo antes de alterar o JavaScript**

```powershell
$pdf = 'assets/CardapioMenu/cardapio-villa-plaza.pdf'
if (-not (Test-Path -LiteralPath $pdf)) { throw 'PDF não foi copiado' }
$python = 'C:\Users\Hesron\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
& $python -c "from pypdf import PdfReader; import sys; r=PdfReader(sys.argv[1]); assert len(r.pages) == 12, len(r.pages); print('PDF_PAGES=' + str(len(r.pages)))" $pdf
```

Expected: `PDF_PAGES=12`.

### Task 3: Corrigir somente o renderer do modal

**Files:**
- Modify: `index.html:1390-1421`

- [ ] **Step 1: Inicializar o estado de renderização antes do uso**

Add `let isPdfRendering = false;` immediately before `initCustomPdfViewer()` is declared or otherwise before the first call to it.

- [ ] **Step 2: Apontar o renderer para o ativo local canônico**

Keep the existing `pdfPaths` fallback array behavior but put `assets/CardapioMenu/cardapio-villa-plaza.pdf` first. Do not change modal markup, event handlers, CSS, or the image fallback.

- [ ] **Step 3: Run the static regression check**

Run the exact PowerShell assertions from Task 1.

Expected: `PASS`.

### Task 4: Validar o modal servido por HTTP

**Files:**
- Verify: `index.html`
- Verify: `assets/CardapioMenu/cardapio-villa-plaza.pdf`

- [ ] **Step 1: Start a local static server**

Run `python -m http.server 4173` from the repository root.

- [ ] **Step 2: Verify the PDF is served**

Run `Invoke-WebRequest http://127.0.0.1:4173/assets/CardapioMenu/cardapio-villa-plaza.pdf -Method Head`.

Expected: HTTP 200 and a non-zero content length.

- [ ] **Step 3: Verify repository scope**

Run `git status --short` and `git diff --stat HEAD~1` after implementation.

Expected runtime changes: only `index.html` and `assets/CardapioMenu/cardapio-villa-plaza.pdf`; the design/plan documents are process records.

- [ ] **Step 4: Stop the local server and inspect the final diff**

Confirm no unrelated site sections or styles changed.
