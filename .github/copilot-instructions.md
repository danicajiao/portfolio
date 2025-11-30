# Portfolio AI Coding Instructions

## Project Overview
Interactive portfolio website built with vanilla JavaScript, GSAP animations, Three.js 3D graphics, and Vite. Features dynamic theming, Conway's Game of Life hero background, and project-specific visual effects.

## Architecture

### Build System
- **Vite** with custom config: `root: 'src'`, `publicDir: '../public'`, port `5173`
- Entry point: `src/index.html` (not root)
- Build output: `dist/` with sourcemaps enabled

### Core Stack
- **GSAP** (v3.13.0): All animations, ScrollTrigger for scroll-based effects, MotionPathPlugin for SVG path animations
- **Three.js** (v0.176.0): 3D scenes on `#skills-canvas` only (IcosahedronGeometry sphere)
- **Lenis** (@studio-freight/lenis v1.0.42): Commented out - implementation deferred for future work
- **Canvas 2D**: Hero section Conway's Game of Life implementation

### Key Files
- `src/js/main.js` (1378 lines): Single-file architecture with all logic
- `src/styles/main.css`: CSS variables for theming, base styles
- `src/styles/schwab-styles.css`, `cove-styles.css`: Project-specific visual styles
- `src/index.html`: Inline SVG for project visualizations (CI/CD pipeline graphics)

## Critical Patterns

### Theme System
**Do not use CSS transitions** - GSAP handles all theme changes:
```javascript
CONFIG.colors = loadCSSColors(); // Reload from CSS vars after theme change
gsap.to(element, { backgroundColor: CONFIG.colors.bgPrimary, duration: 0.3 });
```
- Theme detection: `prefers-color-scheme` media query on page load
- Theme classes: `.dark-theme` / `.light-theme` on `<html>`
- FOUC prevention: Inline script in `<head>` sets theme before CSS loads
- When adding themed elements, animate color changes via GSAP, not CSS

### Animation Lifecycle
1. **Init phase** (`init()`): Scroll disabled (`overflow: hidden`), sets initial states via `gsap.set()`
2. **Loading sequence** (`startLoadingSequence()`): Simulated progress (0-100%), 100ms intervals
3. **Page animations** (`startPageAnimations()`): Re-enables scroll, runs hero timeline, initializes ScrollTriggers
4. **Important**: Always use `gsap.set()` for initial states in `initAnimations()`, never CSS `opacity: 0`

### Project Hover System
Projects use ID-based mapping: `#schwab-link` → `#schwab-bg`, `#schwab-panel-left`, `#schwab-panel-right`
- Background panels in `.project-visual-bgs` (one per project)
- Left/right visual panels in `.project-visual-panels` 
- Naming convention: `${projectId}-bg`, `${projectId}-panel-left/right`
- **Never use inline styles** - all animations via GSAP timelines
- Set `pointerEvents: 'none'` during animation, restore to `'auto'` on complete

### Canvas Scenes
1. **Hero (`#hero-canvas`)**: Conway's Game of Life, vanilla Canvas 2D, 7px cells, edge-weighted spawn
2. **Skills (`#skills-canvas`)**: Three.js IcosahedronGeometry, scroll-linked rotation via ScrollTrigger

### SVG Animations
Inline SVG in HTML for full GSAP access (e.g., Schwab CI/CD pipeline cards):
- MotionPathPlugin animates dots along paths: `gsap.to(dot, { motionPath: { path: '#line-path1' } })`
- `.spinner` class with rotating stroke-dasharray for loading states
- `.success-indicator` with opacity transitions for completion states

## Development Workflow

### Running the Project
```bash
npm run dev      # Start Vite dev server on port 5173
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

### Adding New Projects
1. Add link in HTML: `<a href="#project-name" id="project-name-link" class="project-link">`
2. Create background div: `<div id="project-name-bg" class="project-bg">`
3. Create panel divs: `<div id="project-name-panel-left" class="panel">` and `-right`
4. Add CSS variables in `:root` and `.dark-theme`: `--project-name-bg: #color;`
5. Update `loadCSSColors()` to include new color
6. Implement hover animations in `initProjectHovers()` switch statement

**Note**: Only Schwab and Cove projects are fully implemented. Other projects (SchwApp, SafeLINC, Letics) are placeholders for future development.

### Debugging Animations
- Set `ScrollTrigger.defaults({ markers: true })` to visualize trigger points
- Check `CONFIG.animations.enabled` flag before disabling animations
- Use `console.debug()` for scroll position logging (already in `initNavigation()`)

## Common Pitfalls
- **Don't** add smooth scrolling without uncommenting `initSmoothScroll()` in `init()` - Lenis integration is disabled
- **Don't** use `display: none` on load - use `opacity: 0` with GSAP
- **Don't** animate CSS custom properties directly - reload colors with `loadCSSColors()` then animate elements
- **Don't** forget `ScrollTrigger.refresh()` after DOM changes affecting layout
- **Don't** create new Three.js scenes outside `initSkillsScene()` - hero uses Canvas 2D only

## Future Enhancements
- **Lenis smooth scrolling**: Currently disabled due to implementation complexity - needs integration with ScrollTrigger
- **3D models**: `src/assets/models/` exists but unused - may add Three.js model loading later
- **Testing**: No automated tests yet - visual QA only
- **Projects**: 3 of 5 projects awaiting implementation (SchwApp, SafeLINC, Letics)

## Conventions
- Function prefix: `init*()` for setup, `create*()` for generators, `animate*()` for loops
- No classes - all functional programming with closure-based state
- GSAP timelines over keyframes for sequenced animations
- `gsap.utils.toArray()` for DOM query results before `.forEach()`
- Always provide `ease` parameter in GSAP tweens (use `CONFIG.animations.defaults.ease`)
