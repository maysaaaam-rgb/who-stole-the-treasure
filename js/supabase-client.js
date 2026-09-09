/**
 * ENGLISH ADVENTURE ACADEMY — SUPABASE POSTGRESQL DATABASE CLIENT
 * 
 * Direct PostgreSQL client connecting via @supabase/supabase-js.
 * Serves as the authoritative shared online cloud database for:
 *   - teacher_notes table
 *   - assessment_results table
 *   - xp_transactions table
 *   - students table
 *   - attendance_records table
 */

(function(root) {
  'use strict';

  // Production Supabase Configuration
  // Can be configured here directly, via window.SUPABASE_CONFIG, or via UI settings dialog
  const CONFIG = {
    url: (root.SUPABASE_CONFIG && root.SUPABASE_CONFIG.url) || '',
    anonKey: (root.SUPABASE_CONFIG && root.SUPABASE_CONFIG.anonKey) || ''
  };

  const URL_STORAGE_KEY = 'eaa_supabase_url_v1';
  const KEY_STORAGE_KEY = 'eaa_supabase_key_v1';

  class AdventureSupabaseService {
    constructor() {
      this.client = null;
      this.isConfigured = false;
      this.isSyncing = false;
      this.lastSyncTime = null;
      this.lastSyncStatus = 'idle'; // 'idle' | 'syncing' | 'success' | 'error'
      this.lastError = null;
      this.listeners = [];
      this.initClient();
    }

    getStoredCredentials() {
      try {
        if (typeof localStorage !== 'undefined') {
          const url = localStorage.getItem(URL_STORAGE_KEY) || CONFIG.url;
          const anonKey = localStorage.getItem(KEY_STORAGE_KEY) || CONFIG.anonKey;
          if (url && anonKey) return { url: url.trim(), anonKey: anonKey.trim() };
        }
      } catch (e) {}
      return { url: CONFIG.url, anonKey: CONFIG.anonKey };
    }

    setCredentials(url, anonKey) {
      const cleanUrl = (url || '').trim();
      const cleanKey = (anonKey || '').trim();
      try {
        if (typeof localStorage !== 'undefined') {
          if (cleanUrl) localStorage.setItem(URL_STORAGE_KEY, cleanUrl);
          if (cleanKey) localStorage.setItem(KEY_STORAGE_KEY, cleanKey);
        }
      } catch (e) {}
      this.initClient(cleanUrl, cleanKey);
      this.notify();
    }

    initClient(customUrl, customKey) {
      const creds = (customUrl && customKey) ? { url: customUrl, anonKey: customKey } : this.getStoredCredentials();
      if (!creds.url || !creds.anonKey) {
        this.isConfigured = false;
        this.client = null;
        return;
      }

      // Check if Supabase JS SDK is loaded (from CDN or bundle)
      const createClientFn = (typeof root.supabase !== 'undefined' && root.supabase.createClient) 
        || (typeof root.createClient === 'function' ? root.createClient : null);

      if (createClientFn) {
        try {
          this.client = createClientFn(creds.url, creds.anonKey, {
            auth: { persistSession: true, autoRefreshToken: true }
          });
          this.isConfigured = true;
          this.lastError = null;
          console.log('[AdventureSupabase] Initialized Supabase client for:', creds.url);
        } catch (e) {
          console.error('[AdventureSupabase] Failed to initialize Supabase client:', e);
          this.client = null;
          this.isConfigured = false;
          this.lastError = e.message;
        }
      } else {
        console.warn('[AdventureSupabase] @supabase/supabase-js library not yet loaded.');
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
      const creds = this.getStoredCredentials();
      return {
        isConfigured: this.isConfigured,
        url: creds.url,
        isSyncing: this.isSyncing,
        lastSyncTime: this.lastSyncTime,
        lastSyncStatus: this.lastSyncStatus,
        lastError: this.lastError
      };
    }

    _ensureClient() {
      if (!this.client) this.initClient();
      if (!this.client) {
        throw new Error('Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.');
      }
      return this.client;
    }

    // =========================================================================
    // 1. TEACHER NOTES TABLE (PostgreSQL)
    // =========================================================================
    async saveTeacherNote(note) {
      if (!note || !note.id) return { success: false, error: 'Invalid note payload' };
      const client = this._ensureClient();
      this.isSyncing = true;
      this.lastSyncStatus = 'syncing';
      this.notify();

      const row = {
        id: String(note.id),
        student_id: String(note.studentId),
        text: String(note.text || ''),
        author: note.author || 'Mr. Maysam',
        date: note.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await client
        .from('teacher_notes')
        .upsert(row, { onConflict: 'id' })
        .select();

      this.isSyncing = false;
      if (error) {
        this.lastSyncStatus = 'error';
        this.lastError = error.message;
        this.notify();
        throw new Error('Supabase teacher_notes error: ' + error.message);
      }

      this.lastSyncStatus = 'success';
      this.lastSyncTime = new Date().toISOString();
      this.notify();
      return { success: true, note: data && data[0] ? data[0] : row };
    }

    async getTeacherNotes(studentId = null) {
      const client = this._ensureClient();
      let query = client.from('teacher_notes').select('*').order('updated_at', { ascending: false });
      if (studentId) {
        query = query.eq('student_id', String(studentId));
      }
      const { data, error } = await query;
      if (error) throw new Error('Supabase getTeacherNotes error: ' + error.message);
      return data || [];
    }

    async deleteTeacherNote(noteId) {
      if (!noteId) return { success: false };
      const client = this._ensureClient();
      const { error } = await client.from('teacher_notes').delete().eq('id', String(noteId));
      if (error) throw new Error('Supabase deleteTeacherNote error: ' + error.message);
      return { success: true };
    }

    // =========================================================================
    // 2. ASSESSMENT RESULTS TABLE (PostgreSQL)
    // =========================================================================
    async saveAssessments(submissionsArray) {
      if (!Array.isArray(submissionsArray) || submissionsArray.length === 0) return { success: true, count: 0 };
      const client = this._ensureClient();
      this.isSyncing = true;
      this.lastSyncStatus = 'syncing';
      this.notify();

      const rows = submissionsArray.map(sub => {
        const id = sub.id || (sub.studentId + '_' + sub.progressCheckId);
        const scores = sub.scores || {};
        const rScore = (scores.reading && scores.reading.correct !== undefined) ? scores.reading.correct : 0;
        const lScore = (scores.listening && scores.listening.correct !== undefined) ? scores.listening.correct : 0;
        const wScore = (scores.writing && scores.writing.correct !== undefined) ? scores.writing.correct : 0;
        const sScore = (scores.speaking && scores.speaking.correct !== undefined) ? scores.speaking.correct : 0;
        const rawTotal = (sub.rawTotal !== undefined) ? sub.rawTotal : (rScore + lScore + wScore + sScore);

        return {
          id: id,
          student_id: String(sub.studentId),
          class_id: String(sub.classId || 'class-4a'),
          book_id: sub.bookId || 'book-global-readings-3',
          unit_id: sub.unitId || 'unit-gr3-1',
          assessment_id: sub.progressCheckId || 'progress-check-gr3-u1',
          reading_score: rScore,
          listening_score: lScore,
          writing_score: wScore,
          speaking_score: sScore,
          total_score: rawTotal,
          max_score: sub.maxRawTotal || 40,
          mastery: sub.mastery || (rawTotal >= 34 ? 'Strong' : rawTotal >= 28 ? 'Secure' : rawTotal >= 20 ? 'Developing' : 'Needs Support'),
          xp_earned: Math.round(rawTotal * 10),
          teacher_note: sub.notes || sub.teacherComment || '',
          date: sub.date || new Date().toISOString().split('T')[0],
          display_date: sub.displayDate || 'September 2026',
          updated_at: new Date().toISOString()
        };
      });

      const { data, error } = await client
        .from('assessment_results')
        .upsert(rows, { onConflict: 'id' })
        .select();

      this.isSyncing = false;
      if (error) {
        this.lastSyncStatus = 'error';
        this.lastError = error.message;
        this.notify();
        throw new Error('Supabase assessment_results error: ' + error.message);
      }

      this.lastSyncStatus = 'success';
      this.lastSyncTime = new Date().toISOString();
      this.notify();
      return { success: true, count: rows.length, data };
    }

    async getAssessments(assessmentId = null, studentId = null) {
      const client = this._ensureClient();
      let query = client.from('assessment_results').select('*').order('updated_at', { ascending: false });
      if (assessmentId) query = query.eq('assessment_id', assessmentId);
      if (studentId) query = query.eq('student_id', String(studentId));
      const { data, error } = await query;
      if (error) throw new Error('Supabase getAssessments error: ' + error.message);
      return data || [];
    }

    async deleteAssessment(studentId, checkId) {
      const client = this._ensureClient();
      const id = studentId + '_' + checkId;
      const { error } = await client.from('assessment_results').delete().eq('id', id);
      if (error) throw new Error('Supabase deleteAssessment error: ' + error.message);
      return { success: true };
    }

    // =========================================================================
    // 3. XP AUDIT LEDGER (PostgreSQL)
    // =========================================================================
    async saveXPTransaction(tx) {
      if (!tx || !tx.id || !tx.studentId) return { success: false };
      const client = this._ensureClient();
      const row = {
        id: String(tx.id),
        student_id: String(tx.studentId),
        amount: parseInt(tx.amount, 10) || 0,
        reason: tx.reason || 'Classroom award',
        category: tx.category || 'positive',
        icon: tx.icon || '⭐',
        date: tx.date || 'September 2026',
        timestamp: tx.timestamp || new Date().toISOString(),
        source: tx.source || 'manual',
        source_id: tx.sourceId || null,
        class_id: tx.classId || null,
        status: tx.status || 'active'
      };

      const { data, error } = await client
        .from('xp_transactions')
        .upsert(row, { onConflict: 'id' });

      if (error) throw new Error('Supabase xp_transactions error: ' + error.message);
      return { success: true, transaction: row };
    }

    async getXPTransactions(studentId = null) {
      const client = this._ensureClient();
      let query = client.from('xp_transactions').select('*').order('timestamp', { ascending: false });
      if (studentId) query = query.eq('student_id', String(studentId));
      const { data, error } = await query;
      if (error) throw new Error('Supabase getXPTransactions error: ' + error.message);
      return data || [];
    }

    // =========================================================================
    // 4. STUDENT PROFILES (PostgreSQL)
    // =========================================================================
    async saveStudent(student) {
      if (!student || !student.id) return { success: false };
      const client = this._ensureClient();
      const row = {
        id: String(student.id),
        student_id_number: student.studentIdNumber ? String(student.studentIdNumber) : null,
        first_name: student.firstName || '',
        last_name: student.lastName || '',
        class_id: student.classId || 'class-4a',
        xp: parseInt(student.xp, 10) || 0,
        level: parseInt(student.level, 10) || 1,
        streak_days: parseInt(student.streakDays, 10) || 0,
        latest_teacher_note: student.latestTeacherNote || '',
        manual_cefr_overrides: student.manualCefrOverrides || {},
        monster_profile: student.monsterProfile || {},
        updated_at: new Date().toISOString()
      };

      const { data, error } = await client.from('students').upsert(row, { onConflict: 'id' });
      if (error) throw new Error('Supabase students error: ' + error.message);
      return { success: true };
    }

    async getStudents() {
      const client = this._ensureClient();
      const { data, error } = await client.from('students').select('*');
      if (error) throw new Error('Supabase getStudents error: ' + error.message);
      return data || [];
    }

    // =========================================================================
    // 5. ATTENDANCE (PostgreSQL)
    // =========================================================================
    async saveAttendance(recordsArray) {
      if (!Array.isArray(recordsArray) || recordsArray.length === 0) return { success: true };
      const client = this._ensureClient();
      const rows = recordsArray.map(rec => ({
        id: rec.id || ('att-' + rec.studentId + '-' + rec.date),
        student_id: String(rec.studentId),
        class_id: String(rec.classId || ''),
        date: String(rec.date),
        status: String(rec.status || 'present'),
        created_at: new Date().toISOString()
      }));

      const { error } = await client.from('attendance_records').upsert(rows, { onConflict: 'id' });
      if (error) throw new Error('Supabase attendance error: ' + error.message);
      return { success: true, count: rows.length };
    }

    // =========================================================================
    // 6. TWO-WAY STORE SYNCHRONIZATION
    // =========================================================================
    async syncAllWithStore(store) {
      if (!this.isConfigured) return { success: false, reason: 'not_configured' };
      if (!store) return { success: false, reason: 'no_store' };

      try {
        const [notes, assessments, xpTxs, students, attendance] = await Promise.all([
          this.getTeacherNotes(),
          this.getAssessments(),
          this.getXPTransactions(),
          this.getStudents(),
          this._ensureClient().from('attendance_records').select('*').then(r => r.data || [])
        ]);

        // Transform Supabase rows to Store format
        const transformedNotes = (notes || []).map(n => ({
          id: n.id,
          studentId: n.student_id,
          text: n.text,
          author: n.author,
          date: n.date,
          updatedAt: n.updated_at
        }));

        const transformedSubs = (assessments || []).map(a => ({
          id: a.id,
          studentId: a.student_id,
          classId: a.class_id,
          bookId: a.book_id,
          unitId: a.unit_id,
          progressCheckId: a.assessment_id,
          rawTotal: a.total_score,
          maxRawTotal: a.max_score,
          mastery: a.mastery,
          xpEarned: a.xp_earned,
          notes: a.teacher_note,
          teacherComment: a.teacher_note,
          scores: {
            reading: { correct: a.reading_score, total: 10 },
            listening: { correct: a.listening_score, total: 10 },
            writing: { correct: a.writing_score, total: 10 },
            speaking: { correct: a.speaking_score, total: 10 }
          },
          date: a.date,
          displayDate: a.display_date,
          updatedAt: a.updated_at
        }));

        const studentOverrides = {};
        (students || []).forEach(s => {
          studentOverrides[s.id] = {
            xp: s.xp,
            level: s.level,
            streakDays: s.streak_days,
            latestTeacherNote: s.latest_teacher_note,
            manualCefrOverrides: s.manual_cefr_overrides,
            monsterProfile: s.monster_profile
          };
        });

        const transformedXP = (xpTxs || []).map(x => ({
          id: x.id,
          studentId: x.student_id,
          amount: x.amount,
          points: x.amount,
          xpAmount: x.amount,
          xp: x.amount,
          reason: x.reason,
          category: x.category,
          icon: x.icon,
          date: x.date,
          timestamp: x.timestamp,
          source: x.source,
          sourceId: x.source_id,
          classId: x.class_id,
          status: x.status
        }));

        const transformedAtt = (attendance || []).map(att => ({
          id: att.id,
          studentId: att.student_id,
          classId: att.class_id,
          date: att.date,
          status: att.status
        }));

        // Ingest into store
        if (typeof store.mergeCloudState === 'function') {
          store.mergeCloudState({
            teacherNotes: transformedNotes,
            progressCheckSubmissions: transformedSubs,
            studentOverrides: studentOverrides,
            xpTransactions: transformedXP,
            attendanceRecords: transformedAtt
          });
        }

        return {
          success: true,
          notesCount: transformedNotes.length,
          assessmentsCount: transformedSubs.length,
          xpCount: transformedXP.length
        };
      } catch (err) {
        console.error('[AdventureSupabase] syncAllWithStore error:', err);
        return { success: false, error: err.message };
      }
    }
  }

  root.AdventureSupabase = new AdventureSupabaseService();

})(typeof window !== 'undefined' ? window : global);
