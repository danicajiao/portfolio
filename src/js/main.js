// main.js

import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import githubTexture from '../assets/images/GitHub.png';
import { animateProject } from './project-link-animations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(SplitText);

// Set defaults for ScrollTrigger
ScrollTrigger.defaults({
  scroller: document.body,
  markers: false, // Set to true for debugging
});

// Initialize variables
let _camera, _scenee_rendererer;
let _heroMesh, skillsCube;
let _particles;
const _loader = new THREE.TextureLoader();
let projectHovered = false;
// let asciiEffectElement = null; // Reference to ASCII effect DOM element for theme changes

// Load initial theme colors immediately when script loads
const CONFIG = {
  colors: loadCSSColors(),
  isDarkMode: document.documentElement.classList.contains('dark-theme'),
  animations: {
    enabled: true,
    defaults: {
      duration: 0.3,
      ease: 'power2.inOut',
    },
  },
};

// Reveal the page now that JS has loaded
document.documentElement.style.opacity = '1';

// Initialize page when loaded
window.addEventListener('load', init);

// split elements with the class "split" into words and characters
const aboutSplits = SplitText.create('.about-text p', { type: 'words' });

function init() {
  // Disable scroll initially until page is loaded
  document.body.style.overflow = 'hidden';

  // Initialize theme listener for dark mode support
  initThemeListener();

  initLoader();

  // Initialize smooth scrolling first
  // initSmoothScroll();

  // Initialize custom cursor
  initCursor();

  initNavigation();

  // Initialize 2D scenes
  initHeroScene();

  // Initialize project hover effects with GSAP
  initProjectHovers();

  // Initialize project modal
  initProjectModal();

  initSkillsScene();

  // Initialize interactive elements
  initForm();

  // Initialize animations (sets initial states)
  initAnimations();

  // Force ScrollTrigger to recalculate all scrollbar-related measurements
  // ScrollTrigger.refresh(true);

  // Start loading sequence (will trigger animations when complete)
  startLoadingSequence();
}

function loadCSSColors() {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  return {
    bgPrimary: computedStyle.getPropertyValue('--color-bg-primary').trim(),
    bgSecondary: computedStyle.getPropertyValue('--color-bg-secondary').trim(),
    bgInverted: computedStyle.getPropertyValue('--color-bg-inverted').trim(),
    textPrimary: computedStyle.getPropertyValue('--color-text-primary').trim(),
    textSecondary: computedStyle
      .getPropertyValue('--color-text-secondary')
      .trim(),
    textInverted: computedStyle
      .getPropertyValue('--color-text-inverted')
      .trim(),
    border: computedStyle.getPropertyValue('--color-border').trim(),
    accent: computedStyle.getPropertyValue('--color-accent').trim(),
    accentHover: computedStyle.getPropertyValue('--color-accent-hover').trim(),
    // Convert hex to number for Three.js
    sphereColor: parseInt(
      computedStyle.getPropertyValue('--color-accent').trim().replace('#', ''),
      16,
    ),
    // Load project-specific colors
    schwabBg: computedStyle.getPropertyValue('--schwab-bg').trim(),
    coveBg: computedStyle.getPropertyValue('--cove-bg').trim(),
    schwappBg: computedStyle.getPropertyValue('--schwapp-bg').trim(),
    safelincBg: computedStyle.getPropertyValue('--safelinc-bg').trim(),
    leticsBg: computedStyle.getPropertyValue('--letics-bg').trim(),
  };
}

