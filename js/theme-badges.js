/**
 * ENGLISH ADVENTURE ACADEMY: class themes and companion badges (neutral version, 2 Nov 2026)
 *
 * The Alice in Wonderland (Grade 4) and Korean festival (Grade 3) themes are gone: no themed banner, no
 * themed companions, no role picker. This file keeps the same function names the platform calls, so nothing
 * else breaks, and every one of them now does nothing themed. The old file is in
 * Documents\EAA-Backups\removed-themes-2026-11-02 and in git history.
 */
(function (root) {
  'use strict';

  function updateClassroomTheme() {
    if (typeof document === 'undefined') return;
    var old = ['theme-alice-wonderland', 'theme-korean-traditions'];
    old.forEach(function (c) { document.body.classList.remove(c); });
    var container = document.getElementById('classroom-view') || document.getElementById('app-view-container');
    if (container) old.forEach(function (c) { container.classList.remove(c); });
    var banner = document.getElementById('classroom-hero-banner');
    if (banner) { banner.style.backgroundImage = ''; banner.classList.remove('active-theme-cover'); banner.style.display = 'none'; }
  }
  function resolveStudentCompanion() { return null; }
  function getStudentBadge(student) {
    var icon = (student && (student.customIcon || student.custom_icon)) || '⭐';
    return { icon: icon, role: 'Explorer', name: 'Explorer' };
  }
  function renderStudentThemeBadge() { return ''; }
  function noop() { /* the role picker is gone */ }

  root.updateClassroomTheme = updateClassroomTheme;
  root.resolveStudentCompanion = resolveStudentCompanion;
  root.getStudentBadge = getStudentBadge;
  root.renderStudentThemeBadge = renderStudentThemeBadge;
  root.openCharacterIconPicker = noop;
  root.closeCharacterIconPicker = noop;
  root.saveStudentCharacterRole = noop;
  root.saveStudentCompanionRole = noop;
})(typeof window !== 'undefined' ? window : this);
