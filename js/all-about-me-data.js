/**
 * ALL ABOUT ME: classroom teams (public, ids and team names only) + survey answers.
 * The survey answers are children's personal data: they come from the encrypted bundle in js/private-data.js
 * and are only available after teacher sign-in (see EAAPrivate). Before that get() returns null.
 */
(function(root) {
  'use strict';

  var TEAMS = [
    {
      "id": "group-3a-1",
      "classId": "class-3a",
      "name": "Golden Eagles",
      "color": "#eab308",
      "studentIds": [
        "student-3a-229",
        "student-3a-210",
        "student-3a-209",
        "student-3a-222"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-3a-2",
      "classId": "class-3a",
      "name": "Emerald Forest",
      "color": "#10b981",
      "studentIds": [
        "student-3a-224",
        "student-3a-219",
        "student-3a-214",
        "student-3a-207"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-3a-3",
      "classId": "class-3a",
      "name": "Ocean Explorers",
      "color": "#38bdf8",
      "studentIds": [
        "student-3a-223",
        "student-3a-354",
        "student-3a-351",
        "student-3a-203",
        "student-3a-204"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-3a-4",
      "classId": "class-3a",
      "name": "Cosmic Phoenix",
      "color": "#ec4899",
      "studentIds": [
        "student-3a-211",
        "student-3a-206",
        "student-3a-202",
        "student-3a-227"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-3b-1",
      "classId": "class-3b",
      "name": "Star Navigators",
      "color": "#8b5cf6",
      "studentIds": [
        "student-3b-217",
        "student-3b-352",
        "student-3b-221",
        "student-3b-218"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-3b-2",
      "classId": "class-3b",
      "name": "Crystal Panthers",
      "color": "#06b6d4",
      "studentIds": [
        "student-3b-216",
        "student-3b-215",
        "student-3b-201",
        "student-3b-228"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-3b-3",
      "classId": "class-3b",
      "name": "Thunder Wolves",
      "color": "#f59e0b",
      "studentIds": [
        "student-3b-220",
        "student-3b-213",
        "student-3b-212",
        "student-3b-230"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-3b-4",
      "classId": "class-3b",
      "name": "Solar Phoenix",
      "color": "#ef4444",
      "studentIds": [
        "student-3b-205",
        "student-3b-200",
        "student-3b-353",
        "student-3b-225"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-4a-1",
      "classId": "class-4a",
      "name": "Mystic Dragons",
      "color": "#8b5cf6",
      "studentIds": [
        "student-4a-344",
        "student-4a-343",
        "student-4a-312",
        "student-4a-317",
        "student-4a-109"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-4a-2",
      "classId": "class-4a",
      "name": "Solar Voyagers",
      "color": "#f59e0b",
      "studentIds": [
        "student-4a-311",
        "student-4a-310",
        "student-4a-313",
        "student-4a-320",
        "student-4a-441"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-4a-3",
      "classId": "class-4a",
      "name": "Diamond Titans",
      "color": "#06b6d4",
      "studentIds": [
        "student-4a-314",
        "student-4a-319",
        "student-4a-341",
        "student-4a-300",
        "student-4a-345"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-4a-4",
      "classId": "class-4a",
      "name": "Cyber Knights",
      "color": "#3b82f6",
      "studentIds": [
        "student-4a-315",
        "student-4a-302",
        "student-4a-342",
        "student-4a-321"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-4b-1",
      "classId": "class-4b",
      "name": "Golden Starlights",
      "color": "#eab308",
      "studentIds": [
        "student-4b-306",
        "student-4b-349",
        "student-4b-307",
        "student-4b-348",
        "student-4b-322"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-4b-2",
      "classId": "class-4b",
      "name": "Book Wizards",
      "color": "#10b981",
      "studentIds": [
        "student-4b-338",
        "student-4b-304",
        "student-4b-308",
        "student-4b-303",
        "student-4b-439"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-4b-3",
      "classId": "class-4b",
      "name": "Galactic Navigators",
      "color": "#06b6d4",
      "studentIds": [
        "student-4b-305",
        "student-4b-316",
        "student-4b-318",
        "student-4b-208",
        "student-4b-440"
      ],
      "createdDate": "2026-11-02"
    },
    {
      "id": "group-4b-4",
      "classId": "class-4b",
      "name": "Apex Guardians",
      "color": "#3b82f6",
      "studentIds": [
        "student-4b-301",
        "student-4b-309",
        "student-4b-339",
        "student-4b-346"
      ],
      "createdDate": "2026-11-02"
    }
  ];

  function survey() {
    return (root.EAAPrivate && root.EAAPrivate.get('survey')) || {};
  }

  root.ALL_ABOUT_ME_TEAMS = TEAMS;

  root.AllAboutMeData = {
    load: function() { return root.EAAPrivate ? root.EAAPrivate.load() : Promise.resolve(false); },
    isLoaded: function() { return !!(root.EAAPrivate && root.EAAPrivate.isLoaded()); },
    get: function(studentId) {
      return survey()[studentId] || null;
    },
    getTeam: function(studentId) {
      return TEAMS.find(function(t) { return (t.studentIds || []).indexOf(studentId) !== -1; }) || null;
    },
    getTeamsForClass: function(classId) {
      return TEAMS.filter(function(t) { return t.classId === classId; });
    },
    getAll: function() {
      return survey();
    }
  };
})(typeof window !== 'undefined' ? window : this);
