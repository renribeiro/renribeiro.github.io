(() => {
  if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || !('serviceWorker' in navigator)) return;
  const baseurl = document.currentScript.dataset.baseurl || '';
  const workerUrl = new URL(`${baseurl}/sw.min.js`, location.origin).href;
  const scopeUrl = new URL(`${baseurl}/`, location.origin).href;

  (async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const chirpy = registrations.filter(registration => registration.scope === scopeUrl &&
      [registration.active, registration.waiting, registration.installing].some(worker => worker?.scriptURL === workerUrl));
    if (!chirpy.length) return;

    const controlled = navigator.serviceWorker.controller?.scriptURL === workerUrl;
    const removed = await Promise.all(chirpy.map(registration => registration.unregister()));
    if (removed.some(Boolean) && 'caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.filter(name => name.startsWith('chirpy-')).map(name => caches.delete(name)));
    }
    if (controlled && removed.some(Boolean)) location.reload();
  })().catch(error => console.warn('Unable to clear the local Chirpy preview cache:', error));
})();
