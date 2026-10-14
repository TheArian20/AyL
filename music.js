(() => {
  const storageKey = 'luz-music-v1';
  let state = {};
  try { state = JSON.parse(sessionStorage.getItem(storageKey) || '{}') || {}; } catch {}
  const audio = new Audio('assets/lover-remix.mp3');
  audio.preload = 'metadata';
  audio.loop = true;
  audio.volume = Number.isFinite(state.volume) ? Math.max(0, Math.min(1, state.volume)) : .35;
  let wanted = state.wanted !== false;
  let pending = false;
  let lastSave = 0;
  const player = document.createElement('section');
  player.className = 'music-player';
  player.setAttribute('aria-label', 'Música del regalo');
  player.innerHTML = `<button class="music-toggle" aria-label="Reproducir canción" aria-pressed="false"><span class="music-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button><div class="music-info"><strong>Lover <span>Remix</span></strong><small>Taylor Swift · Shawn Mendes</small><span class="music-status" role="status">Toca para escuchar</span></div><label class="music-volume">Volumen<input type="range" min="0" max="100" value="${Math.round(audio.volume*100)}" aria-label="Volumen de la música"></label>`;
  document.body.append(player);
  const toggle = player.querySelector('.music-toggle');
  const status = player.querySelector('.music-status');
  function save() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({wanted, volume:audio.volume, time:audio.currentTime})); } catch {}
  }
  function update() {
    const playing = !audio.paused;
    player.classList.toggle('is-playing', playing);
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pausar canción' : 'Reproducir canción');
    status.textContent = playing ? 'Sonando para ti' : 'Toca para escuchar';
  }
  async function play() {
    if(pending || !audio.paused) return;
    pending = true;
    try { await audio.play(); } catch { status.textContent = 'Toca el botón para escuchar'; }
    finally { pending = false; }
  }
  toggle.addEventListener('click', event => {
    event.stopPropagation();
    wanted = audio.paused;
    if(wanted) play(); else audio.pause();
    save();
  });
  player.querySelector('input').addEventListener('input', event => {
    audio.volume = Number(event.target.value)/100;
    save();
  });
  audio.addEventListener('loadedmetadata', () => {
    if(Number.isFinite(state.time) && state.time > 0 && state.time < audio.duration) audio.currentTime = state.time;
    // Intenta retomar; si el navegador lo bloquea, espera un gesto de Luz.
    if(state.wanted === true) play();
  });
  audio.addEventListener('play', () => { update(); save(); });
  audio.addEventListener('pause', () => { update(); save(); });
  audio.addEventListener('timeupdate', () => {
    if(Date.now()-lastSave > 1000) { lastSave=Date.now();save(); }
  });
  audio.addEventListener('error', () => { status.textContent='No se pudo cargar la canción'; });
  function startFromGesture(event) {
    if(event.target.closest('.music-player, input, a')) return;
    if(wanted) play();
  }
  document.addEventListener('click', startFromGesture);
  document.addEventListener('keydown', event => {
    if((event.key==='Enter'||event.key===' ') && wanted && !event.target.closest('input')) play();
  });
  addEventListener('pagehide', save);
  addEventListener('pageshow', () => { if(wanted && state.wanted===true) play(); });
})();
