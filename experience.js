/* La experiencia comparte el contenido y el progreso definidos en app.js. */
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const icons = ['✧', '〰', '❋', '◌', '✦', '↗', '☾', '✉'];
const page = location.pathname.split('/').pop() || 'index.html';
const chapterMatch = page.match(/^capitulo-(\d+)\.html$/);
let leaving = false;
function go(url) {
  if (leaving) return;
  leaving = true;
  document.body.classList.add('departing');
  setTimeout(() => location.href = url, reducedMotion ? 0 : 550);
}
function burst(x = innerWidth / 2, y = innerHeight / 2) {
  if (reducedMotion) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'light-particle';
    p.textContent = i % 3 ? '·' : '✦';
    p.style.cssText = `left:${x}px;top:${y}px;--dx:${(Math.random()-.5)*350}px;--dy:${(Math.random()-.5)*350}px;--spin:${Math.random()*180}deg`;
    document.body.append(p);
    setTimeout(() => p.remove(), 1300);
  }
}
function garden() {
  return `<div class="living-garden"><div class="garden-portal"><div class="portal-ring"></div><div class="portal-ring ring-two"></div><div class="garden-moon" aria-hidden="true">☾</div><div class="garden-ground"></div>${[0,1,2].map((n) => `<button class="bloom bloom-${n}" aria-label="Encender flor ${n+1}" aria-pressed="false"><span class="flower-head">${Array.from({length:8},(_,i)=>`<i style="--petal:${i}"></i>`).join('')}<b></b></span><span class="flower-stem"></span><span class="flower-leaf"></span></button>`).join('')}<div class="fireflies" aria-hidden="true">${Array.from({length:14},(_,i)=>`<i style="--i:${i};left:${8+(i*23)%85}%;top:${10+(i*17)%80}%"></i>`).join('')}</div></div><p class="garden-hint" id="garden-hint" aria-live="polite">Toca las flores. Este jardín también responde a ti.</p></div>`;
}
function entrance() {
  document.body.dataset.view = 'entrance';
  app.innerHTML = `<section class="hero"><div class="hero-copy"><div class="eyebrow">✦ NO ES UN DÍA ESPECIAL. TÚ SÍ.</div><h1>Hay encuentros<br>que se vuelven<br><em>un poquito de luz.</em></h1><p class="intro">Y luego estás tú, haciendo que todo<br>se sienta un poco más bonito.</p><div class="invitation"><span class="invitation-mark">L</span><div>Un regalo para ti, Luz.<small>Ocho capítulos. Ocho cosas por descubrir.</small></div></div><form class="form"><label for="date">¿RECUERDAS EL DÍA EN QUE NOS CONOCIMOS?</label><div class="input-wrap"><span aria-hidden="true">✧</span><input id="date" placeholder="DD / MM / AAAA" autocomplete="off" inputmode="numeric" required aria-describedby="error"><button type="submit" aria-label="Abrir mi regalo">↗</button></div><div class="form-bottom"><span>Una fecha que tiene tu nombre</span><span>Un secreto entre los dos</span></div><div id="error" class="error" role="status"></div></form></div>${garden()}<div class="hero-caption"><span>01 — EL INICIO DE ALGO BONITO</span><span>Hecho con calma. Pensando en ti.</span></div></section>`;
  const messages = ['Tu voz.', 'Tu manera de tratarme.', 'Tu compañía.'];
  document.querySelectorAll('.bloom').forEach((flower,i) => flower.addEventListener('click', () => {
    flower.setAttribute('aria-pressed','true');
    document.querySelector('#garden-hint').textContent = messages[i];
    const box = flower.getBoundingClientRect();
    burst(box.x+box.width/2,box.y+30);
  }));
  document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    if (document.querySelector('#date').value.replace(/\D/g,'') !== '22092026') {
      document.querySelector('#error').textContent = 'Pista: día, mes y año de nuestro primer encuentro.';
      document.querySelector('.input-wrap').animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}], {duration:250});
      return;
    }
    unlocked = true; persist();
    document.querySelectorAll('.bloom').forEach(f=>f.setAttribute('aria-pressed','true'));
    document.querySelector('form button').disabled = true;
    document.querySelector('#error').textContent = 'Sí, ese día. Todo esto es para ti…';
    document.body.classList.add('opening-gift');
    burst(); setTimeout(()=>go('universo.html'), reducedMotion ? 0 : 1200);
  });
}
function universe() {
  document.body.dataset.view = 'universe';
  document.querySelector('#counter').textContent = `${completed} / 8 CAPÍTULOS DESCUBIERTOS`;
  app.innerHTML = `<section class="map-heading"><div><div class="eyebrow">EL JARDÍN DE NUESTRA HISTORIA</div><h1>Todo esto tiene<br><em>un poquito de ti.</em></h1></div><div class="map-intro"><p>Abre una puerta, descubre su pequeño secreto y deja que el jardín siga creciendo.</p><div class="progress"><span style="width:${completed/8*100}%"></span></div><small>${completed===8?'Todo floreció. Este lugar siempre es tuyo.':'Tu recorrido se guarda en este navegador.'}</small></div></section><div class="grid">${chapters.map((c,i)=>{
    const open=i<=completed;
    return `<${open?'a':'div'} class="chapter ${open?'':'locked'} ${i===completed?'current-door':''}" ${open?`href="capitulo-${i+1}.html"`:'aria-disabled="true"'}><div class="card-top"><small>CAPÍTULO 0${i+1}</small><span>${i<completed?'✓':open?'↗':'⌑'}</span></div><div class="card-art" aria-hidden="true">${icons[i]}</div><div class="card-bottom"><h2>${c[0]}</h2><p>${c[1]}</p><span class="card-status">${i<completed?'VOLVER A DESCUBRIR':open?'ESTA PUERTA TE ESPERA':'ESPERANDO SU MOMENTO'}</span></div></${open?'a':'div'}>`;
  }).join('')}</div><div class="map-ending"><span>✧</span><p>Algunas historias apenas empiezan.<br>Y aun así, ya merecen un lugar bonito.</p></div>`;
}
const discoveries = {
  1: {instruction:'Desliza para volver al día en que empezó todo.', html:'<label class="range-label" for="timeline">Volver al comienzo <span id="timeline-value">0%</span></label><input id="timeline" class="timeline" type="range" min="0" max="100" value="0"><div class="discovery-result" id="timeline-result" aria-live="polite">Un día cualquiera… hasta que coincidimos.</div>'},
  2: {instruction:'Toca cada palabra para descubrir lo que quería decirte.', html:'<div class="word-buttons"><button data-reveal="Me gusta escucharte. Así, sin necesitar una ocasión especial.">Escucharte</button><button data-reveal="A veces lo más bonito es una conversación sencilla contigo.">Conversar</button><button data-reveal="Tu voz es una de esas cosas que me alegra haber descubierto.">Descubrirte</button></div><p class="discovery-result" id="reveal-result" aria-live="polite">Hay algo detrás de cada palabra.</p>'},
  3: {instruction:'Dale la vuelta a esta pequeña nota.', html:'<button class="flip-note" aria-expanded="false"><span class="flip-front">Hay detalles que se quedan.<small>Toca para darle la vuelta ↻</small></span><span class="flip-back">Tu forma de tratarme es uno de ellos.<small>Gracias por eso, Luz.</small></span></button>'},
  4: {instruction:'Enciende esta pequeña linterna.', html:'<button class="lantern" aria-pressed="false" aria-label="Encender la linterna"><span class="lantern-handle"></span><span class="lantern-light">✦</span></button><p class="discovery-result" id="lantern-result" aria-live="polite">A veces basta con una pequeña luz cerca.</p>'},
  6: {instruction:'Elige una pequeña posibilidad. Aquí todavía cabe mucho.', html:'<div class="word-buttons"><button data-reveal="Seguir conociendo las cosas que te hacen sonreír.">Una conversación</button><button data-reveal="Encontrar una nueva razón para reírnos juntos.">Una risa</button><button data-reveal="Guardar algo sencillo que después nos guste recordar.">Un recuerdo</button></div><p class="discovery-result" id="reveal-result" aria-live="polite">¿Por dónde seguimos?</p>'},
  7: {instruction:'Elige las palabras que te gustaría encontrar hoy.', html:'<div class="word-buttons"><button data-reveal="Puedes ir a tu ritmo. No tienes que resolverlo todo en un solo día.">Un respiro</button><button data-reveal="Este jardín existe porque a alguien le alegra haberte conocido.">Una sonrisa</button><button data-reveal="Una pausa también puede ser parte del camino. Descansa si lo necesitas.">Un poquito de calma</button></div><p class="discovery-result" id="reveal-result" aria-live="polite">Este rincón se abre cuando lo necesites.</p>'}
};
function chapter(number) {
  if(number<1||number>8||number>completed+1) {location.replace('universo.html');return;}
  const c = chapters[number-1];
  document.body.dataset.view='chapter'; document.body.dataset.chapter=number;
  document.title = `${c[0]} · Para Luz`;
  document.querySelector('#counter').textContent=`CAPÍTULO 0${number} / 08`;
  const activity = discoveries[number];
  app.innerHTML=`<article class="reading"><aside class="chapter-side"><a href="universo.html" class="back-link">← Volver al jardín</a><div class="chapter-number">0${number}</div><div class="side-icon" aria-hidden="true">${icons[number-1]}</div><div class="side-caption">UN PEQUEÑO REGALO<br>PARA UNA GRAN PERSONA</div></aside><div class="chapter-content"><div class="eyebrow">0${number} · ${c[0].toUpperCase()}</div><h1>${c[2]}</h1>${number===8?'<button class="envelope" id="envelope" aria-expanded="false"><span>✉</span>Hay unas palabras esperando por ti<small>Toca para abrir tu carta ↗</small></button><div id="letter-body" hidden>'+c[3]+'</div>':c[3]}${activity?`<section class="discovery"><div class="discovery-label">✧ UN PEQUEÑO DESCUBRIMIENTO</div><p>${activity.instruction}</p>${activity.html}</section>`:''}<p id="activity-status" class="activity-status" role="status">${number===8?'Abre el sobre para descubrir el final.':'Descubre el detalle de este capítulo para continuar.'}</p><nav class="nav"><a class="button secondary" href="universo.html">← Mi universo</a><button id="next" disabled>${number===8?'Guardar este final ✦':'Abrir la siguiente puerta →'}</button></nav></div></article>`;
  let ready = false;
  function finish() {
    if(ready)return;
    ready=true;
    document.querySelector('#next').disabled=false;
    document.querySelector('#activity-status').textContent=number===8?'El jardín siempre estará aquí para ti.':'Una nueva puerta está lista para ti.';
    document.querySelector('#next').classList.add('just-unlocked');
  }
  document.querySelectorAll('[data-reveal]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-reveal]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const result=document.querySelector('#reveal-result');
    result.textContent=button.dataset.reveal;
    if(!reducedMotion)result.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:400});
    finish();
  }));
  const slider=document.querySelector('#timeline');
  if(slider)slider.addEventListener('input',()=>{
    const value=Number(slider.value);
    document.querySelector('#timeline-value').textContent=`${value}%`;
    document.querySelector('.date').style.opacity=.2+value/125;
    document.querySelector('#timeline-result').textContent=value<100?'Un día cualquiera… hasta que coincidimos.':'22 de septiembre de 2026. Ahí empezó conocerte.';
    if(value===100){burst();finish();}
  });
  const flip=document.querySelector('.flip-note');
  if(flip)flip.addEventListener('click',()=>{flip.classList.toggle('flipped');flip.setAttribute('aria-expanded',String(flip.classList.contains('flipped')));finish();});
  const lantern=document.querySelector('.lantern');
  if(lantern)lantern.addEventListener('click',()=>{lantern.setAttribute('aria-pressed','true');document.body.classList.add('lantern-on');document.querySelector('#lantern-result').textContent='Gracias por esa compañía que hace todo un poco más cálido.';burst();finish();});
  document.querySelectorAll('.star').forEach(b=>b.addEventListener('click',()=>{
    b.textContent='✦';b.setAttribute('aria-pressed','true');document.querySelector('#star-note').textContent=b.dataset.note;
    const box=b.getBoundingClientRect();burst(box.x+box.width/2,box.y+box.height/2);
    if(document.querySelectorAll('.star[aria-pressed="true"]').length===3)finish();
  }));
  const envelope=document.querySelector('#envelope');
  if(envelope)envelope.addEventListener('click',()=>{
    envelope.disabled=true; envelope.setAttribute('aria-expanded','true');envelope.classList.add('unsealing');burst();
    setTimeout(()=>{envelope.hidden=true;document.querySelector('#letter-body').hidden=false;finish();},reducedMotion?0:700);
  });
  document.querySelector('#next').addEventListener('click',()=>{
    if(!ready)return;
    completed=Math.max(completed,number);persist();go(number===8?'universo.html':`capitulo-${number+1}.html`);
  });
}
if(!unlocked||page==='index.html')entrance();else if(chapterMatch)chapter(Number(chapterMatch[1]));else universe();

// Navegación con una salida suave sin romper abrir enlaces en otra pestaña.
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const url=new URL(link.href,location.href);
  if(url.origin===location.origin && url.pathname.endsWith('.html')){event.preventDefault();go(link.href);}
});
addEventListener('pageshow',()=>{leaving=false;document.body.classList.remove('departing','opening-gift');});

// La escena reacciona al puntero. En pantallas táctiles se mantienen los botones.
if(!reducedMotion && matchMedia('(pointer: fine)').matches) {
  let frame=0;
  document.addEventListener('pointermove',event=>{
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      document.body.style.setProperty('--pointer-x',`${(event.clientX/innerWidth-.5)*18}px`);
      document.body.style.setProperty('--pointer-y',`${(event.clientY/innerHeight-.5)*12}px`);
      document.querySelectorAll('.chapter:not(.locked)').forEach(card=>{
        const rect=card.getBoundingClientRect();
        const inside=event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;
        card.style.setProperty('--tilt-x',inside?`${-(event.clientY-rect.top-rect.height/2)/24}deg`:'0deg');
        card.style.setProperty('--tilt-y',inside?`${(event.clientX-rect.left-rect.width/2)/24}deg`:'0deg');
      });frame=0;
    });
  });
}
