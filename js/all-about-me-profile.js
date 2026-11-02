/* All About Me (AAM) Student Profile View Component
   Renders the comprehensive survey data (Q1–Q13), smartboard team affiliation,
   favourites, learning profile, and confidential teacher notes in 60-30-10 cyber-glassmorphism.
   Follows zero-compromise platform standards & teacher-eyes-only confidentiality. */
(function(root) {
  'use strict';

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function injectAAMStyles() {
    if (document.getElementById('aam-profile-css')) return;
    var s = document.createElement('style');
    s.id = 'aam-profile-css';
    s.textContent = `
      .aam-wrap {
        display: flex;
        flex-direction: column;
        gap: 18px;
        padding: 4px;
        color: #e2e8f0;
        font-family: Inter, system-ui, -apple-system, sans-serif;
      }
      .aam-hero-card {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85));
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        padding: 20px;
        backdrop-filter: blur(14px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .aam-hero-left {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
        min-width: 260px;
      }
      .aam-team-badge {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        flex-shrink: 0;
      }
      .aam-hero-title h3 {
        margin: 0 0 4px 0;
        font-size: 1.35rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: #fff;
      }
      .aam-hero-sub {
        font-size: 0.85rem;
        color: #94a3b8;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .aam-meta-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #cbd5e1;
      }
      .aam-teammates-box {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .aam-teammates-label {
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
      }
      .aam-teammates-list {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .aam-mate-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 600;
        color: #e2e8f0;
        cursor: pointer;
        transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.18s ease;
      }
      .aam-mate-chip:hover {
        transform: translateY(-2px);
        background: rgba(56, 189, 248, 0.18);
        border-color: rgba(56, 189, 248, 0.4);
        color: #fff;
      }
      .aam-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 16px;
      }
      .aam-card {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 16px 18px;
        backdrop-filter: blur(14px);
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
      }
      .aam-card-h {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95rem;
        font-weight: 800;
        margin: 0 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        letter-spacing: -0.01em;
      }
      .aam-card-h span.emoji {
        font-size: 1.15rem;
      }
      .aam-row {
        margin-bottom: 10px;
        font-size: 0.85rem;
        line-height: 1.45;
      }
      .aam-row:last-child {
        margin-bottom: 0;
      }
      .aam-label {
        font-weight: 700;
        color: #94a3b8;
        display: block;
        margin-bottom: 2px;
        font-size: 0.76rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .aam-val {
        color: #f1f5f9;
        font-weight: 500;
      }
      .aam-val em {
        color: #38bdf8;
        font-style: normal;
        font-weight: 600;
      }
      .aam-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 4px;
      }
      .aam-chip {
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 0.76rem;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #cbd5e1;
      }
      .aam-chip.accent {
        background: rgba(56, 189, 248, 0.12);
        border-color: rgba(56, 189, 248, 0.25);
        color: #38bdf8;
      }
      .aam-chip.emerald {
        background: rgba(16, 185, 129, 0.12);
        border-color: rgba(16, 185, 129, 0.25);
        color: #34d399;
      }
      .aam-chip.amber {
        background: rgba(245, 158, 11, 0.12);
        border-color: rgba(245, 158, 11, 0.25);
        color: #fbbf24;
      }
      .aam-chip.rose {
        background: rgba(244, 63, 94, 0.12);
        border-color: rgba(244, 63, 94, 0.25);
        color: #fb7185;
      }
      .aam-private-vault {
        grid-column: 1 / -1;
        background: linear-gradient(135deg, rgba(30, 24, 15, 0.85), rgba(45, 26, 12, 0.85));
        border: 1px solid rgba(245, 158, 11, 0.35);
        border-radius: 18px;
        padding: 20px;
        box-shadow: 0 8px 30px rgba(245, 158, 11, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        position: relative;
        overflow: hidden;
      }
      .aam-private-vault::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b);
      }
      .aam-vault-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        background: rgba(245, 158, 11, 0.2);
        border: 1px solid rgba(245, 158, 11, 0.4);
        border-radius: 999px;
        color: #fbbf24;
        font-size: 0.76rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        margin-bottom: 12px;
      }
      .aam-private-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }
      .aam-quote-box {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-left: 3px solid #f59e0b;
        border-radius: 10px;
        padding: 12px 14px;
        font-size: 0.85rem;
        line-height: 1.5;
        color: #fef3c7;
      }
    `;
    document.head.appendChild(s);
  }

  function getTeamEmoji(teamName) {
    if (!teamName) return '⭐';
    var lower = teamName.toLowerCase();
    if (lower.includes('eagle')) return '🦅';
    if (lower.includes('forest')) return '🌲';
    if (lower.includes('ocean')) return '🌊';
    if (lower.includes('phoenix')) return '🔥';
    if (lower.includes('navigator')) return '🧭';
    if (lower.includes('panther')) return '🐆';
    if (lower.includes('wolf') || lower.includes('wolves')) return '🐺';
    if (lower.includes('dragon')) return '🐉';
    if (lower.includes('voyager')) return '🚀';
    if (lower.includes('titan')) return '💎';
    if (lower.includes('knight')) return '⚔️';
    if (lower.includes('starlight')) return '✨';
    if (lower.includes('wizard')) return '🧙';
    if (lower.includes('guardian')) return '🛡️';
    return '🌟';
  }

  function renderHero(student, data, store) {
    var teamName = data.teamName || 'Unassigned';
    var teamColor = data.teamColor || '#64748b';
    var emoji = getTeamEmoji(teamName);
    var teammatesHtml = '';

    if (data.teammates && data.teammates.length > 0) {
      teammatesHtml = data.teammates.map(function(mateId) {
        var mate = store ? store.getStudent(mateId) : null;
        var mateName = mate ? (mate.firstName + ' ' + mate.lastName.charAt(0) + '.') : mateId;
        return '<button type="button" class="aam-mate-chip" onclick="openStudentDetail(\'' + esc(mateId) + '\', \'allaboutme\')" title="Open ' + esc(mate ? mate.firstName : '') + '\'s profile">' +
          '<span style="font-size:0.9rem;">👤</span> ' + esc(mateName) +
        '</button>';
      }).join('');
    } else {
      teammatesHtml = '<span style="font-size:0.8rem; color:#64748b;">Solo / Pending team arrangement</span>';
    }

    var scanPill = data.hasScan ?
      '<span class="aam-meta-pill" style="color:#34d399; border-color:rgba(16,185,129,0.3)"><span style="font-size:0.8rem">✓</span> ' + esc(data.meta) + '</span>' :
      '<span class="aam-meta-pill" style="color:#fbbf24; border-color:rgba(245,158,11,0.3)">⚠️ Absent / Makeup needed</span>';

    return '' +
      '<div class="aam-hero-card">' +
        '<div class="aam-hero-left">' +
          '<div class="aam-team-badge" style="background: ' + teamColor + '22; border: 2px solid ' + teamColor + '88; color: ' + teamColor + ';">' +
            emoji +
          '</div>' +
          '<div class="aam-hero-title">' +
            '<h3>Smartboard Team: <span style="color:' + teamColor + '">' + esc(teamName) + '</span></h3>' +
            '<div class="aam-hero-sub">' +
              scanPill +
              '<span class="aam-meta-pill">Class ' + esc(student.grade || '') + ' (' + esc(data.classId.replace('class-', '').toUpperCase()) + ')</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="aam-teammates-box">' +
          '<span class="aam-teammates-label">Classroom Squad Teammates</span>' +
          '<div class="aam-teammates-list">' + teammatesHtml + '</div>' +
        '</div>' +
      '</div>';
  }

  function renderCard(emoji, title, contentHtml) {
    return '' +
      '<div class="aam-card">' +
        '<div class="aam-card-h"><span class="emoji">' + emoji + '</span> ' + esc(title) + '</div>' +
        contentHtml +
      '</div>';
  }

  root.AllAboutMeProfile = {
    html: function(student) {
      if (!student) return '<p style="padding:20px; color:#94a3b8;">No student selected.</p>';
      injectAAMStyles();

      var studentId = typeof student === 'string' ? student : student.id;
      var store = root.schoolStore;
      var stObj = typeof student === 'object' ? student : (store ? store.getStudent(studentId) : null);
      if (!stObj) stObj = { id: studentId, firstName: 'Student', lastName: '', grade: '' };

      var data = root.AllAboutMeData ? root.AllAboutMeData.get(studentId) : null;
      if (!data) {
        return '<div class="aam-wrap"><p style="padding:20px; color:#94a3b8;">All About Me survey data not found for student ' + esc(studentId) + '.</p></div>';
      }

      var hero = renderHero(stObj, data, store);

      // Card 1: Favourites & Pop Culture (Q3)
      var favHtml = '' +
        '<div class="aam-row"><span class="aam-label">Favorites Summary (Q3)</span><div class="aam-val">' + esc(data.q3 || 'None listed') + '</div></div>';
      var cardFav = renderCard('🌟', 'Favourites & Pop Culture', favHtml);

      // Card 2: Likes & Dislikes (Q2) & Subject Feelings (Q1)
      var likesHtml = '' +
        '<div class="aam-row"><span class="aam-label">Loves & Dislikes (Q2)</span><div class="aam-val">' + esc(data.q2 || 'None listed') + '</div></div>' +
        '<div class="aam-row" style="margin-top:10px;"><span class="aam-label">School Subjects & Daily Life Feelings (Q1)</span><div class="aam-val">' + esc(data.q1 || 'None listed') + '</div></div>';
      var cardLikes = renderCard('⚖️', 'Likes, Dislikes & Feelings', likesHtml);

      // Card 3: Learning Profile & Hard Skills (Q7, Q8, Q9)
      var learnHtml = '' +
        '<div class="aam-row"><span class="aam-label">How English Feels & Teacher Comprehension (Q7)</span><div class="aam-val">' + esc(data.q7 || 'None listed') + '</div></div>' +
        '<div class="aam-row" style="margin-top:8px;"><span class="aam-label">Challenging Areas (Q8)</span><div class="aam-val">' + esc(data.q8 || 'None listed') + '</div></div>' +
        '<div class="aam-row" style="margin-top:8px;"><span class="aam-label">Wish for English Class / Game Ideas (Q9)</span><div class="aam-val" style="color:#38bdf8;">' + esc(data.q9 || 'None listed') + '</div></div>';
      var cardLearn = renderCard('🧠', 'Learning Profile & Scaffolding', learnHtml);

      // Card 4: Daily Life, Hobbies & Digital Life (Q4, Q6, Q10)
      var lifeHtml = '' +
        '<div class="aam-row"><span class="aam-label">Hobbies & After-School Passions (Q4)</span><div class="aam-val">' + esc(data.q4 || 'None listed') + '</div></div>' +
        '<div class="aam-row" style="margin-top:8px;"><span class="aam-label">Activities at Home (Q6)</span><div class="aam-val">' + esc(data.q6 || 'None listed') + '</div></div>' +
        '<div class="aam-row" style="margin-top:8px;"><span class="aam-label">Free Time & Phone Rules (Q10)</span><div class="aam-val">' + esc(data.q10 || 'None listed') + '</div></div>';
      var cardLife = renderCard('🏠', 'Hobbies & Daily Routine', lifeHtml);

      // Card 5: Strengths & Future Ambitions (Q12)
      var dreamsHtml = '' +
        '<div class="aam-row"><span class="aam-label">Strengths, Learning Goals & Future Career (Q12)</span><div class="aam-val" style="font-size:0.9rem; line-height:1.5;">' + esc(data.q12 || 'None listed') + '</div></div>';
      var cardDreams = renderCard('🚀', 'Strengths & Future Dreams', dreamsHtml);

      // Card 6: Confidential Teacher Vault (Q11 & Q13)
      var vaultHtml = '' +
        '<div class="aam-private-vault">' +
          '<div class="aam-vault-badge">🔒 Teacher Eyes Only · Strictly Confidential</div>' +
          '<div style="font-size:0.78rem; color:#fde68a; margin-bottom:14px; line-height:1.4;">' +
            'This confidential section contains the child\'s private partner selections and personal notes to Mr. Maysam. ' +
            'Per institutional privacy protocols, these entries are never printed in parent reports or exposed on public smartboard views.' +
          '</div>' +
          '<div class="aam-private-grid">' +
            '<div>' +
              '<span class="aam-label" style="color:#fbbf24;">Partner Preferences & Social Feelings (Q11)</span>' +
              '<div class="aam-quote-box" style="margin-top:6px;">' +
                esc(data.q11_private || 'No partner notes recorded.') +
              '</div>' +
            '</div>' +
            '<div>' +
              '<span class="aam-label" style="color:#fbbf24;">Personal Note to Mr. Maysam (Q13)</span>' +
              '<div class="aam-quote-box" style="margin-top:6px; border-left-color:#ef4444;">' +
                (data.q13_private ? ('“' + esc(data.q13_private) + '”') : 'No personal note written.') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      return '' +
        '<div class="aam-wrap">' +
          hero +
          '<div class="aam-grid">' +
            cardFav +
            cardLikes +
            cardLearn +
            cardLife +
            cardDreams +
            vaultHtml +
          '</div>' +
        '</div>';
    }
  };
})(typeof window !== 'undefined' ? window : this);
