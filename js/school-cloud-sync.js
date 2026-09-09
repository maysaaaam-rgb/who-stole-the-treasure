/**
 * ENGLISH ADVENTURE ACADEMY — UNIFIED CLOUD PERSISTENCE & CROSS-DEVICE SYNC SERVICE
 * 
 * Provides live, persistent synchronization across iPad, PC, phones, and different browsers.
 * Serves as the single remote source of truth for:
 *   - Teacher Notes (CRUD + cross-device editing)
 *   - Four-Skill Assessments (Scores, mastery, XP, comments)
 *   - XP Audit Ledger Transactions
 *   - Student Profile Overrides (XP, monsters, CEFR, custom notes)
 *   - Attendance Records
 *   - Acceptance Diagnostic Test Verification (CLOUD_TEST_IPAD_2026 / CLOUD_TEST_PC_2026)
 */

(function(root) {
  'use strict';

  // Primary shared cloud database endpoint (Live REST Cloud DB with full CORS: *)
  const DEFAULT_CLOUD_OBJECT_ID = '17962a8fe21e680aa4be75dcfa9ad35c';
  const DEFAULT_PRIMARY_ENDPOINT = 'https://api.github.com/gists/' + DEFAULT_CLOUD_OBJECT_ID;
  
  const LOCAL_CACHE_KEY = 'eaa_cloud_master_cache_v2';
  const SETTINGS_KEY = 'eaa_cloud_sync_endpoint_v2';

  class SchoolCloudSyncService {
    constructor() {
      this.endpoint = this.getStoredEndpoint() || DEFAULT_PRIMARY_ENDPOINT;
      this.backupEndpoint = null;
      this.projectId = 'eaa-prod-cloud-db-gist-' + DEFAULT_CLOUD_OBJECT_ID;
      this.isSyncing = false;
      this.lastSyncTime = null;
      this.lastSyncStatus = 'idle'; // 'idle' | 'syncing' | 'success' | 'error'
      this.lastError = null;
      this.listeners = [];
      this._activeSavePromise = null;
      this._cachedState = null;
      this._autoSyncSetup = false;
    }

    _getAuthHeaders() {
      const headers = {
        'Accept': 'application/vnd.github.v3+json'
      };
      if (this.endpoint.includes('api.github.com')) {
        let token = null;
        try {
          if (typeof window !== 'undefined' && window.location && window.location.search) {
            const urlParams = new URLSearchParams(window.location.search);
            const queryToken = urlParams.get('cloud_token') || urlParams.get('sync_token');
            if (queryToken && queryToken.trim()) {
              localStorage.setItem('eaa_cloud_sync_token', queryToken.trim());
              const cleanUrl = window.location.pathname + (window.location.hash || '');
              if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, cleanUrl);
              }
            }
          }
          if (typeof window !== 'undefined' && window.EAA_CLOUD_TOKEN) {
            token = window.EAA_CLOUD_TOKEN;
          } else if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('eaa_cloud_sync_token');
          }
        } catch (e) {}
        if (token) {
          headers['Authorization'] = 'Bearer ' + token.trim();
        }
      }
      return headers;
    }

    getStoredEndpoint() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(SETTINGS_KEY);
          // Purge legacy endpoints with CORS or quota issues
          if (stored && (stored.includes('extendsclass.com') || stored.includes('restful-api.dev'))) {
            localStorage.removeItem(SETTINGS_KEY);
            return null;
          }
          if (stored && stored.trim()) {
            return stored.trim();
          }
        }
      } catch (e) {}
      return null;
    }

    setCustomEndpoint(url) {
      this.endpoint = (url || '').trim() || DEFAULT_PRIMARY_ENDPOINT;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(SETTINGS_KEY, this.endpoint);
        }
      } catch (e) {}
      this.notify();
    }

    resetDefaultEndpoint() {
      this.endpoint = DEFAULT_PRIMARY_ENDPOINT;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(SETTINGS_KEY);
        }
      } catch (e) {}
      this.notify();
    }

    subscribe(fn) {
      if (typeof fn === 'function') {
        this.listeners.push(fn);
        try { fn(this.getStatus()); } catch (e) {}
      }
      return () => {
        this.listeners = this.listeners.filter(l => l !== fn);
      };
    }

    notify() {
      const status = this.getStatus();
      this.listeners.forEach(fn => {
        try { fn(status); } catch (e) {}
      });
    }

    getStatus() {
      return {
        provider: 'Shared Online Cloud DB',
        endpoint: this.endpoint,
        projectId: this.projectId,
        isSyncing: this.isSyncing,
        lastSyncTime: this.lastSyncTime,
        lastSyncStatus: this.lastSyncStatus,
        lastError: this.lastError
      };
    }

    /**
     * Normalize and unpack remote database response
     */
    _unpackData(json) {
      if (!json) return this._createEmptyContainer();

      let target = json;
      // Extract from GitHub Gist response if wrapped
      if (target.files && target.files['eaa_cloud_data.json'] && target.files['eaa_cloud_data.json'].content) {
        try {
          target = JSON.parse(target.files['eaa_cloud_data.json'].content);
        } catch (e) {
          console.warn('[SchoolCloudSync] Failed to parse gist content:', e);
          target = json;
        }
      } else if (target.data) {
        if (typeof target.data === 'string') {
          try {
            target = JSON.parse(target.data);
          } catch (e) {
            target = json;
          }
        } else if (typeof target.data === 'object') {
          target = target.data;
        }
      }

      // Normalize teacherNotes array
      let notesArr = [];
      if (Array.isArray(target.teacherNotes)) {
        notesArr = target.teacherNotes;
      } else if (target.teacherNotes && typeof target.teacherNotes === 'object') {
        Object.values(target.teacherNotes).forEach(val => {
          if (Array.isArray(val)) notesArr.push(...val);
          else if (val && typeof val === 'object') notesArr.push(val);
        });
      }

      return {
        database: target.database || 'English Adventure Academy Production DB',
        projectId: this.projectId,
        version: target.version || 2,
        lastUpdated: target.lastUpdated || new Date().toISOString(),
        updatedBy: target.updatedBy || 'client',
        diagnosticTest: target.diagnosticTest || '',
        teacherNotes: notesArr,
        progressCheckSubmissions: (target.progressCheckSubmissions && typeof target.progressCheckSubmissions === 'object') ? target.progressCheckSubmissions : (target.submissions || {}),
        studentOverrides: (target.studentOverrides && typeof target.studentOverrides === 'object') ? target.studentOverrides : {},
        xpTransactions: Array.isArray(target.xpTransactions) ? target.xpTransactions : [],
        attendanceRecords: Array.isArray(target.attendanceRecords) ? target.attendanceRecords : []
      };
    }

    _createEmptyContainer() {
      return {
        database: 'English Adventure Academy Production DB',
        projectId: this.projectId,
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'client',
        diagnosticTest: '',
        teacherNotes: [],
        progressCheckSubmissions: {},
        studentOverrides: {},
        xpTransactions: [],
        attendanceRecords: []
      };
    }

    /**
     * Fetch complete shared state from online database
     */
    async fetchOnlineState() {
      this.isSyncing = true;
      this.lastSyncStatus = 'syncing';
      this.lastError = null;
      this.notify();

      try {
        const fetchUrl = this.endpoint + (this.endpoint.includes('?') ? '&' : '?') + 'ts=' + Date.now();
        const headers = this._getAuthHeaders();

        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: headers
        });

        if (!response.ok) {
          throw new Error('Database GET returned HTTP ' + response.status + ' (' + response.statusText + ')');
        }

        const json = await response.json();
        const data = this._unpackData(json);

        this._cachedState = data;
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
          }
        } catch (e) {}

        this.lastSyncTime = new Date().toISOString();
        this.lastSyncStatus = 'success';
        this.isSyncing = false;
        this.lastError = null;
        this.notify();
        return data;
      } catch (err) {
        console.warn('[SchoolCloudSync] fetchOnlineState error:', err.message);
        this.lastSyncStatus = 'error';
        this.lastError = err.message;
        this.isSyncing = false;
        this.notify();

        // Fallback to local cache only if network error occurred
        if (this._cachedState) return this._cachedState;
        try {
          if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem(LOCAL_CACHE_KEY);
            if (raw) return JSON.parse(raw);
          }
        } catch (e) {}
        return this._createEmptyContainer();
      }
    }

    /**
     * Persist complete shared state container to online database
     */
    async pushOnlineState(container, deviceIdentifier = 'device') {
      this.isSyncing = true;
      this.lastSyncStatus = 'syncing';
      this.lastError = null;
      this.notify();

      const payload = Object.assign({}, container, {
        database: 'English Adventure Academy Production DB',
        projectId: this.projectId,
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: deviceIdentifier
      });

      const isGist = this.endpoint.includes('api.github.com/gists');
      const method = isGist ? 'PATCH' : 'PUT';
      const headers = Object.assign(
        { 'Content-Type': 'application/json' },
        this._getAuthHeaders()
      );

      let bodyContent;
      if (isGist) {
        bodyContent = JSON.stringify({
          description: 'English Adventure Academy Production DB',
          files: {
            'eaa_cloud_data.json': {
              content: JSON.stringify(payload, null, 2)
            }
          }
        });
      } else if (this.endpoint.includes('api.restful-api.dev')) {
        bodyContent = JSON.stringify({ name: 'English Adventure Academy Production DB', data: payload });
      } else {
        bodyContent = JSON.stringify(payload);
      }

      let putRes = null;
      let lastErr = null;
      let attempts = 0;

      while (attempts < 3) {
        attempts++;
        try {
          putRes = await fetch(this.endpoint, {
            method: method,
            headers: headers,
            body: bodyContent
          });
          if (putRes.ok) break;
          lastErr = new Error('Database ' + method + ' returned HTTP ' + putRes.status);
          if (attempts < 3) await new Promise(r => setTimeout(r, 350 * attempts));
        } catch (fetchErr) {
          lastErr = fetchErr;
          if (attempts < 3) await new Promise(r => setTimeout(r, 350 * attempts));
        }
      }

      if (!putRes || !putRes.ok) {
        const errMsg = lastErr ? lastErr.message : (putRes ? 'HTTP ' + putRes.status : 'No response from database');
        console.error('[SchoolCloudSync] pushOnlineState failed:', errMsg);
        this.lastSyncStatus = 'error';
        this.lastError = errMsg;
        this.isSyncing = false;
        this.notify();
        throw new Error('Online database save failed: ' + errMsg);
      }

      this._cachedState = payload;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(payload));
        }
      } catch (e) {}

      // Asynchronous mirror to secondary endpoint (best-effort, non-blocking)
      this._mirrorToBackup(payload).catch(() => {});

      this.lastSyncTime = new Date().toISOString();
      this.lastSyncStatus = 'success';
      this.lastError = null;
      this.isSyncing = false;
      this.notify();

      return { success: true, timestamp: this.lastSyncTime };
    }

    async _mirrorToBackup(payload) {
      if (!this.backupEndpoint) return;
      try {
        const minifiedData = {
          diagnosticTest: payload.diagnosticTest || '',
          teacherNotes: (payload.teacherNotes || []).slice(0, 15),
          lastUpdated: payload.lastUpdated,
          updatedBy: payload.updatedBy
        };
        await fetch(this.backupEndpoint, {
          method: 'PUT',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'English Adventure Academy Production DB',
            data: minifiedData
          })
        });
      } catch (e) {}
    }

    /**
     * Queue and execute save operations sequentially
     */
    _enqueue(taskFn) {
      if (this._activeSavePromise) {
        return this._activeSavePromise.then(() => this._enqueue(taskFn));
      }
      this._activeSavePromise = taskFn().finally(() => {
        this._activeSavePromise = null;
      });
      return this._activeSavePromise;
    }

    // =========================================================================
    // 1. TEACHER NOTES CRUD (Shared Cloud Persistence)
    // =========================================================================
    async saveTeacherNote(note, deviceId = 'web') {
      if (!note || !note.id) return { success: false, error: 'Invalid note payload' };

      return this._enqueue(async () => {
        const state = await this.fetchOnlineState();
        if (!state.teacherNotes) state.teacherNotes = [];

        const cleanNote = {
          id: note.id,
          studentId: String(note.studentId || ''),
          text: String(note.text || ''),
          author: note.author || 'Mr. Maysam',
          date: note.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          updatedAt: new Date().toISOString()
        };

        const existingIdx = state.teacherNotes.findIndex(n => n.id === cleanNote.id);
        if (existingIdx !== -1) {
          state.teacherNotes[existingIdx] = Object.assign({}, state.teacherNotes[existingIdx], cleanNote);
        } else {
          state.teacherNotes.unshift(cleanNote);
        }

        // Sort chronologically newest first
        state.teacherNotes.sort((a, b) => new Date(b.updatedAt || b.date || 0).getTime() - new Date(a.updatedAt || a.date || 0).getTime());

        // Update student latestTeacherNote override
        if (cleanNote.studentId) {
          if (!state.studentOverrides) state.studentOverrides = {};
          if (!state.studentOverrides[cleanNote.studentId]) state.studentOverrides[cleanNote.studentId] = {};
          state.studentOverrides[cleanNote.studentId].latestTeacherNote = cleanNote.text;

          // Also synchronize with any progress check submission for this student
          if (state.progressCheckSubmissions) {
            Object.values(state.progressCheckSubmissions).forEach(sub => {
              if (sub && sub.studentId === cleanNote.studentId) {
                sub.notes = cleanNote.text;
                sub.teacherComment = cleanNote.text;
                sub.updatedAt = cleanNote.updatedAt;
              }
            });
          }
        }

        // Check if this is a diagnostic test string
        if (cleanNote.text.includes('CLOUD_TEST_') || cleanNote.text.includes('REAL_')) {
          state.diagnosticTest = cleanNote.text;
        }

        await this.pushOnlineState(state, deviceId);
        return { success: true, note: cleanNote };
      });
    }

    async deleteTeacherNote(noteId, deviceId = 'web') {
      if (!noteId) return { success: false };

      return this._enqueue(async () => {
        const state = await this.fetchOnlineState();
        if (!state.teacherNotes) return { success: true };

        state.teacherNotes = state.teacherNotes.filter(n => n.id !== noteId);
        await this.pushOnlineState(state, deviceId);
        return { success: true };
      });
    }

    // =========================================================================
    // 2. FOUR-SKILL ASSESSMENTS (Shared Cloud Persistence)
    // =========================================================================
    async saveAssessments(submissionsArray, deviceId = 'web') {
      if (!Array.isArray(submissionsArray) || submissionsArray.length === 0) {
        return { success: true, count: 0 };
      }

      return this._enqueue(async () => {
        const state = await this.fetchOnlineState();
        if (!state.progressCheckSubmissions) state.progressCheckSubmissions = {};

        submissionsArray.forEach(sub => {
          if (!sub || !sub.studentId || !sub.progressCheckId) return;
          const key = sub.studentId + '_' + sub.progressCheckId;

          const cleanSub = {
            id: sub.id,
            studentId: sub.studentId,
            progressCheckId: sub.progressCheckId,
            classId: sub.classId,
            bookId: sub.bookId || (sub.progressCheckId === 'progress-check-gr3-u1' ? 'book-global-readings-3' : 'book-global-readings-2'),
            bookTitle: sub.bookTitle || (sub.progressCheckId === 'progress-check-gr3-u1' ? 'Global Readings 3' : 'Global Readings 2'),
            unitId: sub.unitId || (sub.progressCheckId === 'progress-check-gr3-u1' ? 'unit-gr3-1' : 'unit-gr2-1'),
            unitTitle: sub.unitTitle || (sub.progressCheckId === 'progress-check-gr3-u1' ? 'Unit 1: I Love Reading' : 'Unit 1: What Does It Do?'),
            date: sub.date,
            displayDate: sub.displayDate,
            status: sub.status || 'completed',
            completionPct: sub.completionPct || 100,
            rawTotal: sub.rawTotal,
            maxRawTotal: sub.maxRawTotal || 40,
            xpEarned: sub.xpEarned,
            accuracyPct: sub.accuracyPct,
            overallScore: sub.overallScore,
            mastery: sub.mastery,
            scores: sub.scores ? {
              reading: { correct: (sub.scores.reading && sub.scores.reading.correct !== undefined) ? sub.scores.reading.correct : 0, total: 10 },
              listening: { correct: (sub.scores.listening && sub.scores.listening.correct !== undefined) ? sub.scores.listening.correct : 0, total: 10 },
              writing: { correct: (sub.scores.writing && sub.scores.writing.correct !== undefined) ? sub.scores.writing.correct : 0, total: 10 },
              speaking: { correct: (sub.scores.speaking && sub.scores.speaking.correct !== undefined) ? sub.scores.speaking.correct : 0, total: 10 }
            } : {},
            notes: sub.notes || sub.teacherComment || '',
            teacherComment: sub.notes || sub.teacherComment || '',
            updatedAt: new Date().toISOString()
          };

          state.progressCheckSubmissions[key] = Object.assign({}, state.progressCheckSubmissions[key] || {}, cleanSub);

          // Update student latestTeacherNote and teacherNotes if comments provided
          if (cleanSub.notes && cleanSub.studentId) {
            if (!state.studentOverrides) state.studentOverrides = {};
            if (!state.studentOverrides[cleanSub.studentId]) state.studentOverrides[cleanSub.studentId] = {};
            state.studentOverrides[cleanSub.studentId].latestTeacherNote = cleanSub.notes;

            if (!state.teacherNotes) state.teacherNotes = [];
            const existingNoteIdx = state.teacherNotes.findIndex(n => n.studentId === cleanSub.studentId);
            if (existingNoteIdx !== -1) {
              state.teacherNotes[existingNoteIdx].text = cleanSub.notes;
              state.teacherNotes[existingNoteIdx].updatedAt = cleanSub.updatedAt;
            } else {
              state.teacherNotes.unshift({
                id: 'note-pc-' + cleanSub.studentId + '-' + Date.now(),
                studentId: cleanSub.studentId,
                text: cleanSub.notes,
                author: 'Mr. Maysam',
                date: cleanSub.displayDate || 'September 2026',
                source: 'Progress Check',
                updatedAt: cleanSub.updatedAt
              });
            }

            if (cleanSub.notes.includes('CLOUD_TEST_') || cleanSub.notes.includes('REAL_')) {
              state.diagnosticTest = cleanSub.notes;
            }
          }
        });

        await this.pushOnlineState(state, deviceId);
        return { success: true, count: submissionsArray.length };
      });
    }

    async deleteAssessment(studentId, checkId, deviceId = 'web') {
      if (!studentId || !checkId) return { success: false };

      return this._enqueue(async () => {
        const state = await this.fetchOnlineState();
        if (!state.progressCheckSubmissions) return { success: true };

        const key = studentId + '_' + checkId;
        if (state.progressCheckSubmissions[key]) {
          delete state.progressCheckSubmissions[key];
        }

        await this.pushOnlineState(state, deviceId);
        return { success: true };
      });
    }

    // =========================================================================
    // 3. XP AUDIT LEDGER (Shared Cloud Persistence)
    // =========================================================================
    async saveXPTransaction(tx, deviceId = 'web') {
      if (!tx || !tx.id || !tx.studentId) return { success: false };

      return this._enqueue(async () => {
        const state = await this.fetchOnlineState();
        if (!state.xpTransactions) state.xpTransactions = [];

        const cleanTx = {
          id: tx.id,
          studentId: tx.studentId,
          amount: parseInt(tx.amount, 10) || 0,
          reason: tx.reason || 'Classroom Award',
          category: tx.category || 'positive',
          icon: tx.icon || '⭐',
          date: tx.date || 'September 2026',
          timestamp: tx.timestamp || new Date().toISOString(),
          source: tx.source || 'manual',
          sourceId: tx.sourceId || null,
          classId: tx.classId || null,
          status: tx.status || 'active'
        };

        const existingIdx = state.xpTransactions.findIndex(t => t.id === cleanTx.id);
        if (existingIdx !== -1) {
          state.xpTransactions[existingIdx] = cleanTx;
        } else {
          state.xpTransactions.push(cleanTx);
        }

        await this.pushOnlineState(state, deviceId);
        return { success: true, tx: cleanTx };
      });
    }

    // =========================================================================
    // 4. STUDENT OVERRIDES & PROFILES (Shared Cloud Persistence)
    // =========================================================================
    async saveStudentUpdate(studentId, updates, deviceId = 'web') {
      if (!studentId || !updates) return { success: false };

      return this._enqueue(async () => {
        const state = await this.fetchOnlineState();
        if (!state.studentOverrides) state.studentOverrides = {};

        state.studentOverrides[studentId] = Object.assign({}, state.studentOverrides[studentId] || {}, updates, {
          updatedAt: new Date().toISOString()
        });

        await this.pushOnlineState(state, deviceId);
        return { success: true };
      });
    }

    // =========================================================================
    // 5. ATTENDANCE (Shared Cloud Persistence)
    // =========================================================================
    async saveAttendance(recordsArray, deviceId = 'web') {
      if (!Array.isArray(recordsArray) || recordsArray.length === 0) return { success: true };

      return this._enqueue(async () => {
        const state = await this.fetchOnlineState();
        if (!state.attendanceRecords) state.attendanceRecords = [];

        recordsArray.forEach(rec => {
          if (!rec || !rec.id) return;
          const idx = state.attendanceRecords.findIndex(r => r.id === rec.id);
          if (idx !== -1) {
            state.attendanceRecords[idx] = Object.assign({}, state.attendanceRecords[idx], rec);
          } else {
            state.attendanceRecords.push(rec);
          }
        });

        await this.pushOnlineState(state, deviceId);
        return { success: true };
      });
    }

    // =========================================================================
    // 6. FULL TWO-WAY STORE SYNCHRONIZATION
    // =========================================================================
    async syncWithStore(store) {
      if (!store || typeof store.mergeCloudState !== 'function') {
        return { success: false, reason: 'Invalid store' };
      }

      try {
        const onlineData = await this.fetchOnlineState();
        if (onlineData) {
          store.mergeCloudState(onlineData);
          return {
            success: true,
            notesCount: onlineData.teacherNotes.length,
            submissionsCount: Object.keys(onlineData.progressCheckSubmissions).length,
            diagnosticTest: onlineData.diagnosticTest
          };
        }
        return { success: false, reason: 'No data returned from online database' };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Legacy backwards compatibility helper for fetchAssessments
    async fetchAssessments() {
      const state = await this.fetchOnlineState();
      return state.progressCheckSubmissions || {};
    }

    // Legacy backwards compatibility helper for deleteAssessment
    async deleteAssessmentLegacy(studentId, checkId) {
      return this.deleteAssessment(studentId, checkId);
    }

    // =========================================================================
    // 7. CONTINUOUS AUTO-SYNC & CROSS-DEVICE EVENT LISTENERS
    // =========================================================================
    setupAutoSync(store) {
      if (!store || this._autoSyncSetup) return;
      this._autoSyncSetup = true;

      // Initial immediate fetch & merge on app load
      this.syncWithStore(store).catch(err => {
        console.warn('[SchoolCloudSync] Initial auto-sync note:', err.message);
      });

      // Synchronize on window focus & tab visibility change (iPad wake, PC tab focus)
      const onVisible = () => {
        if (typeof document !== 'undefined' && document.visibilityState === 'visible' && !this.isSyncing) {
          this.syncWithStore(store).catch(() => {});
        }
      };

      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('focus', onVisible);
        if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
          document.addEventListener('visibilitychange', onVisible);
        }
      }

      // Continuous 10-second background polling
      if (typeof setInterval !== 'undefined') {
        setInterval(() => {
          if (typeof document !== 'undefined' && document.visibilityState === 'visible' && !this.isSyncing) {
            this.syncWithStore(store).catch(() => {});
          }
        }, 10000);
      }
    }
  }

  root.SchoolCloudSync = new SchoolCloudSyncService();

})(typeof window !== 'undefined' ? window : global);