function initThemeListener() {
  const body = document.body;
  const logo = document.querySelector('.logo a');
  const navLinks = document.querySelectorAll('.nav-link');
  const projectLinks = document.querySelectorAll('.project-link');
  const schwabBg = document.getElementById('schwab-bg');

  // Set initial values based on computed CSS variables for GSAP to transition from
  gsap.set(body, {
    backgroundColor: CONFIG.colors.bgPrimary,
    color: CONFIG.colors.textPrimary,
  });

  gsap.set(logo, {
    color: CONFIG.colors.textPrimary,
  });

  navLinks.forEach((link) => {
    gsap.to(link, {
      color: CONFIG.colors.textPrimary,
      duration: CONFIG.animations.defaults.duration,
      ease: CONFIG.animations.defaults.ease,
    });
  });

  // Listen for changes in the user's color scheme preference
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      CONFIG.isDarkMode = e.matches;

      // Update theme class
      if (e.matches) {
        document.documentElement.classList.remove('light-theme');
        document.documentElement.classList.add('dark-theme');

        // Reload colors from CSS after theme change
        CONFIG.colors = loadCSSColors();

        gsap.to(body, {
          backgroundColor: CONFIG.colors.bgPrimary,
          color: CONFIG.colors.textPrimary,
          duration: CONFIG.animations.defaults.duration,
          ease: CONFIG.animations.defaults.ease,
        });

        gsap.to(logo, {
          color: CONFIG.colors.textPrimary,
          duration: CONFIG.animations.defaults.duration,
          ease: CONFIG.animations.defaults.ease,
        });

        navLinks.forEach((link) => {
          gsap.to(link, {
            color: CONFIG.colors.textPrimary,
            duration: CONFIG.animations.defaults.duration,
            ease: CONFIG.animations.defaults.ease,
          });
        });

        projectLinks.forEach((link) => {
          gsap.to(link, {
            color: CONFIG.colors.textPrimary,
            duration: CONFIG.animations.defaults.duration,
            ease: CONFIG.animations.defaults.ease,
          });

          const underline = link.querySelector('div');
          if (underline) {
            gsap.to(underline, {
              backgroundColor: CONFIG.colors.textPrimary,
              duration: CONFIG.animations.defaults.duration,
              ease: CONFIG.animations.defaults.ease,
            });
          }
        });

        // Schwab Background
        const squares = schwabBg.querySelectorAll('.grid-square');
        gsap.set(squares, { stroke: 'rgba(0, 0, 0, 1)' });

        // ASCII effect color
        // if (asciiEffectElement) {
        //     gsap.to(asciiEffectElement, {
        //         color: '#000000ff',
        //         duration: CONFIG.animations.defaults.duration,
        //         ease: CONFIG.animations.defaults.ease
        //     });
        // }
      } else {
        document.documentElement.classList.remove('dark-theme');
        document.documentElement.classList.add('light-theme');

        // Reload colors from CSS after theme change
        CONFIG.colors = loadCSSColors();

        gsap.to(body, {
          backgroundColor: CONFIG.colors.bgPrimary,
          color: CONFIG.colors.textPrimary,
          duration: CONFIG.animations.defaults.duration,
          ease: CONFIG.animations.defaults.ease,
        });

        gsap.to(logo, {
          color: CONFIG.colors.textPrimary,
          duration: CONFIG.animations.defaults.duration,
          ease: CONFIG.animations.defaults.ease,
        });

        navLinks.forEach((link) => {
          gsap.to(link, {
            color: CONFIG.colors.textPrimary,
            duration: CONFIG.animations.defaults.duration,
            ease: CONFIG.animations.defaults.ease,
          });
        });

        projectLinks.forEach((link) => {
          gsap.to(link, {
            color: CONFIG.colors.textPrimary,
            duration: CONFIG.animations.defaults.duration,
            ease: CONFIG.animations.defaults.ease,
          });

          const underline = link.querySelector('div');
          if (underline) {
            gsap.to(underline, {
              backgroundColor: CONFIG.colors.textPrimary,
              duration: CONFIG.animations.defaults.duration,
              ease: CONFIG.animations.defaults.ease,
            });
          }
        });

        // Schwab Background
        const squares = schwabBg.querySelectorAll('.grid-square');
        gsap.set(squares, { stroke: 'rgba(255, 255, 255, 1)' });
      }
    });
}

function initLoader() {
  const loaderCircle = document.querySelector('.loader-circle');

  // The loader background is now handled by CSS custom properties
  // Just animate the circle rotation
  gsap.to(loaderCircle, {
    rotate: 360,
    duration: 1.5,
    repeat: -1,
    ease: 'linear',
  });
}

// Custom cursor
function initCursor() {
  const cursor = document.querySelector('.cursor');

  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: 'power3.out',
    });
  });

  document.addEventListener('mouseenter', () => {
    gsap.to(cursor, {
      opacity: 1,
      duration: CONFIG.animations.defaults.duration,
    });
  });

  document.addEventListener('mouseleave', () => {
    gsap.to(cursor, {
      opacity: 0,
      duration: CONFIG.animations.defaults.duration,
    });
  });

  // Hover effect for links and buttons
  const interactiveElements = document.querySelectorAll(
    'a, button, .project, .social-link',
  );
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, {
        scale: 1.5,
        duration: CONFIG.animations.defaults.duration,
      });
      // cursor.classList.add('hovered');
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, {
        scale: 1,
        duration: CONFIG.animations.defaults.duration,
      });
      // cursor.classList.remove('hovered');
    });
  });
}

