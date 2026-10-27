(() => {
  const dialog = document.getElementById('citation-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  document.body.append(dialog);
  const text = dialog.querySelector('#citation-text');
  const publication = dialog.querySelector('[data-citation-publication]');
  const status = dialog.querySelector('[data-citation-status]');
  const download = dialog.querySelector('[data-citation-download]');
  const copy = dialog.querySelector('[data-citation-copy]');
  const copyIcon = copy.querySelector('i');
  const copyLabel = copy.querySelector('span');
  const citations = new Map();
  let opener;
  let request;
  let session = 0;
  let resetTimer;

  const resetCopy = () => {
    clearTimeout(resetTimer);
    copyIcon.className = 'far fa-copy';
    copyLabel.textContent = 'Copy';
  };

  document.querySelectorAll('a[data-resource="bibtex"]').forEach((link) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', dialog.id);
    link.setAttribute('aria-label', 'BibTeX citation (opens dialog)');
  });

  document.addEventListener('click', async (event) => {
    const link = event.target.closest('a[data-resource="bibtex"]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    request?.abort();
    request = new AbortController();
    const current = ++session;
    resetCopy();
    text.value = '';
    text.setAttribute('aria-busy', 'true');
    copy.disabled = true;
    publication.textContent = link.dataset.citationTitle;
    download.href = link.href;
    status.textContent = 'Loading citation…';
    dialog.showModal();
    document.body.classList.add('citation-dialog-open');

    try {
      let citation = citations.get(link.href);
      if (!citation) {
        const response = await fetch(link.href, { signal: request.signal });
        if (!response.ok) throw new Error('Citation unavailable');
        citation = await response.text();
        if (!citation.trim()) throw new Error('Empty citation');
        citations.set(link.href, citation);
      }
      if (current !== session) return;
      text.value = citation;
      status.textContent = '';
      copy.disabled = false;
    } catch (error) {
      if (current !== session || error.name === 'AbortError') return;
      status.textContent = 'Could not load the citation. Close this dialog and try again, or use Download.';
    } finally {
      if (current === session) text.removeAttribute('aria-busy');
    }
  });

  copy.addEventListener('click', async () => {
    const current = session;
    resetCopy();
    copy.disabled = true;
    try {
      await navigator.clipboard.writeText(text.value);
      if (current !== session) return;
      copyIcon.className = 'fas fa-check';
      copyLabel.textContent = 'Copied';
      status.textContent = 'Copied to clipboard.';
      resetTimer = setTimeout(() => {
        resetCopy();
        status.textContent = '';
      }, 2000);
    } catch {
      if (current !== session) return;
      text.focus();
      text.select();
      status.textContent = 'Could not copy automatically. Copy the selected text instead.';
    } finally {
      if (current === session) copy.disabled = false;
    }
  });

  let pressedBackdrop = false;
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled), a[href], textarea')]
      .filter((control) => control.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const outside = (event) => {
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };
  dialog.addEventListener('pointerdown', (event) => {
    pressedBackdrop = event.target === dialog && outside(event);
  });
  dialog.addEventListener('click', (event) => {
    if (pressedBackdrop && event.target === dialog && outside(event)) dialog.close();
    pressedBackdrop = false;
  });
  dialog.addEventListener('close', () => {
    session++;
    request?.abort();
    resetCopy();
    document.body.classList.remove('citation-dialog-open');
    opener?.focus({ preventScroll: true });
  });
})();
