(() => {
  const browserDark = window.matchMedia('(prefers-color-scheme: dark)');
  const folder = new URL(document.currentScript.dataset.faviconPath, location.href);
  let icon = document.createElement('link');
  icon.rel = 'icon';
  icon.type = 'image/png';
  icon.sizes = '96x96';

  const hrefForBrowser = () => {
    const file = browserDark.matches ? 'favicon-96x96.png' : 'favicon-light-96x96.png';
    const url = new URL(file, folder);
    url.searchParams.set('v', '3');
    return url.href;
  };

  const sync = () => {
    const href = hrefForBrowser();
    if (icon.href === href) return;

    const replacement = icon.cloneNode();
    replacement.href = href;
    icon.replaceWith(replacement);
    icon = replacement;
  };

  icon.href = hrefForBrowser();
  document.head.append(icon);
  browserDark.addEventListener('change', sync);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sync();
  });
})();