// Mobile navigation
function initNavigation() {
  // Navigation background change on scroll
  const nav = document.querySelector('.nav');
  const navLinks = gsap.utils.toArray('.nav-link');
  const logo = document.querySelector('.logo a');

  // Set initial state for nav
  if (window.scrollY > 100) {
    gsap.set(nav, {
      backdropFilter: 'blur(10px)',
      padding: '1rem 0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    });
  } else {
    gsap.set(nav, {
      backdropFilter: 'none',
      padding: '2rem 0',
      boxShadow: 'none',
    });
  }

  // console.debug(`Current scrollY position: ${window.scrollY}`)

  window.addEventListener('scroll', () => {
    // console.debug(window.scrollY);

    if (window.scrollY > 100) {
      gsap.to(nav, {
        backdropFilter: 'blur(10px)',
        padding: '1rem 0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        duration: CONFIG.animations.defaults.duration,
      });
    } else {
      gsap.to(nav, {
        backdropFilter: 'none',
        padding: '2rem 0',
        boxShadow: 'none',
        duration: 0.3,
      });
    }
  });

  // Change navbar color when over skills section
  ScrollTrigger.create({
    trigger: '#skills',
    start: 'top top+=50',
    end: 'bottom top+=50',
    onEnter: () => {
      gsap.to([...navLinks, logo], {
        color: CONFIG.isDarkMode
          ? CONFIG.colors.textPrimary
          : CONFIG.colors.textInverted,
        duration: 0.3,
        ease: CONFIG.animations.defaults.ease,
      });
    },
    onLeave: () => {
      gsap.to([...navLinks, logo], {
        color: CONFIG.colors.textPrimary,
        duration: 0.3,
        ease: CONFIG.animations.defaults.ease,
      });
    },
    onEnterBack: () => {
      gsap.to([...navLinks, logo], {
        color: CONFIG.isDarkMode
          ? CONFIG.colors.textPrimary
          : CONFIG.colors.textInverted,
        duration: 0.3,
        ease: CONFIG.animations.defaults.ease,
      });
    },
    onLeaveBack: () => {
      gsap.to([...navLinks, logo], {
        color: CONFIG.colors.textPrimary,
        duration: 0.3,
        ease: CONFIG.animations.defaults.ease,
      });
    },
  });

  const menuToggle = document.querySelector('.menu-toggle');

  menuToggle.addEventListener('click', () => {
    const isActive = menuToggle.classList.contains('active');

    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    const menuToggleSpans = gsap.utils.toArray('.menu-toggle span');

    if (!isActive) {
      // Animate to X (hamburger -> X)
      gsap.to(menuToggleSpans[0], {
        rotate: 45,
        y: 9, // Move down to center
        duration: CONFIG.animations.defaults.duration,
        ease: CONFIG.animations.defaults.ease,
      });
      gsap.to(menuToggleSpans[1], {
        opacity: 0,
        duration: CONFIG.animations.defaults.duration,
        ease: CONFIG.animations.defaults.ease,
      });
      gsap.to(menuToggleSpans[2], {
        rotate: -45,
        y: -9, // Move up to center
        duration: CONFIG.animations.defaults.duration,
        ease: CONFIG.animations.defaults.ease,
      });
    } else {
      // Animate back to hamburger (X -> hamburger)
      gsap.to(menuToggleSpans[0], {
        rotate: 0,
        y: 0,
        duration: CONFIG.animations.defaults.duration,
        ease: CONFIG.animations.defaults.ease,
      });
      gsap.to(menuToggleSpans[1], {
        opacity: 1,
        duration: CONFIG.animations.defaults.duration,
        ease: CONFIG.animations.defaults.ease,
      });
      gsap.to(menuToggleSpans[2], {
        rotate: 0,
        y: 0,
        duration: CONFIG.animations.defaults.duration,
        ease: CONFIG.animations.defaults.ease,
      });
    }
  });

  logo.addEventListener('mouseenter', () => {
    gsap.to(logo, {
      color: CONFIG.colors.accent,
      duration: CONFIG.animations.defaults.duration,
      ease: CONFIG.animations.defaults.ease,
    });
  });

  logo.addEventListener('mouseleave', () => {
    gsap.to(logo, {
      color: CONFIG.colors.textPrimary,
      duration: CONFIG.animations.defaults.duration,
      ease: CONFIG.animations.defaults.ease,
    });
  });

  // Add hover effect for nav links
  gsap.utils.toArray('.nav-link').forEach((link) => {
    // Create underline element for each nav link
    const underline = document.createElement('div');
    underline.style.position = 'absolute';
    underline.style.bottom = '-5px';
    underline.style.left = '0';
    underline.style.width = '100%';
    underline.style.height = '2px';
    underline.style.backgroundColor = CONFIG.colors.accent;
    underline.style.transformOrigin = 'right';

    // Set initial state
    gsap.set(underline, { scaleX: 0 });

    // Make link relative and append underline
    link.style.position = 'relative';
    link.appendChild(underline);

    // Mouse enter - animate color and underline
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        color: CONFIG.colors.accent,
        duration: CONFIG.animations.defaults.duration,
        ease: CONFIG.animations.defaults.ease,
      });

      gsap.to(underline, {
        scaleX: 1,
        transformOrigin: 'left',
        duration: CONFIG.animations.defaults.duration,
        ease: CONFIG.animations.defaults.ease,
      });
    });

    // Mouse leave - reset color and underline
    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        color: CONFIG.colors.textPrimary,
        duration: CONFIG.animations.defaults.duration,
        ease: CONFIG.animations.defaults.ease,
      });

      gsap.to(underline, {
        scaleX: 0,
        transformOrigin: 'right',
        duration: CONFIG.animations.defaults.duration,
        ease: CONFIG.animations.defaults.ease,
      });
    });
  });
}

