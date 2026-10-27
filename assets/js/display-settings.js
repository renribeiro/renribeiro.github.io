(() => {
  const root = document.documentElement;
  const settings = {
    'text-size': ['default', 'large', 'larger'],
    'line-spacing': ['default', 'relaxed'],
    contrast: ['default', 'high']
  };
  let storageAvailable = true;

  const store = (key, value) => {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      storageAvailable = false;
    }
  };

  const apply = (key, value) => {
    if (value === 'default') root.removeAttribute(`data-display-${key}`);
    else root.setAttribute(`data-display-${key}`, value);
  };

  for (const [key, values] of Object.entries(settings)) {
    try {
      const saved = localStorage.getItem(`display-${key}`);
      if (values.includes(saved)) apply(key, saved);
    } catch {
      storageAvailable = false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('display-settings');
    const toggle = document.getElementById('display-toggle');
    if (!dialog || !toggle || typeof dialog.showModal !== 'function') return;

    document.body.append(dialog);
    toggle.hidden = false;
    const status = dialog.querySelector('[data-display-status]');
    const close = dialog.querySelector('.display-close');
    const reset = dialog.querySelector('.display-reset');

    const sync = () => {
      const theme = root.hasAttribute('data-theme-persisted') ? root.dataset.bsTheme : 'system';
      dialog.querySelectorAll('input[name="display-theme"]').forEach((input) => {
        input.checked = input.value === theme;
      });
      document.querySelectorAll('#mode-toggle + .dropdown-menu button[data-theme-mode]').forEach((button) => {
        button.classList.toggle('active', button.dataset.themeMode === theme);
      });
      for (const key of Object.keys(settings)) {
        const value = root.getAttribute(`data-display-${key}`) || 'default';
        dialog.querySelectorAll(`input[name="display-${key}"]`).forEach((input) => {
          input.checked = input.value === value;
        });
      }
    };

    const setTheme = (mode) => {
      store('theme-system-preference', mode === 'system' ? 'true' : null);
      try {
        window.Theme.update(mode);
      } catch {
        storageAvailable = false;
        root.dataset.bsTheme = mode === 'system'
          ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode;
        root.toggleAttribute('data-theme-persisted', mode !== 'system');
      }
    };

    const savedMessage = () => {
      status.textContent = storageAvailable
        ? 'Choices are saved in this browser.'
        : 'Changes apply here, but this browser cannot save them.';
    };

    toggle.addEventListener('click', () => {
      sync();
      savedMessage();
      dialog.showModal();
      document.body.classList.add('display-settings-open');
    });
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      document.body.classList.remove('display-settings-open');
      toggle.focus({ preventScroll: true });
    });

    dialog.addEventListener('change', (event) => {
      const input = event.target;
      if (!input.matches('input[type="radio"]')) return;
      const key = input.name.replace('display-', '');
      if (key === 'theme') setTheme(input.value);
      else if (settings[key]?.includes(input.value)) {
        apply(key, input.value);
        store(`display-${key}`, input.value === 'default' ? null : input.value);
      }
      sync();
      savedMessage();
    });

    reset.addEventListener('click', () => {
      for (const key of Object.keys(settings)) {
        apply(key, 'default');
        store(`display-${key}`, null);
      }
      setTheme('dark');
      sync();
      status.textContent = storageAvailable
        ? 'Default display settings restored.'
        : 'Defaults restored here; this browser cannot save them.';
    });

    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.target.matches('.display-options input[type="radio"]')) {
        event.preventDefault();
        event.target.click();
        return;
      }
      if (event.key !== 'Tab') return;
      if (event.shiftKey && document.activeElement === close) {
        event.preventDefault();
        reset.focus();
      } else if (!event.shiftKey && document.activeElement === reset) {
        event.preventDefault();
        close.focus();
      }
    });

    const outside = (event) => {
      const box = dialog.getBoundingClientRect();
      return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    };
    let pressedBackdrop = false;
    dialog.addEventListener('pointerdown', (event) => {
      pressedBackdrop = event.target === dialog && outside(event);
    });
    dialog.addEventListener('click', (event) => {
      if (pressedBackdrop && event.target === dialog && outside(event)) dialog.close();
      pressedBackdrop = false;
    });

    new MutationObserver(sync).observe(root, {
      attributes: true,
      attributeFilter: ['data-bs-theme', 'data-theme-persisted']
    });
    sync();
  });
})();
