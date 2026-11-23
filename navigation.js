// Run on every click, including repeated clicks on the current fragment.
// A hashchange listener cannot handle that case because the URL is unchanged.
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey ||
        event.metaKey || event.shiftKey || event.altKey || link.target === '_blank') return;

    const destination = new URL(link.getAttribute('href'), location.href);
    if (destination.origin !== location.origin || destination.pathname !== location.pathname ||
        destination.search !== location.search || !destination.hash) return;

    let id;
    try { id = decodeURIComponent(destination.hash.slice(1)); } catch { return; }
    const section = document.getElementById(id);
    if (!section) return;

    event.preventDefault();
    // Release focus from the sticky tab before moving the viewport.
    link.blur();
    if (id !== 'top') {
      if (!section.hasAttribute('tabindex')) section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    }

    // Updating history must not trigger the browser's native fragment jump.
    // Some file: previews disallow replaceState; scrolling still works there.
    try { history.replaceState(null, '', destination.href); } catch { /* Local preview. */ }
    const tabs = document.querySelector('.section-nav');
    const offset = tabs ? tabs.getBoundingClientRect().height + 16 : 16;
    const top = id === 'top' ? 0 : Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset);
    window.scrollTo({ top, left: 0, behavior: 'instant' });
  });
});