// Hero background scene with Conway's Game of Life
function initHeroScene() {
  const heroCanvas = document.getElementById('hero-canvas');
  if (!heroCanvas) return;

  // Set canvas size
  heroCanvas.width = window.innerWidth;
  heroCanvas.height = window.innerHeight;
  const ctx = heroCanvas.getContext('2d');

  // Game of Life settings
  const cellSize = 10;
  const cols = Math.floor(heroCanvas.width / cellSize);
  const rows = Math.floor(heroCanvas.height / cellSize);
  let grid = createRandomGrid(cols, rows);

  function createRandomGrid(cols, rows) {
    const arr = [];
    for (let y = 0; y < rows; y++) {
      arr[y] = [];
      for (let x = 0; x < cols; x++) {
        // Place most live cells near the edges, few in the center
        const edgeThreshold = 10; // Number of cells from edge considered 'edge'
        const isEdge =
          x < edgeThreshold ||
          x >= cols - edgeThreshold ||
          y < edgeThreshold ||
          y >= rows - edgeThreshold;
        if (isEdge) {
          arr[y][x] = Math.random() > 0.5 ? 1 : 0; // 50% chance alive on edge
        } else {
          arr[y][x] = 0; // 0% chance alive in center
        }
      }
    }
    return arr;
  }

  function drawGrid() {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    // // Check if dark mode is preferred
    // const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const cellColor = CONFIG.isDarkMode ? '#ffffff10' : '#00000010'; // Lighter transparent white (0x10 = ~6% opacity)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x]) {
          ctx.fillStyle = cellColor;

          // Draw circular cells instead of squares
          ctx.beginPath();
          ctx.arc(
            x * cellSize + cellSize / 2, // x center
            y * cellSize + cellSize / 2, // y center
            cellSize / 2 - 1, // radius (slightly smaller for spacing)
            0, // start angle
            2 * Math.PI, // end angle (full circle)
          );
          ctx.fill();
        }
      }
    }
  }

  function nextGeneration() {
    const newGrid = [];
    for (let y = 0; y < rows; y++) {
      newGrid[y] = [];
      for (let x = 0; x < cols; x++) {
        let neighbors = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const nx = x + j;
            const ny = y + i;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              neighbors += grid[ny][nx];
            }
          }
        }
        if (grid[y][x] === 1) {
          newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          newGrid[y][x] = neighbors === 3 ? 1 : 0;
        }
      }
    }
    grid = newGrid;
  }

  function animate() {
    drawGrid();
    setTimeout(() => {
      nextGeneration();
      requestAnimationFrame(animate);
    }, 100); // 100ms per generation (adjust as desired)
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;
  });
}

function createGridBackground() {
  const gridSvg = document.querySelector('#schwab-bg .grid-svg');
  if (!gridSvg) return;

  const squareSize = 70;
  const containerWidth = gridSvg.clientWidth;
  const containerHeight = gridSvg.clientHeight;

  const cols = Math.floor(containerWidth / squareSize);
  const rows = Math.floor(containerHeight / squareSize);

  // Calculate offsets to center the grid
  const gridWidth = cols * squareSize;
  const gridHeight = rows * squareSize;
  const offsetX = (containerWidth - gridWidth) / 2;
  const offsetY = (containerHeight - gridHeight) / 2;

  // Clear existing content
  gridSvg.innerHTML = '';

  // Create grid squares
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      );

      rect.setAttribute('x', col * squareSize + offsetX);
      rect.setAttribute('y', row * squareSize + offsetY);
      rect.setAttribute('width', squareSize);
      rect.setAttribute('height', squareSize);
      rect.setAttribute('fill', 'none');
      rect.setAttribute(
        'stroke',
        CONFIG.isDarkMode ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)',
      );
      rect.setAttribute('stroke-width', '0.5');

      rect.classList.add('grid-square');
      rect.dataset.row = row;
      rect.dataset.col = col;

      gridSvg.appendChild(rect);
    }
  }

  // Animate random squares
  // animateGridSquares();
}

function _animateGridSquares() {
  const squares = document.querySelectorAll('.grid-square');

  squares.forEach((square, _index) => {
    // Only animate 1/10th of the squares (10% chance)
    if (Math.random() < 0.1) {
      // Random delay for each square
      const delay = Math.random() * 5;

      gsap.to(square, {
        fill: () => {
          const colors = [
            'rgba(0, 149, 255, 0.23)', // Blue
            // 'rgba(255, 255, 255, 1)'    // White
          ];
          return colors[Math.floor(Math.random() * colors.length)];
        },
        duration: 2,
        delay: delay,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });
    }
  });
}

