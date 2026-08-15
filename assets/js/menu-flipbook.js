function normalizePage(page, total) {
    const max = Math.max(1, Number(total) || 1);
    const value = Number.parseInt(page, 10);
    if (!Number.isFinite(value)) return 1;
    return Math.min(max, Math.max(1, value));
}

function getSpread(page, total) {
    const current = normalizePage(page, total);
    const max = Math.max(1, Number(total) || 1);

    if (current === 1) {
        return { current, pages: [1], isCover: true };
    }

    const first = current % 2 === 0 ? current : current - 1;
    const pages = [first];
    if (first + 1 <= max) pages.push(first + 1);

    return { current, pages, isCover: false };
}

function nextPage(page, total) {
    const current = normalizePage(page, total);
    const max = Math.max(1, Number(total) || 1);
    return current === 1 ? Math.min(2, max) : Math.min(current + 2, max);
}

function previousPage(page, total) {
    const current = normalizePage(page, total);
    return current <= 2 ? 1 : current - 2;
}

const PDF_URL = 'assets/CardapioMenu/cardapio-villa-plaza.pdf';
const LOCAL_PAGE_IMAGES = Array.from({ length: 12 }, (_, index) => (
    `assets/CardapioMenu/pages/page-${String(index + 1).padStart(2, '0')}.png`
));
const PAGE_FLIP_OPTIONS = {
    width: 595,
    height: 842,
    size: 'stretch',
    minWidth: 220,
    maxWidth: 980,
    minHeight: 260,
    maxHeight: 1385,
    drawShadow: true,
    maxShadowOpacity: 0.48,
    flippingTime: 720,
    usePortrait: true,
    showCover: true,
    autoSize: false,
    mobileScrollSupport: false,
    swipeDistance: 30,
    useMouseEvents: true,
    showPageCorners: true,
    disableFlipByClick: false,
};

const $ = (id) => document.getElementById(id);

const elements = {
    modal: $('menuModal'),
    stage: $('menuFlipbookStage'),
    pages: $('menuFlipbookPages'),
    loading: $('menuPdfLoading'),
    error: $('menuPdfError'),
    retry: $('menuRetryBtn'),
    close: $('menuModalCloseBtn'),
    previous: $('menuPrevBtn'),
    next: $('menuNextBtn'),
    pageInput: $('menuPageInput'),
    pageTotal: $('menuPageTotal'),
    zoomOut: $('menuZoomOut'),
    zoomIn: $('menuZoomIn'),
    fit: $('menuFitBtn'),
    fullscreen: $('menuFullscreenBtn'),
};

let pageFlip = null;
let initializationPromise = null;
let currentPage = 1;
let totalPages = LOCAL_PAGE_IMAGES.length;
let zoom = 1;
let isOpen = false;
let isAnimating = false;
let resizeTimer = null;
let lastFocusedElement = null;

function setLoading(visible) {
    if (!elements.loading) return;
    elements.loading.hidden = !visible;
}

function setError(visible) {
    if (!elements.error) return;
    elements.error.hidden = !visible;
}

function getCurrentPageNumber() {
    if (!pageFlip || typeof pageFlip.getCurrentPageIndex !== 'function') {
        return normalizePage(currentPage, totalPages);
    }

    return normalizePage(pageFlip.getCurrentPageIndex() + 1, totalPages);
}

function updateControls() {
    if (!elements.pageInput || !elements.pageTotal) return;

    currentPage = getCurrentPageNumber();
    elements.pageInput.value = String(currentPage);
    elements.pageInput.max = String(Math.max(totalPages, 1));
    elements.pageTotal.textContent = totalPages ? String(totalPages) : '—';
    elements.pages?.classList.toggle('is-cover', currentPage === 1);
    elements.previous.disabled = !pageFlip || currentPage <= 1 || isAnimating;
    elements.next.disabled = !pageFlip || currentPage >= totalPages || isAnimating;
    elements.stage?.setAttribute(
        'aria-label',
        `Leitor do cardápio, página ${currentPage} de ${totalPages}`
    );
}

