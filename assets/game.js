/* ============================================================
   The tile board — "Explore the Book"
   Ten tiles, one per leadership parallel. Tap a tile to turn it
   over; if that parallel's framework has been designed, the back
   offers a link that opens the framework full-size.

   ADDING A FRAMEWORK: drop the artwork in assets/frameworks/ and
   add one line to FRAMEWORKS below, keyed by parallel number.
   The tile picks it up automatically — nothing else to change.
   ============================================================ */
// 26 Oct: all ten designed leadership models. file = web image (tile lightbox), pdf = print-quality download.
const FRAMEWORKS = {
  1: { name: 'CURATE', file: 'assets/frameworks/01-curate.png', pdf: 'assets/frameworks/pdf/Leadership-Model-01-CURATE.pdf' },
  2: { name: 'RULES', file: 'assets/frameworks/02-rules.png', pdf: 'assets/frameworks/pdf/Leadership-Model-02-RULES.pdf' },
  3: { name: 'RITUAL', file: 'assets/frameworks/03-ritual.png', pdf: 'assets/frameworks/pdf/Leadership-Model-03-RITUAL.pdf' },
  4: { name: 'OBSERVE', file: 'assets/frameworks/04-observe.png', pdf: 'assets/frameworks/pdf/Leadership-Model-04-OBSERVE.pdf' },
  5: { name: 'RESET', file: 'assets/frameworks/05-reset.png', pdf: 'assets/frameworks/pdf/Leadership-Model-05-RESET.pdf' },
  6: { name: 'PIVOT', file: 'assets/frameworks/06-pivot.png', pdf: 'assets/frameworks/pdf/Leadership-Model-06-PIVOT.pdf' },
  7: { name: 'SHIFT', file: 'assets/frameworks/07-shift.png', pdf: 'assets/frameworks/pdf/Leadership-Model-07-SHIFT.pdf' },
  8: { name: 'WIN', file: 'assets/frameworks/08-win.png', pdf: 'assets/frameworks/pdf/Leadership-Model-08-WIN.pdf' },
  9: { name: 'GROW', file: 'assets/frameworks/09-grow.png', pdf: 'assets/frameworks/pdf/Leadership-Model-09-GROW.pdf' },
  10: { name: 'CONNECT', file: 'assets/frameworks/10-connect.png', pdf: 'assets/frameworks/pdf/Leadership-Model-10-CONNECT.pdf' }
};

let opened = 0;

/* tile face colour follows the phase it belongs to */
const FACE_COLOR = ['var(--green)', 'var(--navy)', 'var(--red)', '#8a6d2f'];

function buildBoard(){
  const phasesEl = document.getElementById('phases');
  if (!phasesEl) return;

  PHASES.forEach((ph, pi) => {
    const col = document.createElement('div');
    col.className = 'phase';
    col.innerHTML = `<span class="h4b"><span class="ph-sub">${ph.s}</span>${ph.h}</span>
                     <div class="tiles" data-p="${pi}"></div>`;
    phasesEl.appendChild(col);
  });

  LESSONS.forEach(L => {
    const holder = phasesEl.querySelector(`.tiles[data-p="${L.p}"]`);
    const fw = FRAMEWORKS[L.n];
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'tile' + (fw ? ' has-framework' : '');
    tile.setAttribute('aria-label', `Parallel ${L.n}: ${L.t} — turn over to read`);
    tile.innerHTML = `
      <div class="tile-inner">
        <div class="tile-face">
          ${fw ? '<span class="fw-flag">✦</span>' : ''}
          <div class="num" style="color:${FACE_COLOR[L.p]}">${L.g}</div>
          <div class="t-title">${L.t}</div>
          <div class="hint">👆 Tap</div>
        </div>
        <div class="tile-back">
          <div class="t-title">${L.n}. ${L.t}</div>
          <div class="tip">${L.tip}</div>
          ${fw ? `<span class="fw-link">See the ${fw.name} framework →</span>` : ''}
        </div>
      </div>`;
    tile.addEventListener('click', e => {
      // on a turned tile, a second tap opens the framework instead of closing
      if (fw && tile.classList.contains('flipped') && e.target.closest('.fw-link')) {
        openFramework(L, fw);
        return;
      }
      flip(tile, L);
    });
    holder.appendChild(tile);
  });
}

function flip(tile, L){
  const msg = document.getElementById('gmsg');
  if (tile.classList.contains('flipped')){
    tile.classList.remove('flipped');
    opened--;
  } else {
    tile.classList.add('flipped');
    opened++;
    msg.textContent = `Parallel ${L.n} — ${L.t}`;
  }
  const counter = document.getElementById('counter');
  counter.textContent = opened === 0
    ? 'Ten parallels — turn over any tile'
    : `${opened} of 10 turned over`;

  if (opened === 10){
    msg.textContent = 'All ten parallels — the full stories are in the book.';
  }
  document.getElementById('resetBtn').style.display = opened > 0 ? 'inline-block' : 'none';
  const cue = document.getElementById('tapCue');
  if (cue) cue.style.display = opened > 0 ? 'none' : '';
}

function revealAll(){
  document.querySelectorAll('.tile:not(.flipped)').forEach(t => t.click());
}

function resetBoard(){
  document.querySelectorAll('.tile.flipped').forEach(t => t.classList.remove('flipped'));
  opened = 0;
  document.getElementById('counter').textContent = 'Ten parallels — turn over any tile';
  document.getElementById('gmsg').textContent = '';
  document.getElementById('resetBtn').style.display = 'none';
  const cue = document.getElementById('tapCue');
  if (cue) cue.style.display = '';
  document.getElementById('phases').classList.add('active');
}

function startBoard(){
  document.getElementById('gintro').classList.add('hide');
  document.getElementById('phases').classList.add('active');
  return true;
}

/* ---- framework viewer ---- */
function openFramework(L, fw){
  let box = document.getElementById('fwbox');
  if (!box){
    box = document.createElement('div');
    box.id = 'fwbox';
    box.innerHTML = `
      <button class="fw-close" type="button" aria-label="Close">✕</button>
      <figure>
        <img alt="">
        <figcaption></figcaption>
      </figure>`;
    document.body.appendChild(box);
    box.addEventListener('click', e => { if (e.target === box || e.target.closest('.fw-close')) closeFramework(); });
  }
  const img = box.querySelector('img');
  img.src = fw.file;
  img.alt = `The ${fw.name} leadership model — Parallel ${L.n}, ${L.t}`;
  box.querySelector('figcaption').innerHTML =
    `Parallel ${L.n} · ${L.t} <a href="${fw.pdf || fw.file}" download>Download ↓</a>`;
  box.classList.add('open');
  document.body.style.overflow = 'hidden';
  box.querySelector('.fw-close').focus();
}

function closeFramework(){
  const box = document.getElementById('fwbox');
  if (!box) return;
  box.classList.remove('open');
  document.body.style.overflow = '';
}

addEventListener('keydown', e => { if (e.key === 'Escape') closeFramework(); });

document.addEventListener('DOMContentLoaded', buildBoard);
