# Monster Lab — Academy Integration Plan

> **Status:** DOCUMENTED. Do NOT implement until Monster Lab is proven and approved.  
> The main English Adventure Academy platform is currently **frozen** and must not be modified.

---

## MonsterRenderer Public API

When integrating into the academy, the `MonsterRenderer` class exposes this interface:

```javascript
// Mount the monster into a container DOM element with initial state
renderer.mount(container, characterState)

// Update full or partial character state (re-renders automatically)
renderer.update({ fur: 'blue', tail: 'curl' })

// Update a single customization category
renderer.setSkin('tail', 'lightning')
renderer.setSkin('aura', 'fire')
renderer.setSkin('eyes', 'sparkle')

// Set evolution stage directly (also sets internally from XP)
renderer.setEvolution('adventurer')

// Play a named animation
renderer.play('celebrate')
renderer.play('wave')
renderer.play('idle')

// Destroy and remove canvas (cleanup when navigating away)
renderer.destroy()
```

---

## Academy Character Data Shape

The academy student record should eventually include a `monster` sub-object:

```javascript
student.monster = {
  species:        'lumifox',       // always 'lumifox' currently
  evolutionStage: 'young',         // derived from XP at load time
  style:          'boy',           // 'boy' | 'girl'
  fur:            'orange',        // orange | blue | purple | green | pink
  eyes:           'bright',        // bright | sleepy | fierce | sparkle
  ears:           'fluffy',        // fluffy | pointy | round
  tail:           'plume',         // plume | curl | lightning | ribbon
  outfit:         'explorer',      // explorer | scholar | knight | casual
  accessory:      null,            // null | glasses | crown | scarf
  aura:           null,            // null | fire | ice | electric | rainbow
  xp:             700              // integer 0–6000
}
```

---

## XP → Evolution Stage Thresholds

| Stage       | XP Required |
|-------------|-------------|
| Egg         | 0           |
| Baby        | 100         |
| Tot         | 300         |
| Young       | 700         |
| Adventurer  | 1200        |
| Elite       | 2500        |
| Legendary   | 5000        |

---

## Integration Points in the Academy

### 1. Student Dashboard
- Mount renderer in the student's profile area
- Call `renderer.mount(dashboardMonsterDiv, student.monster)`
- Subscribe to XP changes: call `renderer.setEvolution(newStage)` when XP threshold is crossed
- Trigger animations on events: `renderer.play('celebrate')` on assignment completion

### 2. Homework / Assignment Completion
- Award XP to `student.monster.xp`
- Recompute stage: `MonsterData.xpToStage(student.monster.xp)`
- If stage changed: `renderer.play('evolution')` then `renderer.setEvolution(newStage)`

### 3. Customization Screen
- Use `CustomizationPanel` independently or re-implement in academy's UI framework
- On change: call `renderer.setSkin(category, value)` and persist to student record

### 4. Resource Hub / Games
- Display small version of monster: mount with smaller container (canvas auto-scales)
- Only idle animation needed

### 5. Progress Page
- Evolution timeline can be extracted from `EvolutionManager.renderTimeline()`
- Or re-implemented using `MonsterData.EVOLUTION_STAGES` and student XP

---

## Files Required in Academy

Copy these files to academy `js/` or bundle them:

```
monster-lab/js/monster-data.js       → js/monster/monster-data.js
monster-lab/js/monster-renderer.js   → js/monster/monster-renderer.js
monster-lab/js/animation.js          → js/monster/animation.js
monster-lab/js/evolution.js          → js/monster/evolution.js
```

The `customization.js` and `app.js` are lab-specific and should NOT be copied;  
instead write academy-native wrappers that call the renderer API above.

---

## Persistence

The Monster Lab uses `localStorage` key `monster-lab-state-v1` (lab only).

The academy should persist `student.monster` to its own database/store (school-store.js).  
No localStorage dependency in the renderer itself.

---

## Style Isolation

The lab CSS (`monster-lab.css`) uses scoped class names (`#lab-shell`, `.cp-*`, `.evo-*`).  
These will NOT conflict with academy styles (`school-platform.css`).

The renderer uses only a `<canvas>` element — no CSS classes of its own.

---

## Testing Integration (Future Steps)

1. Copy the 4 JS files into academy
2. In `school-app.js`: on student dashboard render, call `renderer.mount(el, student.monster)`
3. Wire XP award events → `renderer.play('celebrate')` 
4. Wire customization save → `renderer.setSkin(cat, val)` → persist to `school-store`
5. Verify no console errors
6. Verify no interference with existing academy features

---

*This file documents the planned integration. No academy files have been modified.*
