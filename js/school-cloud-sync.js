/**
 * ENGLISH ADVENTURE ACADEMY — CLOUD PERSISTENCE & CROSS-DEVICE SYNC SERVICE
 * 
 * Provides live persistent synchronization across iPad, PC, phones, and different browsers.
 * Acts as the centralized cloud database connector for Four-Skill Assessments and XP contributions.
 */

(function(root) {
  'use strict';

  const DEFAULT_CLOUD_BIN_ID = 'fcbfecb';
  const DEFAULT_API_BASE = 'https://extendsclass.com/api/json-storage/bin/' + DEFAULT_CLOUD_BIN_ID;
  const LOCAL_CACHE_KEY = 'eaa_cloud_assessments_cache_v1';
  const SETTINGS_KEY = 'eaa_cloud_sync_endpoint_v1';

  class SchoolCloudSyncService {
    constructor() {
      this.endpoint = this.getStoredEndpoint() || DEFAULT_API_BASE;
      this.isSyncing = false;
      this.lastSyncTime = null;
      this.lastSyncStatus = 'idle'; // 'idle' | 'syncing' | 'success' | 'error'
      this.listeners = [];
    }

    getStoredEndpoint() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(SETTINGS_KEY);
          if (stored && stored.includes('restful-api.dev')) {
            localStorage.removeItem(SETTINGS_KEY);
            return DEFAULT_API_BASE;
          }
          return stored;
        }
      } catch (e) {}
      return null;
    }

    setCustomEndpoint(url) {
      this.endpoint = (url || '').trim() || DEFAULT_API_BASE;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(SETTINGS_KEY, this.endpoint);
        }
      } catch (e) {}
      this.notify();
    }

    resetDefaultEndpoint() {
      this.endpoint = DEFAULT_API_BASE;
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
      }
    }

    notify() {
      this.listeners.forEach(fn => {
        try { fn(this.getStatus()); } catch (e) {}
      });
    }

    getStatus() {
      return {
        endpoint: this.endpoint,
        isSyncing: this.isSyncing,
        lastSyncTime: this.lastSyncTime,
        lastSyncStatus: this.lastSyncStatus
      };
    }

    _extractSubmissions(json) {
      if (!json) return {};
      if (json.submissions && typeof json.submissions === 'object') {
        return json.submissions;
      }
      if (json.data) {
        if (typeof json.data === 'string') {
          try {
            const parsed = JSON.parse(json.data);
            return parsed.submissions || {};
          } catch (e) {}
        } else if (typeof json.data === 'object' && json.data.submissions) {
          return json.data.submissions;
        }
      }
      return {};
    }

    /**
     * Fetch all persisted assessment records from the cloud database.
     * Returns an object mapping: { 'studentId_checkId': submissionRecord }
     */
    async fetchAssessments() {
      this.isSyncing = true;
      this.lastSyncStatus = 'syncing';
      this.notify();

      try {
        const fetchUrl = this.endpoint + (this.endpoint.includes('?') ? '&' : '?') + 'ts=' + Date.now();
        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error('Cloud HTTP error: ' + response.status);
        }

        const json = await response.json();
        const data = this._extractSubmissions(json);

        // Update local cache
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
          }
        } catch (e) {}

        this.lastSyncTime = new Date().toISOString();
        this.lastSyncStatus = 'success';
        this.isSyncing = false;
        this.notify();
        return data;
      } catch (err) {
        console.warn('[CloudSync] Fetch failed, using local cache:', err.message);
        this.lastSyncStatus = 'error';
        this.isSyncing = false;
        this.notify();

        // Fallback to local cache if offline or error
        try {
          if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem(LOCAL_CACHE_KEY);
            if (raw) return JSON.parse(raw);
          }
        } catch (e) {}
        return null;
      }
    }

    /**
     * Persist an array of submissions to the cloud database (UPSERT).
     */
    async saveAssessments(submissionsArray) {
      if (!Array.isArray(submissionsArray) || submissionsArray.length === 0) {
        return { success: true, count: 0 };
      }

      if (this._activeSavePromise) {
        return this._activeSavePromise.then(() => this.saveAssessments(submissionsArray));
      }

      this._activeSavePromise = this._doSaveAssessments(submissionsArray).finally(() => {
        this._activeSavePromise = null;
      });
      return this._activeSavePromise;
    }

    async _doSaveAssessments(submissionsArray) {
      this.isSyncing = true;
      this.lastSyncStatus = 'syncing';
      this.notify();

      try {
        // 1. Fetch current cloud state first to ensure deep merge
        let currentSubmissions = {};
        try {
          const fetchUrl = this.endpoint + (this.endpoint.includes('?') ? '&' : '?') + 'ts=' + Date.now();
          const fetchRes = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          });
          if (fetchRes.ok) {
            const json = await fetchRes.json();
            currentSubmissions = this._extractSubmissions(json);
          }
        } catch (e) {
          console.warn('[CloudSync] Pre-save fetch warning:', e.message);
        }

        // 2. Sanitize and UPSERT each submission
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
          currentSubmissions[key] = Object.assign({}, currentSubmissions[key] || {}, cleanSub);
        });

        // 3. PUT updated container back to cloud with retry
        const payload = {
          schema: 'eaa_four_skill_assessments_v1',
          appName: 'English Adventure Academy',
          version: 1,
          lastSync: new Date().toISOString(),
          submissions: currentSubmissions
        };

        let putRes = null;
        let attempts = 0;
        while (attempts < 3) {
          attempts++;
          try {
            putRes = await fetch(this.endpoint, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(payload)
            });
            if (putRes.ok) break;
            if (attempts < 3) await new Promise(r => setTimeout(r, 400 * attempts));
          } catch (fetchErr) {
            if (attempts >= 3) throw fetchErr;
            await new Promise(r => setTimeout(r, 400 * attempts));
          }
        }

        if (!putRes || !putRes.ok) {
          throw new Error('Cloud save HTTP error: ' + (putRes ? putRes.status : 'no response'));
        }

        // Update local cache
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(currentSubmissions));
          }
        } catch (e) {}

        this.lastSyncTime = new Date().toISOString();
        this.lastSyncStatus = 'success';
        this.isSyncing = false;
        this.notify();

        return { success: true, count: submissionsArray.length };
      } catch (err) {
        console.error('[CloudSync] Save failed:', err.message);
        this.lastSyncStatus = 'error';
        this.isSyncing = false;
        this.notify();
        return { success: false, error: err.message };
      }
    }

    /**
     * Delete an assessment record from the cloud database
     */
    async deleteAssessment(studentId, checkId) {
      if (!studentId || !checkId) return { success: false };

      try {
        let currentSubmissions = {};
        const fetchUrl = this.endpoint + (this.endpoint.includes('?') ? '&' : '?') + 'ts=' + Date.now();
        const fetchRes = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (fetchRes.ok) {
          const json = await fetchRes.json();
          currentSubmissions = this._extractSubmissions(json);
        }

        const key = studentId + '_' + checkId;
        if (currentSubmissions[key]) {
          delete currentSubmissions[key];
        }

        const payload = {
          schema: 'eaa_four_skill_assessments_v1',
          appName: 'English Adventure Academy',
          version: 1,
          lastSync: new Date().toISOString(),
          submissions: currentSubmissions
        };

        await fetch(this.endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        return { success: true };
      } catch (err) {
        console.warn('[CloudSync] Delete warning:', err.message);
        return { success: false, error: err.message };
      }
    }

    /**
     * Two-way sync: Pulls cloud assessments and merges into school store
     */
    async syncWithStore(store) {
      if (!store || typeof store.mergeCloudSubmissions !== 'function') return;

      const cloudData = await this.fetchAssessments();
      if (cloudData && typeof cloudData === 'object') {
        const cloudArray = Object.values(cloudData);
        store.mergeCloudSubmissions(cloudArray);
      }
    }
  }

  root.SchoolCloudSync = new SchoolCloudSyncService();

})(typeof window !== 'undefined' ? window : global);
