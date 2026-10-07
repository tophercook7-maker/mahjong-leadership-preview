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

/* Where the book can actually be bought. Empty until Maureen has the Amazon
   link — and while it is empty NOTHING changes on the page, so this can sit
   here safely until launch day. On 27 October: paste the URL, flip
   BOOK_LAUNCHED to true, push. That is the whole launch-day procedure.
   Without this the site had no way to sell the book on the day it went on
   sale; every CTA pointed at the launch list, which by then is the wrong
   ask. */
/* Maureen confirmed the retailers on 1 Oct 2026: Amazon and Bookshop.org,
   with Barnes & Noble possibly added later. Fill in a url and that retailer's
   button appears; leave it empty and it stays hidden. Adding a fourth is one
   more line — no layout work on launch morning.                            */
const BUY_LINKS = [
  { label: 'Buy on Amazon',      url: '' },
  { label: 'Buy on Bookshop.org', url: '' }
];

/* ---- reader resources ----
   The permanent return link readers receive by email. Not a password —
   the library is a lead-capture gate, not a vault.                     */
const READER_LINK = 'https://maureenacahill.com/resources?access=reader';
const READER_KEY  = 'agml_reader';

/* ---- free chapter (punch list 2.1) ----
   Drop the PDF in assets/resources/ and put its path here. While this is
   empty the button collects the email instead of promising a file we
   can't yet deliver. One line to flip on the day Maureen sends it.   */
// Absolute, not relative: /tap/ is a subdirectory, and a relative path
// resolves to /tap/assets/... which 404s. Root-relative works everywhere.
const FREE_CHAPTER = '/assets/resources/Ancient-Game-Modern-Leadership-Sample-Chapter.pdf';

/* ---- Google Analytics (punch list 5.1) ----
   Paste the GA4 Measurement ID (looks like 'G-XXXXXXXXXX') from
   analytics.google.com once the property exists. Empty = no script
   loads at all, so the page stays clean until it's real.            */
const GA_ID = 'G-0BPBECS5EC';

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

/* ---- free-chapter: capture the reader, then hand over the chapter ----
   Nancy's 21 Sept request. Until now the PDF downloaded straight away and we
   learned nothing about who took it, which in the run-up to a launch is the
   expensive part.

   The chapter is never withheld. The link appears the moment the form is
   submitted, whether or not MailerLite has finished its own confirmation
   round-trip — somebody who just gave us their address should not be left
   waiting on an email to read the thing they were promised. The email is a
   bonus, not the delivery mechanism, so the page cannot end up promising
   something the mail never does. */
function readerKnown(){
  try { return localStorage.getItem(READER_KEY) === '1'; } catch(_){ return false; }
}

function applyFreeChapter(){
  document.querySelectorAll('[data-free-chapter]').forEach(a => {
    if (!FREE_CHAPTER) return;
    a.href = FREE_CHAPTER;
    a.textContent = 'Free Chapter Download ↓';
    if (readerKnown()){
      // Already on the list from this device — don't make them ask twice.
      a.setAttribute('download', '');
      a.addEventListener('click', () => track('free-chapter'));
      return;
    }
    a.removeAttribute('download');
    a.addEventListener('click', e => { e.preventDefault(); openChapterGate(a); });
  });
}

