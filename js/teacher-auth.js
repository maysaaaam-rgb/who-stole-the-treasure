/**
 * ENGLISH ADVENTURE ACADEMY — UNIFIED TEACHER VERIFICATION & SECURITY ENGINE (v2.0)
 *
 * Security & Classroom Smartboard Protections:
 *  1. 6-Digit Email Verification Code (Supabase Auth OTP, shouldCreateUser: false) — primary unlock.
 *  2. Smartboard Stealth UI: Masked code orbs (• • • • • •) + optional cryptographically shuffled
 *     0–9 touch keypad with suppressed press highlights so pupils cannot read projector input.
 *  3. Device Isolation:
 *       - Classroom Smartboard (default): session lives in sessionStorage only, requires a fresh
 *         6-digit code every browser session, and auto-locks after 25m of inactivity.
 *       - Personal Trusted Device (opt-in checkbox): stays signed in via Supabase Auth JWT until
 *         manually locked or signed out.
 *  4. Zero Crackable PIN Hashes in Public HTML: static short PIN hashes are completely removed.
 *  5. Brute-Force Rate Limiter: exponential cooldown (30s -> 120s -> 300s) stored in localStorage.
 *  6. Offline Emergency Passphrase: 600,000-round PBKDF2-SHA256 high-entropy rescue verifier that
 *     activates ONLY when internet is genuinely unreachable, with all cloud writes paused.
 *  7. Built-in Security, Password & Platform Cache Refresh Center modal.
 */