// Add this to your init function or create a new function called from init
function initProjectHovers() {
  // Don't initialize hover effects on tablets and smaller screens
  if (window.innerWidth <= 1100) {
    return;
  }

  const projectLinks = document.querySelectorAll('.project-link');
  const visuals = document.querySelector('.project-visuals');
  // const nav = document.querySelector('.nav');
  const heroCanvas = document.getElementById('hero-canvas');

  // Track current state
  let _activeProjectId = null;
  const _isBlockVisible = false;

  // Set initial state for the unified visual block
  gsap.set(visuals, {
    opacity: 0,
  });

  // Hide all visuals initially
  document.querySelectorAll('.project-panel').forEach((visual) => {
    gsap.set(visual, { opacity: 0 });
  });

  createGridBackground();

  projectLinks.forEach((link) => {
    // Extract project name from ID
    const projectId = link.id.replace('-link', '');

    // Create underline element for each nav link
    const underline = document.createElement('div');
    underline.style.position = 'absolute';
    underline.style.bottom = '-5px';
    underline.style.left = '0';
    underline.style.width = '100%';
    underline.style.height = '4px';
    underline.style.backgroundColor = CONFIG.colors.textPrimary;
    underline.style.transformOrigin = 'right';

    // Set initial state
    gsap.set(underline, { scaleX: 0 });

    // Make link relative and append underline
    link.style.position = 'relative';
    link.appendChild(underline);

    // Mouse enter animation
    link.addEventListener('mouseenter', (_event) => {
      // If a project is already hovered, don't do anything
      if (!projectHovered) projectHovered = true;

      // Kill any ongoing animations on global/shared elements
      gsap.killTweensOf(visuals);
      gsap.killTweensOf(heroCanvas);
      // gsap.killTweensOf('.nav');

      document.querySelectorAll('.panel').forEach((panel) => {
        gsap.killTweensOf(panel);
      });

      document.querySelectorAll('.project-bg').forEach((bg) => {
        gsap.killTweensOf(bg);
      });

      // Update state
      _activeProjectId = projectId;

      // Hide nav
      gsap.to('.nav', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });

      // Hide all backgrounds
      document.querySelectorAll('.project-bg').forEach((projectBg) => {
        gsap.set(projectBg, { opacity: 0 });
      });

      // Hide all panels
      document.querySelectorAll('.panel').forEach((panel) => {
        gsap.set(panel, { opacity: 0 });
      });

      // Animate the project visuals in
      animateProject(projectId, 'enter', CONFIG);

      // Show the relevant left and right panels
      const panelLeft = document.querySelector(`.panel-left`);
      const panelRight = document.querySelector(`.panel-right`);

      if (panelLeft) {
        gsap.fromTo(
          panelLeft,
          {
            translateX: '-20%',
          },
          {
            translateX: '0%',
            duration: 0.4,
            ease: 'power2.out',
          },
        );
      }

      if (panelRight) {
        gsap.fromTo(
          panelRight,
          {
            translateX: '20%',
          },
          {
            translateX: '0%',
            duration: 0.4,
            ease: 'power2.out',
          },
        );
      }

      gsap.set(visuals, {
        opacity: 1,
      });

      gsap.to(heroCanvas, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });

      // Animate the underline
      gsap.to(underline, {
        transformOrigin: 'left',
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    });

    // Reset the project link on mouse leave
    link.addEventListener('mouseleave', (event) => {
      projectHovered = false;

      console.log(event.target);
      console.log(event.relatedTarget);

      gsap.killTweensOf('body');
      // gsap.killTweensOf(nav);
      gsap.killTweensOf(visuals);
      gsap.killTweensOf(heroCanvas);

      // If the mouse is leaving the project link AND NOT going to another project link
      if (
        event.target.classList.contains('project-link') !==
        event.relatedTarget?.classList.contains('project-link')
      ) {
        // Reset state
        // gsap.set('body', { backgroundColor: CONFIG.colors.bgPrimary });
        gsap.to('.nav', {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        });
        gsap.set(visuals, { opacity: 0 });
        gsap.set(heroCanvas, { opacity: 1 });
      }

      animateProject(projectId, 'leave', CONFIG);

      // Reset underline
      gsap.to(underline, {
        scaleX: 0,
        duration: 0.3,
        transformOrigin: 'right',
        ease: 'power2.inOut',
      });
    });
  });
}

