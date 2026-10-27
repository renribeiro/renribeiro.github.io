(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('search-input');
    const trigger = document.getElementById('search-trigger');
    const cancel = document.getElementById('search-cancel');
    const results = document.getElementById('search-result-wrapper');
    const hint = document.querySelector('.search-shortcut');
    if (!input || !trigger || !cancel || !results || !hint) return;

    const isApple = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgentData?.platform || navigator.platform);
    const label = isApple ? '⌘ K' : 'Ctrl K';
    hint.textContent = label;
    hint.hidden = false;
    for (const control of [input, trigger, hint]) {
      control.setAttribute('aria-keyshortcuts', isApple ? 'Meta+k' : 'Control+k');
      control.title = `Search (${label})`;
    }

    let returnFocus;
    input.addEventListener('focus', (event) => {
      if (event.relatedTarget && !event.relatedTarget.closest('#search')) {
        returnFocus = event.relatedTarget;
      }
    });
    trigger.addEventListener('click', () => {
      if (!cancel.classList.contains('d-block') && document.activeElement !== input) {
        returnFocus = document.activeElement;
      }
    }, { capture: true });

    cancel.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.blur();
      const target = returnFocus?.isConnected && returnFocus !== document.body && returnFocus.getClientRects().length
        ? returnFocus : (trigger.getClientRects().length ? trigger : input);
      target.focus({ preventScroll: true });
      returnFocus = null;
    });

    document.addEventListener('keydown', (event) => {
      if (event.defaultPrevented || event.isComposing || document.querySelector('dialog[open]:not(#quick-search)')) return;
      const shortcut = event.key.toLowerCase() === 'k' && !event.altKey && !event.shiftKey
        && (isApple ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey);

      if (shortcut) {
        const active = document.activeElement;
        if (active !== input && active.id !== 'quick-search-input' && (active.isContentEditable || active.matches('input, textarea, select'))) return;
        event.preventDefault();
        if (event.repeat) return;
        document.dispatchEvent(new Event('quick-search:open'));
      } else if (event.key === 'Escape' && !event.altKey && !event.ctrlKey && !event.metaKey
        && !document.querySelector('dialog[open]')
        && (document.activeElement === input || cancel.classList.contains('d-block') || !results.classList.contains('d-none'))) {
        event.preventDefault();
        cancel.click();
      }
    });
  });
})();
