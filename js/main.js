/* ============================================================
   LILY WANG — PORTFOLIO JAVASCRIPT
   Navigation, animations, contact form
   ============================================================ */

document.addEventListener('contentRendered', () => {

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
       5. CONTACT FORM (MAILTO)
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