// Initialize project modal
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalOverlay = modal.querySelector('.modal-overlay');
  const modalContent = modal.querySelector('.modal-content');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = modal.querySelector('.modal-close');
  const projectLinks = document.querySelectorAll('.project-link');

  // Project content mapping
  const projectContent = {
    schwab: {
      title: 'Schwab CI/CD',
      description:
        'Enterprise CI/CD platform serving developers across Charles Schwab with automated pipelines for diverse deployment targets. The platform provides comprehensive CI/CD capabilities, artifact management, secure secret fetching, and unified developer experience across the organization\'s technology stack. Recognized with the "Schwab Technology Services All-Star Developer 2025" award for delivering production-grade deployment pipelines with enterprise-standard environment strategies, security scanning, and compliance automation.',
      tech: [
        'GitHub Actions',
        'Docker',
        'GCP',
        'Cloud Foundry',
        'Kubernetes',
        'Bash',
        'JavaScript',
        'Python',
      ],
      link: 'https://www.linkedin.com/in/daniel-cajiao-67184996',
    },
    cove: {
      title: 'Cove',
      description:
        'Passion project of a mock curated marketplace of ethical businesses and quality producers to explore native iOS Development, UX/UI design, mobile CI/CD, and the Google Cloud Platform.',
      tech: ['iOS', 'SwiftUI', 'GCP', 'Firebase'],
      link: 'https://github.com/danicajiao/cove-ios',
    },
    schwapp: {
      title: 'SchwApp',
      description:
        "Award-winning project from Schwab's 2024 NERDathon. A comprehensive internal mobile platform designed to strengthen employee engagement and foster workplace community. Features include personalized news feeds, company-wide event discovery, real-time collaboration tools, resource directories, and employee recognition systems—creating a unified digital hub that connects thousands of employees across the organization.",
      tech: ['React Native', 'TypeScript', 'REST API'],
      link: 'https://www.linkedin.com/in/daniel-cajiao-67184996',
    },
    safelinc: {
      title: 'SafeLINC',
      description:
        'Mental health safety plan application that empowers individuals to create, access, and modify their personalized safety plans anytime from anywhere. Features include real-time plan updates, encouraging feedback, secure sharing with parents or therapists, and quick access to crisis services—providing a comfortable, supportive way for users to manage their mental wellness. Won "Best in Show" @ UCF CS Senior Design, engaging parents and clinicians in collaborative safety planning for at-risk youth, using a secure platform for monitoring and communication.',
      tech: ['iOS', 'AWS', 'GraphQL'],
      link: 'https://www.linkedin.com/in/daniel-cajiao-67184996',
    },
    letics: {
      title: 'Letics',
      description:
        'Athletic performance tracking and analysis platform. Track workouts, analyze performance metrics, and connect with coaches and teammates.',
      tech: ['React Native', 'MongoDB'],
      link: 'https://www.linkedin.com/in/daniel-cajiao-67184996',
    },
  };

  // Open modal function
  function openModal(projectId) {
    const content = projectContent[projectId];
    if (!content) return;

    // Generate modal content
    modalBody.innerHTML = `
            <h2>${content.title}</h2>
            <p>${content.description}</p>
            <div class="tech-stack">
                ${content.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            ${content.link ? `<p style="margin-top: 2rem;"><a href="${content.link}" target="_blank" rel="noopener noreferrer" style="color: var(--color-accent); text-decoration: underline;">View Project →</a></p>` : ''}
        `;

    // Enable pointer events and animate in
    gsap.set(modal, { pointerEvents: 'auto' });
    gsap.set(modalContent, { scale: 0.8, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(modal, {
      opacity: 1,
      duration: 0.3,
      ease: CONFIG.animations.defaults.ease,
    }).to(
      modalContent,
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.2)',
      },
      '-=0.2',
    );

    // Disable scroll
    document.body.style.overflow = 'hidden';
  }

  // Close modal function
  function closeModal() {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(modal, { pointerEvents: 'none' });
        document.body.style.overflow = '';
      },
    });

    tl.to(modalContent, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: CONFIG.animations.defaults.ease,
    }).to(
      modal,
      {
        opacity: 0,
        duration: 0.2,
      },
      '-=0.1',
    );
  }

  // Event listeners for project links
  projectLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = link.id.replace('-link', '');
      openModal(projectId);
    });
  });

  // Close button
  closeBtn.addEventListener('click', closeModal);

  // Click overlay to close
  modalOverlay.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.pointerEvents === 'auto') {
      closeModal();
    }
  });
}

