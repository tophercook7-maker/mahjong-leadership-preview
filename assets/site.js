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
  { p:0, g:'一', n:1,  t:"Curate the Environment",            tip:"Before play begins, the table is already set. Leaders create the conditions in which people succeed." },
  { p:0, g:'二', n:2,  t:"Learn the Rules of the Game",       tip:"You can't build a winning hand without understanding the rules. Leaders must learn both the written and unwritten rules." },
  { p:0, g:'三', n:3,  t:"Ground Your Team in Ritual",        tip:"Every hand begins with familiar rituals. Leaders use consistent routines to create clarity, trust, and momentum." },
  { p:1, g:'中', n:4,  t:"Harness the Power of Observation",  tip:"The best players watch the table before making their move. Leaders observe carefully before they act." },
  { p:1, g:'發', n:5,  t:"Regulate Emotions",                 tip:"A reaction at the table can reveal more than intended. Leaders know how to reset before emotion drives their response." },
  { p:2, g:'東', n:6,  t:"Master the Art of the Pivot",       tip:"The strongest hand is often not the one you set out to build. Leaders recognize when conditions change and adjust." },
  { p:2, g:'南', n:7,  t:"Balance Offense and Defense",       tip:"Strong players know when to pursue a win and when to protect their hand. Leaders know when to advance and when to defend what matters." },
  { p:3, g:'西', n:8,  t:"Celebrate Every Win",               tip:"Every “Mahjong!” is worth celebrating. Leaders build momentum by recognizing progress—large and small." },
  { p:3, g:'北', n:9,  t:"Learn from Better Players",         tip:"Every stronger player at the table has something to teach you. Leaders grow when they are willing to learn." },
  { p:3, g:'八', n:10, t:"Foster Connection",                 tip:"The tiles may bring people to the table, but connection is what keeps them coming back." }
];

/* ---- launch switch ----
   Flip to true on launch day: the nav's "Join the Launch List" becomes
   "Reader Resources", and launch.html re-titles itself "Stay Connected". */
const BOOK_LAUNCHED = false;

/* ---- reader resources ----
   The permanent return link readers receive by email. Not a password —
   the library is a lead-capture gate, not a vault.                     */
const READER_LINK = 'https://maureenacahill.com/resources?access=reader';
const READER_KEY  = 'agml_reader';

/* ---- free chapter (punch list 2.1) ----
   Drop the PDF in assets/resources/ and put its path here. While this is
   empty the button collects the email instead of promising a file we
   can't yet deliver. One line to flip on the day Maureen sends it.   */
const FREE_CHAPTER = '';

/* ---- Google Analytics (punch list 5.1) ----
   Paste the GA4 Measurement ID (looks like 'G-XXXXXXXXXX') from
   analytics.google.com once the property exists. Empty = no script
   loads at all, so the page stays clean until it's real.            */
const GA_ID = '';

/* ---- download / event tracking ----
   Set GOATCOUNTER_SITE to e.g. 'maureenacahill' after creating a free
   GoatCounter account (goatcounter.com) and every form completion and
   resource download shows up in its dashboard. Empty = tracking off.  */
const GOATCOUNTER_SITE = '';

function track(name){
  try {
    if (window.goatcounter && goatcounter.count) goatcounter.count({ path: name, title: name, event: true });
    if (window.gtag) gtag('event', name);
  } catch(e){}
}

function loadTracking(){
  if (GA_ID){
    const ga = document.createElement('script');
    ga.async = true;
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
  }
  if (!GOATCOUNTER_SITE) return;
  const sc = document.createElement('script');
  sc.async = true;
  sc.dataset.goatcounter = `https://${GOATCOUNTER_SITE}.goatcounter.com/count`;
  sc.src = 'https://gc.zgo.at/count.js';
  document.head.appendChild(sc);
}

/* ---- free-chapter button: real download once the PDF exists ---- */
function applyFreeChapter(){
  document.querySelectorAll('[data-free-chapter]').forEach(a => {
    if (FREE_CHAPTER){
      a.href = FREE_CHAPTER;
      a.setAttribute('download', '');
      a.textContent = 'Free Chapter Download \u2193';
    }
    a.addEventListener('click', () => track('free-chapter'));
  });
}

