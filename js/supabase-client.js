/**
 * ENGLISH ADVENTURE ACADEMY — SUPABASE POSTGRESQL DATABASE CLIENT (v2.0)
 * 
 * Direct PostgreSQL client connecting via @supabase/supabase-js.
 * Serves as the single authoritative shared online cloud database for:
 *   - students table (complete student roster & profiles)
 *   - teacher_notes table (notes, feedback & diagnostic evidence)
 *   - assessment_results table (4-skill scores, mastery & comments)
 *   - xp_transactions table (audit ledger & rewards)
 *   - attendance_records table (daily roll calls)
 *   - classes table (cohort metadata)
 */

(function(root) {
  'use strict';

  // Production Supabase Configuration
  // Can be configured here directly, via window.SUPABASE_CONFIG, via URL params, or via UI settings dialog
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
      this._realtimeChannel = null;
      this._activeStore = null;

      // Automatically capture credentials from URL query parameters if provided (e.g. ?supabase_url=...&supabase_key=...)
      this._detectUrlCredentials();
      this.initClient();
    }

    _detectUrlCredentials() {
      try {
        if (typeof window !== 'undefined' && window.location && window.location.search) {
          const params = new URLSearchParams(window.location.search);
          const urlParam = params.get('supabase_url') || params.get('sb_url');
          const keyParam = params.get('supabase_key') || params.get('sb_key') || params.get('supabase_anon_key');

          if (urlParam && keyParam && urlParam.trim() && keyParam.trim()) {
            const cleanUrl = urlParam.trim();
            const cleanKey = keyParam.trim();
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(URL_STORAGE_KEY, cleanUrl);
              localStorage.setItem(KEY_STORAGE_KEY, cleanKey);
            }
            console.log('[AdventureSupabase] Loaded credentials from URL parameter.');
            // Clean URL query without page reload
            if (window.history && window.history.replaceState) {
              const cleanPath = window.location.pathname + (window.location.hash || '');
              window.history.replaceState({}, document.title, cleanPath);
            }
          }
        }
      } catch (e) {
        console.warn('[AdventureSupabase] URL credentials parse error:', e);
      }
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
          else localStorage.removeItem(URL_STORAGE_KEY);
          if (cleanKey) localStorage.setItem(KEY_STORAGE_KEY, cleanKey);
          else localStorage.removeItem(KEY_STORAGE_KEY);
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
          if (this._activeStore) {
            this.setupRealtimeSubscriptions(this._activeStore);
          }
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
        throw new Error('Supabase is not configured. Please connect your Supabase database in Settings or provide URL & Public Anon Key.');
      }
      return this.client;
    }

    /**
     * Connection health check utility
     */
    async testConnection(customUrl, customKey) {
      const createClientFn = (typeof root.supabase !== 'undefined' && root.supabase.createClient) 
        || (typeof root.createClient === 'function' ? root.createClient : null);

      if (!createClientFn) {
        return { success: false, error: 'Supabase JS SDK library not loaded' };
      }

      const url = customUrl || this.getStoredCredentials().url;
      const key = customKey || this.getStoredCredentials().anonKey;
      if (!url || !key) {
        return { success: false, error: 'Missing Supabase URL or Anon Key' };
      }

      try {
        const testClient = createClientFn(url, key, { auth: { persistSession: false } });
        const start = Date.now();
        const { data, count, error, status } = await testClient.from('students').select('id', { count: 'exact' }).limit(1);
        const latencyMs = Date.now() - start;

        if (error || (status && status >= 400)) {
          const errCode = error && error.code ? `[${error.code}] ` : '';
          const errMsg = error && error.message ? error.message : `HTTP status ${status}`;
          const errDetails = error && error.details ? ` (${error.details})` : '';
          const errHint = error && error.hint ? ` Hint: ${error.hint}` : '';
          let guidance = '';
          if (error && (error.code === 'PGRST205' || errMsg.includes('schema cache'))) {
            guidance = ' · Table "public.students" does not exist in Supabase. Run sql/supabase_schema.sql in Supabase SQL Editor.';
          } else if (error && (error.code === '42501' || errMsg.includes('permission denied'))) {
            guidance = ' · Permission denied under Row Level Security. Run RLS policies in sql/supabase_schema.sql.';
          }
          return { 
            success: false, 
            error: `${errCode}${errMsg}${errDetails}${errHint}${guidance}`,
            code: error ? error.code : null,
            status 
          };
        }
        return { success: true, latencyMs, count: typeof count === 'number' ? count : (data ? data.length : 0) };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // =========================================================================
    // 1. STUDENTS CRUD (Full student roster & attributes in PostgreSQL)
    // =========================================================================
    async saveStudent(student) {
      if (!student || !student.id) return { success: false, error: 'Invalid student' };
      const client = this._ensureClient();
      this.isSyncing = true;
      this.lastSyncStatus = 'syncing';
      this.notify();

      const row = {
        id: String(student.id),
        student_id_number: student.studentIdNumber ? String(student.studentIdNumber) : null,
        first_name: String(student.firstName || 'Student'),
        last_name: String(student.lastName || ''),
        class_id: String(student.classId || 'class-3a'),
        age: parseInt(student.age, 10) || 8,
        grade: String(student.grade || 'Grade 3'),
        overall_cefr: String(student.overallCefr || 'A1'),
        avatar: student.avatar || { hair: 'girl', outfit: 'explorer', accessory: 'none' },
        parent_name: String(student.parentName || ''),
        parent_contact: String(student.parentContact || ''),
        parent_email: String(student.parentEmail || ''),
        xp: (this._activeStore && typeof this._activeStore.getStudentTotalXP === 'function')
          ? this._activeStore.getStudentTotalXP(student.id)
          : (parseInt(student.xp || student.totalXP, 10) || 0),
        level: parseInt(student.level, 10) || 1,
        streak_days: parseInt(student.streakDays, 10) || 0,
        equipped_monster: String(student.equippedMonster || 'Mystery Egg'),
        archived: Boolean(student.archived),
        latest_teacher_note: String(student.latestTeacherNote || ''),
        manual_cefr_overrides: student.manualCefrOverrides || {},
        monster_profile: student.monsterProfile || {},
        extra_data: {
          lastActive: student.lastActive || null,
          parentNotes: student.parentNotes || ''
        },
        updated_at: new Date().toISOString()
      };

      try {
        const { data, error } = await client
          .from('students')
          .upsert(row, { onConflict: 'id' })
          .select();

        this.isSyncing = false;
        if (error) {
          // If error is caused by missing column in an older table schema, try fallback row
          if (error.message && (error.message.includes('column') || error.message.includes('schema'))) {
            const fallbackRow = {
              id: row.id,
              student_id_number: row.student_id_number,
              first_name: row.first_name,
              last_name: row.last_name,
              class_id: row.class_id,
              xp: row.xp,
              level: row.level,
              streak_days: row.streak_days,
              latest_teacher_note: row.latest_teacher_note,
              manual_cefr_overrides: row.manual_cefr_overrides,
              monster_profile: row.monster_profile,
              updated_at: row.updated_at
            };
            const fallbackRes = await client.from('students').upsert(fallbackRow, { onConflict: 'id' }).select();
            if (fallbackRes.error) throw fallbackRes.error;
          } else {
            throw error;
          }
        }

        this.lastSyncStatus = 'success';
        this.lastSyncTime = new Date().toISOString();
        this.notify();
        return { success: true, student: data && data[0] ? data[0] : row };
      } catch (err) {
        this.isSyncing = false;
        this.lastSyncStatus = 'error';
        const errDetails = err.details ? ` (${err.details})` : '';
        const errHint = err.hint ? ` Hint: ${err.hint}` : '';
        const fullErrMsg = (err.code ? `[${err.code}] ` : '') + (err.message || 'Unknown Supabase error') + errDetails + errHint;
        this.lastError = fullErrMsg;
        this.notify();
        console.error('[AdventureSupabase] saveStudent error:', fullErrMsg, err);
        throw new Error('Supabase saveStudent error: ' + fullErrMsg);
      }
    }

    async getStudents() {
      const client = this._ensureClient();
      const { data, error } = await client.from('students').select('*').order('first_name', { ascending: true });
      if (error) {
        const fullErrMsg = (error.code ? `[${error.code}] ` : '') + (error.message || 'Error fetching students');
        throw new Error('Supabase getStudents error: ' + fullErrMsg);
      }

      // Transform rows to match store format
      return (data || []).map(row => ({
        id: row.id,
        studentIdNumber: row.student_id_number,
        firstName: row.first_name,
        lastName: row.last_name,
        classId: row.class_id,
        age: row.age !== undefined ? row.age : 8,
        grade: row.grade || 'Grade 3',
        overallCefr: row.overall_cefr || 'A1',
        avatar: row.avatar || { hair: 'girl', outfit: 'explorer', accessory: 'none' },
        parentName: row.parent_name || '',
        parentContact: row.parent_contact || '',
        parentEmail: row.parent_email || '',
        xp: row.xp !== undefined ? row.xp : 0,
        level: row.level !== undefined ? row.level : 1,
        streakDays: row.streak_days !== undefined ? row.streak_days : 0,
        equippedMonster: row.equipped_monster || 'Mystery Egg',
        archived: Boolean(row.archived),
        latestTeacherNote: row.latest_teacher_note || '',
        manualCefrOverrides: row.manual_cefr_overrides || {},
        monsterProfile: row.monster_profile || {},
        extraData: row.extra_data || {},
        updatedAt: row.updated_at
      }));
    }

    async deleteStudent(studentId) {
      if (!studentId) return { success: false };
      const client = this._ensureClient();
      this.isSyncing = true;
      this.lastSyncStatus = 'syncing';
      this.notify();

      try {
        const { error } = await client.from('students').delete().eq('id', String(studentId));
        this.isSyncing = false;
        if (error) throw error;
        this.lastSyncStatus = 'success';
        this.lastSyncTime = new Date().toISOString();
        this.notify();
        return { success: true };
      } catch (err) {
        this.isSyncing = false;
        this.lastSyncStatus = 'error';
        const errDetails = err.details ? ` (${err.details})` : '';
        const errHint = err.hint ? ` Hint: ${err.hint}` : '';
        const fullErrMsg = (err.code ? `[${err.code}] ` : '') + (err.message || 'Unknown Supabase error') + errDetails + errHint;
        this.lastError = fullErrMsg;
        this.notify();
        console.error('[AdventureSupabase] deleteStudent error:', fullErrMsg, err);
        throw new Error('Supabase deleteStudent error: ' + fullErrMsg);
      }
    }

    // =========================================================================
    // 2. TEACHER NOTES TABLE (PostgreSQL)
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
    // 3. ASSESSMENT RESULTS TABLE (PostgreSQL)
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
    // 4. XP AUDIT LEDGER (PostgreSQL)
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

    async deleteXPTransaction(txId) {
      if (!txId) return { success: false };
      const client = this._ensureClient();
      const { error } = await client.from('xp_transactions').delete().eq('id', String(txId));
      if (error) throw new Error('Supabase deleteXPTransaction error: ' + error.message);
      return { success: true };
    }

    async saveXPTransactions(transactionsArray) {
      if (!Array.isArray(transactionsArray) || transactionsArray.length === 0) return { success: true, count: 0 };
      const client = this._ensureClient();
      const rows = transactionsArray.map(tx => ({
        id: String(tx.id),
        student_id: String(tx.studentId),
        amount: parseInt(tx.amount || tx.points || tx.xp, 10) || 0,
        reason: tx.reason || 'Classroom award',
        category: tx.category || 'positive',
        icon: tx.icon || '⭐',
        date: tx.date || 'September 2026',
        timestamp: tx.timestamp || new Date().toISOString(),
        source: tx.source || 'manual',
        source_id: tx.sourceId || null,
        class_id: tx.classId || null,
        status: tx.status || 'active'
      }));
      const { error } = await client.from('xp_transactions').upsert(rows, { onConflict: 'id' });
      if (error) throw new Error('Supabase xp_transactions error: ' + error.message);
      return { success: true, count: rows.length };
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
    // 5B. CLASSES COHORT TABLE (PostgreSQL)
    // =========================================================================
    async saveClass(cls) {
      if (!cls || !cls.id) return { success: false, error: 'Invalid class' };
      const client = this._ensureClient();
      const row = {
        id: String(cls.id),
        name: String(cls.name || 'Class'),
        grade: String(cls.grade || 'Grade 3'),
        teacher: String(cls.teacher || 'Mr. Maysam'),
        primary_book_id: String(cls.primaryBookId || ''),
        academic_year: String(cls.academicYear || '2026–2027'),
        cefr_target: String(cls.cefrTarget || 'A1'),
        room: String(cls.room || ''),
        schedule: String(cls.schedule || ''),
        description: String(cls.description || ''),
        archived: Boolean(cls.archived),
        updated_at: new Date().toISOString()
      };
      const { data, error } = await client.from('classes').upsert(row, { onConflict: 'id' }).select();
      if (error) {
        const fullErrMsg = (error.code ? `[${error.code}] ` : '') + (error.message || 'Error saving class');
        throw new Error('Supabase saveClass error: ' + fullErrMsg);
      }
      return { success: true, class: data && data[0] ? data[0] : row };
    }

    async getClasses() {
      const client = this._ensureClient();
      const { data, error } = await client.from('classes').select('*').order('name', { ascending: true });
      if (error) throw new Error('Supabase getClasses error: ' + error.message);
      return (data || []).map(row => ({
        id: row.id,
        name: row.name,
        grade: row.grade,
        teacher: row.teacher,
        primaryBookId: row.primary_book_id,
        academicYear: row.academic_year,
        cefrTarget: row.cefr_target,
        room: row.room,
        schedule: row.schedule,
        description: row.description,
        archived: Boolean(row.archived)
      }));
    }

    async deleteClass(classId) {
      if (!classId) return { success: false };
      const client = this._ensureClient();
      const { error } = await client.from('classes').delete().eq('id', String(classId));
      if (error) throw new Error('Supabase deleteClass error: ' + error.message);
      return { success: true };
    }

    // =========================================================================
    // 6. REALTIME MULTI-DEVICE SUBSCRIPTIONS
    // =========================================================================
    setupRealtimeSubscriptions(store) {
      if (!store) return;
      this._activeStore = store;
      if (!this.client || !this.isConfigured) return;

      // Clean up previous subscription if any
      if (this._realtimeChannel) {
        try { this.client.removeChannel(this._realtimeChannel); } catch (e) {}
        this._realtimeChannel = null;
      }

      try {
        const channel = this.client.channel('adventure-realtime-all');

        // Listen to all public schema table changes
        const tables = ['classes', 'students', 'teacher_notes', 'assessment_results', 'xp_transactions', 'attendance_records'];
        tables.forEach(tableName => {
          channel.on('postgres_changes', { event: '*', schema: 'public', table: tableName }, payload => {
            console.log(`[AdventureSupabase:Realtime] ${tableName} event:`, payload.eventType);
            // Trigger store sync when remote changes arrive
            this.syncAllWithStore(store).catch(err => {
              console.warn('[AdventureSupabase] Realtime sync-back error:', err);
            });
          });
        });

        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('[AdventureSupabase] Realtime subscriptions active for all tables.');
          }
        });

        this._realtimeChannel = channel;
      } catch (e) {
        console.warn('[AdventureSupabase] Realtime subscription error:', e);
      }
    }

    // =========================================================================
    // 7. TWO-WAY STORE SYNCHRONIZATION (Authoritative Supabase -> Store)
    // =========================================================================
    async syncAllWithStore(store) {
      if (!this.isConfigured) return { success: false, reason: 'not_configured' };
      if (!store) return { success: false, reason: 'no_store' };

      this._activeStore = store;
      this.isSyncing = true;
      this.lastSyncStatus = 'syncing';
      this.notify();

      try {
        const [classes, students, notes, assessments, xpTxs, attendance] = await Promise.all([
          this.getClasses().catch(() => []),
          this.getStudents(),
          this.getTeacherNotes(),
          this.getAssessments(),
          this.getXPTransactions(),
          this._ensureClient().from('attendance_records').select('*').then(r => r.data || [])
        ]);

        // SAFE IDEMPOTENT SEEDING / MIGRATION:
        // If Supabase has zero students, but local store has students, upload local roster to Supabase!
        if (students.length === 0 && store.state && Array.isArray(store.state.students) && store.state.students.length > 0) {
          console.log('[AdventureSupabase] Supabase is empty. Performing initial migration of local students to cloud...');
          return this.migrateLocalRosterToCloud(store);
        }

        // Transform Supabase notes to Store format
        const transformedNotes = (notes || []).map(n => ({
          id: n.id,
          studentId: n.student_id,
          text: n.text,
          author: n.author,
          date: n.date,
          updatedAt: n.updated_at
        }));

        // Transform Supabase assessment results to Store format
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

        // Transform Supabase XP ledger to Store format
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

        // Transform Supabase attendance records to Store format
        const transformedAtt = (attendance || []).map(att => ({
          id: att.id,
          studentId: att.student_id,
          classId: att.class_id,
          date: att.date,
          status: att.status
        }));

        // Ingest into store with authoritative student & class lists
        if (typeof store.mergeCloudState === 'function') {
          store.mergeCloudState({
            classes: classes,
            students: students,
            isAuthoritativeList: true,
            teacherNotes: transformedNotes,
            progressCheckSubmissions: transformedSubs,
            xpTransactions: transformedXP,
            attendanceRecords: transformedAtt
          });
        }

        this.isSyncing = false;
        this.lastSyncStatus = 'success';
        this.lastSyncTime = new Date().toISOString();
        this.notify();

        return {
          success: true,
          classCount: classes.length,
          studentCount: students.length,
          notesCount: transformedNotes.length,
          assessmentsCount: transformedSubs.length,
          xpCount: transformedXP.length,
          attendanceCount: transformedAtt.length
        };
      } catch (err) {
        this.isSyncing = false;
        this.lastSyncStatus = 'error';
        const errDetails = err.details ? ` (${err.details})` : '';
        const fullErrMsg = (err.code ? `[${err.code}] ` : '') + (err.message || 'Unknown Supabase error') + errDetails;
        this.lastError = fullErrMsg;
        this.notify();
        console.error('[AdventureSupabase] syncAllWithStore error:', fullErrMsg, err);
        return { success: false, error: fullErrMsg };
      }
    }

    async uploadLocalStudentsToCloud(store) {
      return this.migrateLocalRosterToCloud(store);
    }

    async migrateLocalRosterToCloud(store) {
      const targetStore = store || this._activeStore || (typeof window !== 'undefined' ? (window.store || window.schoolStore) : null);
      if (!targetStore || !targetStore.state) throw new Error('School store is not available.');

      this.isSyncing = true;
      this.lastSyncStatus = 'syncing';
      this.notify();

      const results = {
        classesCount: 0,
        studentsCount: 0,
        notesCount: 0,
        assessmentsCount: 0,
        xpCount: 0,
        attendanceCount: 0,
        errors: []
      };

      try {
        // 1. Upload Classes first
        if (Array.isArray(targetStore.state.classes) && targetStore.state.classes.length > 0) {
          for (const c of targetStore.state.classes) {
            try {
              await this.saveClass(c);
              results.classesCount++;
            } catch (e) {
              console.warn('[AdventureSupabase] upload class error:', c.id, e);
              results.errors.push(`Class ${c.id}: ${e.message}`);
            }
          }
        }

        // 2. Upload Students (idempotent upsert - NEVER deletes or alters local state)
        if (Array.isArray(targetStore.state.students) && targetStore.state.students.length > 0) {
          for (const s of targetStore.state.students) {
            try {
              await this.saveStudent(s);
              results.studentsCount++;
            } catch (e) {
              console.warn('[AdventureSupabase] upload student error:', s.id, e);
              results.errors.push(`Student ${s.id}: ${e.message}`);
            }
          }
        }

        // 3. Upload Teacher Notes
        if (Array.isArray(targetStore.state.teacherNotes) && targetStore.state.teacherNotes.length > 0) {
          for (const n of targetStore.state.teacherNotes) {
            try {
              await this.saveTeacherNote(n);
              results.notesCount++;
            } catch (e) {
              results.errors.push(`Note ${n.id}: ${e.message}`);
            }
          }
        }

        // 4. Upload Assessments
        if (Array.isArray(targetStore.state.progressCheckSubmissions) && targetStore.state.progressCheckSubmissions.length > 0) {
          try {
            await this.saveAssessments(targetStore.state.progressCheckSubmissions);
            results.assessmentsCount += targetStore.state.progressCheckSubmissions.length;
          } catch (e) {
            results.errors.push(`Assessments: ${e.message}`);
          }
        }

        // 5. Upload XP Transactions
        if (Array.isArray(targetStore.state.xpTransactions) && targetStore.state.xpTransactions.length > 0) {
          try {
            await this.saveXPTransactions(targetStore.state.xpTransactions);
            results.xpCount += targetStore.state.xpTransactions.length;
          } catch (e) {
            results.errors.push(`XP: ${e.message}`);
          }
        }

        // 6. Upload Attendance
        if (Array.isArray(targetStore.state.attendanceRecords) && targetStore.state.attendanceRecords.length > 0) {
          try {
            await this.saveAttendance(targetStore.state.attendanceRecords);
            results.attendanceCount += targetStore.state.attendanceRecords.length;
          } catch (e) {
            results.errors.push(`Attendance: ${e.message}`);
          }
        }

        this.isSyncing = false;
        this.lastSyncStatus = 'success';
        this.lastSyncTime = new Date().toISOString();
        this.notify();

        return {
          success: results.errors.length === 0,
          ...results
        };
      } catch (err) {
        this.isSyncing = false;
        this.lastSyncStatus = 'error';
        this.lastError = err.message;
        this.notify();
        throw err;
      }
    }

    async syncWithCloud(store) {
      const targetStore = store || this._activeStore || (typeof window !== 'undefined' ? (window.store || window.schoolStore) : null);
      return this.syncAllWithStore(targetStore);
    }
  }

  root.AdventureSupabase = new AdventureSupabaseService();

})(typeof window !== 'undefined' ? window : global);