// Skills scene with Three.js ASCII effect
function initSkillsScene() {
  const skillsCanvas = document.getElementById('skills-canvas');

  if (!skillsCanvas) return;

  // Scene, camera and renderer
  const skillsScene = new THREE.Scene();
  const skillsCamera = new THREE.PerspectiveCamera(10, 1, 0.1, 1000); // Fixed 1:1 aspect ratio, tighter FOV
  const skillsRenderer = new THREE.WebGLRenderer({
    canvas: skillsCanvas,
    antialias: true,
    alpha: true, // Enable transparency
  });
  skillsRenderer.setSize(skillsCanvas.clientWidth, skillsCanvas.clientHeight);
  skillsRenderer.setPixelRatio(window.devicePixelRatio);
  skillsRenderer.setClearColor(0x000000, 0); // Transparent background

  // Create ASCII effect with resolution control
  // Invert: false maps bright pixels (white) to end of string, dark pixels (black) to start
  const asciiEffect = new AsciiEffect(skillsRenderer, ' .<>#', {
    invert: false, // White areas -> #, Black areas -> . (space)
    resolution: 0.17, // Higher resolution = smaller ASCII characters (try 0.2-0.3)
  });
  asciiEffect.setSize(skillsCanvas.clientWidth, skillsCanvas.clientWidth); // Square dimensions
  asciiEffect.domElement.style.color = '#ffffffff';
  asciiEffect.domElement.style.backgroundColor = 'transparent';

  // Replace canvas with ASCII effect's DOM element
  skillsCanvas.parentNode.replaceChild(asciiEffect.domElement, skillsCanvas);
  asciiEffect.domElement.id = 'skills-canvas';

  // Store reference for theme changes
  // asciiEffectElement = asciiEffect.domElement;

  // Create cube geometry (or use IcosahedronGeometry for sphere)
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  // For sphere: const geometry = new THREE.IcosahedronGeometry(4, 1);

  // Load texture (imported at top of file for Vite compatibility)
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(githubTexture);

  // Create custom shader material for contrast adjustment
  const material = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      contrast: { value: 1.5 }, // Increase for more contrast (1.0 = normal, 2.0 = very high)
    },
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform sampler2D map;
            uniform float contrast;
            varying vec2 vUv;
            
            void main() {
                vec4 texColor = texture2D(map, vUv);
                // Apply contrast adjustment
                texColor.rgb = (texColor.rgb - 0.5) * contrast + 0.5;
                // Darken white areas - reduce brightness of light pixels
                texColor.rgb *= 0.6; // Makes white more gray (0.6 = 60% brightness)
                gl_FragColor = texColor;
            }
        `,
    transparent: true,
  });

  // Create mesh
  skillsCube = new THREE.Mesh(geometry, material);
  skillsCube.rotation.x = -Math.PI / 6; // 45°
  skillsCube.rotation.y = -Math.PI / 6; // 45°
  skillsScene.add(skillsCube);

  // Position camera (moved back to accommodate larger mesh)
  skillsCamera.position.z = 15;

  // Animation
  let cameraAngle = 0;
  const cameraDistance = 15;

  const animateSkills = () => {
    requestAnimationFrame(animateSkills);

    // Check if canvas has valid dimensions before rendering
    const width = asciiEffect.domElement.clientWidth;
    const height = asciiEffect.domElement.clientHeight;

    if (width === 0 || height === 0) {
      return; // Skip rendering if canvas has zero dimensions
    }

    // Rotate camera around the cube
    cameraAngle += 0.002;
    skillsCamera.position.x = Math.cos(cameraAngle) * cameraDistance;
    skillsCamera.position.z = Math.sin(cameraAngle) * cameraDistance;
    skillsCamera.lookAt(skillsCube.position);

    // Render with ASCII effect
    asciiEffect.render(skillsScene, skillsCamera);
  };

  animateSkills();

  // Handle resize
  const handleResize = () => {
    const size = Math.min(
      asciiEffect.domElement.clientWidth,
      asciiEffect.domElement.clientHeight,
    );

    // Only update if dimensions are valid
    if (size === 0) return;

    // Keep it square
    skillsCamera.aspect = 1;
    skillsCamera.updateProjectionMatrix();

    // Update renderer and ASCII effect with square dimensions
    skillsRenderer.setSize(size, size);
    asciiEffect.setSize(size, size);
  };

  window.addEventListener('resize', handleResize);

  // Call handleResize after a frame to ensure DOM layout is complete
  requestAnimationFrame(() => handleResize());
}

// Contact form handling
function initForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = form?.querySelector('button[type="submit"]');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');
  const messageDiv = document.getElementById('form-message');

  // Replace with your Google Apps Script web app URL
  const GOOGLE_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycby9a5QcOEHypUP94--YKSuNpppWbBWBvQ7FL6p7ZQmGqVylY-IP4jvV-p6SayEN5Muugg/exec';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form data
      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
        timestamp: new Date().toISOString(),
      };

      // Validate
      if (!formData.name || !formData.email || !formData.message) {
        showFormMessage('Please fill in all fields.', 'error');
        return;
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
      }

      try {
        // Send to Google Sheets
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Google Apps Script requires this
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        // Note: With no-cors mode, we can't read the response
        // Assume success if no error is thrown
        showFormMessage(
          'Thanks! Your message has been sent successfully.',
          'success',
        );
        form.reset();
      } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(
          'Oops! Something went wrong. Please try again or email me directly.',
          'error',
        );
      } finally {
        // Reset button state
        if (submitBtn) {
          submitBtn.disabled = false;
          if (btnText) btnText.style.display = 'inline';
          if (btnLoading) btnLoading.style.display = 'none';
        }
      }
    });
  }

  function showFormMessage(message, type) {
    if (!messageDiv) return;

    messageDiv.textContent = message;
    messageDiv.className = `form-message form-message-${type}`;

    // Animate message in
    gsap.fromTo(
      messageDiv,
      { opacity: 0, y: -10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      },
    );

    // Auto-hide after 5 seconds
    setTimeout(() => {
      gsap.to(messageDiv, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          messageDiv.textContent = '';
          messageDiv.className = 'form-message';
        },
      });
    }, 5000);
  }
}

// Main GSAP animations
function initAnimations() {
  // Set initial states for animations
  if (window.scrollY === 0) {
    gsap.set('.hero-title-line', { y: 50, opacity: 0 });
    gsap.set('.hero-title-highlight', { y: 100, opacity: 0 });
    gsap.set('.hero-description', { y: 50, opacity: 0 });
    gsap.set('.hero-cta', { y: 50, opacity: 0 });
    gsap.set('.scroll-indicator', { opacity: 0 });
    gsap.set('.nav', { y: -100, opacity: 0 });
  } else {
    gsap.set('.hero-opener', { opacity: 0 });
  }

  // Set initial states for sections
  gsap.utils.toArray('.section-title').forEach((title) => {
    gsap.set(title, { y: 50, opacity: 0 });
  });

  // Projects animation setup
  gsap.utils.toArray('.project-link').forEach((project) => {
    gsap.set(project, {
      y: 50,
      opacity: 0,
      pointerEvents: 'none', // Disable pointer events initially
    });
  });

  // About section elements
  // gsap.set('.about-image-wrapper', { scale: 0.8, opacity: 0 });
  // Text visibility handled by SplitText animation
  gsap.set(aboutSplits.words, { opacity: 0 });
  gsap.set('.about-cta', { y: 30, opacity: 0 });

  // Skills section elements
  gsap.set('.skills-category', { y: 30, opacity: 0 });

  // Contact section elements
  gsap.set('.contact-info', { y: 30, opacity: 0 });
  gsap.set('.contact-form', { y: 30, opacity: 0 });
}

// Loading sequence
function startLoadingSequence() {
  const loader = document.querySelector('.loader');
  const loaderProgress = document.querySelector('.loader-progress');

  // Simulate loading progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10);
    if (progress > 100) progress = 100;
    loaderProgress.textContent = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);

      // Hide loader and start page animations
      setTimeout(() => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            loader.style.display = 'none';
            document.body.classList.add('loaded');
            startPageAnimations();
          },
        });
      }, 500);
    }
  }, 100);
}

// Start animations after loading
function startPageAnimations() {
  if (window.scrollY === 0) {
    // Hero section animations
    const heroTimeline = gsap.timeline();

    heroTimeline
      .to('.hero-opener .hero-title-line', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      })
      .to(
        '.hero-opener .hero-title-highlight',
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.1',
      )
      // Fade out the hero-opener
      .to('.hero-opener', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
      // Then show the main hero-title
      .to('.hero-title .hero-title-line', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
      })
      .to(
        '.nav',
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.8',
      )
      .to(
        '.hero-description',
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.8',
      )
      .to(
        '.hero-cta',
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          onStart: () => {
            // Re-enable scroll after hero animations
            document.body.style.overflow = 'auto';
          },
        },
        '-=0.8',
      )
      .to(
        '.scroll-indicator',
        {
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.5',
      );
  } else {
    document.body.style.overflow = 'auto';
  }

  // Bounce animation for scroll indicator
  gsap.to('.scroll-arrow', {
    y: 10,
    duration: 1,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
  });

  // Scroll animations using ScrollTrigger
  // Section titles
  gsap.utils.toArray('.section-title').forEach((title) => {
    gsap.to(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
    });
  });

  // Project animations
  gsap.utils.toArray('.project-link').forEach((project, _index) => {
    gsap.to(project, {
      scrollTrigger: {
        trigger: project,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      onComplete: () => {
        project.style.pointerEvents = 'auto'; // Enable pointer events after animation
      },
    });
  });

  // About section animations
  const aboutTrigger = {
    trigger: '.about',
    start: 'top 70%',
  };

  // now animate the words in a staggered fashion
  gsap.to(aboutSplits.words, {
    scrollTrigger: aboutTrigger,
    duration: 1,
    autoAlpha: 1, // fade in to visible
    stagger: 0.05, // 0.05 seconds between each
    ease: 'power3.out',
    onComplete: () => {
      gsap.to('.about-cta', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      });
    },
  });

  // Skills section animations
  gsap.to('.skills-category', {
    scrollTrigger: {
      trigger: '.skills',
      start: 'top 70%',
    },
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
  });

  // Contact section animations
  const contactTrigger = {
    trigger: '.contact',
    start: 'top 70%',
  };

  gsap.to('.contact-info', {
    scrollTrigger: contactTrigger,
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.to('.contact-form', {
    scrollTrigger: contactTrigger,
    y: 0,
    opacity: 1,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out',
  });
}

// Smooth scrolling with Lenis
function _initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Connect Lenis to ScrollTrigger
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(...args) {
      if (args.length) {
        lenis.scrollTo(args[0]);
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  // Update ScrollTrigger on scroll
  lenis.on('scroll', ScrollTrigger.update);

  // Define the animation loop that will run Lenis
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Remove the default RAF because we're handling it with gsap.ticker
  // This ensures GSAP and Lenis are in sync
  gsap.ticker.lagSmoothing(0);

  // Handle navigation click for smooth scrolling
  document
    .querySelectorAll('nav a, .hero-cta a, .scroll-indicator')
    .forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
          lenis.scrollTo(target, {
            offset: 0,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          });
        }
      });
    });
}

// Handle window resize for ScrollTrigger
window.addEventListener('resize', () => {
  // Debounce the resize event
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(() => {
    // Refresh ScrollTrigger
    ScrollTrigger.refresh(true);
  }, 250);
});

// Export for potential reuse in other modules
export { init };