function applyLaunchState(){
  if (!BOOK_LAUNCHED) return;
  document.querySelectorAll('a[href="launch.html"].nav-cta').forEach(a => { a.textContent = 'Reader Resources'; a.href = 'resources.html'; });
  document.querySelectorAll('[data-prelaunch]').forEach(el => el.hidden = true);
  document.querySelectorAll('[data-launched]').forEach(el => el.hidden = false);
}

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

/* ---- reader resources form (rendered wherever <div data-reader-form> appears) ----
   NOTE: this one posts natively (not AJAX). FormSubmit only sends the _autoresponse
   welcome email — the reader's permanent link — on a native POST with captcha ON.
   Flow: submit → FormSubmit's one-click "I'm human" page → _next back to the library. */
const READER_POST = 'https://formsubmit.co/mkennedycahill@gmail.com';

function welcomeText(first){
  return `Hi ${first || 'there'},

Welcome to the reader resource library for Ancient Game. Modern Leadership.

Your permanent link — bookmark it and return any time:
${READER_LINK}

Inside you'll find the ten leadership frameworks, the bonus chapter, and the "Put It into Play" worksheets, with new material added as it's released.

Start with the parallel that most closely reflects a challenge you're facing today.

~ Maureen
maureenacahill.com`;
}

function renderReaderForm(host){
  const source = host.dataset.source || 'Reader Resources';
  const next = new URL('resources.html?access=reader&welcome=1', location.href).href;
  host.classList.add('capture');
  host.innerHTML = `
    <form data-reader data-source="${source}" method="POST" action="${READER_POST}" novalidate>
      <input type="hidden" name="_subject" value="Book Reader Resources">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_autoresponse" value="">
      <input type="hidden" name="_next" value="${next}">
      <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
      <input type="hidden" name="Tag" value="Book Reader Resources">
      <input type="hidden" name="Source" value="${source}">
      <div class="fields">
        <input type="text" name="First name" placeholder="First name" required aria-label="First name" autocomplete="given-name">
        <input type="text" name="Last name" placeholder="Last name" required aria-label="Last name" autocomplete="family-name">
      </div>
      <div class="fields" style="margin-top:10px">
        <input type="email" name="email" placeholder="Email address" required aria-label="Email address" autocomplete="email">
      </div>
      <div class="fields" style="margin-top:12px">
        <button type="submit" class="btn btn-red" style="flex:1">Unlock the Reader Resources</button>
      </div>
      <p class="note">You'll receive immediate access, along with a link you can use to return at any time.</p>
      <label class="check">
        <input type="checkbox" name="Leadership updates opt-in" value="Yes">
        <span>Yes, I'd also like to receive occasional leadership insights, resources, and updates from Maureen.</span>
      </label>
      <p class="form-err" hidden>Please add your first name, last name, and a valid email address.</p>
    </form>`;
  host.querySelector('form').addEventListener('submit', submitReaderForm);
}

function submitReaderForm(e){
  const form = e.target;
  const err  = form.querySelector('.form-err');
  const first = form.elements['First name'].value.trim();
  const last  = form.elements['Last name'].value.trim();
  const email = form.elements['email'].value.trim();
  if (!first || !last || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    e.preventDefault(); err.hidden = false; return false;
  }
  err.hidden = true;
  // unchecked boxes aren't posted — send an explicit No so her inbox table always shows the answer
  const box = form.elements['Leadership updates opt-in'];
  if (!box.checked){ box.type = 'hidden'; box.value = 'No'; }
  form.elements['_subject'].value = `Book Reader Resources — ${first} ${last}`;
  form.elements['_autoresponse'].value = welcomeText(first);
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true; btn.textContent = 'Unlocking…';
  try { localStorage.setItem(READER_KEY, '1'); } catch(_){}
  track('reader-signup');
  return true; // let the browser POST; FormSubmit redirects to _next
}

/* ---- boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  observeReveals();
  buildFloaters();
  onScroll();
  addEventListener('scroll', () => { if (!ticking){ requestAnimationFrame(onScroll); ticking = true; } });
  document.querySelectorAll('form[data-capture]').forEach(f => f.addEventListener('submit', submitCapture));
  document.querySelectorAll('[data-reader-form]').forEach(renderReaderForm);
  applyLaunchState();
  applyFreeChapter();
  loadTracking();
  // close mobile menu on navigation tap
  document.querySelectorAll('#navlinks a').forEach(a => a.addEventListener('click', () => {
    const links = document.getElementById('navlinks');
    if (links.classList.contains('open')) toggleMenu();
  }));
});
