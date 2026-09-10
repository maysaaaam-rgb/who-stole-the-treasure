/**
 * ENGLISH ADVENTURE ACADEMY — UNIFIED CLOUD PERSISTENCE & CROSS-DEVICE SYNC SERVICE (v2.0)
 * 
 * Authoritative cloud database bridge powered by Supabase PostgreSQL.
 * Provides instant, reliable cross-device data synchronization across PC, iPad, and phones.
 * Fully replaces legacy GitHub Gist storage with unified PostgreSQL persistence.
 */

(function(root) {
  'use strict';

  class SchoolCloudSyncService {
    constructor() {
      this.isSyncing = false;
      this.lastSyncTime = null;
      this.lastSyncStatus = 'idle'; // 'idle' | 'syncing' | 'success' | 'error'
      this.lastError = null;
      this.listeners = [];
      this._autoSyncSetup = false;
      this._activeStore = null;

      // Subscribe to underlying Supabase client status
      if (root.AdventureSupabase && typeof root.AdventureSupabase.subscribe === 'function') {
        root.AdventureSupabase.subscribe((sbStatus) => {
          this.isSyncing = sbStatus.isSyncing;
          this.lastSyncTime = sbStatus.lastSyncTime || this.lastSyncTime;
          this.lastSyncStatus = sbStatus.lastSyncStatus;
          this.lastError = sbStatus.lastError;
          this.notify();
        });
      }
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
      const sbStatus = (root.AdventureSupabase && root.AdventureSupabase.getStatus)
        ? root.AdventureSupabase.getStatus()
        : { isConfigured: false, url: '' };

      return {
        provider: 'Supabase PostgreSQL',
        isConfigured: Boolean(sbStatus.isConfigured),
        url: sbStatus.url || '',
        endpoint: sbStatus.url || 'Supabase Cloud Database',
        isSyncing: Boolean(this.isSyncing || sbStatus.isSyncing),
        lastSyncTime: this.lastSyncTime || sbStatus.lastSyncTime,
        lastSyncStatus: this.lastSyncStatus || sbStatus.lastSyncStatus || 'idle',
        lastError: this.lastError || sbStatus.lastError
      };
    }

    // =========================================================================
    // 1. STUDENTS CRUD (Supabase Authoritative Persistence)
    // =========================================================================
    async saveStudent(student) {
      if (!root.AdventureSupabase) return { success: false, error: 'Supabase client not initialized' };
      return root.AdventureSupabase.saveStudent(student);
    }

    async deleteStudent(studentId) {
      if (!root.AdventureSupabase) return { success: false, error: 'Supabase client not initialized' };
      return root.AdventureSupabase.deleteStudent(studentId);
    }

    async getStudents() {
      if (!root.AdventureSupabase) return [];
      return root.AdventureSupabase.getStudents();
    }

    async saveStudentUpdate(studentId, updates) {
      if (!studentId || !updates) return { success: false };
      if (this._activeStore) {
        const student = this._activeStore.getStudent(studentId);
        if (student) {
          Object.assign(student, updates);
          return this.saveStudent(student);
        }
      }
      return { success: true };
    }

    // =========================================================================
    // 2. TEACHER NOTES CRUD (Supabase Authoritative Persistence)
    // =========================================================================
    async saveTeacherNote(note) {
      if (!root.AdventureSupabase) return { success: false };
      return root.AdventureSupabase.saveTeacherNote(note);
    }

    async deleteTeacherNote(noteId) {
      if (!root.AdventureSupabase) return { success: false };
      return root.AdventureSupabase.deleteTeacherNote(noteId);
    }

    // =========================================================================
    // 3. FOUR-SKILL ASSESSMENTS (Supabase Authoritative Persistence)
    // =========================================================================
    async saveAssessments(submissionsArray) {
      if (!root.AdventureSupabase) return { success: true, count: 0 };
      return root.AdventureSupabase.saveAssessments(submissionsArray);
    }

    async deleteAssessment(studentId, checkId) {
      if (!root.AdventureSupabase) return { success: false };
      return root.AdventureSupabase.deleteAssessment(studentId, checkId);
    }

    // =========================================================================
    // 4. XP AUDIT LEDGER (Supabase Authoritative Persistence)
    // =========================================================================
    async saveXPTransaction(tx) {
      if (!root.AdventureSupabase) return { success: false };
      return root.AdventureSupabase.saveXPTransaction(tx);
    }

    async deleteXPTransaction(txId) {
      if (!root.AdventureSupabase) return { success: false };
      return root.AdventureSupabase.deleteXPTransaction(txId);
    }

    // =========================================================================
    // 5. ATTENDANCE (Supabase Authoritative Persistence)
    // =========================================================================
    async saveAttendance(recordsArray) {
      if (!root.AdventureSupabase) return { success: true };
      return root.AdventureSupabase.saveAttendance(recordsArray);
    }

    // =========================================================================
    // 5B. CLASSES CRUD (Supabase Authoritative Persistence)
    // =========================================================================
    async saveClass(cls) {
      if (!root.AdventureSupabase) return { success: false };
      return root.AdventureSupabase.saveClass(cls);
    }

    async getClasses() {
      if (!root.AdventureSupabase) return [];
      return root.AdventureSupabase.getClasses();
    }

    async deleteClass(classId) {
      if (!root.AdventureSupabase) return { success: false };
      return root.AdventureSupabase.deleteClass(classId);
    }

    // =========================================================================
    // 6. TWO-WAY STORE SYNCHRONIZATION & SAFE ROSTER MIGRATION
    // =========================================================================
    async uploadLocalStudentsToCloud(store) {
      if (!root.AdventureSupabase) return { success: false, error: 'Supabase client not loaded' };
      return root.AdventureSupabase.uploadLocalStudentsToCloud(store);
    }

    async migrateLocalRosterToCloud(store) {
      if (!root.AdventureSupabase) return { success: false, error: 'Supabase client not loaded' };
      return root.AdventureSupabase.migrateLocalRosterToCloud(store);
    }

    async syncWithStore(store) {
      if (!store) return { success: false, reason: 'Invalid store' };
      this._activeStore = store;

      if (!root.AdventureSupabase || !root.AdventureSupabase.isConfigured) {
        return { success: false, reason: 'Supabase is not configured. Please connect in Settings.' };
      }

      return root.AdventureSupabase.syncAllWithStore(store);
    }

    async syncWithCloud(store) {
      const targetStore = store || this._activeStore || (typeof window !== 'undefined' ? (window.store || window.schoolStore) : null);
      return this.syncWithStore(targetStore);
    }

    // =========================================================================
    // 7. CONTINUOUS AUTO-SYNC & CROSS-DEVICE REALTIME LISTENERS
    // =========================================================================
    setupAutoSync(store) {
      if (!store || this._autoSyncSetup) return;
      this._autoSyncSetup = true;
      this._activeStore = store;

      // Enable Supabase Realtime subscriptions
      if (root.AdventureSupabase) {
        root.AdventureSupabase.setupRealtimeSubscriptions(store);
      }

      // Initial immediate fetch & merge on app load
      this.syncWithStore(store).catch(err => {
        console.warn('[SchoolCloudSync] Initial sync note:', err.message);
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

      // Continuous 15-second background polling fallback
      if (typeof setInterval !== 'undefined') {
        setInterval(() => {
          if (typeof document !== 'undefined' && document.visibilityState === 'visible' && !this.isSyncing) {
            this.syncWithStore(store).catch(() => {});
          }
        }, 15000);
      }
    }
  }

  root.SchoolCloudSync = new SchoolCloudSyncService();

})(typeof window !== 'undefined' ? window : global);

