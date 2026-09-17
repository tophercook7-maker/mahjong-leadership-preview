/* ============================================================
   Reader Resources library — resources.html
   Gate: the library shows once the reader has signed up (a flag in
   their browser) or arrives with the permanent link (?access=reader).

   ADDING CONTENT — one line each, nothing else to touch:
   • a framework: drop the PNG in assets/frameworks/ and add it to
     FRAMEWORKS in game.js (the tile board picks it up too), then run
     tools/build-frameworks-zip.sh so "Download All" includes it.
   • the bonus chapter: set BONUS.file (and its description).
   • worksheets: set WORKSHEETS[n].file — one printer-friendly PDF,
     one fillable PDF.
   ============================================================ */
const BONUS = {
  title: 'The Bonus Chapter',
  desc:  'An additional parallel written for readers of the book.',   // Maureen will supply the description
  file:  ''                                                            // e.g. 'assets/resources/Ancient-Game-Modern-Leadership-Bonus-Chapter.pdf'
};

const WORKSHEETS = [
  { title: 'Put It into Play — printer-friendly', desc: 'All ten worksheets in one PDF, formatted to print.', file: '' },
  { title: 'Put It into Play — fillable',         desc: 'The same worksheets as a fillable PDF you can complete on screen and save.', file: '' }
];

function isUnlocked(){
  const q = new URLSearchParams(location.search);
  if (q.get('access')){ try { localStorage.setItem(READER_KEY, '1'); } catch(_){} return true; }
  try { return localStorage.getItem(READER_KEY) === '1'; } catch(_){ return false; }
}

function item({ n, title, desc, file, track: ev }){
  const ready = !!file;
  return `<div class="lib-item${ready ? ' ready' : ''}">
    ${n ? `<span class="n">Parallel ${n}</span>` : ''}
    <span class="t">${title}</span>
    <span class="d">${desc}</span>
    ${ready
      ? `<a class="dl" href="${file}" download data-track="${ev}">Download ↓</a>`
      : `<span class="dl soon">Coming soon</span>`}
  </div>`;
}

function buildLibrary(){
  const gate = document.getElementById('gate');
  const lib  = document.getElementById('library');
  if (!gate || !lib) return;

  if (!isUnlocked()){ track('reader-gate-view'); return; }
  gate.hidden = true;
  lib.hidden  = false;
  if (new URLSearchParams(location.search).get('welcome')) document.getElementById('welcome').hidden = false;
  track('reader-library-view');

  // frameworks — LESSONS (site.js) gives the ten parallels, FRAMEWORKS (game.js) says which are designed
  document.getElementById('fwGrid').innerHTML = LESSONS.map(L => {
    const fw = FRAMEWORKS[L.n];
    return item({ n: L.n, title: L.t, desc: L.tip, file: fw ? fw.file : '', track: `download-framework-${L.n}` });
  }).join('');
  const ready = LESSONS.filter(L => FRAMEWORKS[L.n]).length;
  const all = document.getElementById('dlAll'), note = document.getElementById('dlAllNote');
  if (ready === 0){ all.classList.add('soon'); all.textContent = 'Download All Ten Frameworks — coming soon'; }
  else if (ready < 10){ all.textContent = `Download All Available Frameworks ↓`; note.textContent = `${ready} of 10 designed so far — the rest are on their way.`; }

  document.getElementById('bonusGrid').innerHTML = item({ title: BONUS.title, desc: BONUS.desc, file: BONUS.file, track: 'download-bonus-chapter' });
  document.getElementById('wsGrid').innerHTML = WORKSHEETS.map((w, i) => item({ ...w, track: `download-worksheets-${i ? 'fillable' : 'print'}` })).join('');

  // count every download
  lib.querySelectorAll('[data-track]').forEach(a => a.addEventListener('click', () => track(a.dataset.track)));
  observeReveals(lib);
}

document.addEventListener('DOMContentLoaded', buildLibrary);
