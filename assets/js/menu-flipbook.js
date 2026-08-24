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
const MOBILE_PAGE_IMAGES = Array.from({ length: 12 }, (_, index) => (
    `assets/CardapioMenu/pages/mobile/page-${String(index + 1).padStart(2, '0')}.webp`
));
const getPageImagesForViewport = () => (
    window.matchMedia('(max-width: 820px)').matches ? MOBILE_PAGE_IMAGES : LOCAL_PAGE_IMAGES
);
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
let menuModalScrollY = 0;
let pinchGesture = null;
let pausedBackgroundVideos = [];
let backgroundVideoPlayHandlers = new Map();

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
    const settings = pageFlip.getSettings();
    settings.minWidth = PAGE_FLIP_OPTIONS.minWidth;

    // The library switches to a spread whenever the available width is at
    // least twice minWidth. On mobile, derive that threshold from the real
    // viewport instead of forcing an artificial giant width.
    if (mobile && elements.pages?.clientWidth) {
        settings.minWidth = Math.max(
            PAGE_FLIP_OPTIONS.minWidth,
            Math.floor(elements.pages.clientWidth / 2) + 1
        );
    }

    settings.drawShadow = !mobile;
    settings.maxShadowOpacity = mobile ? 0.18 : PAGE_FLIP_OPTIONS.maxShadowOpacity;
    settings.flippingTime = mobile ? 560 : PAGE_FLIP_OPTIONS.flippingTime;
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
    const mobile = window.matchMedia('(max-width: 820px)').matches;
    const pixelRatio = mobile
        ? Math.min(window.devicePixelRatio || 1, 3)
        : Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
    const pixelWidth = Math.round(cssWidth * pixelRatio);
    const pixelHeight = Math.round(cssHeight * pixelRatio);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    render.update();
}

function centerCoverPage() {
    const canvas = pageFlip?.getUI?.()?.getCanvas?.();
    if (!canvas || !elements.pages || !elements.stage) return;

    const isDesktop = window.matchMedia('(min-width: 821px)').matches;
    if (!isDesktop || currentPage !== 1) {
        canvas.style.removeProperty('left');
        return;
    }

    const bounds = pageFlip.getBoundsRect?.();
    const pageWidth = Number(bounds?.pageWidth);
    if (!Number.isFinite(pageWidth) || pageWidth <= 0) return;

    const stageRect = elements.stage.getBoundingClientRect();
    const pagesRect = elements.pages.getBoundingClientRect();
    const renderLeft = Number(bounds.left) || 0;
    const coverCenter = renderLeft + (pageWidth * 1.5);
    const targetLeft = (
        stageRect.left
        + stageRect.width / 2
        - pagesRect.left
        - coverCenter
    );

    canvas.style.left = `${Math.round(targetLeft * 100) / 100}px`;
}

function lockPageScroll(locked) {
    document.documentElement.classList.toggle('menu-modal-open', locked);
    document.body.classList.toggle('menu-modal-open', locked);
    document.body.style.overflow = locked ? 'hidden' : '';
    document.documentElement.style.overflow = locked ? 'hidden' : '';
}

function setBackgroundVideosPaused(paused) {
    const backgroundVideos = Array.from(document.querySelectorAll('video'))
        .filter((video) => !elements.modal?.contains(video));

    if (paused) {
        if (backgroundVideoPlayHandlers.size) return;

        pausedBackgroundVideos = backgroundVideos.filter((video) => !video.paused);
        backgroundVideos.forEach((video) => {
            const preventBackgroundPlayback = () => video.pause();
            backgroundVideoPlayHandlers.set(video, preventBackgroundPlayback);
            video.addEventListener('play', preventBackgroundPlayback);
            video.pause();
        });
        return;
    }

    backgroundVideoPlayHandlers.forEach((handler, video) => {
        video.removeEventListener('play', handler);
    });
    backgroundVideoPlayHandlers.clear();
    pausedBackgroundVideos.forEach((video) => {
        video.play().catch(() => {});
    });
    pausedBackgroundVideos = [];
}

