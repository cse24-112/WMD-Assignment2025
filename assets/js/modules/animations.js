// Animation Constants
const ANIMATION_CONSTANTS = {
  DURATION: {
    FAST: 300,
    NORMAL: 500,
    SLOW: 800,
    COUNTER: 2000
  },
  THRESHOLD: 0.1,
  SCROLL_RATE: 0.5,
  PARTICLES: {
    COUNT: 80,
    SPEED: 2,
    SIZE: 3,
    DISTANCE: 150
  }
};

// Animations module
export function initAnimations() {
    // Initialize intersection observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: ANIMATION_CONSTANTS.THRESHOLD
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Handle counter animations
                if (entry.target.classList.contains('achievement-number')) {
                    animateAchievementNumber(entry.target);
                }
                
                // Handle staggered animations
                if (entry.target.dataset.stagger) {
                    handleStaggeredAnimation(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.fade-in, .fade-in-up, .slide-in-left, .slide-in-right, .scale-in, .achievement-number'
    );
    
    animatedElements.forEach(el => animationObserver.observe(el));
}

// Achievement number animation function
function animateAchievementNumber(numberElement) {
    if (numberElement.dataset.animated === 'true') return;
    
    numberElement.dataset.animated = 'true';
    const target = parseInt(numberElement.dataset.target);
    const duration = ANIMATION_CONSTANTS.DURATION.COUNTER;
    let start = 0;
    let startTime = null;

    function easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    function updateNumber(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.floor(easedProgress * (target - start) + start);
        
        numberElement.textContent = currentValue.toLocaleString();
        numberElement.classList.add('animate');

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

// Handle staggered animations for child elements
function handleStaggeredAnimation(container) {
    const children = container.children;
    const delay = parseFloat(container.dataset.staggerDelay || 0.1);
    
    Array.from(children).forEach((child, index) => {
        child.style.animationDelay = `${index * delay}s`;
        child.classList.add('animate');
    });
}

// Parallax effect function
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxElements.forEach(element => {
                    const speed = parseFloat(element.dataset.parallax || ANIMATION_CONSTANTS.SCROLL_RATE);
                    const rect = element.getBoundingClientRect();
                    const visible = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (visible) {
                        const yOffset = window.pageYOffset;
                        const parallaxOffset = -(yOffset * speed);
                        element.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Hero Section Animations
export function initHero() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: ANIMATION_CONSTANTS.PARTICLES.COUNT,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    animation: {
                        enable: true,
                        speed: 1,
                        minimumValue: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: ANIMATION_CONSTANTS.PARTICLES.SIZE,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: ANIMATION_CONSTANTS.PARTICLES.DISTANCE,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: ANIMATION_CONSTANTS.PARTICLES.SPEED,
                    direction: 'none',
                    random: false,
                    straight: false,
                    outMode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detectsOn: 'canvas',
                events: {
                    onHover: {
                        enable: true,
                        mode: 'grab'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        lineLinked: {
                            opacity: 1
                        }
                    }
                }
            },
            retina_detect: true
        });
    }

    initSmoothScroll();
    initHeroParallax();
    initHeroCards();
}

function initSmoothScroll() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.welcome-section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * ANIMATION_CONSTANTS.SCROLL_RATE;
            hero.style.backgroundPosition = `center ${rate}px`;
        });
    }
}

function initHeroCards() {
    const heroCards = document.querySelectorAll('.hero-card');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: ANIMATION_CONSTANTS.THRESHOLD
    };

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => {
                    const value = stat.textContent;
                    animateValue(stat, 0, parseInt(value), ANIMATION_CONSTANTS.DURATION.COUNTER);
                });
                
                heroObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    heroCards.forEach(card => heroObserver.observe(card));
}

function animateValue(element, start, end, duration) {
    if (start === end) return;
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Export all initialization functions
export {
    initParallax,
    animateValue
}; 