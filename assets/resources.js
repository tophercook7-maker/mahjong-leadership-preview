/* ============================================================
   Reader Resources library — resources.html
   Gate: the library shows once the reader has signed up (a flag in
   their browser) or arrives with the permanent link (?access=reader).

   ADDING CONTENT — one line each, nothing else to touch:
   • a framework: drop the PNG in assets/frameworks/ and add it to
     FRAMEWORKS in game.js (the tile board picks it up too), then run
     tools/build-frameworks-zip.sh so "Download All" includes it.
   • the bonus chapter: set BONUS.file (and its description).
   • worksheets: one PDF per parallel at
     assets/resources/Put-It-Into-Play-Parallel-NN.pdf, plus the combined
     Put-It-Into-Play-All-Ten-Worksheets.pdf.
   ============================================================ */
const BONUS = {
  title: 'Sample Chapter \u2014 Parallel Six: Master the Art of the Pivot',
  desc:  'A full chapter from Ancient Game. Modern Leadership. \u2014 a leadership reality, a story from the Mahjong table, reflection questions, and actions you can use this week.',
  file:  'assets/resources/Ancient-Game-Modern-Leadership-Sample-Chapter.pdf'
};

// Maureen's ten worksheets (sent 21 Oct 2026) — print-ready PDFs, 3 pages each.
// Each one is named for its parallel's leadership model, from the worksheet itself.
const WS_MODELS = ['CURATE','RULES','RITUAL','OBSERVE','RESET','PIVOT','SHIFT','WIN','GROW','CONNECT'];
const WS_DIR = 'assets/resources/';
const WORKSHEETS_ALL = {
  title: 'All Ten Worksheets',
  desc:  'Every Put It into Play worksheet in one PDF, ready to print.',
  file:  WS_DIR + 'Put-It-Into-Play-All-Ten-Worksheets.pdf'
};

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
  if (new URLSearchParams(location.search).get('welcome')){
    document.getElementById('welcome').hidden = false;
    // so the bookmark they're told to make is the clean permanent link
    try { history.replaceState(null, '', READER_LINK.replace(/^https?:\/\/[^/]+/, '')); } catch(_){}
  }
  track('reader-library-view');

  // frameworks — LESSONS (site.js) gives the ten parallels, FRAMEWORKS (game.js) says which are designed
  document.getElementById('fwGrid').innerHTML = LESSONS.map(L => {
    const fw = FRAMEWORKS[L.n];
    return item({ n: L.n, title: L.t, desc: L.tip, file: fw ? (fw.pdf || fw.file) : '', track: `download-framework-${L.n}` });
  }).join('');
  const ready = LESSONS.filter(L => FRAMEWORKS[L.n]).length;
  const all = document.getElementById('dlAll'), note = document.getElementById('dlAllNote');
  if (ready === 0){ all.classList.add('soon'); all.textContent = 'Download All Ten Frameworks — coming soon'; }
  else if (ready < 10){ all.textContent = `Download All Available Frameworks ↓`; note.textContent = `${ready} of 10 designed so far — the rest are on their way.`; }

  document.getElementById('bonusGrid').innerHTML = item({ title: BONUS.title, desc: BONUS.desc, file: BONUS.file, track: 'download-bonus-chapter' });
  document.getElementById('wsGrid').innerHTML =
    item({ ...WORKSHEETS_ALL, track: 'download-worksheets-all' }) +
    LESSONS.map(L => item({
      n: L.n, title: L.t,
      desc: `Leadership Model: ${WS_MODELS[L.n - 1]}. Reflection questions and one action to take this week.`,
      file: `${WS_DIR}Put-It-Into-Play-Parallel-${String(L.n).padStart(2, '0')}.pdf`,
      track: `download-worksheet-${L.n}`
    })).join('');

  // count every download
  lib.querySelectorAll('[data-track]').forEach(a => a.addEventListener('click', () => track(a.dataset.track)));
  observeReveals(lib);
}

document.addEventListener('DOMContentLoaded', buildLibrary);