function handlePageFlip({ data }) {
    currentPage = normalizePage(Number(data) + 1, totalPages);
    isAnimating = false;
    setLoading(false);
    setError(false);
    updateControls();
    centerCoverPage();
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
        pageFlip.on('changeOrientation', () => {
            updateControls();
            centerCoverPage();
        });
        updateResponsiveBookMode();
        pageFlip.loadFromImages(getPageImagesForViewport());

        updateControls();
        await new Promise((resolve) => window.setTimeout(resolve, 80));
        updateCanvasResolution();
        setLoading(false);
        updateControls();
        centerCoverPage();
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
        centerCoverPage();
        return;
    }

    isAnimating = true;
    updateControls();
    pageFlip.flip(target - 1, 'top');
}

function openMenuModal() {
    if (!elements.modal) return;

    menuModalScrollY = window.scrollY;
    lastFocusedElement = document.activeElement;
    isOpen = true;
    setBackgroundVideosPaused(true);
    elements.modal.style.display = 'flex';
    elements.modal.classList.add('active');
    elements.modal.setAttribute('aria-hidden', 'false');
    lockPageScroll(true);
    elements.stage?.focus({ preventScroll: true });

    if (pageFlip) {
        updateControls();
        centerCoverPage();
    } else {
        initializeReader();
    }
}

function closeMenuModal() {
    if (!elements.modal) return;

    isOpen = false;
    isAnimating = false;
    pinchGesture = null;
    elements.modal.classList.remove('active');
    elements.modal.setAttribute('aria-hidden', 'true');
    elements.modal.style.display = 'none';
    lockPageScroll(false);
    setBackgroundVideosPaused(false);
    zoom = 1;
    updateZoomState();

    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus({ preventScroll: true });
    }

    window.requestAnimationFrame(() => {
        window.scrollTo({ top: menuModalScrollY, left: 0, behavior: 'instant' });
    });
}

function setZoom(nextZoom) {
    zoom = Math.min(1.35, Math.max(0.85, Number(nextZoom.toFixed(2))));
    updateZoomState();
    centerCoverPage();
}

function getTouchDistance(touches) {
    if (!touches || touches.length < 2) return 0;

    const first = touches[0];
    const second = touches[1];
    return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
}

function bindTouchZoom() {
    if (!elements.stage) return;

    const stopFlipGesture = () => {
        pageFlip?.userStop?.({ x: 0, y: 0 }, true);
    };

    elements.stage.addEventListener('touchstart', (event) => {
        if (event.touches.length < 2) return;

        const distance = getTouchDistance(event.touches);
        if (!distance) return;

        stopFlipGesture();
        pinchGesture = { distance, zoom };
        event.preventDefault();
        event.stopPropagation();
    }, { passive: false, capture: true });

    elements.stage.addEventListener('touchmove', (event) => {
        if (!pinchGesture || event.touches.length < 2) return;

        const distance = getTouchDistance(event.touches);
        if (!distance) return;

        setZoom(pinchGesture.zoom * (distance / pinchGesture.distance));
        event.preventDefault();
        event.stopPropagation();
    }, { passive: false, capture: true });

    const finishPinch = (event) => {
        if (!pinchGesture) return;

        pinchGesture = null;
        event.preventDefault();
        event.stopPropagation();
    };

    elements.stage.addEventListener('touchend', finishPinch, { passive: false, capture: true });
    elements.stage.addEventListener('touchcancel', finishPinch, { passive: false, capture: true });
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
    const label = document.fullscreenElement ? 'Sair da tela cheia' : 'Abrir tela cheia';
    elements.fullscreen.setAttribute('aria-label', label);
    elements.fullscreen.setAttribute('title', label);
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
    elements.fullscreen?.addEventListener('click', toggleFullscreen);
    elements.pageInput?.addEventListener('change', handlePageInput);
    elements.pageInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handlePageInput();
        }
    });

    bindTouchZoom();

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
            centerCoverPage();
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
