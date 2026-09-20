'use strict';
// =============================================================
// MONSTER LAB — Customization Panel
// Generates the right-side category UI and fires onChange callbacks
// =============================================================

class CustomizationPanel {

  constructor(onChange) {
    this.onChange = onChange; // callback(category, value)
    this.state    = {};
  }

  // -----------------------------------------------------------
  // Render all categories into a container element
  // -----------------------------------------------------------
  render(container, state) {
    this.state     = { ...state };
    container.innerHTML = '';

    const categories = [
      { key: 'fur',       label: 'Fur',       type: 'swatch' },
      { key: 'eyes',      label: 'Eyes',      type: 'icon'   },
      { key: 'ears',      label: 'Ears',      type: 'icon'   },
      { key: 'tail',      label: 'Tail',      type: 'icon'   },
      { key: 'outfit',    label: 'Outfit',    type: 'icon'   },
      { key: 'accessory', label: 'Accessory', type: 'icon'   },
      { key: 'aura',      label: 'Aura',      type: 'swatch' },
      { key: 'style',     label: 'Style',     type: 'toggle' }
    ];

    categories.forEach(cat => {
      const section = document.createElement('div');
      section.className = 'cp-section';
      section.id        = `cp-${cat.key}`;

      const header = document.createElement('div');
      header.className   = 'cp-header';
      header.textContent = cat.label;
      section.appendChild(header);

      const row = document.createElement('div');
      row.className = cat.type === 'toggle' ? 'cp-toggle-row' : 'cp-row';

      if (cat.type === 'toggle') {
        // Boy / Girl style toggle
        ['boy', 'girl'].forEach(s => {
          const btn = document.createElement('button');
          btn.className   = 'cp-toggle' + (state.style === s ? ' active' : '');
          btn.textContent = s === 'boy' ? '👦 Boy' : '👧 Girl';
          btn.dataset.val = s;
          btn.addEventListener('click', () => {
            this._selectToggle(section, 'style', s);
          });
          row.appendChild(btn);
        });
      } else {
        const opts = MonsterData.CUSTOMIZATION_OPTIONS[cat.key] || [];
        opts.forEach(opt => {
          const btn = this._makeOptionBtn(cat, opt, state[cat.key]);
          row.appendChild(btn);
        });
      }

      section.appendChild(row);
      container.appendChild(section);
    });
  }

  // -----------------------------------------------------------
  // Update a single category's selection highlight
  // -----------------------------------------------------------
  updateSelection(category, value) {
    this.state[category] = value;
    const section = document.getElementById(`cp-${category}`);
    if (!section) return;

    section.querySelectorAll('[data-val]').forEach(btn => {
      const bval = btn.dataset.val === 'null' ? null : btn.dataset.val;
      btn.classList.toggle('active', bval === value);
    });
  }

  // -----------------------------------------------------------
  // Internal helpers
  // -----------------------------------------------------------
  _makeOptionBtn(cat, opt, currentVal) {
    const btn = document.createElement('button');
    const isActive = opt.id === currentVal || (opt.id === null && currentVal === null);
    btn.className  = 'cp-btn' + (isActive ? ' active' : '');
    btn.dataset.val = opt.id === null ? 'null' : opt.id;
    btn.title       = opt.label;

    if (cat.type === 'swatch') {
      // Color swatch button
      const swatch = document.createElement('span');
      swatch.className = 'cp-swatch';
      swatch.style.background = opt.color || '#888';
      btn.appendChild(swatch);
      const lbl = document.createElement('span');
      lbl.className   = 'cp-btn-label';
      lbl.textContent = opt.label;
      btn.appendChild(lbl);
    } else {
      // Icon button
      if (opt.icon) {
        const ico = document.createElement('span');
        ico.className   = 'cp-icon';
        ico.textContent = opt.icon;
        btn.appendChild(ico);
      }
      const lbl = document.createElement('span');
      lbl.className   = 'cp-btn-label';
      lbl.textContent = opt.label;
      btn.appendChild(lbl);
    }

    btn.addEventListener('click', () => {
      this._select(cat.key, opt.id, btn);
    });

    return btn;
  }

  _select(category, value, clickedBtn) {
    // Update visual state
    const section = document.getElementById(`cp-${category}`);
    if (section) {
      section.querySelectorAll('.cp-btn').forEach(b => b.classList.remove('active'));
    }
    clickedBtn.classList.add('active');
    this.state[category] = value;
    // Fire callback
    if (this.onChange) this.onChange(category, value);
  }

  _selectToggle(section, category, value) {
    section.querySelectorAll('.cp-toggle').forEach(b => {
      b.classList.toggle('active', b.dataset.val === value);
    });
    this.state[category] = value;
    if (this.onChange) this.onChange(category, value);
  }
}
