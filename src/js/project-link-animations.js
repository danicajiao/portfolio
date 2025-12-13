import { gsap } from 'gsap';

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Safely gets DOM elements for a project
 * @param {string} projectId - Project identifier
 * @returns {Object} Object containing DOM element references
 */
const getProjectElements = (projectId) => {
    const bg = document.getElementById(`${projectId}-bg`);
    const leftPanel = document.getElementById(`${projectId}-panel-left`);
    const rightPanel = document.getElementById(`${projectId}-panel-right`);

    if (!bg) {
        console.warn(`[getProjectElements] Missing background element for project: "${projectId}"`);
    }

    if (!leftPanel) {
        console.warn(`[getProjectElements] Missing left panel element for project: "${projectId}"`);
    }

    if (!rightPanel) {
        console.warn(`[getProjectElements] Missing right panel element for project: "${projectId}"`);
    }

    return {
        bg,
        leftPanel,
        rightPanel
    }
};

/**
 * Gets Schwab-specific DOM elements for animations
 * @returns {Object} Object containing Schwab animation element references
 */
const getSchwabSpecificElements = () => {
    const circle = document.getElementById('circle-svg');
    const squares = document.querySelectorAll('.grid-square');
    const spinners = document.querySelectorAll('.spinner');
    const inProgressIndicators = document.querySelectorAll('.in-progress-indicator');
    const successIndicators = document.querySelectorAll('.success-indicator');

    if (!circle) {
        console.warn('[getSchwabSpecificElements] Missing circle-svg element');
    }

    if (squares.length === 0) {
        console.warn('[getSchwabSpecificElements] No grid-square elements found');
    }

    if (spinners.length === 0) {
        console.warn('[getSchwabSpecificElements] No spinner elements found');
    }

    if (inProgressIndicators.length === 0) {
        console.warn('[getSchwabSpecificElements] No in-progress-indicator elements found');
    }

    if (successIndicators.length === 0) {
        console.warn('[getSchwabSpecificElements] No success-indicator elements found');
    }


    return {
        circle,
        squares,
        spinners,
        inProgressIndicators,
        successIndicators
    };
};

/**
 * Gets Cove-specific DOM elements for animations
 * @returns {Object} Object containing Cove animation element references
 */
const getCoveSpecificElements = () => {
    const spinner = document.getElementById('cove-geo-1');

    if (!spinner) {
        console.warn('[getCoveSpecificElements] Missing spinner element');
    }

    return {
        spinner
    };
};

// ============================================================================
// PROJECT ANIMATION STRATEGIES
// ============================================================================

/**
 * Schwab project animations
 */
const schwabAnimations = {
    enter: (projectId, config) => {
        const { bg, leftPanel, rightPanel } = getProjectElements(projectId);
        const { circle, squares, spinners, inProgressIndicators, successIndicators } = getSchwabSpecificElements();

        if (!bg) return;

        gsap.to(bg, {
            opacity: 1
        });

        gsap.to([leftPanel, rightPanel].filter(Boolean), {
            opacity: 1
        });

        animateGridSquares(squares);

        gsap.fromTo(spinners,
            {
                rotate: 0
            },
            {
                rotate: 360,
                duration: 1,
                ease: 'linear',
                repeat: -1,
                transformOrigin: 'center center'
            }
        );

        let timeline = gsap.timeline();

        timeline.to(circle, {
            motionPath: {
                path: "#line-path0",
                start: 1,
                end: 0  
            },
            duration: 3
        }).to(successIndicators[0], {
            opacity: 1,
        },).to(inProgressIndicators[0], {
            opacity: 0,
        }, "<").to(circle, {
            motionPath: {
                path: "#line-path1",
                start: 1,
                end: 0
            },
            duration: 3
        }).to(successIndicators[1], {
            opacity: 1,
        },).to(inProgressIndicators[1], {
            opacity: 0,
        }, "<").to(circle, {
            motionPath: {
                path: "#line-path2",
                start: 0,
                end: 1
            },
            duration: 3
        }).to(successIndicators[2], {
            opacity: 1,
        },).to(inProgressIndicators[2], {
            opacity: 0,
        }, "<").to(circle, {
            motionPath: {
                path: "#line-path3",
                start: 1,
                end: 0
            },
            duration: 3
        }).to(successIndicators[3], {
            opacity: 1,
        },).to(inProgressIndicators[3], {
            opacity: 0,
        }, "<").to(circle, {
            motionPath: {
                path: "#line-path4",
                start: 1,
                end: 0
            },
            duration: 3
        });
    },

    leave: (projectId, config) => {
        const { bg, leftPanel, rightPanel } = getProjectElements(projectId);
        const elements = [bg, leftPanel, rightPanel].filter(Boolean);

        if (elements.length === 0) return;

        const { circle, squares, spinners, inProgressIndicators, successIndicators } = getSchwabSpecificElements();

        gsap.killTweensOf([circle, squares, spinners, inProgressIndicators, successIndicators]);

        // gsap.set(bg, { opacity: 0 });
        gsap.set(squares, { fill: 'none' });
        gsap.set(inProgressIndicators, { opacity: 1 });
        gsap.set(successIndicators, { opacity: 0 });
    }
};