function openChapterGate(btn){
  const existing = document.getElementById('chapter-gate');
  if (existing){
    existing.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const f = existing.querySelector('input'); if (f) f.focus();
    return;
  }
  track('free-chapter-gate');
  const band = btn.closest('.cta-band') || btn.parentElement;
  const gate = document.createElement('div');
  gate.id = 'chapter-gate';
  gate.className = 'capture chapter-gate';
  gate.innerHTML = `
    <p class="gate-lead">Where should I send it?</p>
    <form data-chapter novalidate>
      <div class="fields">
        <input type="text" name="First name" placeholder="First name" required aria-label="First name" autocomplete="given-name">
        <input type="text" name="Last name" placeholder="Last name" required aria-label="Last name" autocomplete="family-name">
      </div>
      <div class="fields" style="margin-top:10px">
        <input type="email" name="email" placeholder="Email address" required aria-label="Email address" autocomplete="email">
      </div>
      <div class="fields" style="margin-top:12px">
        <button type="submit" class="btn btn-red" style="flex:1">Send Me the Chapter</button>
      </div>
      <p class="note">You'll also be first to hear when the book is released. Unsubscribe any time.</p>
      <p class="form-err" hidden>Please add your first name, last name, and a valid email address.</p>
    </form>`;
  band.insertAdjacentElement('afterend', gate);
  gate.querySelector('form').addEventListener('submit', submitChapterGate);
  const first = gate.querySelector('input'); if (first) first.focus();
}

function submitChapterGate(e){
  e.preventDefault();
  const form  = e.target;
  const wrap  = form.closest('.capture');
  const err   = form.querySelector('.form-err');
  const first = form.elements['First name'].value.trim();
  const last  = form.elements['Last name'].value.trim();
  const email = form.elements['email'].value.trim();

  if (!first || !last || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    err.hidden = false;
    return false;
  }
  err.hidden = true;

  const btn = form.querySelector('button[type=submit]');
  const original = btn.textContent;
  btn.disabled = true; btn.textContent = 'Sending…';

  // Tagged by its own source so the book page's performance is separable from
  // every other form feeding the same list.
  mlSubscribe('reader', { email, first, last, source: 'Sample chapter — book page' })
    .then(ok => {
      if (!ok){
        btn.disabled = false; btn.textContent = original;
        err.hidden = false;
        return;
      }
      try { localStorage.setItem(READER_KEY, '1'); } catch(_){}
      track('free-chapter-captured');
      wrap.classList.add('sent');
      wrap.innerHTML = `
        <div class="form-ok show">
          <p><strong>Thank you, ${first}.</strong> Your chapter is downloading now —
             if nothing happens, use the link below.</p>
          <p style="margin-top:12px">
            <a class="btn btn-gold" href="${FREE_CHAPTER}" download data-chapter-dl>
              Download the chapter ↓</a>
          </p>
          <p class="note" style="margin-top:12px">Check your email too — there's a confirmation
             link from Maureen A. Cahill (subject: “Confirmation email”) to click before the
             launch updates start arriving. Worth a look in spam if you don't see it.</p>
        </div>`;
      const dl = wrap.querySelector('[data-chapter-dl]');
      if (dl) setTimeout(() => dl.click(), 350);
      document.querySelectorAll('[data-free-chapter]').forEach(a => {
        a.setAttribute('download', '');
        a.removeAttribute('data-free-chapter');
      });
    });
  return false;
}

function applyLaunchState(){
  applyBuyLink();
  if (!BOOK_LAUNCHED) return;
  document.querySelectorAll('a[href="launch.html"].nav-cta').forEach(a => { a.textContent = 'Reader Resources'; a.href = 'resources.html'; });
  document.querySelectorAll('[data-prelaunch]').forEach(el => el.hidden = true);
  document.querySelectorAll('[data-launched]').forEach(el => el.hidden = false);
}

/* Buy buttons appear only once there is somewhere to send people. Deliberately
   independent of BOOK_LAUNCHED: if the retailer listing goes live early, the
   link can be switched on without changing anything else. */