function updateZoomState() {
    if (!elements.pages) return;
    elements.pages.style.setProperty('--flipbook-zoom', String(zoom));
    elements.pages.classList.toggle('is-zoomed', zoom > 1);
}

function updateResponsiveBookMode() {
    if (!pageFlip || typeof pageFlip.getSettings !== 'function') return;

    const mobile = window.matchMedia('(max-width: 820px)').matches;
    pageFlip.getSettings().minWidth = mobile ? 10000 : PAGE_FLIP_OPTIONS.minWidth;
}

function updateCanvasResolution() {
    if (!pageFlip) return;

    const canvas = pageFlip.getUI?.()?.getCanvas?.();
    const render = pageFlip.getRender?.();
    const context = render?.getContext?.();
    if (!canvas || !render || !context) return;

    const bounds = canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(bounds.width));
    const cssHeight = Math.max(1, Math.round(bounds.height));
    const pixelRatio = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
    const pixelWidth = Math.round(cssWidth * pixelRatio);
    const pixelHeight = Math.round(cssHeight * pixelRatio);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    render.update();
}

function lockPageScroll(locked) {
    document.documentElement.classList.toggle('menu-modal-open', locked);
    document.body.classList.toggle('menu-modal-open', locked);
    document.body.style.overflow = locked ? 'hidden' : '';
    document.documentElement.style.overflow = locked ? 'hidden' : '';
}

function handlePageFlip({ data }) {
    currentPage = normalizePage(Number(data) + 1, totalPages);
    isAnimating = false;
    setLoading(false);
    setError(false);
    updateControls();
}

async function initializeReader() {
    if (!elements.pages || pageFlip) {
        setLoading(false);
        updateControls();
        return pageFlip;
    }

    if (initializationPromise) return initializationPromise;

    setError(false);
    setLoading(true);

    initializationPromise = (async () => {
        if (!window.St?.PageFlip) {
            throw new Error('StPageFlip não está disponível.');
        }

        pageFlip = new window.St.PageFlip(elements.pages, PAGE_FLIP_OPTIONS);
        pageFlip.on('init', handlePageFlip);
        pageFlip.on('flip', handlePageFlip);
        pageFlip.on('changeOrientation', updateControls);
        updateResponsiveBookMode();
        pageFlip.loadFromImages(LOCAL_PAGE_IMAGES);

        updateControls();
        await new Promise((resolve) => window.setTimeout(resolve, 80));
        updateCanvasResolution();
        setLoading(false);
        updateControls();
        return pageFlip;
    })();

    try {
        return await initializationPromise;
    } catch (error) {
        console.error(`Erro ao carregar o cardápio local (${PDF_URL}):`, error);
        pageFlip?.destroy?.();
        pageFlip = null;
        setLoading(false);
        setError(true);
        return null;
    } finally {
        initializationPromise = null;
    }
}

function requestPageFlip(action) {
    if (!pageFlip || isAnimating) return;
    if (action === 'flipPrev' && currentPage <= 1) return;
    if (action === 'flipNext' && currentPage >= totalPages) return;

    isAnimating = true;
    updateControls();
    pageFlip[action](action === 'flipPrev' ? 'bottom' : 'top');
}

function goToPage(targetPage) {
    if (!pageFlip || isAnimating) return;

    const target = normalizePage(targetPage, totalPages);
    if (target === currentPage) return;

    if (typeof pageFlip.turnToPage === 'function') {
        pageFlip.turnToPage(target - 1);
        currentPage = target;
        isAnimating = false;
        updateControls();
        return;
    }

    isAnimating = true;
    updateControls();
    pageFlip.flip(target - 1, 'top');
}

