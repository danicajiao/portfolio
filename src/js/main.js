// main.js
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from '@studio-freight/lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Set defaults for ScrollTrigger
ScrollTrigger.defaults({
    scroller: document.body,
    markers: false // Set to true for debugging
});

// Initialize variables
let camera, scene, renderer;
let heroMesh, skillsSphere;
let particles;
const loader = new THREE.TextureLoader();
let projectHovered = false;

// Initialize page when loaded
window.addEventListener('load', init);
function init() {
    // Initialize smooth scrolling first
    // initSmoothScroll();

    // Initialize animations (sets initial states)
    initAnimations();

    // Initialize custom cursor
    initCursor();

    // Initialize 3D scenes
    initHeroScene();
    initSkillsScene();

    // Initialize project hover effects with GSAP
    initProjectHovers();

    // Initialize interactive elements
    initNavigation();
    initForm();

    // Force ScrollTrigger to recalculate all scrollbar-related measurements
    ScrollTrigger.refresh(true);

    // Start loading sequence (will trigger animations when complete)
    startLoadingSequence();
}

// Smooth scrolling with Lenis
function initSmoothScroll() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Connect Lenis to ScrollTrigger
    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            if (arguments.length) {
                lenis.scrollTo(value);
            }
            return lenis.scroll;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
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
    document.querySelectorAll('nav a, .hero-cta a, .scroll-indicator').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                lenis.scrollTo(target, {
                    offset: 0,
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });
}

// Custom cursor
function initCursor() {
    const cursor = document.querySelector('.cursor');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.05
        });
    });

    document.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
    });

    document.addEventListener('mouseleave', () => {
        gsap.to(cursor, { opacity: 0, duration: 0.3 });
    });

    // Hover effect for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .project, .social-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1.5, duration: 0.3 });
            cursor.classList.add('hovered');
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
            cursor.classList.remove('hovered');
        });
    });
}

// Mobile navigation
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Navigation background change on scroll
    const nav = document.querySelector('.nav');

    // Set initial state for nav
    gsap.set(nav, {
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        padding: '2rem 0',
        boxShadow: 'none'
    });

    window.addEventListener('scroll', () => {
        // Only change nav color on scroll if no project is being hovered
        // if (!projectHovered) {
            if (window.scrollY > 100) {
                gsap.to(nav, {
                    // backgroundColor: '#ffffffe6',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem 0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    duration: 0.3
                });
            } else {
                gsap.to(nav, {
                    // backgroundColor: 'transparent',
                    backdropFilter: 'none',
                    padding: '2rem 0',
                    boxShadow: 'none',
                    duration: 0.3
                });
            }
        // }
    });
}

// Contact form handling
function initForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            // Here you would typically handle the form submission
            // This is a placeholder for actual form handling
            alert('Form submitted! In a real application, this would send your message.');
        });
    }
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
                    }
                });
            }, 500);
        }
    }, 100);
}

// Main GSAP animations
function initAnimations() {
    // Set initial states for animations
    gsap.set('.hero-title-line', { y: 50, opacity: 0 });
    gsap.set('.hero-title-highlight', { y: 100, opacity: 0 });
    gsap.set('.hero-description', { y: 50, opacity: 0 });
    gsap.set('.hero-cta', { y: 50, opacity: 0 });
    gsap.set('.scroll-indicator', { opacity: 0 });
    gsap.set('.nav', { y: -100, opacity: 0 });

    // Set initial states for sections
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.set(title, { y: 50, opacity: 0 });
    });

    // Projects animation setup
    gsap.utils.toArray('.project-titles-list a').forEach(project => {
        gsap.set(project, { 
            y: 50,
            opacity: 0,
            pointerEvents: 'none' // Disable pointer events initially 
        });
    });

    // About section elements
    gsap.set('.about-image-wrapper', { scale: 0.8, opacity: 0 });
    gsap.set('.about-text p', { y: 30, opacity: 0 });
    gsap.set('.about-cta', { y: 30, opacity: 0 });

    // Skills section elements
    gsap.set('.skills-category', { y: 30, opacity: 0 });

    // Contact section elements
    gsap.set('.contact-info', { x: -50, opacity: 0 });
    gsap.set('.contact-form', { x: 50, opacity: 0 });
}

