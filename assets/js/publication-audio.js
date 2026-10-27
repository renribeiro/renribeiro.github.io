(() => {
  const formatTime = (seconds) => {
    const value = Math.max(0, Math.floor(seconds || 0));
    const minutes = Math.floor(value / 60);
    const remainder = String(value % 60).padStart(2, '0');
    return value >= 3600
      ? `${Math.floor(value / 3600)}:${String(minutes % 60).padStart(2, '0')}:${remainder}`
      : `${minutes}:${remainder}`;
  };

  document.querySelectorAll('[data-publication-audio]').forEach((player) => {
    const audio = player.querySelector('audio');
    const recordingURL = audio.src;
    const play = player.querySelector('.narration-play');
    const icon = play.querySelector('i');
    const seek = player.querySelector('.narration-seek');
    const speed = player.querySelector('select');
    const skips = player.querySelectorAll('[data-skip]');
    const status = player.querySelector('.narration-status');
    const chapterLabel = player.querySelector('.narration-current-chapter');
    const chapterToggle = player.querySelector('.narration-chapters-toggle');
    const chapterPanel = player.querySelector('.narration-chapters');
    let chapters = [];
    let chapterButtons = [];
    let activeChapter = -1;
    let bars = [];
    let pending = false;
    let objectURL = null;
    let loadController = null;
    let recordingDuration = 0;
    let targetTime = 0;
    let leaving = false;

    const duration = () => Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : recordingDuration;
    const position = () => audio.readyState >= 1 ? audio.currentTime : targetTime;
    const seekTo = (time) => {
      targetTime = Math.max(0, Math.min(duration(), time));
      if (audio.readyState >= 1) audio.currentTime = targetTime;
      update();
    };

    const releaseAudio = () => {
      loadController?.abort();
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      if (objectURL) URL.revokeObjectURL(objectURL);
      objectURL = null;
    };

    const prepareAudio = async () => {
      if (objectURL && !audio.error) return;
      releaseAudio();
      const controller = new AbortController();
      loadController = controller;
      const timeout = setTimeout(() => controller.abort(), 120000);
      try {
        const response = await fetch(recordingURL, { cache: 'no-store', signal: controller.signal });
        if (response.status !== 200) throw new Error(`Recording request returned HTTP ${response.status}.`);
        const blob = await response.blob();
        if (!blob.size) throw new Error('The recording is empty.');
        objectURL = URL.createObjectURL(blob);
        await new Promise((resolve, reject) => {
          const cleanup = () => {
            audio.removeEventListener('loadedmetadata', loaded);
            audio.removeEventListener('error', failed);
            controller.signal.removeEventListener('abort', aborted);
          };
          const loaded = () => { cleanup(); resolve(); };
          const failed = () => { cleanup(); reject(new Error(audio.error?.message || 'The recording could not be decoded.')); };
          const aborted = () => { cleanup(); reject(new DOMException('Recording loading was cancelled.', 'AbortError')); };
          if (controller.signal.aborted) { aborted(); return; }
          audio.addEventListener('loadedmetadata', loaded);
          audio.addEventListener('error', failed);
          controller.signal.addEventListener('abort', aborted, { once: true });
          audio.preload = 'auto';
          audio.src = objectURL;
          audio.load();
        });
        audio.currentTime = targetTime;
        audio.playbackRate = Number(speed.value);
      } catch (error) {
        releaseAudio();
        throw error;
      } finally {
        clearTimeout(timeout);
        if (loadController === controller) loadController = null;
      }
    };

    const update = () => {
      const length = duration();
      const time = position();
      const ready = length > 0;
      const playing = !audio.paused && !audio.ended;
      play.setAttribute('aria-label', playing ? 'Pause narration' : audio.ended ? 'Replay narration' : 'Play narration');
      icon.className = playing ? 'fas fa-pause' : 'fas fa-play';
      seek.disabled = !ready;
      skips.forEach((button) => { button.disabled = !ready; });
      seek.max = ready ? length : 100;
      seek.value = time;
      let chapterIndex = -1;
      chapters.forEach((chapter, index) => { if (time >= chapter.start) chapterIndex = index; });
      const chapterTitle = chapters[chapterIndex]?.title;
      seek.setAttribute('aria-valuetext', `${formatTime(time)} of ${ready ? formatTime(length) : 'unknown duration'}${chapterTitle ? `, ${chapterTitle}` : ''}`);
      chapterButtons.forEach((button) => { button.disabled = !ready; });
      if (chapterIndex !== activeChapter) {
        activeChapter = chapterIndex;
        chapterLabel.textContent = chapterTitle || '';
        chapterButtons.forEach((button, index) => {
          if (index === chapterIndex) button.setAttribute('aria-current', 'true');
          else button.removeAttribute('aria-current');
        });
      }
      player.querySelector('[data-elapsed]').textContent = formatTime(time);
      player.querySelector('[data-duration]').textContent = ready ? formatTime(length) : '—:—';
      const progress = ready ? time / length : 0;
      bars.forEach((bar) => bar.classList.toggle('is-played', Number(bar.dataset.progress) < progress));
    };

    play.addEventListener('click', async () => {
      if (!audio.paused) { audio.pause(); return; }
      if (pending) return;
      pending = true;
      play.setAttribute('aria-busy', 'true');
      status.textContent = objectURL ? '' : 'Loading audio…';
      try {
        if (audio.ended) seekTo(0);
        else targetTime = position();
        await prepareAudio();
        if (leaving) return;
        await audio.play();
      } catch (error) {
        if (!leaving) status.textContent = error.name === 'NotAllowedError'
          ? 'Audio is ready. Press Play to start.'
          : 'Audio could not load. Try Play again, or download the recording.';
      } finally {
        pending = false;
        play.removeAttribute('aria-busy');
        update();
      }
    });
    seek.addEventListener('input', () => seekTo(Number(seek.value)));
    skips.forEach((button) => button.addEventListener('click', () => {
      seekTo(position() + Number(button.dataset.skip));
    }));
    speed.addEventListener('change', () => { audio.playbackRate = Number(speed.value); });
    const closeChapters = () => {
      chapterPanel.hidden = true;
      chapterToggle.setAttribute('aria-expanded', 'false');
    };
    chapterToggle.addEventListener('click', () => {
      chapterPanel.hidden = !chapterPanel.hidden;
      chapterToggle.setAttribute('aria-expanded', String(!chapterPanel.hidden));
    });
    player.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !chapterPanel.hidden) {
        event.preventDefault();
        event.stopPropagation();
        closeChapters();
        chapterToggle.focus();
      }
    });
    ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended', 'emptied'].forEach((event) => audio.addEventListener(event, update));
    audio.addEventListener('playing', () => {
      status.textContent = '';
      document.querySelectorAll('[data-publication-audio] audio').forEach((other) => { if (other !== audio) other.pause(); });
    });
    audio.addEventListener('waiting', () => { status.textContent = 'Loading audio…'; });
    audio.addEventListener('error', () => { status.textContent = 'Audio is unavailable. Try again, or download the recording.'; });
    window.addEventListener('pagehide', () => {
      leaving = true;
      targetTime = position();
      releaseAudio();
    });
    window.addEventListener('pageshow', () => { leaving = false; update(); });
    update();
    audio.hidden = true;
    play.hidden = false;
    player.querySelector('.narration-controls').hidden = false;

    const waveformURL = new URL(recordingURL);
    waveformURL.pathname = waveformURL.pathname.replace(/\.[^.]+$/, '.json');
    fetch(waveformURL).then((response) => response.ok ? response.json() : null).then((data) => {
      if (!Array.isArray(data?.peaks) || !data.peaks.length) return;
      if (Number.isFinite(data.duration) && data.duration > 0) recordingDuration = data.duration;
      if (Number.isFinite(data.duration) && data.duration > 0 && Array.isArray(data.chapters) && data.chapters.length > 1 && data.chapters.every((chapter, index, all) =>
        typeof chapter.title === 'string' && chapter.title.trim() && Number.isFinite(chapter.start) &&
        chapter.start < data.duration && (index === 0 ? chapter.start === 0 : chapter.start > all[index - 1].start)
      )) {
        chapters = data.chapters;
        const list = chapterPanel.querySelector('ol');
        chapterButtons = chapters.map((chapter) => {
          const item = document.createElement('li');
          const button = document.createElement('button');
          button.type = 'button';
          const title = document.createElement('span');
          title.textContent = chapter.title;
          const time = document.createElement('span');
          time.textContent = formatTime(chapter.start);
          time.setAttribute('aria-hidden', 'true');
          button.setAttribute('aria-label', `Jump to ${chapter.title}, ${formatTime(chapter.start)}`);
          button.append(title, time);
          button.addEventListener('click', () => {
            seekTo(chapter.start);
            closeChapters();
            chapterToggle.focus();
          });
          item.append(button);
          list.append(item);
          return button;
        });
        chapterToggle.hidden = false;
        chapterLabel.hidden = false;
      }
      const peaks = data.peaks.slice(0, 200);
      const boundaries = chapters.slice(1).map((chapter) => chapter.start / data.duration * peaks.length * 6);
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', `0 0 ${peaks.length * 6} 56`);
      svg.setAttribute('preserveAspectRatio', 'none');
      bars = peaks.flatMap((peak, index) => {
        if (boundaries.some((boundary) => Math.abs(index * 6 + 1.5 - boundary) < 6)) return [];
        const height = 4 + 44 * Math.max(0, Math.min(1, Number(peak) || 0));
        const bar = document.createElementNS(ns, 'rect');
        bar.dataset.progress = index / peaks.length;
        Object.entries({ x: index * 6, y: (56 - height) / 2, width: 3, height, rx: 1.5 }).forEach(([key, value]) => bar.setAttribute(key, value));
        svg.append(bar);
        return bar;
      });
      boundaries.forEach((boundary) => {
        const tick = document.createElementNS(ns, 'line');
        Object.entries({ x1: boundary, x2: boundary, y1: 52, y2: 56 }).forEach(([key, value]) => tick.setAttribute(key, value));
        svg.append(tick);
      });
      player.querySelector('.narration-waveform').replaceChildren(svg);
      update();
    }).catch(() => { /* Seeking still works without waveform data. */ });
  });
})();
