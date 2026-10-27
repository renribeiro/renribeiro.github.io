(() => {
  if (!window.Theme?.isToggleable) return;

  // Chirpy removes its saved theme when System is selected.
  const systemPreferenceKey = 'theme-system-preference';

  try {
    if (!localStorage.getItem('theme') && localStorage.getItem(systemPreferenceKey) !== 'true') {
      window.Theme.update(window.Theme.Mode.DARK);
    }
  } catch {
    return;
  }

  document.addEventListener('click', (event) => {
    const option = event.target.closest('#mode-toggle + .dropdown-menu button[data-theme-mode]');
    if (!option) return;

    try {
      if (option.dataset.themeMode === window.Theme.Mode.SYSTEM) {
        localStorage.setItem(systemPreferenceKey, 'true');
      } else {
        localStorage.removeItem(systemPreferenceKey);
      }
    } catch {
      return;
    }
  });
})();
