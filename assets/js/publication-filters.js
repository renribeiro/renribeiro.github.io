(() => {
  const browser = document.querySelector('[data-publication-browser]');
  if (!browser) return;
  const filters = browser.querySelector('.publication-filters');
  const options = filters.querySelector('.publication-filter-options');
  const status = filters.querySelector('.publication-filter-status');
  const summary = browser.querySelector('.publication-filter-summary');
  const query = browser.querySelector('#publication-filter-query');
  const yearSelect = filters.querySelector('#publication-filter-year');
  const clear = filters.querySelector('.publication-filter-clear');
  const cards = [...browser.querySelectorAll('.publication-entry')];
  const years = [...browser.querySelectorAll('.publications > section')];
  const featuredVenues = ['CHI', 'ASSETS', 'VRST', 'UIST'];
  const otherValue = '__other__';
  const venues = new Map();
  const venueColors = new Map();
  const yearCounts = new Map();
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const searchable = new Map();
  cards.forEach((card) => {
    const venue = card.dataset.publicationVenue.trim();
    venues.set(venue, (venues.get(venue) || 0) + 1);
    venueColors.set(venue, {
      light: card.style.getPropertyValue('--venue-light'),
      dark: card.style.getPropertyValue('--venue-dark')
    });
    const year = card.dataset.publicationYear;
    if (year) yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
    searchable.set(card, normalize([
      venue, year, card.dataset.publicationKeywords,
      ...[...card.querySelectorAll('.publication-title, .publication-authors, .publication-venue, .publication-badge')].map((element) => element.textContent)
    ].join(' ')));
  });
  if (!cards.length) return;

  const sortedYears = [...yearCounts.keys()].sort((a, b) => Number(b) - Number(a));
  for (const year of sortedYears) yearSelect.add(new Option(`${year} (${yearCounts.get(year)})`, year));
  summary.textContent = `${cards.length} publication${cards.length === 1 ? '' : 's'}${sortedYears.length ? ` since ${sortedYears[sortedYears.length - 1]}` : ''}.`;

  const addOption = (label, value, count, checked = false, detail = '') => {
    const option = document.createElement('label');
    option.dataset.venue = value;
    const colors = venueColors.get(value);
    if (colors?.light) option.style.setProperty('--venue-light', colors.light);
    if (colors?.dark) option.style.setProperty('--venue-dark', colors.dark);
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'publication-venue';
    input.value = value;
    input.checked = checked;
    const text = document.createElement('span');
    text.className = 'publication-filter-label';
    const name = document.createElement('span');
    name.className = 'publication-filter-name';
    const visibleName = document.createElement('span');
    visibleName.textContent = label;
    const reserve = document.createElement('span');
    reserve.className = 'publication-filter-name-reserve';
    reserve.setAttribute('aria-hidden', 'true');
    reserve.textContent = label;
    name.append(visibleName, reserve);
    text.append(name);
    const number = document.createElement('span');
    number.className = 'publication-filter-count';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = count;
    const accessibleCount = document.createElement('span');
    accessibleCount.className = 'visually-hidden';
    accessibleCount.textContent = `, ${count} publication${count === 1 ? '' : 's'}${detail ? `; includes ${detail}` : ''}`;
    text.append(number, accessibleCount);
    option.append(input, text);
    options.append(option);
  };

  addOption('All', '', cards.length, true);
  featuredVenues.forEach((venue) => {
    if (venues.has(venue)) addOption(venue, venue, venues.get(venue));
  });
  const otherVenues = [...venues.keys()].filter((venue) => !featuredVenues.includes(venue)).sort((a, b) => a.localeCompare(b));
  const otherCount = otherVenues.reduce((count, venue) => count + venues.get(venue), 0);
  if (otherCount) addOption('Other publications', otherValue, otherCount, false, otherVenues.join(', '));

  const filter = () => {
    const venue = options.querySelector('input:checked').value;
    const year = yearSelect.value;
    const terms = normalize(query.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach((card) => {
      const cardVenue = card.dataset.publicationVenue.trim();
      card.hidden = (venue === otherValue ? featuredVenues.includes(cardVenue) : Boolean(venue) && cardVenue !== venue)
        || (Boolean(year) && card.dataset.publicationYear !== year)
        || !terms.every((term) => searchable.get(card).includes(term));
      if (!card.hidden) count++;
    });
    years.forEach((year) => {
      year.hidden = ![...year.querySelectorAll('.publication-entry')].some((card) => !card.hidden);
    });
    status.textContent = `Showing ${count} of ${cards.length} publications.${count ? '' : ' Try a different filter or clear filters.'}`;
    clear.hidden = !venue && !year && !query.value;
  };

  options.addEventListener('change', (event) => {
    if (event.target.matches('input[name="publication-venue"]')) filter();
  });
  yearSelect.addEventListener('change', filter);
  let inputTimer;
  query.addEventListener('input', (event) => {
    clearTimeout(inputTimer);
    if (!event.isComposing) inputTimer = setTimeout(filter, 150);
  });
  query.addEventListener('compositionend', () => {
    clearTimeout(inputTimer);
    filter();
  });
  clear.addEventListener('click', () => {
    clearTimeout(inputTimer);
    query.value = '';
    yearSelect.value = '';
    options.querySelector('input[value=""]').checked = true;
    filter();
    query.focus({ preventScroll: true });
  });
  filter();
  filters.hidden = false;
  browser.querySelector('.publication-filter-search').hidden = false;
})();
