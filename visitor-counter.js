(() => {
  const digits = document.getElementById('visitor-digits');
  const message = document.getElementById('counter-message');
  if (!digits || !message) return;
  const isEnglish = document.documentElement.lang === 'en';

  const isPreview = location.protocol === 'file:' ||
    ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const countKey = `shuke840_github_io_unique_visitors_v2${isPreview ? '_preview' : ''}`;
  const api = 'https://countapi.mileshilliard.com/api/v1/';
  const celebration = document.getElementById('kiriban-message');
  const artwork = document.querySelectorAll('.side-art');

  function showKiriban(value) {
    const count = BigInt(value);
    const celebrate = count > 0n && count % 50n === 0n;
    document.documentElement.classList.toggle('is-kiriban', celebrate);
    if (celebration) celebration.hidden = !celebrate;
    artwork.forEach(art => { art.hidden = !celebrate; });
  }

  showKiriban(0);

  function renderCount(value) {
    if (!/^\d+$/.test(String(value))) throw new Error('Invalid count');
    const text = String(value).replace(/^0+(?=\d)/, '').padStart(6, '0');
    const cells = Array.from(text, character => {
      const cell = document.createElement('span');
      cell.className = 'counter-digit';
      cell.textContent = character;
      cell.setAttribute('aria-hidden', 'true');
      return cell;
    });
    digits.replaceChildren(...cells);
    digits.setAttribute('aria-label', isEnglish ? `Total visits: ${value}` : `累計来場者数 ${value} 人`);
    showKiriban(value);
  }

  async function showCounter() {
    // Each page load counts once, including reloads. Keep local tests separate.
    const shouldIncrement = isPreview || location.hostname === 'shuke840.github.io';
    try {
      const response = await fetch(`${api}${shouldIncrement ? 'hit' : 'get'}/${countKey}`, {
        cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer',
        signal: AbortSignal.timeout(12000)
      });
      if (response.status === 404 && !shouldIncrement) {
        renderCount(0);
        return;
      }
      if (!response.ok) throw new Error('Counter unavailable');
      const data = await response.json();
      renderCount(data.value);
      message.textContent = '';
    } catch {
      showKiriban(0);
      digits.setAttribute('aria-label', isEnglish ? 'Visitor count unavailable' : '来場者数を取得できません');
      message.textContent = isEnglish ? 'The counter is temporarily unavailable.' : 'ただいま集計を取得できません。';
      // Never retry an increment: the server may have counted the first one.
    }
  }

  void showCounter();
})();
