(() => {
  const button = document.querySelector('.news-toggle');
  if (!button) return;

  const timeline = document.getElementById(button.getAttribute('aria-controls'));
  const olderEntries = timeline.querySelectorAll('[data-news-extra]');
  const label = button.querySelector('.news-toggle-label');

  const setExpanded = (expanded) => {
    olderEntries.forEach((entry) => {
      entry.hidden = !expanded;
    });
    button.setAttribute('aria-expanded', String(expanded));
    label.textContent = expanded ? 'Show less' : 'Show older news';
  };

  setExpanded(false);
  button.hidden = false;

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    setExpanded(expanded);
    if (!expanded) {
      button.focus({ preventScroll: true });
      const bounds = button.getBoundingClientRect();
      if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
        button.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  });
})();
