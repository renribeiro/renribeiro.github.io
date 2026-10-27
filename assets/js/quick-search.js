(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('quick-search');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    document.body.append(dialog);
    const input = dialog.querySelector('#quick-search-input');
    const list = dialog.querySelector('#quick-search-options');
    const status = dialog.querySelector('.quick-search-status');
    const close = dialog.querySelector('.quick-search-close');
    const all = dialog.querySelector('.quick-search-all');
    const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const navigation = [...dialog.querySelector('template').content.querySelectorAll('a')].map((link) => ({
      title: link.textContent.trim(), url: link.href, group: 'Navigation', icon: link.dataset.icon
    }));
    navigation.push({ title: 'Display settings', group: 'Settings', icon: 'fa-sliders', action: 'display', keywords: 'appearance theme dark light system contrast text size line spacing' });
    let publications = [];
    let request;
    let loaded = false;
    let failed = false;
    let matches = [];
    let active = -1;
    let opener;
    let afterClose;
    let showingCards = false;

    const setActive = (index, scroll = true) => {
      active = index;
      const options = [...list.querySelectorAll('[role="option"]')];
      options.forEach((option, i) => option.setAttribute('aria-selected', String(i === active)));
      if (options[active]) {
        input.setAttribute('aria-activedescendant', options[active].id);
        if (scroll) options[active].scrollIntoView({ block: 'nearest', behavior: 'instant' });
      } else input.removeAttribute('aria-activedescendant');
    };

    const render = (preserveSelection = false) => {
      const previous = preserveSelection ? matches[active] : null;
      const terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
      matches = [...navigation, ...publications].filter((item) => {
        const searchable = normalize([item.title, item.details, item.authors, item.tags, item.content, item.keywords].join(' '));
        return terms.every((term) => searchable.includes(term));
      }).slice(0, 30);
      list.replaceChildren();
      let group;
      let groupName;
      for (const [index, item] of matches.entries()) {
        if (item.group !== groupName) {
          groupName = item.group;
          group = document.createElement('div');
          group.setAttribute('role', 'group');
          group.setAttribute('aria-label', groupName);
          const heading = document.createElement('p');
          heading.className = 'quick-search-group';
          heading.setAttribute('aria-hidden', 'true');
          heading.textContent = groupName;
          group.append(heading);
          list.append(group);
        }
        const option = document.createElement('div');
        option.id = `quick-search-option-${index}`;
        option.className = 'quick-search-option';
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        option.dataset.index = index;
        const icon = document.createElement('i');
        icon.className = `fas ${item.icon}`;
        icon.setAttribute('aria-hidden', 'true');
        const text = document.createElement('div');
        const title = document.createElement('span');
        title.className = 'quick-search-option-title';
        title.textContent = item.title;
        text.append(title);
        if (item.details) {
          const details = document.createElement('span');
          details.className = 'quick-search-option-details';
          details.textContent = item.details;
          text.append(details);
        }
        option.append(icon, text);
        group.append(option);
      }
      const previousIndex = previous ? matches.indexOf(previous) : -1;
      setActive(previousIndex >= 0 ? previousIndex : (matches.length ? 0 : -1), false);
      list.scrollTop = 0;
      input.setAttribute('aria-expanded', String(dialog.open && matches.length > 0));
      all.hidden = !input.value.trim();
      status.textContent = failed ? 'Publications could not load. Reopen search to retry; navigation still works.'
        : !loaded ? 'Loading publications…'
          : matches.length ? `${matches.length === 30 ? 'Showing the first ' : ''}${matches.length} result${matches.length === 1 ? '' : 's'}.`
            : 'No matches. Try a title, author, or research topic.';
    };

    const load = () => {
      if (loaded || request) return;
      failed = false;
      request = fetch(dialog.dataset.indexUrl)
        .then((response) => {
          if (!response.ok) throw new Error('Search unavailable');
          return response.json();
        })
        .then((items) => {
          publications = items.map((item) => ({ ...item, group: 'Publications', icon: 'fa-file-lines' }));
          loaded = true;
        })
        .catch(() => { failed = true; })
        .finally(() => {
          request = null;
          if (dialog.open) render(true);
        });
    };

    const open = () => {
      if (document.querySelector('dialog[open]:not(#quick-search)')) return;
      if (dialog.open) { input.focus(); input.select(); return; }
      opener = document.activeElement;
      input.value = document.getElementById('search-input').value;
      dialog.showModal();
      document.body.classList.add('quick-search-open');
      load();
      render();
      input.focus();
      input.select();
    };

    const activate = (index) => {
      const item = matches[index];
      if (!item) return;
      afterClose = () => {
        if (item.action === 'display') document.getElementById('display-toggle').click();
        else window.location.assign(item.url);
      };
      dialog.close();
    };

    dialog.addEventListener('close', () => {
      document.body.classList.remove('quick-search-open');
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      const target = opener?.isConnected && opener !== document.body && opener.getClientRects().length
        ? opener : document.querySelector('.search-shortcut');
      if (target?.getClientRects().length) target.focus({ preventScroll: true });
      else document.getElementById('search-trigger').focus({ preventScroll: true });
      const action = afterClose;
      afterClose = null;
      action?.();
    });
    close.addEventListener('click', () => dialog.close());
    input.addEventListener('input', (event) => { if (!event.isComposing) render(); });
    input.addEventListener('compositionend', () => render());
    input.addEventListener('keydown', (event) => {
      if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (matches.length) setActive((active + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        activate(active);
      }
    });
    list.addEventListener('click', (event) => {
      const option = event.target.closest('[role="option"]');
      if (option) activate(Number(option.dataset.index));
    });
    list.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || (!event.movementX && !event.movementY)) return;
      const option = event.target.closest('[role="option"]');
      if (option) setActive(Number(option.dataset.index), false);
    });

    all.addEventListener('click', () => {
      const query = input.value;
      afterClose = () => {
        const field = document.getElementById('search-input');
        showingCards = true;
        document.getElementById('search-trigger').click();
        showingCards = false;
        field.value = query;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.focus();
      };
      dialog.close();
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const controls = [close, input, all].filter((control) => !control.hidden);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    const outside = (event) => {
      const box = dialog.getBoundingClientRect();
      return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    };
    let pressedBackdrop = false;
    dialog.addEventListener('pointerdown', (event) => { pressedBackdrop = event.target === dialog && outside(event); });
    dialog.addEventListener('click', (event) => {
      if (pressedBackdrop && event.target === dialog && outside(event)) dialog.close();
      pressedBackdrop = false;
    });

    document.addEventListener('quick-search:open', open);
    document.querySelector('.search-shortcut').addEventListener('click', open);
    document.getElementById('search-trigger').addEventListener('click', (event) => {
      if (showingCards) return;
      event.stopImmediatePropagation();
      open();
    }, { capture: true });
  });
})();
