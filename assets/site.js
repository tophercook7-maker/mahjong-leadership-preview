/* ============================================================
   Maureen A. Cahill — shared site behaviour
   Loaded on every page. Nav, ambience, scroll reveals, forms.
   ============================================================ */

/* ---- the ten leadership parallels (single source of truth) ---- */
const PHASES = [
  { h: "Set the Table",     s: "Create the conditions",  c: "var(--green)" },
  { h: "Read the Room",     s: "Awareness before action", c: "var(--navy)" },
  { h: "Play Your Hand",    s: "Respond intentionally",  c: "var(--red)" },
  { h: "Elevate the Game",  s: "Multiply your impact",   c: "var(--gold)" }
];

const LESSONS = [
  { p:0, g:'一', n:1,  t:"Curate the Environment",            tip:"Before the first tile is drawn, the table is already set. Shape the conditions so the right moves become possible." },
  { p:0, g:'二', n:2,  t:"Learn the Rules of the Game",       tip:"You can't win a game you don't understand. Master the real rules — written and unwritten — first." },
  { p:0, g:'三', n:3,  t:"Ground Your Team in Ritual",        tip:"Rituals turn a group into a team. Small, repeated practices build trust and rhythm." },
  { p:1, g:'中', n:4,  t:"Harness the Power of Observation",  tip:"The best players watch more than they move. Read the table before you act." },
  { p:1, g:'發', n:5,  t:"Regulate Emotions",                 tip:"Your face is part of your hand. Composure keeps your options — and your team — steady." },
  { p:2, g:'東', n:6,  t:"Master the Art of the Pivot",       tip:"The hand you planned rarely survives the first draw. Change direction without losing your center." },
  { p:2, g:'南', n:7,  t:"Balance Offense and Defense",       tip:"Know when to press and when to protect. Chasing the win while ignoring risk loses games." },
  { p:3, g:'西', n:8,  t:"Celebrate Every Win",               tip:"Naming small wins builds the momentum that reaches the big ones." },
  { p:3, g:'北', n:9,  t:"Learn from Better Players",         tip:"Every stronger player at the table is a lesson you couldn't teach yourself." },
  { p:3, g:'八', n:10, t:"Foster Connection",                 tip:"The game outlasts any hand because of the people around the table. Connection is the long game." }
];

/* ---- mobile menu ---- */
function toggleMenu(){
  const links = document.getElementById('navlinks');
  const btn = document.getElementById('menuBtn');
  const open = links.classList.toggle('open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.textContent = open ? '✕' : '☰';
}

/* ---- scroll reveals ---- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .16 });

function observeReveals(root){
  (root || document).querySelectorAll('.reveal:not(.in),[data-lz]:not(.in)').forEach(el => io.observe(el));
}

/* ---- nav solidify + parallax ---- */
let ticking = false;
function onScroll(){
  document.getElementById('nav').classList.toggle('solid', window.scrollY > 40);
  document.querySelectorAll('[data-par]').forEach(el => {
    el.style.transform = `translateY(${window.scrollY * parseFloat(el.dataset.par)}px) rotate(-16deg)`;
  });
  ticking = false;
}

/* ---- ambient floating tiles ---- */
function buildFloaters(){
  const F = document.getElementById('floaters');
  if (!F) return;
  const GL = ['發','中','二','東','八','南','西','北','一','三'];
  for (let i = 0; i < 10; i++){
    const t = document.createElement('i');
    t.textContent = GL[i % GL.length];
    t.style.left = (Math.random() * 100) + 'vw';
    t.style.top  = (Math.random() * 180 + 20) + 'vh';
    t.style.transform = `rotate(${Math.random()*30-15}deg) scale(${.7+Math.random()*.8})`;
    t.dataset.fspeed = (.02 + Math.random() * .06).toFixed(3);
    F.appendChild(t);
  }
  addEventListener('scroll', () => {
    F.querySelectorAll('i').forEach(t => {
      t.style.marginTop = (-window.scrollY * parseFloat(t.dataset.fspeed)) + 'px';
    });
  }, { passive: true });
}

/* ---- contact capture -> FormSubmit (goes to Maureen's inbox) ----
   Every form on the site routes here. data-source tells her WHICH
   page/section the person signed up from.                         */
const LIST_ENDPOINT = 'https://formsubmit.co/ajax/mkennedycahill@gmail.com';

function submitCapture(e){
  e.preventDefault();
  const form = e.target;
  const wrap = form.closest('.capture');
  const btn  = form.querySelector('button[type=submit]');
  const source = form.dataset.source || 'Website';

  const payload = { _subject: 'maureenacahill.com — ' + source, _template: 'table', _captcha: 'false', Source: source };
  new FormData(form).forEach((v, k) => { if (!k.startsWith('_')) payload[k] = v; });

  if (btn){ btn.disabled = true; btn.textContent = 'Sending…'; }

  const done = () => {
    wrap.classList.add('sent');
    const ok = wrap.querySelector('.form-ok');
    if (ok) ok.classList.add('show');
  };

  fetch(LIST_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r => r.json()).then(done).catch(done);

  return false;
}

/* ---- boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  observeReveals();
  buildFloaters();
  onScroll();
  addEventListener('scroll', () => { if (!ticking){ requestAnimationFrame(onScroll); ticking = true; } });
  document.querySelectorAll('form[data-capture]').forEach(f => f.addEventListener('submit', submitCapture));
  // close mobile menu on navigation tap
  document.querySelectorAll('#navlinks a').forEach(a => a.addEventListener('click', () => {
    const links = document.getElementById('navlinks');
    if (links.classList.contains('open')) toggleMenu();
  }));
});