const animateGridSquares = (squares) => {
    // const { squares } = getSchwabSpecificElements();

    squares.forEach((square, index) => {
        // Only animate 1/10th of the squares (10% chance)
        if (Math.random() < 0.1) {
            // Random delay for each square
            const delay = Math.random() * 5;

            gsap.to(square, {
                fill: () => {
                    const colors = [
                        'rgba(0, 149, 255, 0.23)',   // Blue
                    ];
                    return colors[Math.floor(Math.random() * colors.length)];
                },
                duration: 2,
                delay: delay,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut'
            });
        }
    });
}

/**
 * Cove project animations
 */
const coveAnimations = {
    enter: (projectId, config) => {
        const { bg, leftPanel, rightPanel } = getProjectElements(projectId);
        const { spinner } = getCoveSpecificElements();

        if (!bg) return;

        gsap.to(bg, {
            opacity: 1
        });

        gsap.to([leftPanel, rightPanel].filter(Boolean), {
            opacity: 1
        });

        gsap.fromTo(spinner,
            {
                rotate: 0
            },
            {
                rotate: 90,
                delay: 1,
                ease: 'elastic.inOut',
                duration: 2,
                repeat: -1,
                repeatDelay: 1,
                transformOrigin: 'center center' // Use center instead of pixel coordinates
            }
        );
    },

    leave: (projectId, config) => {
        const { bg, leftPanel, rightPanel } = getProjectElements(projectId);
        const elements = [bg, leftPanel, rightPanel].filter(Boolean);

        if (elements.length === 0) return;

        const { spinner } = getCoveSpecificElements();

        gsap.killTweensOf([spinner]);

        // gsap.set(bg, { opacity: 0 });
    }
};

/**
 * Schwapp project animations
 */
const schwappAnimations = {
    enter: (projectId, config) => {
        const { bg, leftPanel, rightPanel } = getProjectElements(projectId);

        if (!bg) return;

        gsap.to(bg, {
            opacity: 1
        });

        gsap.to([leftPanel, rightPanel].filter(Boolean), {
            opacity: 1
        });
    },
}

// ============================================================================
// ANIMATION REGISTRY
// ============================================================================

/**
 * Central registry mapping project IDs to their animation strategies
 * @type {Object.<string, {enter: Function, leave: Function}>}
 */
const PROJECT_ANIMATIONS = {
    schwab: schwabAnimations,
    cove: coveAnimations,
    // Add new projects here:
    schwapp: schwappAnimations,
    // safelinc: safelincAnimations,
    // letics: leticsAnimations,
};

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Main animation controller for project hover interactions
 * Delegates to project-specific animation strategies
 * 
 * @param {string} projectId - Project ID (e.g., 'schwab')
 * @param {boolean} isEnter - True for mouseenter, false for mouseleave
 * @param {Object} config - Configuration object from main.js
 * @returns {gsap.core.Timeline|gsap.core.Tween|null} GSAP animation instance or null
 * 
 * @example
 * // In main.js
 * projectLink.addEventListener('mouseenter', () => {
 *   animateProject('schwab-link', true, CONFIG);
 * });
 */
export const animateProject = (projectId, action, config) => {
    const animations = PROJECT_ANIMATIONS[projectId];

    if (!animations) {
        console.warn(`[animateProject] No animations defined for project: "${projectId}"`);
        return;
    }

    const animationFn = action == 'enter' ? animations.enter : animations.leave;

    try {
        return animationFn(projectId, config);
    } catch (error) {
        console.error(`[animateProject] Error animating ${projectId}:`, error);
        return;
    }
};

/**
 * Get list of all registered projects
 * @returns {string[]} Array of project IDs
 */
export const getRegisteredProjects = () => Object.keys(PROJECT_ANIMATIONS);

/**
 * Check if a project has animations registered
 * @param {string} projectId - Project identifier
 * @returns {boolean} True if project has animations
 */
export const hasProjectAnimations = (projectId) => projectId in PROJECT_ANIMATIONS;
