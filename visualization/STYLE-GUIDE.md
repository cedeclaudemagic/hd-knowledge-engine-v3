# HD Wheel Visualization Style Guide

This document defines the visual design language for all Human Design Wheel visualization tools and interfaces.

## Design Philosophy

The aesthetic draws from **sacred geometry** and **esoteric wisdom traditions**, creating an atmosphere that feels:
- Timeless and mystical
- Sophisticated, not generic
- Dark and contemplative with golden accents
- Professional yet otherworldly

## Color Palette

### CSS Custom Properties

```css
:root {
  /* Sacred Gold - Primary accent */
  --gold-primary: #D4AF37;    /* Main gold for accents, highlights */
  --gold-light: #F4D35E;      /* Lighter gold for hover states, emphasis */
  --gold-dark: #996515;       /* Darker gold for borders, shadows */

  /* Void - Background hierarchy */
  --void-deep: #0A0E14;       /* Deepest background */
  --void-mid: #12171F;        /* Panel backgrounds */
  --void-surface: #1A2029;    /* Card backgrounds */
  --void-elevated: #232A36;   /* Hover states, elevated surfaces */

  /* Cosmic Accents - Subtle atmosphere */
  --cosmic-blue: #2D4A6F;     /* Selected states, depth */
  --cosmic-teal: #1E4D4D;     /* Success states, variety */

  /* Text Hierarchy */
  --text-primary: #E8E4DC;    /* Primary text (warm white) */
  --text-secondary: #9A9590;  /* Secondary labels */
  --text-muted: #5C5852;      /* Disabled, tertiary info */

  /* Borders & Glow */
  --border-subtle: rgba(212, 175, 55, 0.15);
  --border-accent: rgba(212, 175, 55, 0.4);
  --glow-gold: rgba(212, 175, 55, 0.3);
}
```

### Color Usage

| Element | Color |
|---------|-------|
| Page background | `--void-deep` |
| Panel background | `--void-mid` with gradient to `--void-deep` |
| Card background | `--void-surface` |
| Card hover | `--void-elevated` |
| Selected state | Gradient to `--cosmic-blue` |
| Primary buttons | Gold gradient |
| Secondary buttons | `--void-surface` with subtle border |
| Headings | `--gold-primary` |
| Body text | `--text-primary` |
| Labels | `--text-secondary` |
| Data values | `--gold-primary` + monospace font |

## Typography

### Font Stack

```css
/* Headings - Classical, mystical feel */
font-family: 'Cinzel', serif;

/* UI Elements - Clean, modern */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Data/Code - Technical precision */
font-family: 'JetBrains Mono', monospace;
```

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Typography Usage

| Element | Font | Weight | Size | Style |
|---------|------|--------|------|-------|
| Main title | Cinzel | 600 | 1.4em | letter-spacing: 0.05em |
| Section headers | Cinzel | 400 | 0.8em | uppercase, letter-spacing: 0.2em |
| Card titles | Cinzel | 600 | 0.95em | letter-spacing: 0.02em |
| Body text | Inter | 400 | 0.85em | - |
| Labels | Inter | 500 | 0.75em | uppercase, letter-spacing: 0.05em |
| Data values | JetBrains Mono | 500 | inherit | - |
| Badges | JetBrains Mono | 400 | 0.65em | uppercase, letter-spacing: 0.1em |

## Animation & Motion

### Timing Functions

```css
/* Standard easing for most interactions */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Faster for micro-interactions */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### Keyframe Animations

```css
/* Entrance animation - stagger with delays */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Loading/active state */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px var(--glow-gold); }
  50% { box-shadow: 0 0 40px var(--glow-gold), 0 0 60px rgba(212, 175, 55, 0.15); }
}