function openMenuModal() {
    if (!elements.modal) return;

    lastFocusedElement = document.activeElement;
    isOpen = true;
    elements.modal.style.display = 'flex';
    elements.modal.classList.add('active');
    elements.modal.setAttribute('aria-hidden', 'false');
    lockPageScroll(true);
    elements.stage?.focus({ preventScroll: true });

    if (pageFlip) {
        updateControls();
    } else {
        initializeReader();
    }
}

function closeMenuModal() {
    if (!elements.modal) return;

    isOpen = false;
    isAnimating = false;
    elements.modal.classList.remove('active');
    elements.modal.setAttribute('aria-hidden', 'true');
    elements.modal.style.display = 'none';
    lockPageScroll(false);

    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus({ preventScroll: true });
    }
}

function setZoom(nextZoom) {
    zoom = Math.min(1.35, Math.max(0.85, Number(nextZoom.toFixed(2))));
    updateZoomState();
}

async function toggleFullscreen() {
    if (!elements.modal) return;

    try {
        if (!document.fullscreenElement && elements.modal.requestFullscreen) {
            await elements.modal.requestFullscreen();
        } else if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.warn('Tela cheia indisponível neste navegador:', error);
    }
}

function updateFullscreenLabel() {
    if (!elements.fullscreen) return;
    elements.fullscreen.textContent = document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia';
}

function handlePageInput() {
    goToPage(elements.pageInput.value);
}

function trapFocus(event) {
    if (event.key !== 'Tab' || !elements.modal?.classList.contains('active')) return;

    const focusable = Array.from(elements.modal.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled])'
    ));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function bindEvents() {
    if (!elements.modal) return;

    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('.trigger-menu-modal');
        if (!trigger) return;
        event.preventDefault();
        openMenuModal();
    });

    elements.close?.addEventListener('click', closeMenuModal);
    elements.previous?.addEventListener('click', () => requestPageFlip('flipPrev'));
    elements.next?.addEventListener('click', () => requestPageFlip('flipNext'));
    elements.retry?.addEventListener('click', initializeReader);
    elements.zoomOut?.addEventListener('click', () => setZoom(zoom - 0.1));
    elements.zoomIn?.addEventListener('click', () => setZoom(zoom + 0.1));
    elements.fit?.addEventListener('click', () => setZoom(1));
    elements.fullscreen?.addEventListener('click', toggleFullscreen);
    elements.pageInput?.addEventListener('change', handlePageInput);
    elements.pageInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handlePageInput();
        }
    });

    elements.modal.addEventListener('click', (event) => {
        if (event.target === elements.modal) closeMenuModal();
    });

    document.addEventListener('keydown', (event) => {
        if (!isOpen) return;
        trapFocus(event);

        if (event.key === 'Escape') {
            event.preventDefault();
            closeMenuModal();
        } else if (event.key === 'ArrowRight' && document.activeElement !== elements.pageInput) {
            event.preventDefault();
            requestPageFlip('flipNext');
        } else if (event.key === 'ArrowLeft' && document.activeElement !== elements.pageInput) {
            event.preventDefault();
            requestPageFlip('flipPrev');
        } else if (event.key === 'Home' && document.activeElement !== elements.pageInput) {
            event.preventDefault();
            goToPage(1);
        } else if (event.key === 'End' && document.activeElement !== elements.pageInput) {
            event.preventDefault();
            goToPage(totalPages);
        }
    });

    document.addEventListener('fullscreenchange', updateFullscreenLabel);
    window.addEventListener('resize', () => {
        if (!isOpen || !pageFlip) return;
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            updateResponsiveBookMode();
            pageFlip.update();
            updateCanvasResolution();
            updateZoomState();
        }, 180);
    }, { passive: true });
}

if (elements.modal) {
    elements.modal.style.display = 'none';
    updateControls();
    updateZoomState();
    bindEvents();
    window.openMenuModal = openMenuModal;
    window.closeMenuModal = closeMenuModal;
}
