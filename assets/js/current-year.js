(() => {
    const yearElement = document.querySelector('[data-current-year]');
    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }

    const yearElements = document.querySelectorAll('[data-current-year], #currentYear');
    const currentYear = String(new Date().getFullYear());
    yearElements.forEach((el) => {
        el.textContent = currentYear;
    });
})();
