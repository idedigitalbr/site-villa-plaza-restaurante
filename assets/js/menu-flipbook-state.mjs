export function normalizePage(page, total) {
  const max = Math.max(1, Number(total) || 1);
  const value = Number.parseInt(page, 10);

  if (!Number.isFinite(value)) return 1;
  return Math.min(max, Math.max(1, value));
}

export function getSpread(page, total) {
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

export function nextPage(page, total) {
  const current = normalizePage(page, total);
  const max = Math.max(1, Number(total) || 1);

  return current === 1 ? Math.min(2, max) : Math.min(current + 2, max);
}

export function previousPage(page, total) {
  const current = normalizePage(page, total);

  return current <= 2 ? 1 : current - 2;
}