/* Subtle floating effect */
@keyframes subtleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
```

### Animation Guidelines

- Stagger entrance animations with 0.1s delays
- Cards shift horizontally on hover (4-8px)
- Buttons lift slightly on hover (-2px translateY)
- Use glow pulse for loading/processing states
- Keep animations subtle - avoid distracting movement

## Component Patterns

### Cards

```css
.card {
  background: var(--void-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover {
  border-color: var(--border-accent);
  transform: translateX(4px);
  background: var(--void-elevated);
}

.card:hover::before {
  opacity: 0.5;
}

.card.selected {
  border-color: var(--gold-primary);
  background: linear-gradient(135deg, var(--void-elevated) 0%, var(--cosmic-blue) 100%);
  box-shadow: 0 4px 24px rgba(212, 175, 55, 0.15);
}
```

### Primary Buttons

```css
.btn-primary {
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-dark) 100%);
  color: var(--void-deep);
  font-family: 'Cinzel', serif;
  font-size: 0.85em;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold-primary) 100%);
  box-shadow: 0 6px 24px rgba(212, 175, 55, 0.4);
  transform: translateY(-2px);
}
```

### Secondary Buttons

```css
.btn-secondary {
  padding: 14px 20px;
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  background: var(--void-surface);
  color: var(--text-secondary);
  font-family: 'Cinzel', serif;
  font-size: 0.85em;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  background: var(--void-elevated);
  border-color: var(--border-accent);
  color: var(--gold-primary);
}
```

### Range Sliders

```css
input[type="range"] {
  -webkit-appearance: none;
  background: transparent;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  background: linear-gradient(90deg, var(--void-deep), var(--void-elevated));
  border-radius: 2px;
  border: 1px solid var(--border-subtle);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold-primary) 100%);
  border-radius: 50%;
  border: 2px solid var(--gold-dark);
  margin-top: -7px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 12px var(--glow-gold);
  cursor: grab;
}
```

### Badges / Pills

```css
.badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65em;
  color: var(--text-muted);
  background: var(--void-deep);
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid var(--border-subtle);
}
```

## Atmospheric Effects

### Panel Gradient Border

```css
.panel {
  position: relative;
}

.panel::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg,
    transparent 0%,
    var(--gold-primary) 20%,
    var(--gold-primary) 80%,
    transparent 100%);
  opacity: 0.3;
}
```

### Preview Area Background

```css
.preview {
  background: var(--void-deep);
  position: relative;
}

/* Radial gradient atmosphere */
.preview::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at center, rgba(45, 74, 111, 0.15) 0%, transparent 70%),
    radial-gradient(circle at 20% 80%, rgba(30, 77, 77, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 40%);
  pointer-events: none;
}

/* Subtle grid pattern */
.preview::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(212, 175, 55, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 175, 55, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}
```

### SVG Glow

```css
svg {
  filter: drop-shadow(0 0 40px rgba(212, 175, 55, 0.1));
}
```

## Custom Scrollbar

```css
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--void-deep);
}

::-webkit-scrollbar-thumb {
  background: var(--border-accent);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gold-dark);
}
```

## SVG Elements

When rendering SVG elements programmatically:

```javascript
// Center marker
const goldColor = '#D4AF37';
const goldLight = '#F4D35E';

// Double-circle with crosshairs
`<circle cx="${cx}" cy="${cy}" r="6" fill="${goldColor}" opacity="0.9"/>
 <circle cx="${cx}" cy="${cy}" r="3" fill="${goldLight}"/>
 <line x1="${cx-12}" y1="${cy}" x2="${cx+12}" y2="${cy}"
       stroke="${goldColor}" stroke-width="1" opacity="0.6"/>
 <line x1="${cx}" y1="${cy-12}" x2="${cx}" y2="${cy+12}"
       stroke="${goldColor}" stroke-width="1" opacity="0.6"/>`
```

## Do's and Don'ts

### Do
- Use the gold palette consistently for accents
- Maintain dark, deep backgrounds
- Apply subtle animations that feel mystical
- Use Cinzel for anything "titled" or important
- Add atmospheric gradients and glows
- Keep text warm-toned (not pure white)

### Don't
- Use bright, saturated colors
- Apply bouncy or playful animations
- Use rounded "friendly" UI patterns
- Add unnecessary decorative elements
- Use pure white (#FFFFFF) for text
- Mix in other accent colors (stick to gold/blue/teal)

---

*This style guide was created for the HD Knowledge Engine visualization tools. Apply these patterns consistently to maintain a cohesive, mystical aesthetic.*