// Start animations after loading
function startPageAnimations() {
    // Hero section animations
    const heroTimeline = gsap.timeline();

    heroTimeline
        .to('.hero-title-line', {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out'
        })
        .to('.hero-title-highlight', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5')
        .to('.nav', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        })
        .to('.hero-description', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8')
        .to('.hero-cta', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8')
        .to('.scroll-indicator', {
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5');

    // Bounce animation for scroll indicator
    gsap.to('.scroll-arrow', {
        y: 10,
        duration: 1,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    });

    // Scroll animations using ScrollTrigger
    // Section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.to(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
        });
    });

    // Project animations
    gsap.utils.toArray('.project-titles-list a').forEach((project, index) => {
        gsap.to(project, {
            scrollTrigger: {
                trigger: project,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 0,
            opacity: 1,
            duration: 1,
            delay: index * 0.2,
            ease: 'power3.out',
            onComplete: () => {
                project.style.pointerEvents = 'auto'; // Enable pointer events after animation
            }
        });
    });

    // About section animations
    const aboutTrigger = {
        trigger: '.about',
        start: 'top 70%'
    };

    gsap.to('.about-image-wrapper', {
        scrollTrigger: aboutTrigger,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'back.out(1.5)'
    });

    gsap.to('.about-text p', {
        scrollTrigger: aboutTrigger,
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    gsap.to('.about-cta', {
        scrollTrigger: aboutTrigger,
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
    });

    // Skills section animations
    gsap.to('.skills-category', {
        scrollTrigger: {
            trigger: '.skills',
            start: 'top 70%'
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Contact section animations
    const contactTrigger = {
        trigger: '.contact',
        start: 'top 70%'
    };

    gsap.to('.contact-info', {
        scrollTrigger: contactTrigger,
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.to('.contact-form', {
        scrollTrigger: contactTrigger,
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
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
                const edgeThreshold = 5; // Number of cells from edge considered 'edge'
                const isEdge = x < edgeThreshold || x >= cols - edgeThreshold || y < edgeThreshold || y >= rows - edgeThreshold;
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
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (grid[y][x]) {
                    ctx.fillStyle = '#00000010'; // Even lighter transparent black (0x10 = ~6% opacity)
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
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

// Add this to your init function or create a new function called from init
function initProjectHovers() {
    const projectLinks = document.querySelectorAll('.project-titles-list a');
    const visualBlock = document.querySelector('.project-visual-block');
    const projectList = document.querySelector('.project-titles-list');
    const nav = document.querySelector('.nav');
    const heroCanvas = document.getElementById('hero-canvas');

    // Define project colors
    const projectColors = {
        'charles-schwab': '#c7edff',
        'cove': '#ffe6cb',
        'schwapp': '#c7edff',
        'safelinc': '#3FB550',
        'letics': '#FF4B4B'
    };

    // Track current state
    let activeProjectId = null;
    let isBlockVisible = false;

    // Set initial state
    gsap.set(visualBlock, {
        transformOrigin: 'right center',
        translateX: '20%',
        opacity: 0
    });

    // Hide all visuals initially
    document.querySelectorAll('.project-visual').forEach(visual => {
        gsap.set(visual, { opacity: 0 });
    });

    projectLinks.forEach(link => {
        // Extract project name from ID
        const projectId = link.id.replace('-link', '');

        // Mouse enter animation
        link.addEventListener('mouseenter', (event) => {
            // If a project is already hovered, don't do anything
            if (!projectHovered) projectHovered = true;

            // Kill any ongoing animations
            gsap.killTweensOf('body');
            gsap.killTweensOf(visualBlock);
            document.querySelectorAll('.project-visual').forEach(visual => {
                gsap.killTweensOf(visual);
            });
            gsap.killTweensOf(link);

            // Update state
            activeProjectId = projectId;

            // Hide all visuals
            document.querySelectorAll('.project-visual').forEach(visual => {
                visual.style.opacity = 0;
            });

            // Show the relevant visual
            const projectVisual = document.getElementById(`${projectId}-visual`);
            if (projectVisual) {
                gsap.fromTo(projectVisual,
                    { opacity: 0 }, // ✅ Only "from" properties
                    {
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power2.out'
                    }
                );
            }

            gsap.to(heroCanvas, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut'
            });

            // Smoothly transition body background color
            gsap.to('body', {
                backgroundColor: projectColors[projectId],
                duration: 0.2,
                ease: 'power2.inOut'
            });

            // Show the visual block
            gsap.fromTo(visualBlock,
                {
                    opacity: 0,
                    translateX: '20%'
                },
                {
                    opacity: 1,
                    translateX: '0%',
                    duration: 0.4,
                    ease: 'power2.inOut',
                    onStart: () => {
                        isBlockVisible = true;
                        activeProjectId = projectId;
                    }
                }
            );

            // Create underline effect similar to nav links
            // First ensure there's a pseudo-element to animate
            if (!link.querySelector('.link-underline')) {
                const underline = document.createElement('span');
                underline.classList.add('link-underline');
                underline.style.position = 'absolute';
                underline.style.bottom = '-5px';
                underline.style.left = '0';
                underline.style.width = '100%';
                underline.style.height = '4px';
                underline.style.backgroundColor = '#333333';
                underline.style.transformOrigin = 'right';
                underline.style.transform = 'scaleX(0)';
                link.style.position = 'relative';
                link.appendChild(underline);
            }

            // Animate the underline
            gsap.to(link.querySelector('.link-underline'), {
                transformOrigin: 'left',
                scaleX: 1,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        });

        // Reset the project link on mouse leave
        link.addEventListener('mouseleave', (event) => {
            projectHovered = false;

            console.log(event.target);
            console.log(event.relatedTarget);

            gsap.killTweensOf('body');
            gsap.killTweensOf(nav);
            gsap.killTweensOf(visualBlock);
            gsap.killTweensOf(heroCanvas);

            // If the mouse is leaving the project link and not going to another project link
            if ( event.target.classList.contains('project-title') !== event.relatedTarget.classList.contains('project-title') ) {
                // Reset state
                gsap.set('body', { backgroundColor: '#ffffff' });
                // gsap.set(nav, { backgroundColor: '#ffffff' });
                gsap.set(visualBlock, { opacity: 0 });
                gsap.set(heroCanvas, { opacity: 1 });
            }
            // Reset underline
            if (link.querySelector('.link-underline')) {
                gsap.to(link.querySelector('.link-underline'), {
                    scaleX: 0,
                    duration: 0.3,
                    transformOrigin: 'right',
                    ease: 'power2.inOut',
                });
            }
        });
    });
}

// Skills scene with Three.js
function initSkillsScene() {
    const skillsCanvas = document.getElementById('skills-canvas');

    if (!skillsCanvas) return;

    // Scene, camera and renderer
    const skillsScene = new THREE.Scene();
    const skillsCamera = new THREE.PerspectiveCamera(75, skillsCanvas.clientWidth / skillsCanvas.clientHeight, 0.1, 1000);
    const skillsRenderer = new THREE.WebGLRenderer({ canvas: skillsCanvas, alpha: true, antialias: true });
    skillsRenderer.setSize(skillsCanvas.clientWidth, skillsCanvas.clientHeight);
    skillsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create sphere geometry
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial({
        color: 0x4f46e5,
        wireframe: true,
        emissive: 0x4f46e5,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    // Create mesh
    skillsSphere = new THREE.Mesh(geometry, material);
    skillsScene.add(skillsSphere);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    skillsScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4f46e5, 1);
    pointLight.position.set(2, 2, 2);
    skillsScene.add(pointLight);

    // Position camera
    skillsCamera.position.z = 2.5;

    // Scroll-based animation
    ScrollTrigger.create({
        trigger: '.skills',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
            // Rotate sphere based on scroll position
            skillsSphere.rotation.y = self.progress * Math.PI * 2;
        }
    });

    // Animation
    const animateSkills = () => {
        requestAnimationFrame(animateSkills);

        // Continuous slight rotation
        skillsSphere.rotation.x += 0.002;

        // Render
        skillsRenderer.render(skillsScene, skillsCamera);
    };

    animateSkills();

    // Handle resize
    const handleResize = () => {
        const width = skillsCanvas.clientWidth;
        const height = skillsCanvas.clientHeight;

        // Update camera
        skillsCamera.aspect = width / height;
        skillsCamera.updateProjectionMatrix();

        // Update renderer
        skillsRenderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
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
