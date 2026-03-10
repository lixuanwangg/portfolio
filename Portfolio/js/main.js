/* ============================================================
   LILY WANG — PORTFOLIO JAVASCRIPT
   Navigation, animations, carousel, contact form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. MOBILE NAVIGATION
       ========================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.navbar__link');

    function closeMenu() {
        navMenu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    }

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        hamburger.classList.toggle('is-active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('no-scroll', isOpen);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    /* ==========================================
       2. SCROLL PROGRESS BAR
       ========================================== */
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollHeight > 0) {
            const progress = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = progress + '%';
        }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    /* ==========================================
       3. SCROLL-REVEAL ANIMATIONS
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* Staggered animation for grid children */
    document.querySelectorAll('.skills-grid, .projects-grid, .video-grid').forEach(grid => {
        Array.from(grid.children).forEach((child, index) => {
            child.style.transitionDelay = (index * 0.1) + 's';
            child.classList.add('reveal');
            revealObserver.observe(child);
        });
    });

    /* ==========================================
       4. ACTIVE NAV LINK HIGHLIGHTING
       ========================================== */
    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'is-active',
                        link.getAttribute('href') === '#' + id
                    );
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-70px 0px -50% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

    /* ==========================================
       5. SPLIDE CAROUSEL
       ========================================== */
    if (typeof Splide !== 'undefined') {
        new Splide('#brandCarousel', {
            type:         'loop',
            perPage:      3,
            perMove:      1,
            gap:          '1.5rem',
            padding:      '1rem',
            autoplay:     true,
            interval:     4000,
            pauseOnHover: true,
            pauseOnFocus: true,
            speed:        800,
            easing:       'cubic-bezier(0.25, 0.1, 0.25, 1)',
            pagination:   true,
            arrows:       true,
            drag:         true,
            snap:         true,
            lazyLoad:     'nearby',

            breakpoints: {
                1024: {
                    perPage: 2,
                    gap:     '1rem',
                    padding: '0.5rem',
                },
                640: {
                    perPage: 1,
                    gap:     '0.75rem',
                    padding: '0.5rem',
                },
            },
        }).mount();
    }

    /* ==========================================
       6. CONTACT FORM (MAILTO)
       ========================================== */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name    = formData.get('name');
            const email   = formData.get('email');
            const subject = formData.get('subject') || 'Portfolio Inquiry';
            const message = formData.get('message');

            const mailtoLink = 'mailto:lilywanglixuan@gmail.com'
                + '?subject=' + encodeURIComponent(subject)
                + '&body='    + encodeURIComponent(
                    'From: ' + name + '\nEmail: ' + email + '\n\n' + message
                );

            window.location.href = mailtoLink;
        });
    }

});