function applyBuyLink(){
  const live = BUY_LINKS.filter(b => b.url);
  const slots = document.querySelectorAll('[data-buy]');
  if (!slots.length) return;

  if (!live.length){
    // Markup can sit on the live site for weeks: no urls, nothing renders.
    slots.forEach(el => { el.hidden = true; });
    document.querySelectorAll('[data-bookstores]').forEach(el => { el.hidden = true; });
    return;
  }

  slots.forEach(slot => {
    // The slot is a placeholder <a>; replace it with one button per retailer
    // so a second or third shop needs no new markup on any page.
    const row = document.createElement('span');
    row.className = 'buy-row';
    live.forEach((b, i) => {
      const a = document.createElement('a');
      a.className = 'btn ' + (i === 0 ? 'btn-red' : 'btn-gold');
      a.href = b.url;
      a.rel = 'noopener';
      a.target = '_blank';
      a.textContent = b.label + ' →';
      a.addEventListener('click', () => track('buy:' + b.label));
      row.appendChild(a);
    });
    slot.replaceWith(row);
  });

  // Her note to independent bookshops — only meaningful once it's on sale.
  document.querySelectorAll('[data-bookstores]').forEach(el => { el.hidden = false; });

  // Once it can be bought, "be first to know" is the wrong ask.
  document.querySelectorAll('[data-prelaunch-cta]').forEach(el => { el.hidden = true; });
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
  // Optional chaining, not a guard clause: /tap has no nav but DOES have
  // [data-par] elements, so bailing early would kill the parallax too.
  document.getElementById('nav')?.classList.toggle('solid', window.scrollY > 40);
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

/* ============================================================
   SIGNUPS -> MAILERLITE   (punch list 1.1)
   ------------------------------------------------------------
   Replaces FormSubmit. These are MailerLite's public form
   endpoints: no API key, safe to call from the browser, so we
   keep Maureen's own form markup and styling and only change
   where it posts.

   Each form posts to the endpoint for its group, so she can
   still see which page someone came from — Launch List,
   Reader Resources, or Work With Me.

   All three use double opt-in: the subscriber gets a
   confirmation email from maureen@maureenacahill.com and only
   joins the list once they click it.
   ============================================================ */
const ML_ACCOUNT = '2644986';
const ML_FORMS = {
  'launch':    '198985867271865777',
  'reader':    '198989675981965097',
  'work':      '198989762204271982'
};
const ML_DEFAULT = 'launch';

function mlEndpoint(key){
  const id = ML_FORMS[key] || ML_FORMS[ML_DEFAULT];
  return `https://assets.mailerlite.com/jsonp/${ML_ACCOUNT}/forms/${id}/subscribe`;
}

/* Which MailerLite group a form belongs to. Set explicitly with
   data-list="reader|work|launch"; otherwise inferred from the
   data-source label the page already carries. */
function mlListFor(form){
  if (form.dataset.list) return form.dataset.list;
  const src = (form.dataset.source || '').toLowerCase();
  if (src.includes('reader') || src.includes('resource')) return 'reader';
  if (src.includes('work with me') || src.includes('inquiry')) return 'work';
  return 'launch';
}

/* Split a single "name" field into first/last for MailerLite. */
function splitName(full){
  const parts = (full || '').trim().split(/\s+/).filter(Boolean);
  return { first: parts.shift() || '', last: parts.join(' ') };
}

/* POST to MailerLite. Resolves true on success. */
function mlSubscribe(list, { email, first, last, source }){
  const body = new URLSearchParams();
  body.set('fields[email]', email);
  if (first) body.set('fields[name]', first);
  if (last)  body.set('fields[last_name]', last);
  body.set('ml-submit', '1');
  body.set('anticsrf', 'true');
  track('signup:' + (source || list));
  return fetch(mlEndpoint(list), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  }).then(r => r.json()).then(d => !!(d && d.success)).catch(() => false);
}

