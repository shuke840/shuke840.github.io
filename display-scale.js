(() => {
  const root = document.documentElement;
  if (root.lang !== 'en') return;

  function fitPage() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const desktop = width >= 1200;
    // A 1280px layout leaves room for the text and two 240px AA columns.
    // Keep the entire right AA below the counter within the window height.
    const scale = desktop ? Math.max(1, Math.min(2, width / 1280, height / 480)) : 1;
    root.classList.toggle('english-desktop', desktop);
    root.style.setProperty('--page-zoom', String(Math.floor(scale * 100) / 100));
  }

  fitPage();
  window.addEventListener('resize', fitPage);
})();