(function (root) {
  'use strict';

  var scriptEl = document.currentScript;
  var ROOT_URL = (scriptEl && scriptEl.src || '').replace(/js\/teacher-auth\.js.*$/, '');
  var IS_GUARDED_SUBPAGE = !!(scriptEl && scriptEl.dataset && scriptEl.dataset.guard === '1');

  // Storage keys
  var UNLOCK_SESSION_KEY = 'eaa_auth_unlocked';
  var OFFLINE_SESSION_KEY = 'eaa_offline_emergency';
  var TRUST_DEVICE_KEY = 'eaa_device_trust_v2';       // 'trusted' | null
  var EXPLICIT_LOCK_KEY = 'eaa_explicit_locked_v2';   // '1' when teacher manually clicks Lock
  var EMAIL_HINT_KEY = 'eaa_teacher_email_v2';
  var IDLE_PREF_KEY = 'eaa_idle_minutes_v2';
  var LIMITER_KEY = 'eaa_auth_limiter_v2';
  var CUSTOM_RESCUE_KEY = 'eaa_offline_rescue_v2';

  // High-entropy fallback Offline Rescue Verifier (PBKDF2-HMAC-SHA256, 600,000 iterations, 65+ bits entropy)
  var DEFAULT_RESCUE_SALT = 'eaa-rescue-v2-941b5c02663e76537c96185c';
  var DEFAULT_RESCUE_ROUNDS = 600000;
  var DEFAULT_RESCUE_HASH = 'ffb80908cefbd13a0c5a481a453da21a5358c07742503358741b4318df496349';

  var state = {
    session: null,
    unlocked: false,
    offlineEmergency: false,
    step: 'request',          // 'request' | 'verify' | 'password' | 'offline'
    pendingEmail: '',
    editingEmail: false,
    otpDigits: '',
    stealthMode: true,
    showKeypad: false,
    keypadOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    resendUntil: 0,
    resendTimer: 0,
    cooldownTimer: 0,
    busy: false,
    lastActivityAt: Date.now(),
    idleInterval: 0,
    idleWarnShown: false
  };

  var readyResolve;
  var readyPromise = new Promise(function (resolve) { readyResolve = resolve; });

  function el(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function required() {
    var cfg = root.SUPABASE_CONFIG || {};
    return cfg.cloudLocked !== false;
  }

  function getClient() {
    var A = root.AdventureSupabase;
    if (!A || !A.isConfigured) return null;
    try { return A.client || (A._ensureClient && A._ensureClient()) || null; } catch (e) { return null; }
  }

  function isTrustedDevice() {
    try { return localStorage.getItem(TRUST_DEVICE_KEY) === 'trusted'; } catch (e) { return false; }
  }

  function setTrustedDevice(trusted) {
    try {
      if (trusted) {
        localStorage.setItem(TRUST_DEVICE_KEY, 'trusted');
        // Copy active session token from sessionStorage into localStorage so reloads persist
        for (var i = 0; i < sessionStorage.length; i++) {
          var k = sessionStorage.key(i);
          if (k && /^sb-.*-auth-token/i.test(k)) {
            localStorage.setItem(k, sessionStorage.getItem(k));
          }
        }
      } else {
        localStorage.removeItem(TRUST_DEVICE_KEY);
        scrubLocalSupabaseTokens();
      }
    } catch (e) {}
  }

  function scrubLocalSupabaseTokens() {
    try {
      var toRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && /^sb-.*-auth-token/i.test(k)) toRemove.push(k);
      }
      toRemove.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
  }

  function scrubSessionSupabaseTokens() {
    try {
      var toRemove = [];
      for (var i = 0; i < sessionStorage.length; i++) {
        var k = sessionStorage.key(i);
        if (k && /^sb-.*-auth-token/i.test(k)) toRemove.push(k);
      }
      toRemove.forEach(function (k) { sessionStorage.removeItem(k); });
    } catch (e) {}
  }

  function signedIn() {
    return !!state.session;
  }

  function isUnlocked() {
    return !!(state.unlocked || root.__eaa_auth_unlocked === true);
  }

  function canSyncCloud() {
    if (state.offlineEmergency || root.__eaa_offline_emergency === true) return false;
    if (!required()) return true;
    return signedIn() && isUnlocked();
  }

  /* Validate internal relative page redirects only (never external URLs). */
  function safeNext() {
    var m = /[?&]next=([^&#]+)/.exec(location.search);
    if (!m) return '';
    try {
      var next = decodeURIComponent(m[1]).replace(/^\/+/, '');
      if (/^[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\.html$/.test(next)) return next;
    } catch (e) {}
    return '';
  }

  function maskEmail(email) {
    var clean = String(email || '').trim();
    var parts = clean.split('@');
    if (parts.length !== 2) return clean;
    var name = parts[0], dom = parts[1];
    var maskedName = name.length <= 2 ? (name.charAt(0) + '•••') : (name.slice(0, 2) + '••••' + name.slice(-1));
    var dParts = dom.split('.');
    var ext = dParts.length > 1 ? '.' + dParts.pop() : '';
    var domMain = dParts.join('.');
    var maskedDom = (domMain.charAt(0) || '•') + '••••' + ext;
    return maskedName + '@' + maskedDom;
  }

  function getSavedEmail() {
    try { return (localStorage.getItem(EMAIL_HINT_KEY) || '').trim(); } catch (e) { return ''; }
  }

  function saveEmailHint(email) {
    try {
      if (email) localStorage.setItem(EMAIL_HINT_KEY, email.trim().toLowerCase());
    } catch (e) {}
  }

  function isNetworkError(err) {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
    return !!err && (err.name === 'AuthRetryableFetchError' || /fetch|network|failed to fetch|load failed|offline/i.test(err.message || String(err)));
  }

  async function checkInternetTrulyDown() {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
    var cfg = root.SUPABASE_CONFIG || {};
    if (!cfg.url) return false;
    try {
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 2800);
      var res = await fetch(cfg.url.replace(/\/$/, '') + '/auth/v1/health', {
        method: 'GET',
        headers: { apikey: cfg.anonKey || '' },
        cache: 'no-store',
        signal: ctrl ? ctrl.signal : undefined
      });
      clearTimeout(t);
      return !res;
    } catch (e) {
      return true;
    }
  }

  // =========================================================================
  // BRUTE-FORCE RATE LIMITER
  // =========================================================================
  function getLimiter() {
    try {
      var raw = JSON.parse(localStorage.getItem(LIMITER_KEY) || 'null');
      if (raw && typeof raw.fails === 'number') return raw;
    } catch (e) {}
    return { fails: 0, until: 0 };
  }

  function saveLimiter(lim) {
    try { localStorage.setItem(LIMITER_KEY, JSON.stringify(lim)); } catch (e) {}
  }

  function clearLimiter() {
    try { localStorage.removeItem(LIMITER_KEY); } catch (e) {}
  }

  function getCooldownRemainingSec() {
    var lim = getLimiter();
    if (!lim.until) return 0;
    var rem = Math.ceil((lim.until - Date.now()) / 1000);
    return rem > 0 ? rem : 0;
  }

  function recordFailedAttempt() {
    var lim = getLimiter();
    lim.fails = (lim.fails || 0) + 1;
    if (lim.fails >= 10) lim.until = Date.now() + 300 * 1000;      // 5 minutes
    else if (lim.fails >= 8) lim.until = Date.now() + 120 * 1000;  // 2 minutes
    else if (lim.fails >= 5) lim.until = Date.now() + 30 * 1000;   // 30 seconds
    saveLimiter(lim);
    return getCooldownRemainingSec();
  }

  // =========================================================================
  // CRYPTOGRAPHIC PBKDF2-SHA256 FOR OFFLINE EMERGENCY PASSPHRASE
  // =========================================================================
  async function deriveHashHex(passphrase, salt, rounds) {
    var enc = new TextEncoder();
    var key = await root.crypto.subtle.importKey('raw', enc.encode(String(passphrase)), 'PBKDF2', false, ['deriveBits']);
    var bits = await root.crypto.subtle.deriveBits({
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: enc.encode(String(salt)),
      iterations: rounds || DEFAULT_RESCUE_ROUNDS
    }, key, 256);
    return Array.prototype.map.call(new Uint8Array(bits), function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
  }

  async function verifyOfflinePassphrase(value) {
    var clean = String(value || '').trim();
    if (clean.length < 10) return false;
    try {
      var customRaw = null;
      try { customRaw = JSON.parse(localStorage.getItem(CUSTOM_RESCUE_KEY) || 'null'); } catch (e) {}
      if (customRaw && customRaw.salt && customRaw.hash) {
        var hCustom = await deriveHashHex(clean, customRaw.salt, customRaw.rounds || DEFAULT_RESCUE_ROUNDS);
        if (hCustom === customRaw.hash) return true;
      }
      var hDefault = await deriveHashHex(clean, DEFAULT_RESCUE_SALT, DEFAULT_RESCUE_ROUNDS);
      return hDefault === DEFAULT_RESCUE_HASH;
    } catch (e) {
      return false;
    }
  }

  async function saveCustomOfflinePassphrase(newPhrase) {
    var clean = String(newPhrase || '').trim();
    if (clean.length < 12) throw new Error('Emergency passphrase must be at least 12 characters.');
    var rand = new Uint8Array(12);
    root.crypto.getRandomValues(rand);
    var saltHex = Array.prototype.map.call(rand, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    var salt = 'eaa-custom-rescue-' + saltHex;
    var hash = await deriveHashHex(clean, salt, DEFAULT_RESCUE_ROUNDS);
    localStorage.setItem(CUSTOM_RESCUE_KEY, JSON.stringify({
      salt: salt,
      rounds: DEFAULT_RESCUE_ROUNDS,
      hash: hash,
      updatedAt: new Date().toISOString()
    }));
    return true;
  }

  function generateRandomRescuePhrase() {
    var words = [
      'amber', 'falcon', 'river', 'crystal', 'meadow', 'comet', 'harbor', 'lantern',
      'summit', 'velvet', 'cobalt', 'glacier', 'phoenix', 'cedar', 'aurora', 'compass',
      'granite', 'breeze', 'quartz', 'voyage', 'silver', 'thunder', 'coral', 'forest',
      'planet', 'rocket', 'island', 'beacon', 'canyon', 'marble', 'zephyr', 'sunrise'
    ];
    var buf = new Uint32Array(5);
    root.crypto.getRandomValues(buf);
    var picked = [
      words[buf[0] % words.length],
      words[buf[1] % words.length],
      words[buf[2] % words.length],
      words[buf[3] % words.length],
      String(100000 + (buf[4] % 900000))
    ];
    return picked.join('-');
  }

  function shuffleKeypadDigits() {
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    try {
      var rnd = new Uint32Array(arr.length);
      root.crypto.getRandomValues(rnd);
      for (var i = arr.length - 1; i > 0; i--) {
        var j = rnd[i] % (i + 1);
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      }
    } catch (e) {}
    state.keypadOrder = arr;
  }

  // =========================================================================
  // CYBER-GLASS LOCK SCREEN STYLES & UI RENDERER (AGENTS.md §1.1)
  // =========================================================================
  function injectAuthStyles() {
    if (el('eaa-auth-v2-styles')) return;
    var st = document.createElement('style');
    st.id = 'eaa-auth-v2-styles';
    st.textContent =
      ':root { --eaa-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); }' +
      '#platform-lock-screen { background: radial-gradient(circle at 50% 25%, #0d1527 0%, #060911 75%) !important; }' +
      '.eaa-lock-shell { width: 100%; max-width: 460px; margin: auto; background: rgba(15, 23, 42, 0.86); border: 1px solid rgba(56, 189, 248, 0.22); border-radius: 26px; padding: 30px 26px 24px; box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.78), 0 0 40px -10px rgba(56, 189, 248, 0.16); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); color: #f8fafc; text-align: center; box-sizing: border-box; position: relative; }' +
      '.eaa-lock-badge-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }' +
      '.eaa-mode-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; font-size: 0.76rem; font-weight: 800; letter-spacing: 0.02em; background: rgba(56, 189, 248, 0.13); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }' +
      '.eaa-mode-pill.trusted { background: rgba(16, 185, 129, 0.14); color: #34d399; border-color: rgba(16, 185, 129, 0.35); }' +
      '.eaa-mode-pill.offline { background: rgba(245, 158, 11, 0.16); color: #fbbf24; border-color: rgba(245, 158, 11, 0.4); }' +
      '.eaa-lock-hero-icon { width: 66px; height: 66px; margin: 0 auto 14px; border-radius: 20px; background: linear-gradient(145deg, rgba(56,189,248,0.22), rgba(168,85,247,0.22)); border: 1.5px solid rgba(56,189,248,0.38); display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 10px 26px -6px rgba(56,189,248,0.3); user-select: none; }' +
      '.eaa-lock-title { font-size: 1.5rem; font-weight: 800; margin: 0 0 6px; color: #ffffff; letter-spacing: -0.02em; }' +
      '.eaa-lock-sub { font-size: 0.9rem; color: #94a3b8; margin: 0 0 18px; line-height: 1.45; }' +
      '.eaa-btn-3d { width: 100%; min-height: 50px; padding: 12px 18px; border-radius: 14px; border: none; border-bottom: 5px solid #0284c7; background: linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%); color: #06101f; font-family: inherit; font-size: 0.98rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.14s var(--eaa-spring), filter 0.15s ease; box-sizing: border-box; user-select: none; }' +
      '.eaa-btn-3d:hover:not(:disabled) { filter: brightness(1.06); }' +
      '.eaa-btn-3d:active:not(:disabled) { transform: translateY(4px); border-bottom-width: 1px; }' +
      '.eaa-btn-3d:disabled { opacity: 0.5; cursor: not-allowed; }' +
      '.eaa-btn-3d.emerald { background: linear-gradient(180deg, #34d399 0%, #10b981 100%); border-bottom-color: #047857; color: #042f2e; }' +
      '.eaa-btn-3d.amber { background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%); border-bottom-color: #b45309; color: #1e1b4b; }' +
      '.eaa-btn-3d.coral { background: linear-gradient(180deg, #fb7185 0%, #f43f5e 100%); border-bottom-color: #be123c; color: #ffffff; }' +
      '.eaa-btn-3d.slate { background: rgba(30, 41, 59, 0.92); border: 1px solid rgba(148, 163, 184, 0.24); border-bottom: 5px solid #0f172a; color: #e2e8f0; font-size: 0.88rem; min-height: 44px; padding: 9px 14px; }' +
      '.eaa-field { width: 100%; padding: 13px 15px; border-radius: 13px; border: 1.5px solid rgba(148, 163, 184, 0.3); background: rgba(6, 9, 17, 0.78); color: #f8fafc; font-family: inherit; font-size: 1rem; font-weight: 600; outline: none; box-sizing: border-box; transition: border-color 0.18s ease, box-shadow 0.18s ease; }' +
      '.eaa-field:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25); }' +
      '.eaa-email-chip { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 11px 14px; border-radius: 13px; background: rgba(6, 9, 17, 0.72); border: 1px solid rgba(148, 163, 184, 0.24); margin-bottom: 12px; font-size: 0.92rem; color: #e2e8f0; }' +
      '.eaa-otp-row { display: flex; justify-content: center; gap: 8px; margin: 12px 0 14px; cursor: text; }' +
      '.eaa-otp-slot { width: 46px; height: 56px; border-radius: 14px; background: rgba(6, 9, 17, 0.88); border: 2px solid rgba(148, 163, 184, 0.28); display: flex; align-items: center; justify-content: center; font-size: 1.35rem; font-weight: 800; color: #f8fafc; transition: border-color 0.14s ease, transform 0.14s var(--eaa-spring); user-select: none; }' +
      '.eaa-otp-slot.filled { border-color: rgba(56, 189, 248, 0.75); box-shadow: 0 0 14px rgba(56, 189, 248, 0.2); }' +
      '.eaa-otp-slot.active { border-color: #38bdf8; transform: translateY(-2px); }' +
      '.eaa-otp-orb { width: 13px; height: 13px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 10px #38bdf8; display: inline-block; }' +
      '.eaa-keypad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 12px 0 14px; }' +
      '.eaa-key-btn { min-height: 48px; border-radius: 12px; border: 1px solid rgba(148, 163, 184, 0.22); border-bottom: 5px solid #020617; background: rgba(30, 41, 59, 0.9); color: #f8fafc; font-family: inherit; font-size: 1.15rem; font-weight: 800; cursor: pointer; user-select: none; transition: transform 0.1s var(--eaa-spring); }' +
      '.eaa-key-btn:active { transform: translateY(4px); border-bottom-width: 1px; }' +
      '.eaa-stealth-keypad .eaa-key-btn:hover, .eaa-stealth-keypad .eaa-key-btn:active, .eaa-stealth-keypad .eaa-key-btn:focus { background: rgba(30, 41, 59, 0.9) !important; color: #f8fafc !important; box-shadow: none !important; outline: none !important; }' +
      '.eaa-trust-box { display: flex; align-items: flex-start; gap: 10px; text-align: left; padding: 11px 13px; border-radius: 13px; background: rgba(6, 9, 17, 0.55); border: 1px solid rgba(148, 163, 184, 0.18); margin: 14px 0 10px; cursor: pointer; font-size: 0.8rem; color: #cbd5e1; line-height: 1.35; }' +
      '.eaa-trust-box input { margin-top: 2px; width: 17px; height: 17px; accent-color: #10b981; flex-shrink: 0; cursor: pointer; }' +
      '.eaa-auth-msg { padding: 10px 12px; border-radius: 11px; font-size: 0.84rem; font-weight: 700; margin: 10px 0; line-height: 1.35; }' +
      '.eaa-auth-msg.err { background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.4); color: #fda4af; }' +
      '.eaa-auth-msg.ok { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #6ee7b7; }' +
      '.eaa-auth-msg.warn { background: rgba(245, 158, 11, 0.16); border: 1px solid rgba(245, 158, 11, 0.4); color: #fde68a; }' +
      '.eaa-tab-links { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(148, 163, 184, 0.14); }' +
      '.eaa-mini-link { background: rgba(30, 41, 59, 0.72); border: 1px solid rgba(148, 163, 184, 0.22); border-bottom: 3px solid #020617; color: #cbd5e1; border-radius: 10px; padding: 6px 11px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: transform 0.12s var(--eaa-spring), color 0.15s; }' +
      '.eaa-mini-link:hover { color: #38bdf8; }' +
      '.eaa-mini-link:active { transform: translateY(2px); border-bottom-width: 1px; }' +
      '#eaa-security-modal-backdrop { position: fixed; inset: 0; z-index: 9999998; background: rgba(6, 9, 17, 0.78); backdrop-filter: blur(10px); display: none; align-items: center; justify-content: center; padding: 18px; box-sizing: border-box; overflow-y: auto; }' +
      '#eaa-security-modal-backdrop.is-open { display: flex; }' +
      '.eaa-sec-modal { width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 24px; padding: 24px; color: #f8fafc; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75); font-family: "Plus Jakarta Sans", system-ui, sans-serif; }' +
      '.eaa-sec-section { background: rgba(6, 9, 17, 0.62); border: 1px solid rgba(148, 163, 184, 0.18); border-radius: 16px; padding: 15px 16px; margin-bottom: 14px; }' +
      '.eaa-sec-section h3 { margin: 0 0 6px; font-size: 0.96rem; font-weight: 800; color: #f8fafc; display: flex; align-items: center; gap: 7px; }' +
      '.eaa-sec-section p { margin: 0 0 10px; font-size: 0.81rem; color: #94a3b8; line-height: 1.4; }' +
      '@media (max-height: 820px) { .eaa-lock-shell { padding: 18px 22px 16px; } .eaa-lock-hero-icon { width: 48px; height: 48px; font-size: 1.5rem; margin-bottom: 8px; border-radius: 14px; } .eaa-lock-title { font-size: 1.28rem; margin-bottom: 3px; } .eaa-lock-sub { font-size: 0.82rem; margin-bottom: 10px; } .eaa-otp-row { margin: 8px 0 10px; } .eaa-otp-slot { width: 42px; height: 48px; } .eaa-keypad { gap: 6px; margin: 8px 0 10px; } .eaa-key-btn { min-height: 40px; font-size: 1.02rem; } .eaa-trust-box { margin: 8px 0; padding: 8px 11px; } .eaa-tab-links { margin-top: 10px; padding-top: 10px; } }' +
      '#eaa-idle-warning-toast { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); z-index: 9999997; background: rgba(15, 23, 42, 0.95); border: 2px solid #f59e0b; color: #fef3c7; padding: 12px 20px; border-radius: 999px; font-weight: 800; font-size: 0.9rem; box-shadow: 0 14px 35px rgba(0,0,0,0.65); display: none; align-items: center; gap: 10px; cursor: pointer; }';
    (document.head || document.documentElement).appendChild(st);
  }

  function renderLockUI(feedbackMsg, feedbackKind) {
    var screen = el('platform-lock-screen');
    if (!screen) return;
    injectAuthStyles();

    var offlineNow = typeof navigator !== 'undefined' && navigator.onLine === false;
    if (offlineNow && state.step === 'request') {
      state.step = 'offline';
    }

    var trusted = isTrustedDevice();
    var cooldown = getCooldownRemainingSec();
    var savedEmail = state.pendingEmail || getSavedEmail();
    var wideBoard = typeof window !== 'undefined' && window.innerWidth >= 1500;

    var pillHtml = offlineNow
      ? '<span class="eaa-mode-pill offline">📡 Offline Detected · Emergency Gate</span>'
      : (trusted
        ? '<span class="eaa-mode-pill trusted">💻 Personal Trusted Device</span>'
        : '<span class="eaa-mode-pill">📺 ' + (wideBoard ? 'Smartboard Session Mode' : 'Single-Session Protected') + '</span>');

    var msgHtml = '';
    if (cooldown > 0) {
      msgHtml = '<div class="eaa-auth-msg err" id="eaa-lock-feedback">⏳ Too many failed tries. Please wait ' + cooldown + 's before trying again.</div>';
    } else if (feedbackMsg) {
      msgHtml = '<div class="eaa-auth-msg ' + esc(feedbackKind || 'err') + '" id="eaa-lock-feedback">' + esc(feedbackMsg) + '</div>';
    } else {
      msgHtml = '<div id="eaa-lock-feedback" style="display:none;"></div>';
    }

    var trustCheckHtml =
      '<label class="eaa-trust-box" for="eaa-trust-device-chk">' +
        '<input type="checkbox" id="eaa-trust-device-chk" ' + (trusted ? 'checked' : '') + ' />' +
        '<div><strong style="color:#f8fafc;">Trust my personal laptop / phone</strong><br>' +
        '<span>Stay signed in on this device. Leave <b>unchecked</b> on the classroom smartboard (auto-locks after idle).</span></div>' +
      '</label>';

    var bodyHtml = '';

    if (state.step === 'request') {
      var showInput = state.editingEmail || !savedEmail;
      bodyHtml =
        '<div class="eaa-lock-hero-icon">🛡️</div>' +
        '<h1 class="eaa-lock-title">Teacher Verification</h1>' +
        '<p class="eaa-lock-sub">Send a one-time 6-digit verification code to your teacher email. Safe to enter on the smartboard.</p>' +
        msgHtml +
        '<form id="eaa-step-request-form" style="display:flex;flex-direction:column;gap:10px;">' +
          (showInput
            ? '<input id="eaa-auth-email" class="eaa-field" type="email" value="' + esc(savedEmail) + '" placeholder="Teacher email address" autocomplete="username" autocapitalize="none" spellcheck="false" required />'
            : '<div class="eaa-email-chip">' +
                '<span>📧 <strong>' + esc(maskEmail(savedEmail)) + '</strong></span>' +
                '<button type="button" class="eaa-mini-link" id="eaa-btn-edit-email">Change</button>' +
              '</div>') +
          trustCheckHtml +
          '<button type="submit" class="eaa-btn-3d" id="eaa-btn-send-code" ' + (state.busy || cooldown > 0 ? 'disabled' : '') + '>' +
            '<span>' + (state.busy ? 'Sending Code…' : '📨 Send 6-Digit Code') + '</span>' +
          '</button>' +
        '</form>' +
        '<div class="eaa-tab-links">' +
          '<button type="button" class="eaa-mini-link" data-goto="verify">🔢 I already have a code</button>' +
          '<button type="button" class="eaa-mini-link" data-goto="password">🔑 Use account password</button>' +
          (offlineNow ? '<button type="button" class="eaa-mini-link" data-goto="offline">📡 Offline emergency phrase</button>' : '') +
        '</div>';
    } else if (state.step === 'verify') {
      var slotCount = Math.max(6, state.otpDigits.length);
      var slotsHtml = '';
      for (var i = 0; i < slotCount; i++) {
        var ch = state.otpDigits.charAt(i);
        var isActive = i === state.otpDigits.length && i < slotCount;
        slotsHtml +=
          '<div class="eaa-otp-slot' + (ch ? ' filled' : '') + (isActive ? ' active' : '') + '">' +
            (ch ? (state.stealthMode ? '<span class="eaa-otp-orb"></span>' : esc(ch)) : '') +
          '</div>';
      }

      var keypadHtml = '';
      if (state.showKeypad) {
        var kpBtns = '';
        for (var k = 0; k < 9; k++) {
          kpBtns += '<button type="button" class="eaa-key-btn" data-digit="' + state.keypadOrder[k] + '">' + state.keypadOrder[k] + '</button>';
        }
        kpBtns += '<button type="button" class="eaa-key-btn" data-kact="shuffle" title="Shuffle keypad layout" style="font-size:0.9rem;color:#38bdf8;">🔀 Mix</button>';
        kpBtns += '<button type="button" class="eaa-key-btn" data-digit="' + state.keypadOrder[9] + '">' + state.keypadOrder[9] + '</button>';
        kpBtns += '<button type="button" class="eaa-key-btn" data-kact="back" title="Backspace" style="font-size:0.95rem;color:#fda4af;">⌫</button>';
        keypadHtml = '<div class="eaa-keypad' + (state.stealthMode ? ' eaa-stealth-keypad' : '') + '">' + kpBtns + '</div>';
      }

      var resendSec = Math.max(0, Math.ceil((state.resendUntil - Date.now()) / 1000));

      bodyHtml =
        '<div class="eaa-lock-hero-icon">🔐</div>' +
        '<h1 class="eaa-lock-title">Enter Verification Code</h1>' +
        '<p class="eaa-lock-sub">Sent to <strong>' + esc(maskEmail(savedEmail || 'your email')) + '</strong>. ' +
          (state.stealthMode ? 'Stealth mode hides digits from the projector.' : 'Digits visible on screen.') + '</p>' +
        msgHtml +
        '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">' +
          '<button type="button" class="eaa-mini-link" id="eaa-toggle-stealth">' + (state.stealthMode ? '🕵️ Stealth: ON (Show 👁)' : '👁 Digits Shown (Hide 🕵️)') + '</button>' +
          '<button type="button" class="eaa-mini-link" id="eaa-toggle-keypad">' + (state.showKeypad ? '⌨️ Hide Touch Pad' : '🔢 Scrambled Touch Pad') + '</button>' +
        '</div>' +
        '<form id="eaa-step-verify-form">' +
          '<input id="eaa-otp-hidden-input" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="8" value="' + esc(state.otpDigits) + '" aria-label="Verification code" style="position:absolute;opacity:0;pointer-events:none;width:1px;height:1px;" />' +
          '<div class="eaa-otp-row" id="eaa-otp-slots-row" title="Click and type or paste your verification code">' + slotsHtml + '</div>' +
          keypadHtml +
          trustCheckHtml +
          '<button type="submit" class="eaa-btn-3d emerald" id="eaa-btn-verify-code" ' + (state.busy || cooldown > 0 || state.otpDigits.length < 6 ? 'disabled' : '') + '>' +
            '<span>' + (state.busy ? 'Verifying…' : '🔓 Verify & Unlock') + '</span>' +
          '</button>' +
        '</form>' +
        '<div class="eaa-tab-links">' +
          '<button type="button" class="eaa-mini-link" id="eaa-btn-resend" ' + (resendSec > 0 || state.busy ? 'disabled' : '') + '>' +
            (resendSec > 0 ? '📨 Resend in ' + resendSec + 's' : '📨 Send new code') +
          '</button>' +
          '<button type="button" class="eaa-mini-link" data-goto="request">◀ Change email</button>' +
          '<button type="button" class="eaa-mini-link" data-goto="password">🔑 Password</button>' +
        '</div>';
    } else if (state.step === 'password') {
      var showEm = state.editingEmail || !savedEmail;
      bodyHtml =
        '<div class="eaa-lock-hero-icon">🔑</div>' +
        '<h1 class="eaa-lock-title">Teacher Account Sign-In</h1>' +
        '<p class="eaa-lock-sub">Verify directly with your Supabase teacher account password.</p>' +
        msgHtml +
        '<form id="eaa-step-password-form" style="display:flex;flex-direction:column;gap:10px;">' +
          (showEm
            ? '<input id="eaa-pw-email" class="eaa-field" type="email" value="' + esc(savedEmail) + '" placeholder="Teacher email address" autocomplete="username" autocapitalize="none" spellcheck="false" required />'
            : '<div class="eaa-email-chip">' +
                '<span>📧 <strong>' + esc(maskEmail(savedEmail)) + '</strong></span>' +
                '<button type="button" class="eaa-mini-link" id="eaa-btn-edit-email">Change</button>' +
              '</div>') +
          '<input id="eaa-pw-input" class="eaa-field" type="password" placeholder="Account password" autocomplete="current-password" required />' +
          trustCheckHtml +
          '<button type="submit" class="eaa-btn-3d" ' + (state.busy || cooldown > 0 ? 'disabled' : '') + '>' +
            '<span>' + (state.busy ? 'Checking…' : '🔓 Sign In & Unlock') + '</span>' +
          '</button>' +
        '</form>' +
        '<div class="eaa-tab-links">' +
          '<button type="button" class="eaa-mini-link" data-goto="request">📨 Use 6-Digit Email Code (Recommended)</button>' +
          (offlineNow ? '<button type="button" class="eaa-mini-link" data-goto="offline">📡 Offline emergency phrase</button>' : '') +
        '</div>';
    } else if (state.step === 'offline') {
      bodyHtml =
        '<div class="eaa-lock-hero-icon">📡</div>' +
        '<h1 class="eaa-lock-title">Offline Emergency Access</h1>' +
        '<p class="eaa-lock-sub">Works <strong>only when school internet is completely down</strong>. Cloud sync stays paused until you reconnect and verify online.</p>' +
        msgHtml +
        '<form id="eaa-step-offline-form" style="display:flex;flex-direction:column;gap:10px;">' +
          '<input id="eaa-offline-phrase-input" class="eaa-field" type="password" placeholder="Enter high-entropy emergency passphrase" autocomplete="off" spellcheck="false" required />' +
          '<button type="submit" class="eaa-btn-3d amber" ' + (state.busy || cooldown > 0 ? 'disabled' : '') + '>' +
            '<span>' + (state.busy ? 'Checking Offline Key…' : '🛡️ Unlock Local Offline Mode') + '</span>' +
          '</button>' +
        '</form>' +
        '<div class="eaa-tab-links">' +
          '<button type="button" class="eaa-mini-link" data-goto="request">📨 Back to Email Verification Code</button>' +
        '</div>';
    }

    screen.innerHTML =
      '<div class="eaa-lock-shell">' +
        '<div class="eaa-lock-badge-row">' + pillHtml + '</div>' +
        bodyHtml +
        '<div style="margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:0.78rem;color:#64748b;flex-wrap:wrap;">' +
          '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;"></span>Teacher: <strong style="color:#cbd5e1;">Mr. Maysam</strong></span>' +
          '<button type="button" class="eaa-mini-link" id="eaa-lock-refresh-btn" title="Clear cached files and load latest version">🔄 Refresh Build</button>' +
        '</div>' +
      '</div>';

    bindLockEvents(screen);

    if (cooldown > 0) {
      clearTimeout(state.cooldownTimer);
      state.cooldownTimer = setTimeout(function () { renderLockUI(); }, 1000);
    }
  }

  function bindLockEvents(screen) {
    var editEmailBtn = el('eaa-btn-edit-email');
    if (editEmailBtn) {
      editEmailBtn.onclick = function () {
        state.editingEmail = true;
        renderLockUI();
        var em = el('eaa-auth-email') || el('eaa-pw-email');
        if (em) em.focus();
      };
    }

    var trustChk = el('eaa-trust-device-chk');
    if (trustChk) {
      trustChk.onchange = function () {
        setTrustedDevice(!!trustChk.checked);
      };
    }

    screen.querySelectorAll('[data-goto]').forEach(function (btn) {
      btn.onclick = function () {
        var target = btn.getAttribute('data-goto');
        if (target === 'verify' && !state.pendingEmail) {
          state.pendingEmail = getSavedEmail();
          if (!state.pendingEmail) {
            state.editingEmail = true;
            state.step = 'request';
            renderLockUI('Enter your teacher email first so we know which account to verify.', 'warn');
            return;
          }
        }
        state.step = target;
        renderLockUI();
        focusActiveInput();
      };
    });

    var refreshBtn = el('eaa-lock-refresh-btn');
    if (refreshBtn) {
      refreshBtn.onclick = function () {
        if (root.EAAOffline && root.EAAOffline.forceRefresh) root.EAAOffline.forceRefresh();
        else location.reload();
      };
    }

    var reqForm = el('eaa-step-request-form');
    if (reqForm) {
      reqForm.onsubmit = function (ev) {
        ev.preventDefault();
        var emInput = el('eaa-auth-email');
        var email = emInput ? emInput.value.trim() : (state.pendingEmail || getSavedEmail());
        handleSendOtp(email);
      };
    }

    var verForm = el('eaa-step-verify-form');
    if (verForm) {
      var hiddenInput = el('eaa-otp-hidden-input');
      var slotsRow = el('eaa-otp-slots-row');
      if (slotsRow && hiddenInput) {
        slotsRow.onclick = function () { hiddenInput.focus(); };
      }
      if (hiddenInput) {
        hiddenInput.oninput = function () {
          var digits = hiddenInput.value.replace(/\D+/g, '').slice(0, 8);
          state.otpDigits = digits;
          renderLockUI();
          focusActiveInput();
          if (digits.length === 6) {
            handleVerifyOtp(digits);
          }
        };
      }

      var stealthBtn = el('eaa-toggle-stealth');
      if (stealthBtn) {
        stealthBtn.onclick = function () {
          state.stealthMode = !state.stealthMode;
          renderLockUI();
          focusActiveInput();
        };
      }

      var kpBtn = el('eaa-toggle-keypad');
      if (kpBtn) {
        kpBtn.onclick = function () {
          state.showKeypad = !state.showKeypad;
          if (state.showKeypad) shuffleKeypadDigits();
          renderLockUI();
        };
      }

      screen.querySelectorAll('[data-digit]').forEach(function (b) {
        b.onclick = function () {
          if (state.otpDigits.length >= 8 || state.busy) return;
          state.otpDigits += b.getAttribute('data-digit');
          renderLockUI();
          if (state.otpDigits.length === 6) {
            handleVerifyOtp(state.otpDigits);
          }
        };
      });

      screen.querySelectorAll('[data-kact]').forEach(function (b) {
        b.onclick = function () {
          var act = b.getAttribute('data-kact');
          if (act === 'back') {
            state.otpDigits = state.otpDigits.slice(0, -1);
            renderLockUI();
          } else if (act === 'shuffle') {
            shuffleKeypadDigits();
            renderLockUI();
          }
        };
      });

      var resendBtn = el('eaa-btn-resend');
      if (resendBtn) {
        resendBtn.onclick = function () {
          handleSendOtp(state.pendingEmail || getSavedEmail());
        };
      }

      verForm.onsubmit = function (ev) {
        ev.preventDefault();
        handleVerifyOtp(state.otpDigits);
      };
    }

    var pwForm = el('eaa-step-password-form');
    if (pwForm) {
      pwForm.onsubmit = function (ev) {
        ev.preventDefault();
        var emEl = el('eaa-pw-email');
        var email = emEl ? emEl.value.trim() : (state.pendingEmail || getSavedEmail());
        var pwEl = el('eaa-pw-input');
        var pw = pwEl ? pwEl.value : '';
        handlePasswordSignIn(email, pw);
      };
    }

    var offForm = el('eaa-step-offline-form');
    if (offForm) {
      offForm.onsubmit = function (ev) {
        ev.preventDefault();
        var inp = el('eaa-offline-phrase-input');
        handleOfflineUnlock(inp ? inp.value : '');
      };
    }
  }

  function focusActiveInput() {
    setTimeout(function () {
      var target = el('eaa-otp-hidden-input') || el('eaa-auth-email') || el('eaa-pw-input') || el('eaa-offline-phrase-input');
      if (target && !state.showKeypad) {
        try { target.focus(); } catch (e) {}
      }
    }, 30);
  }

  // Global keyboard listener while lock screen is open on 'verify' step so typing/pasting works seamlessly
  document.addEventListener('keydown', function (ev) {
    if (!document.documentElement.classList.contains('platform-locked')) return;
    if (state.step !== 'verify' || state.busy || getCooldownRemainingSec() > 0) return;
    var active = document.activeElement;
    if (active && active.id === 'eaa-otp-hidden-input') return; // handled by oninput
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;

    if (/^[0-9]$/.test(ev.key)) {
      ev.preventDefault();
      if (state.otpDigits.length < 8) {
        state.otpDigits += ev.key;
        renderLockUI();
        if (state.otpDigits.length === 6) handleVerifyOtp(state.otpDigits);
      }
    } else if (ev.key === 'Backspace') {
      ev.preventDefault();
      state.otpDigits = state.otpDigits.slice(0, -1);
      renderLockUI();
    } else if (ev.key === 'Enter' && state.otpDigits.length >= 6) {
      ev.preventDefault();
      handleVerifyOtp(state.otpDigits);
    }
  });

  document.addEventListener('paste', function (ev) {
    if (!document.documentElement.classList.contains('platform-locked')) return;
    if (state.step !== 'verify' || state.busy || getCooldownRemainingSec() > 0) return;
    try {
      var pasted = (ev.clipboardData || window.clipboardData).getData('text') || '';
      var digits = pasted.replace(/\D+/g, '').slice(0, 8);
      if (digits.length >= 6) {
        ev.preventDefault();
        state.otpDigits = digits;
        renderLockUI();
        handleVerifyOtp(digits);
      }
    } catch (e) {}
  });

  // =========================================================================
  // VERIFICATION HANDLERS (EMAIL OTP, PASSWORD, OFFLINE EMERGENCY)
  // =========================================================================
  async function handleSendOtp(email) {
    if (getCooldownRemainingSec() > 0) { renderLockUI(); return; }
    var cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || cleanEmail.indexOf('@') < 1) {
      state.editingEmail = true;
      renderLockUI('Please enter a valid teacher email address.', 'err');
      return;
    }

    var trustChk = el('eaa-trust-device-chk');
    if (trustChk) setTrustedDevice(!!trustChk.checked);

    var c = getClient();
    if (!c) {
      state.step = 'offline';
      renderLockUI('Cloud client unavailable offline. Use your Offline Emergency Passphrase below.', 'warn');
      return;
    }

    state.busy = true;
    state.pendingEmail = cleanEmail;
    state.editingEmail = false;
    saveEmailHint(cleanEmail);
    renderLockUI();

    try {
      var redirectUrl = location.origin + location.pathname;
      var res = await c.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectUrl
        }
      });
      state.busy = false;
      if (res.error) {
        if (isNetworkError(res.error)) {
          state.step = 'offline';
          renderLockUI('Internet appears down. You can unlock offline with your Emergency Passphrase (cloud sync paused).', 'warn');
          return;
        }
        var waitSec = recordFailedAttempt();
        renderLockUI(waitSec > 0 ? ('Too many attempts. Wait ' + waitSec + 's.') : 'Could not send code to that email. Make sure it is your registered teacher email.', 'err');
        return;
      }

      state.otpDigits = '';
      state.step = 'verify';
      state.resendUntil = Date.now() + 45000;
      startResendTicker();
      renderLockUI('6-digit code sent! Check your inbox and type or paste it below.', 'ok');
      focusActiveInput();
    } catch (err) {
      state.busy = false;
      if (isNetworkError(err)) {
        state.step = 'offline';
        renderLockUI('No internet connection right now. Enter your Offline Emergency Passphrase below.', 'warn');
      } else {
        renderLockUI('Could not send verification code. Please try again.', 'err');
      }
    }
  }

  function startResendTicker() {
    clearInterval(state.resendTimer);
    state.resendTimer = setInterval(function () {
      if (Date.now() >= state.resendUntil || state.step !== 'verify' || !document.documentElement.classList.contains('platform-locked')) {
        clearInterval(state.resendTimer);
      }
      if (state.step === 'verify' && document.documentElement.classList.contains('platform-locked')) {
        var btn = el('eaa-btn-resend');
        if (btn) {
          var rem = Math.max(0, Math.ceil((state.resendUntil - Date.now()) / 1000));
          btn.disabled = rem > 0 || state.busy;
          btn.textContent = rem > 0 ? ('📨 Resend in ' + rem + 's') : '📨 Send new code';
        }
      }
    }, 1000);
  }

  async function handleVerifyOtp(tokenStr) {
    if (getCooldownRemainingSec() > 0) { renderLockUI(); return; }
    var code = String(tokenStr || '').replace(/\D+/g, '');
    if (code.length < 6) {
      renderLockUI('Please enter all 6 digits of your verification code.', 'warn');
      return;
    }

    var trustChk = el('eaa-trust-device-chk');
    if (trustChk) setTrustedDevice(!!trustChk.checked);

    var email = state.pendingEmail || getSavedEmail();
    var c = getClient();
    if (!c || !email) {
      state.step = 'request';
      renderLockUI('Please request a fresh verification code first.', 'warn');
      return;
    }

    state.busy = true;
    renderLockUI();

    try {
      var res = await c.auth.verifyOtp({ email: email, token: code, type: 'email' });
      if (res.error) {
        // Fallback for older magiclink OTP configurations
        var res2 = await c.auth.verifyOtp({ email: email, token: code, type: 'magiclink' });
        if (!res2.error && res2.data && res2.data.session) res = res2;
      }
      state.busy = false;

      if (res.error || !(res.data && res.data.session)) {
        if (isNetworkError(res.error)) {
          state.step = 'offline';
          renderLockUI('Internet dropped while verifying. Use your Offline Emergency Passphrase below.', 'warn');
          return;
        }
        state.otpDigits = '';
        recordFailedAttempt();
        renderLockUI('Invalid or expired verification code. Try again or send a new code.', 'err');
        focusActiveInput();
        return;
      }

      state.session = res.data.session;
      state.otpDigits = '';
      clearLimiter();
      completeOnlineUnlock();
    } catch (err) {
      state.busy = false;
      state.otpDigits = '';
      if (isNetworkError(err)) {
        state.step = 'offline';
        renderLockUI('Network unreachable. Use your Offline Emergency Passphrase.', 'warn');
      } else {
        recordFailedAttempt();
        renderLockUI('Verification failed. Please try again.', 'err');
      }
    }
  }

  async function handlePasswordSignIn(email, password) {
    if (getCooldownRemainingSec() > 0) { renderLockUI(); return; }
    var cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      renderLockUI('Enter both your teacher email and password.', 'warn');
      return;
    }

    var trustChk = el('eaa-trust-device-chk');
    if (trustChk) setTrustedDevice(!!trustChk.checked);

    var c = getClient();
    if (!c) {
      state.step = 'offline';
      renderLockUI('Offline right now. Use your Offline Emergency Passphrase below.', 'warn');
      return;
    }

    state.busy = true;
    state.pendingEmail = cleanEmail;
    saveEmailHint(cleanEmail);
    renderLockUI();

    try {
      var res = await c.auth.signInWithPassword({ email: cleanEmail, password: password });
      state.busy = false;
      if (res.error || !(res.data && res.data.session)) {
        if (isNetworkError(res.error)) {
          state.step = 'offline';
          renderLockUI('Internet is down. Use your Offline Emergency Passphrase below.', 'warn');
          return;
        }
        recordFailedAttempt();
        renderLockUI('Incorrect email or password.', 'err');
        return;
      }

      state.session = res.data.session;
      clearLimiter();
      completeOnlineUnlock();
    } catch (err) {
      state.busy = false;
      if (isNetworkError(err)) {
        state.step = 'offline';
        renderLockUI('Internet is down. Use your Offline Emergency Passphrase below.', 'warn');
      } else {
        recordFailedAttempt();
        renderLockUI('Sign-in error. Please try again.', 'err');
      }
    }
  }

  async function handleOfflineUnlock(passphrase) {
    if (getCooldownRemainingSec() > 0) { renderLockUI(); return; }
    state.busy = true;
    renderLockUI();

    // Enforce strict rule: Backup passphrase works ONLY when internet is genuinely down
    var trulyOffline = await checkInternetTrulyDown();
    if (!trulyOffline) {
      state.busy = false;
      state.step = 'request';
      renderLockUI('Internet connection is active! Please verify with a live 6-digit Email Code.', 'warn');
      return;
    }

    var ok = await verifyOfflinePassphrase(passphrase);
    state.busy = false;
    if (!ok) {
      recordFailedAttempt();
      renderLockUI('Invalid Offline Emergency Passphrase.', 'err');
      return;
    }

    clearLimiter();
    state.offlineEmergency = true;
    state.unlocked = true;
    root.__eaa_offline_emergency = true;
    root.__eaa_auth_unlocked = true;
    try {
      sessionStorage.setItem(UNLOCK_SESSION_KEY, 'true');
      sessionStorage.setItem(OFFLINE_SESSION_KEY, '1');
    } catch (e) {}

    finishUnlockTransition(true);
  }

  // =========================================================================
  // UNLOCK / LOCK TRANSITIONS & HEADER STATUS
  // =========================================================================
  function completeOnlineUnlock() {
    state.offlineEmergency = false;
    state.unlocked = true;
    root.__eaa_offline_emergency = false;
    root.__eaa_auth_unlocked = true;
    try {
      sessionStorage.setItem(UNLOCK_SESSION_KEY, 'true');
      sessionStorage.removeItem(OFFLINE_SESSION_KEY);
      localStorage.removeItem(EXPLICIT_LOCK_KEY);
    } catch (e) {}

    if (!isTrustedDevice()) {
      scrubLocalSupabaseTokens();
    }

    finishUnlockTransition(false);
  }

  function finishUnlockTransition(isOfflineEmergency) {
    var next = safeNext();
    if (next && !IS_GUARDED_SUBPAGE) {
      location.replace(ROOT_URL + next);
      return;
    }

    document.documentElement.classList.remove('platform-locked');
    var lockScreen = el('platform-lock-screen') || el('lock');
    if (lockScreen) {
      lockScreen.style.opacity = '0';
      lockScreen.style.pointerEvents = 'none';
      setTimeout(function () { lockScreen.style.display = 'none'; }, 220);
    }

    if (typeof root.__eaaFinishUnlock === 'function') {
      try { root.__eaaFinishUnlock(); } catch (e) {}
    }

    updateSyncIndicatorForMode(isOfflineEmergency);
    startIdleMonitor();

    if (!isOfflineEmergency) {
      if (root.AdventureSupabase && root.AdventureSupabase.checkLiveStatus) {
        root.AdventureSupabase.checkLiveStatus().catch(function () {});
      }
      if (root.SchoolCloudSync && root.SchoolCloudSync.syncWithCloud) {
        root.SchoolCloudSync.syncWithCloud().catch(function () {});
      }
      if (root.EAAPrivate && root.EAAPrivate.load) {
        root.EAAPrivate.load().catch(function () {});
      }
    }

    try { root.dispatchEvent(new CustomEvent('eaa:teacher-unlocked', { detail: { offline: !!isOfflineEmergency } })); } catch (e) {}
  }

  function updateSyncIndicatorForMode(isOfflineEmergency) {
    var btn = el('global-cloud-sync-btn');
    var icon = el('global-sync-icon');
    var txt = el('global-sync-text');
    if (!btn || !icon || !txt) return;
    if (isOfflineEmergency) {
      icon.textContent = '🛡️⏸';
      txt.textContent = 'Offline Mode · Cloud Paused';
      btn.style.background = '#fef3c7';
      btn.style.color = '#92400e';
      btn.style.borderColor = '#fcd34d';
      btn.title = 'Unlocked with Offline Emergency Passphrase. Click when Wi-Fi returns to verify online.';
      btn.onclick = function () {
        if (navigator.onLine !== false) {
          lockPlatform({ reason: 'Verify online to resume Cloud Sync.' });
        } else {
          openSecurityModal();
        }
      };
    }
  }

  async function lockPlatform(opts) {
    opts = opts || {};
    state.unlocked = false;
    state.offlineEmergency = false;
    state.otpDigits = '';
    root.__eaa_auth_unlocked = false;
    root.__eaa_offline_emergency = false;

    if (root.EAAPrivate && typeof root.EAAPrivate.clear === 'function') {
      root.EAAPrivate.clear();
    }

    try {
      sessionStorage.removeItem(UNLOCK_SESSION_KEY);
      sessionStorage.removeItem(OFFLINE_SESSION_KEY);
      if (isTrustedDevice()) {
        localStorage.setItem(EXPLICIT_LOCK_KEY, '1');
      }
    } catch (e) {}

    // On Classroom Smartboard (untrusted device), wipe Supabase JWT immediately on lock!
    if (!isTrustedDevice() || opts.signOutLocal) {
      var c = getClient();
      state.session = null;
      if (c) {
        try { await c.auth.signOut({ scope: 'local' }); } catch (e) {}
      }
      scrubSessionSupabaseTokens();
      scrubLocalSupabaseTokens();
    }

    if (IS_GUARDED_SUBPAGE) {
      redirectToMainGate();
      return;
    }

    document.documentElement.classList.add('platform-locked');
    var lockScreen = el('platform-lock-screen');
    if (lockScreen) {
      lockScreen.style.display = 'flex';
      lockScreen.style.opacity = '1';
      lockScreen.style.pointerEvents = 'auto';
    }
    state.step = (typeof navigator !== 'undefined' && navigator.onLine === false) ? 'offline' : 'request';
    renderLockUI(opts.reason || '', opts.reason ? 'warn' : '');
    focusActiveInput();
  }

  async function signOutDevice(globalEverywhere) {
    var c = getClient();
    state.session = null;
    setTrustedDevice(false);
    try { localStorage.removeItem(EXPLICIT_LOCK_KEY); } catch (e) {}
    if (c) {
      try { await c.auth.signOut({ scope: globalEverywhere ? 'global' : 'local' }); } catch (e) {}
    }
    scrubSessionSupabaseTokens();
    scrubLocalSupabaseTokens();
    closeSecurityModal();
    await lockPlatform({ reason: globalEverywhere ? 'Signed out of all devices. Verify with a fresh 6-digit code.' : 'Signed out of this device.' });
  }

  // =========================================================================
  // SMARTBOARD IDLE AUTO-LOCK ENGINE
  // =========================================================================
  function getIdleMinutes() {
    try {
      var saved = parseInt(localStorage.getItem(IDLE_PREF_KEY) || '', 10);
      if (!isNaN(saved) && saved >= 0) return saved;
    } catch (e) {}
    // Default: 25 minutes on Classroom Smartboard, 0 (off) on Personal Trusted Laptop/Phone
    return isTrustedDevice() ? 0 : 25;
  }

  function setIdleMinutes(mins) {
    try { localStorage.setItem(IDLE_PREF_KEY, String(Math.max(0, parseInt(mins, 10) || 0))); } catch (e) {}
    state.lastActivityAt = Date.now();
    hideIdleWarning();
  }

  function touchActivity() {
    state.lastActivityAt = Date.now();
    if (state.idleWarnShown) hideIdleWarning();
  }

  function showIdleWarning(secLeft) {
    injectAuthStyles();
    var toast = el('eaa-idle-warning-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'eaa-idle-warning-toast';
      toast.onclick = touchActivity;
      (document.body || document.documentElement).appendChild(toast);
    }
    state.idleWarnShown = true;
    toast.style.display = 'inline-flex';
    toast.textContent = '🔒 Smartboard auto-locking in ' + secLeft + 's — tap anywhere to stay unlocked';
  }

  function hideIdleWarning() {
    state.idleWarnShown = false;
    var toast = el('eaa-idle-warning-toast');
    if (toast) toast.style.display = 'none';
  }

  function startIdleMonitor() {
    if (state.idleInterval) clearInterval(state.idleInterval);
    state.lastActivityAt = Date.now();

    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (evName) {
      window.addEventListener(evName, touchActivity, { passive: true });
    });

    state.idleInterval = setInterval(function () {
      if (!isUnlocked() || document.documentElement.classList.contains('platform-locked')) {
        hideIdleWarning();
        return;
      }
      if (root.speechSynthesis && root.speechSynthesis.speaking) {
        state.lastActivityAt = Date.now();
        return;
      }
      var mins = getIdleMinutes();
      if (!mins || mins <= 0) {
        hideIdleWarning();
        return;
      }
      var limitMs = mins * 60 * 1000;
      var elapsed = Date.now() - state.lastActivityAt;
      var leftSec = Math.ceil((limitMs - elapsed) / 1000);
      if (leftSec <= 0) {
        hideIdleWarning();
        lockPlatform({ reason: 'Auto-locked due to inactivity.', signOutLocal: !isTrustedDevice() });
      } else if (leftSec <= 60) {
        showIdleWarning(leftSec);
      } else if (state.idleWarnShown) {
        hideIdleWarning();
      }
    }, 5000);
  }

  // =========================================================================
  // SECURITY, PASSWORD & PLATFORM REFRESH MODAL
  // =========================================================================
  function openSecurityModal() {
    if (!isUnlocked()) return;
    injectAuthStyles();
    var bd = el('eaa-security-modal-backdrop');
    if (!bd) {
      bd = document.createElement('div');
      bd.id = 'eaa-security-modal-backdrop';
      bd.onclick = function (e) { if (e.target === bd) closeSecurityModal(); };
      document.body.appendChild(bd);
    }

    var trusted = isTrustedDevice();
    var idleMins = getIdleMinutes();
    var userEmail = (state.session && state.session.user && state.session.user.email) || getSavedEmail() || 'Signed in';
    var hasCustomRescue = false;
    try { hasCustomRescue = !!localStorage.getItem(CUSTOM_RESCUE_KEY); } catch (e) {}

    bd.innerHTML =
      '<div class="eaa-sec-modal" role="dialog" aria-modal="true" aria-label="Security and Platform Refresh">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;">' +
          '<div>' +
            '<h2 style="margin:0;font-size:1.3rem;font-weight:800;color:#ffffff;">🛡️ Security &amp; Platform Refresh</h2>' +
            '<p style="margin:3px 0 0;font-size:0.82rem;color:#94a3b8;">Account: <strong style="color:#38bdf8;">' + esc(maskEmail(userEmail)) + '</strong>' +
              (state.offlineEmergency ? ' · <span style="color:#fbbf24;">Offline Emergency Mode</span>' : (signedIn() ? ' · <span style="color:#34d399;">Verified Online</span>' : ' · <span style="color:#94a3b8;">Local Session (Verify Online for Cloud)</span>')) + '</p>' +
          '</div>' +
          '<button type="button" class="eaa-mini-link" id="eaa-sec-close">✕ Close</button>' +
        '</div>' +

        '<div id="eaa-sec-status-msg" style="display:none;" class="eaa-auth-msg ok"></div>' +

        '<div class="eaa-sec-section">' +
          '<h3>🔄 Force-Refresh Platform &amp; Clear Cache</h3>' +
          '<p>Clears saved offline scripts/styles on this device and downloads the newest build immediately.</p>' +
          '<button type="button" class="eaa-btn-3d" id="eaa-sec-force-refresh">🔄 Refresh Platform &amp; Clear Cache Now</button>' +
        '</div>' +

        '<div class="eaa-sec-section">' +
          '<h3>📺 Device Trust &amp; Smartboard Auto-Lock</h3>' +
          '<p>Keep <strong>Smartboard Mode</strong> on school projectors (wipes session on close/lock). Turn on <strong>Trusted Device</strong> only on your personal laptop or phone.</p>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">' +
            '<button type="button" class="eaa-btn-3d ' + (!trusted ? 'emerald' : 'slate') + '" id="eaa-sec-mode-board">📺 Classroom Smartboard</button>' +
            '<button type="button" class="eaa-btn-3d ' + (trusted ? 'emerald' : 'slate') + '" id="eaa-sec-mode-personal">💻 Personal Device</button>' +
          '</div>' +
          '<label style="display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:0.84rem;color:#cbd5e1;font-weight:700;">' +
            '<span>⏱ Auto-lock when idle:</span>' +
            '<select id="eaa-sec-idle-select" class="eaa-field" style="width:auto;padding:8px 12px;font-size:0.85rem;">' +
              '<option value="15"' + (idleMins === 15 ? ' selected' : '') + '>15 minutes</option>' +
              '<option value="25"' + (idleMins === 25 ? ' selected' : '') + '>25 minutes (Smartboard recommended)</option>' +
              '<option value="45"' + (idleMins === 45 ? ' selected' : '') + '>45 minutes</option>' +
              '<option value="60"' + (idleMins === 60 ? ' selected' : '') + '>60 minutes</option>' +
              '<option value="0"' + (idleMins === 0 ? ' selected' : '') + '>Never (Personal device only)</option>' +
            '</select>' +
          '</label>' +
        '</div>' +

        '<div class="eaa-sec-section">' +
          '<h3>🔑 Change Teacher Account Password</h3>' +
          '<p>Updates your password directly in Supabase Auth (requires an active online session).</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
            '<input type="password" id="eaa-sec-new-pw" class="eaa-field" style="flex:1;min-width:190px;" placeholder="New strong password (min 10 chars)" autocomplete="new-password" />' +
            '<button type="button" class="eaa-btn-3d emerald" id="eaa-sec-save-pw" style="width:auto;">Save Password</button>' +
          '</div>' +
        '</div>' +

        '<div class="eaa-sec-section">' +
          '<h3>📡 Offline Emergency Passphrase (' + (hasCustomRescue ? 'Custom Set ✓' : 'Default Active') + ')</h3>' +
          '<p>Used ONLY if school Wi-Fi is completely down (cloud sync stays paused). Set a 12+ character phrase or generate a 4-word rescue phrase.</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">' +
            '<input type="text" id="eaa-sec-rescue-inp" class="eaa-field" style="flex:1;min-width:200px;font-family:monospace;" placeholder="Type or generate 4-word phrase…" spellcheck="false" />' +
            '<button type="button" class="eaa-btn-3d slate" id="eaa-sec-gen-rescue" style="width:auto;">🎲 Generate</button>' +
          '</div>' +
          '<button type="button" class="eaa-btn-3d amber" id="eaa-sec-save-rescue">💾 Save Offline Emergency Passphrase on This Device</button>' +
        '</div>' +

        '<details style="margin-bottom:14px;background:rgba(6,9,17,0.5);border:1px solid rgba(148,163,184,0.16);border-radius:12px;padding:10px 14px;font-size:0.8rem;color:#94a3b8;">' +
          '<summary style="cursor:pointer;font-weight:800;color:#cbd5e1;">📧 Tip: Make sure Supabase emails show the 6-digit code</summary>' +
          '<p style="margin:8px 0 0;line-height:1.45;">In your <strong>Supabase Dashboard → Authentication → Email Templates → Magic Link</strong>, include <code style="color:#38bdf8;">{{ .Token }}</code> in the email body so Supabase sends the 6-digit number directly in the email.</p>' +
        '</details>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
          '<button type="button" class="eaa-btn-3d slate" id="eaa-sec-lock-now">🔒 Lock Screen Now</button>' +
          '<button type="button" class="eaa-btn-3d coral" id="eaa-sec-signout-all">🚪 Sign Out All Devices</button>' +
        '</div>' +
      '</div>';

    bd.classList.add('is-open');

    function flashSecMsg(text, kind) {
      var m = el('eaa-sec-status-msg');
      if (!m) return;
      m.className = 'eaa-auth-msg ' + (kind || 'ok');
      m.textContent = text;
      m.style.display = 'block';
    }

    el('eaa-sec-close').onclick = closeSecurityModal;
    el('eaa-sec-force-refresh').onclick = function () {
      if (root.EAAOffline && root.EAAOffline.forceRefresh) root.EAAOffline.forceRefresh();
      else location.reload();
    };
    el('eaa-sec-mode-board').onclick = function () {
      setTrustedDevice(false);
      setIdleMinutes(25);
      openSecurityModal();
      flashSecMsg('Switched to Classroom Smartboard Mode (session-only + 25m auto-lock).', 'ok');
    };
    el('eaa-sec-mode-personal').onclick = function () {
      setTrustedDevice(true);
      setIdleMinutes(0);
      openSecurityModal();
      flashSecMsg('This browser is now marked as your Personal Trusted Device.', 'ok');
    };
    el('eaa-sec-idle-select').onchange = function (ev) {
      setIdleMinutes(parseInt(ev.target.value, 10) || 0);
      flashSecMsg('Auto-lock timer updated.', 'ok');
    };
    el('eaa-sec-save-pw').onclick = async function () {
      var pw = (el('eaa-sec-new-pw').value || '').trim();
      if (pw.length < 10) { flashSecMsg('Choose a password of at least 10 characters.', 'err'); return; }
      var c = getClient();
      if (!c || !signedIn()) { flashSecMsg('Sign in online first to update your Supabase password.', 'err'); return; }
      var btn = el('eaa-sec-save-pw');
      btn.disabled = true;
      var res = await c.auth.updateUser({ password: pw });
      btn.disabled = false;
      if (res.error) flashSecMsg(res.error.message || 'Could not update password.', 'err');
      else {
        el('eaa-sec-new-pw').value = '';
        flashSecMsg('Teacher account password updated in Supabase!', 'ok');
      }
    };
    el('eaa-sec-gen-rescue').onclick = function () {
      var phrase = generateRandomRescuePhrase();
      var inp = el('eaa-sec-rescue-inp');
      inp.value = phrase;
      try { navigator.clipboard.writeText(phrase); flashSecMsg('Generated & copied to clipboard! Write it down safely, then click Save below.', 'warn'); }
      catch (e) { flashSecMsg('Generated! Copy it somewhere safe, then click Save below.', 'warn'); }
    };
    el('eaa-sec-save-rescue').onclick = async function () {
      var phrase = (el('eaa-sec-rescue-inp').value || '').trim();
      try {
        await saveCustomOfflinePassphrase(phrase);
        el('eaa-sec-rescue-inp').value = '';
        flashSecMsg('Offline Emergency Passphrase saved securely (600,000-round PBKDF2).', 'ok');
      } catch (err) {
        flashSecMsg(err.message || 'Could not save passphrase.', 'err');
      }
    };
    el('eaa-sec-lock-now').onclick = function () {
      closeSecurityModal();
      lockPlatform();
    };
    el('eaa-sec-signout-all').onclick = function () {
      signOutDevice(true);
    };
  }

  function closeSecurityModal() {
    var bd = el('eaa-security-modal-backdrop');
    if (bd) bd.classList.remove('is-open');
  }

  // =========================================================================
  // SUBPAGE GUARD & INITIAL BOOTSTRAP
  // =========================================================================
  function getRelativePageFromRoot() {
    if (ROOT_URL && location.href.indexOf(ROOT_URL) === 0) {
      return location.href.slice(ROOT_URL.length).split(/[?#]/)[0];
    }
    var parts = location.pathname.split('/').filter(Boolean);
    return parts.slice(-2).join('/');
  }

  function redirectToMainGate() {
    var rel = getRelativePageFromRoot();
    var target = (ROOT_URL || '../') + 'index.html' + (rel ? '?next=' + encodeURIComponent(rel) : '');
    location.replace(target);
  }

  async function boot() {
    var c = getClient();
    var tabUnlocked = false;
    var tabOfflineEmergency = false;
    var explicitLocked = false;
    try {
      tabUnlocked = sessionStorage.getItem(UNLOCK_SESSION_KEY) === 'true';
      tabOfflineEmergency = sessionStorage.getItem(OFFLINE_SESSION_KEY) === '1';
      explicitLocked = localStorage.getItem(EXPLICIT_LOCK_KEY) === '1';
    } catch (e) {}

    // Check active Supabase Auth session
    if (c) {
      try {
        var res = await c.auth.getSession();
        state.session = (res && res.data && res.data.session) || null;
      } catch (e) {
        state.session = null;
      }

      c.auth.onAuthStateChange(function (event, s) {
        state.session = s || null;
        if (event === 'SIGNED_IN' && s && document.documentElement.classList.contains('platform-locked')) {
          completeOnlineUnlock();
        } else if (event === 'SIGNED_OUT' && !state.offlineEmergency) {
          state.unlocked = false;
          root.__eaa_auth_unlocked = false;
          try { sessionStorage.removeItem(UNLOCK_SESSION_KEY); } catch (e) {}
          if (IS_GUARDED_SUBPAGE) redirectToMainGate();
          else if (el('platform-lock-screen')) lockPlatform();
        }
      });
    }

    // Decide whether this tab is unlocked:
    //  Case 1: Active Supabase session + (same-tab already unlocked OR Trusted Personal Device not explicitly locked)
    var canAutoUnlockOnline = !!(state.session && (tabUnlocked || (isTrustedDevice() && !explicitLocked)));
    //  Case 2: Same-tab Offline Emergency session while still offline
    var canKeepOfflineUnlock = !!(tabUnlocked && tabOfflineEmergency && (typeof navigator !== 'undefined' && navigator.onLine === false));

    // If NOT a trusted device and tab was NOT unlocked in this session, scrub any leftover tokens!
    if (!isTrustedDevice() && !tabUnlocked) {
      if (c && state.session) {
        try { await c.auth.signOut({ scope: 'local' }); } catch (e) {}
        state.session = null;
      }
      scrubLocalSupabaseTokens();
      scrubSessionSupabaseTokens();
    }

    readyResolve();

    if (canAutoUnlockOnline) {
      completeOnlineUnlock();
      return;
    }

    if (canKeepOfflineUnlock) {
      state.offlineEmergency = true;
      state.unlocked = true;
      root.__eaa_offline_emergency = true;
      root.__eaa_auth_unlocked = true;
      finishUnlockTransition(true);
      return;
    }

    // Otherwise: LOCKED!
    state.unlocked = false;
    root.__eaa_auth_unlocked = false;
    try { sessionStorage.removeItem(UNLOCK_SESSION_KEY); } catch (e) {}

    if (IS_GUARDED_SUBPAGE) {
      redirectToMainGate();
      return;
    }

    document.documentElement.classList.add('platform-locked');
    var screen = el('platform-lock-screen');
    if (screen) {
      screen.style.display = 'flex';
      screen.style.opacity = '1';
      screen.style.pointerEvents = 'auto';
      state.pendingEmail = getSavedEmail();
      state.step = (typeof navigator !== 'undefined' && navigator.onLine === false) ? 'offline' : 'request';
      renderLockUI();
      focusActiveInput();
    }
  }

  // Expose global hooks compatible with index.html & subpages
  root.lockPlatformSession = function () { return lockPlatform(); };
  root.openSecurityCenterModal = openSecurityModal;

  root.TeacherAuth = {
    required: required,
    signedIn: signedIn,
    isUnlocked: isUnlocked,
    canSyncCloud: canSyncCloud,
    isTrustedDevice: isTrustedDevice,
    lock: lockPlatform,
    signOut: signOutDevice,
    openSecurityModal: openSecurityModal,
    ready: readyPromise
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