function submitCapture(e){
  e.preventDefault();
  const form   = e.target;
  const wrap   = form.closest('.capture');
  const btn    = form.querySelector('button[type=submit]');
  const source = form.dataset.source || 'Website';
  const list   = mlListFor(form);

  const data  = new FormData(form);
  const email = (data.get('Email') || data.get('email') || '').trim();
  const { first, last } = splitName(data.get('Name') || data.get('name'));

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    const inp = form.querySelector('input[type=email]');
    if (inp){ inp.focus(); inp.setCustomValidity('Please enter a valid email address.'); inp.reportValidity(); 
              inp.addEventListener('input', () => inp.setCustomValidity(''), { once:true }); }
    return false;
  }

  const original = btn ? btn.textContent : '';
  if (btn){ btn.disabled = true; btn.textContent = 'Sending…'; }

  mlSubscribe(list, { email, first, last, source }).then(ok => {
    if (ok){
      wrap.classList.add('sent');
      const done = wrap.querySelector('.form-ok');
      if (done) done.classList.add('show');
    } else {
      if (btn){ btn.disabled = false; btn.textContent = original; }
      let err = wrap.querySelector('.form-err');
      if (!err){
        err = document.createElement('p');
        err.className = 'form-err';
        wrap.appendChild(err);
      }
      err.hidden = false;
      err.textContent = 'Something went wrong — please try again, or email maureen@maureenacahill.com.';
    }
  });

  return false;
}

/* ---- reader resources form (rendered wherever <div data-reader-form> appears) ----
   Now posts to MailerLite's Reader Resources group by AJAX, so the reader
   stays on the page. MailerLite sends the confirmation email from
   maureen@maureenacahill.com; clicking it adds them to the list.

   The old FormSubmit native-POST hack is gone — it bounced readers through a
   third-party "confirm you're human" page mid-signup, and its welcome email
   was never verified as actually arriving. */

function renderReaderForm(host){
  const source = host.dataset.source || 'Reader Resources';
  host.classList.add('capture');
  host.innerHTML = `
    <form data-reader data-list="reader" data-source="${source}" novalidate>
      <div class="fields">
        <input type="text" name="First name" placeholder="First name" required aria-label="First name" autocomplete="given-name">
        <input type="text" name="Last name" placeholder="Last name" required aria-label="Last name" autocomplete="family-name">
      </div>
      <div class="fields" style="margin-top:10px">
        <input type="email" name="email" placeholder="Email address" required aria-label="Email address" autocomplete="email">
      </div>
      <div class="fields" style="margin-top:12px">
        <button type="submit" class="btn btn-red" style="flex:1">Send Me the Reader Resources</button>
      </div>
      <p class="note">We'll email you a confirmation link \u2014 it comes from Maureen A. Cahill with the subject \u201cConfirmation email\u201d, so check spam if it doesn't appear. Click it and your resource library opens, plus a link you can return to any time.</p>
      <p class="form-err" hidden>Please add your first name, last name, and a valid email address.</p>
    </form>`;
  host.querySelector('form').addEventListener('submit', submitReaderForm);
}

function submitReaderForm(e){
  e.preventDefault();
  const form  = e.target;
  const wrap  = form.closest('.capture');
  const err   = form.querySelector('.form-err');
  const first = form.elements['First name'].value.trim();
  const last  = form.elements['Last name'].value.trim();
  const email = form.elements['email'].value.trim();

  if (!first || !last || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    err.hidden = false;
    return false;
  }
  err.hidden = true;

  const btn = form.querySelector('button[type=submit]');
  const original = btn.textContent;
  btn.disabled = true; btn.textContent = 'Sending\u2026';

  mlSubscribe('reader', { email, first, last, source: form.dataset.source }).then(ok => {
    if (ok){
      // remember them locally so a returning reader isn't re-gated on this device
      try { localStorage.setItem(READER_KEY, '1'); } catch(_){}
      wrap.classList.add('sent');
      const done = wrap.querySelector('.form-ok');
      if (done){
        done.classList.add('show');
      } else {
        const p = document.createElement('div');
        p.className = 'form-ok show';
        p.innerHTML = `\u2713 Check your email \u2014 we've sent <strong>${email}</strong> a confirmation link from Maureen A. Cahill, subject \u201cConfirmation email\u201d. Click it and your resources open right up. Look in spam if it isn't there.`;
        wrap.appendChild(p);
      }
    } else {
      btn.disabled = false; btn.textContent = original;
      err.hidden = false;
      err.textContent = 'Something went wrong \u2014 please try again, or email maureen@maureenacahill.com.';
    }
  });
  return false;
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
