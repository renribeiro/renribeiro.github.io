(() => {
  const types = (document.currentScript?.dataset.moreProfiles || '').split('|').filter(Boolean);
  const footer = document.querySelector('#sidebar .sidebar-bottom');
  if (!footer || types.length === 0) return;

  const links = types
    .map((type) => [...footer.children].find((child) => child.matches('a') && child.getAttribute('aria-label') === type))
    .filter(Boolean);
  if (links.length === 0) return;

  const disclosure = document.createElement('details');
  disclosure.className = 'sidebar-more';

  const summary = document.createElement('summary');
  summary.setAttribute('aria-label', 'More profiles');
  summary.title = 'More profiles';
  summary.innerHTML = '<i class="fas fa-ellipsis" aria-hidden="true"></i>';

  const menu = document.createElement('div');
  menu.className = 'sidebar-more-menu';
  menu.setAttribute('role', 'group');
  menu.setAttribute('aria-label', 'More profiles');

  links.forEach((link) => {
    const label = document.createElement('span');
    label.textContent = link.getAttribute('aria-label');
    link.append(label);
    menu.append(link);
  });

  disclosure.append(summary, menu);
  footer.append(disclosure);

  disclosure.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      disclosure.open = false;
      summary.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (disclosure.open && !disclosure.contains(event.target)) disclosure.open = false;
  });
})();
