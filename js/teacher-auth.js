/* Teacher sign-in (email + password through Supabase Auth).
   - Off until the cloud lock is switched on (SUPABASE_CONFIG.cloudLocked). Try it early with ?signin=1 on this device.
   - Sign in once per device; after that the PIN screen stays the daily door. No session means no cloud sync at all.
   - Pages one folder deep load this with data-guard="1": no session sends the teacher to the main sign-in and back. */
(function (root) {
  'use strict';

  var TRIAL_KEY = 'eaa_signin_trial';
  var script = document.currentScript;
  var cfg = root.SUPABASE_CONFIG || {};
  var session = null;
  var readyDone;
  var ready = new Promise(function (resolve) { readyDone = resolve; });

  function required() {
    if (cfg.cloudLocked) return true;
    try {
      if (/[?&]signin=1\b/.test(location.search)) sessionStorage.setItem(TRIAL_KEY, '1');
      return sessionStorage.getItem(TRIAL_KEY) === '1';
    } catch (e) { return false; }
  }

  function client() {
    var A = root.AdventureSupabase;
    if (!A || !A.isConfigured) return null;
    try { return A.client || (A._ensureClient && A._ensureClient()) || null; } catch (e) { return null; }
  }

  function signedIn() { return !!session; }

  /* Only a plain page inside this site, so a link can never send the teacher somewhere else after sign-in. */
  function safeNext() {
    var m = /[?&]next=([^&#]+)/.exec(location.search);
    if (!m) return '';
    var next = decodeURIComponent(m[1]);
    return /^[\w-]+(\/[\w-]+)*\.html$/.test(next) ? next : '';
  }

  function isNetworkError(err) {
    return !!err && (err.name === 'AuthRetryableFetchError' || /fetch|network/i.test(err.message || ''));
  }

  function el(id) { return document.getElementById(id); }

  function setIntro(title, text) {
    var card = document.querySelector('#platform-lock-screen .platform-lock-card');
    if (!card) return;
    var h = card.querySelector('h1'), p = card.querySelector('p');
    if (h) h.textContent = title;
    if (p) p.textContent = text;
  }

  function showLockScreen() {
    document.documentElement.classList.add('platform-locked');
    var screen = el('platform-lock-screen');
    if (screen) { screen.style.display = 'flex'; screen.style.opacity = '1'; screen.style.pointerEvents = 'auto'; }
  }

  function showPinForm() {
    var form = el('teacher-signin-form'), pin = el('platform-lock-form');
    if (form) form.style.display = 'none';
    if (pin) pin.style.display = '';
    setIntro('🔐 Teacher Access', 'Enter your password to continue.');
    addSignOutLink();
  }

  function buildSignInForm() {
    var form = el('teacher-signin-form');
    if (form) return form;
    form = document.createElement('form');
    form.id = 'teacher-signin-form';
    form.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
    form.innerHTML =
      '<input id="teacher-signin-email" class="platform-lock-input" type="email" placeholder="Email" autocomplete="username" autocapitalize="none" spellcheck="false" required />' +
      '<input id="teacher-signin-password" class="platform-lock-input" type="password" placeholder="Password" autocomplete="current-password" required />' +
      '<div id="teacher-signin-error" class="platform-lock-error"></div>' +
      '<button type="submit" id="teacher-signin-btn" class="platform-lock-submit-btn"><span>Sign in</span></button>';
    form.addEventListener('submit', onSubmit);
    var pin = el('platform-lock-form');
    if (pin && pin.parentNode) pin.parentNode.insertBefore(form, pin);
    return form;
  }

  function showSignIn() {
    if (!el('platform-lock-screen')) return;
    showLockScreen();
    var pin = el('platform-lock-form');
    if (pin) pin.style.display = 'none';
    buildSignInForm().style.display = 'flex';
    setIntro('🔐 Teacher Sign-in', 'Sign in once on this device. After that, your usual password opens the platform.');
  }

  function showError(msg) {
    var e = el('teacher-signin-error');
    if (!e) return;
    e.textContent = msg;
    e.style.display = 'block';
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    var email = (el('teacher-signin-email').value || '').trim();
    var password = el('teacher-signin-password').value || '';
    var btn = el('teacher-signin-btn');
    var err = el('teacher-signin-error');
    if (err) err.style.display = 'none';
    if (btn) btn.disabled = true;
    var res = await signIn(email, password);
    if (btn) btn.disabled = false;
    if (res.ok) {
      el('teacher-signin-password').value = '';
      afterSignIn();
    } else if (res.offline) {
      showError('No internet right now. Use your usual password: the cloud will wait until you sign in.');
      showPinForm();
      var pinErr = el('platform-password-error');
      if (pinErr) { pinErr.textContent = 'No internet right now. Your changes stay on this device until you sign in.'; pinErr.style.display = 'block'; }
    } else {
      showError('That email or password is not right. Try again.');
    }
  }

  async function signIn(email, password) {
    var c = client();
    if (!c) return { ok: false, offline: true };
    try {
      var res = await c.auth.signInWithPassword({ email: email, password: password });
      if (res.error) return { ok: false, offline: isNetworkError(res.error) };
      session = res.data && res.data.session;
      return { ok: !!session };
    } catch (e) {
      return { ok: false, offline: isNetworkError(e) };
    }
  }

  function afterSignIn() {
    var next = safeNext();
    if (next) {
      try { sessionStorage.setItem('eaa_auth_unlocked', 'true'); } catch (e) {}
      location.replace(next);
      return;
    }
    if (root.__eaaFinishUnlock) root.__eaaFinishUnlock();
    var form = el('teacher-signin-form');
    if (form) form.style.display = 'none';
    var pin = el('platform-lock-form');
    if (pin) pin.style.display = '';
    addSignOutLink();
    if (root.SchoolCloudSync && root.SchoolCloudSync.syncWithCloud) root.SchoolCloudSync.syncWithCloud().catch(function () {});
  }

  function addSignOutLink() {
    var pin = el('platform-lock-form');
    if (!pin || !signedIn() || el('teacher-signout-link')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'teacher-signout-link';
    b.textContent = 'Sign out of this device';
    b.style.cssText = 'margin-top:14px;background:none;border:0;color:#94a3b8;font:inherit;font-size:0.85rem;text-decoration:underline;cursor:pointer;';
    b.addEventListener('click', signOut);
    pin.parentNode.insertBefore(b, pin.nextSibling);
  }

  async function signOut() {
    var c = client();
    session = null;
    if (c) { try { await c.auth.signOut({ scope: 'local' }); } catch (e) {} }
    try { sessionStorage.removeItem('eaa_auth_unlocked'); } catch (e) {}
    var link = el('teacher-signout-link');
    if (link) link.remove();
    root.__eaa_auth_unlocked = false;
    showSignIn();
  }

  function guard() {
    if (!script || !script.dataset.guard || signedIn()) return;
    var parts = location.pathname.split('/').filter(Boolean);
    var next = parts.slice(-2).join('/');
    location.replace('../index.html?next=' + encodeURIComponent(next));
  }

  async function boot() {
    var c = client();
    if (!required() || !c) { readyDone(); return; }
    try {
      var res = await c.auth.getSession();
      session = (res && res.data && res.data.session) || null;
    } catch (e) { session = null; }
    c.auth.onAuthStateChange(function (event, s) {
      session = s || null;
      if (event === 'SIGNED_OUT' && el('platform-lock-screen')) showSignIn();
    });
    readyDone();
    guard();
    if (signedIn()) {
      addSignOutLink();
      if (safeNext()) afterSignIn();
    } else if (navigator.onLine !== false) {
      showSignIn();
    }
  }

  root.TeacherAuth = { required: required, signedIn: signedIn, signIn: signIn, signOut: signOut, ready: ready };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
