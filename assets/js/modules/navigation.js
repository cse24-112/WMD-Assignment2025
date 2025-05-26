// Navigation module
export function initNavigation() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('nav a');

    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize header scroll effects
    initHeaderScroll();

    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerOffset = header.offsetHeight;
                        const elementPosition = target.offsetTop;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Close mobile menu if open
                        closeMobileMenu();
                    }
                }
            });
        });
    }

    function initMobileMenu() {
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
            
            // Close menu on outside click
            document.addEventListener('click', (e) => {
                if (nav.classList.contains('active') && 
                    !nav.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }
    }

    function toggleMobileMenu() {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Animate menu items
        const menuItems = nav.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            if (nav.classList.contains('active')) {
                item.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
            } else {
                item.style.animation = '';
            }
        });
    }

    function closeMobileMenu() {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function initHeaderScroll() {
        let lastScroll = 0;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }

            scrollTimeout = window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                // Add/remove scrolled class
                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Hide/show header on scroll
                if (!nav.classList.contains('active')) { // Don't hide header when menu is open
                    if (currentScroll > lastScroll && currentScroll > 100) {
                        header.style.transform = 'translateY(-100%)';
                    } else {
                        header.style.transform = 'translateY(0)';
                    }
                }

                lastScroll = currentScroll;
            });
        });
    }
} 