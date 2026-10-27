(() => {
  document.querySelectorAll('[data-author-disclosure]').forEach((disclosure) => {
    const button = disclosure.querySelector('.publication-author-toggle');
    const remainder = disclosure.querySelector('[data-author-remainder]');
    const ellipsis = disclosure.querySelector('[data-author-ellipsis]');
    const affiliations = disclosure.querySelector('[data-author-affiliations]');

    const setExpanded = (expanded) => {
      button.setAttribute('aria-expanded', String(expanded));
      remainder.hidden = !expanded;
      ellipsis.hidden = expanded;
      if (affiliations) affiliations.hidden = !expanded;
    };

    setExpanded(false);
    button.hidden = false;
    button.addEventListener('click', () => {
      setExpanded(button.getAttribute('aria-expanded') !== 'true');
    });
  });
})();
