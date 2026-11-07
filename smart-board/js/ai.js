/* Smart Board: talks to the "smartboard-ai" Supabase function (the Gemini key lives there, never in this page). */
(function (root) {
  'use strict';

  const PIN_KEY = 'smartboard.pin';
  let pin = '';
  try { pin = root.localStorage.getItem(PIN_KEY) || ''; } catch (e) { pin = ''; }

  function endpoint() {
    const c = root.SUPABASE_CONFIG || {};
    return c.url ? c.url.replace(/\/$/, '') + '/functions/v1/smartboard-ai' : '';
  }
  function headers(extra) {
    const c = root.SUPABASE_CONFIG || {}, h = {};
    if (c.anonKey) h.apikey = c.anonKey;
    if (pin) h['x-board-pin'] = pin;
    return Object.assign(h, extra || {});
  }
  function fail(code, message) { const e = new Error(message); e.code = code; return e; }

  const AI = {
    ready: false,
    state: 'off',          // off | checking | ready | offline | setup | badpin
    left: null,
    missing: [],
    onChange: null,

    hasPin() { return !!pin; },
    setPin(p) {
      pin = String(p || '').trim();
      try { if (pin) root.localStorage.setItem(PIN_KEY, pin); else root.localStorage.removeItem(PIN_KEY); } catch (e) { /* ignore */ }
    },
    set(state, extra) {
      this.state = state; this.ready = state === 'ready';
      Object.assign(this, extra || {});
      if (typeof this.onChange === 'function') this.onChange(this);
    },

    async status() {
      const url = endpoint();
      if (!url) { this.set('setup', { missing: ['Supabase'] }); return this; }
      if (!pin) { this.set('off'); return this; }
      this.set('checking');
      try {
        const r = await fetch(url + '?action=status', { method: 'GET', headers: headers() });
        const j = await r.json().catch(() => ({}));
        if (r.status === 401) this.set('badpin');
        else if (r.status === 404) this.set('setup', { missing: ['smartboard-ai function'] });
        else if (r.ok && j.ready) this.set('ready', { left: j.left || null, missing: [] });
        else this.set('setup', { missing: j.missing || [] });
      } catch (e) {
        this.set(root.navigator.onLine === false ? 'offline' : 'setup', { missing: ['smartboard-ai function'] });
      }
      return this;
    },

    async call(task, payload, timeoutMs) {
      const url = endpoint();
      if (!url) throw fail('setup', 'The AI is not set up.');
      if (!pin) throw fail('nopin', 'Type your PIN in ⚙️ to switch on the AI.');
      if (root.navigator.onLine === false) throw fail('offline', 'No internet right now.');
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs || 45000);
      let r;
      try {
        r = await fetch(url, {
          method: 'POST', signal: ctrl.signal,
          headers: headers({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(Object.assign({ task }, payload || {}))
        });
      } catch (e) {
        throw fail(e && e.name === 'AbortError' ? 'timeout' : 'offline',
          e && e.name === 'AbortError' ? 'The AI took too long. Try again.' : 'Could not reach the AI. Check the internet.');
      } finally { clearTimeout(timer); }
      const j = await r.json().catch(() => ({}));
      if (j.left) { this.left = j.left; if (typeof this.onChange === 'function') this.onChange(this); }
      if (!r.ok || !j.ok) {
        if (r.status === 401) this.set('badpin');
        if (j.error === 'not_set_up') this.set('setup', { missing: j.missing || [] });
        throw fail(j.error || 'upstream', j.message || 'The AI could not answer.');
      }
      if (this.state !== 'ready') this.set('ready');
      return j.data;
    }
  };

  root.SmartAI = AI;
})(window);
