(() => {
  document.querySelectorAll('.resume-more').forEach((group) => {
    const button = group.querySelector('.resume-more-toggle');
    const content = document.getElementById(button.getAttribute('aria-controls'));
    const firstCard = content.querySelector('.resume-card');

    firstCard.tabIndex = -1;

    content.hidden = true;
    button.hidden = false;

    button.addEventListener('click', (event) => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      content.hidden = !expanded;
      button.setAttribute('aria-expanded', String(expanded));

      if (expanded) {
        if (event.detail === 0) {
          firstCard.focus({ preventScroll: true });
        } else {
          button.blur();
        }
      } else {
        button.focus({ preventScroll: true });
        button.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      }
    });
  });
})();
