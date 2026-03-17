/* ============================================================
   RENDER ENGINE — Builds the portfolio DOM from data.json
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Check localStorage first (for admin preview), then use the global from data.js
    const preview = localStorage.getItem('portfolioPreview');
    let data;
    if (preview) {
        data = JSON.parse(preview);
        localStorage.removeItem('portfolioPreview');
    } else {
        data = PORTFOLIO_DATA;
    }

    // Helper: escape HTML for safe textContent-like insertion via innerHTML
    function esc(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    const main = document.getElementById('mainContent');

    /* === NAVBAR === */
    const navInner = document.getElementById('navbarInner');
    navInner.innerHTML = `
        <a href="#hero" class="navbar__logo">${esc(data.hero.name)}</a>
        <ul class="navbar__menu" id="navMenu">
            <li><a href="#engineering" class="navbar__link">Professional</a></li>
            <li><a href="#modelling" class="navbar__link">Creative</a></li>
            <li><a href="#experience-pt" class="navbar__link">Part-Time</a></li>
            <li><a href="#contact" class="navbar__link">Contact</a></li>
        </ul>
        <button class="navbar__hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>`;

    /* === HERO === */
    const hero = data.hero;
    main.innerHTML += `
    <section class="hero" id="hero">
        <div class="hero__content container">
            <p class="hero__eyebrow reveal">${esc(hero.eyebrow)}</p>
            <h1 class="hero__title reveal">
                ${esc(hero.name)}
                <span class="hero__title--chinese">${esc(hero.nickname)}</span>
            </h1>
            <p class="hero__subtitle reveal">${esc(hero.subtitle)}</p>
            <p class="hero__intro reveal">${esc(hero.intro)}</p>
            <div class="hero__cta reveal">
                ${hero.ctaButtons.map(b =>
                    `<a href="${esc(b.href)}" class="btn btn--${b.style}">${esc(b.label)}</a>`
                ).join('')}
            </div>
        </div>
    </section>`;

    /* === ENGINEERING === */
    const eng = data.engineering;
    main.innerHTML += `
    <section class="section engineering" id="engineering">
        <div class="container">
            <h2 class="section__title reveal">${esc(eng.sectionTitle)}</h2>
            <p class="section__subtitle reveal">${esc(eng.sectionSubtitle)}</p>

            <div class="engineering__education reveal">
                ${eng.education.map(e => `
                    <div class="education-card">
                        <h3>${esc(e.degree)}</h3>
                        <p class="education-card__school">${esc(e.school)}</p>
                        <p class="education-card__year">${esc(e.year)}</p>
                        <p class="education-card__details">${esc(e.details)}</p>
                    </div>`).join('')}
            </div>

            <div class="engineering__skills reveal">
                <h3 class="subsection-title">Technical Skills</h3>
                <div class="skills-grid">
                    ${eng.skills.map(s => `
                        <div class="skill-card">
                            <div class="skill-card__icon">${esc(s.icon)}</div>
                            <h4 class="skill-card__name">${esc(s.name)}</h4>
                            <p class="skill-card__desc">${esc(s.desc)}</p>
                        </div>`).join('')}
                </div>
            </div>

            <div class="engineering__languages reveal">
                <h3 class="subsection-title">Languages</h3>
                <div class="languages-list">
                    ${eng.languages.map(l => `
                        <div class="language-item">
                            <span class="language-item__name">${esc(l.name)}</span>
                            <span class="language-item__level">${esc(l.level)}</span>
                        </div>`).join('')}
                </div>
            </div>

            <div class="engineering__projects reveal">
                <h3 class="subsection-title">Projects</h3>
                <div class="projects-grid">
                    ${eng.projects.map(p => `
                        <div class="project-card">
                            <h4 class="project-card__title">${esc(p.title)}</h4>
                            <p class="project-card__desc">${esc(p.desc)}</p>
                            <div class="project-card__tags">
                                ${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
                            </div>
                        </div>`).join('')}
                </div>
            </div>

            <div class="engineering__experience reveal">
                <h3 class="subsection-title">Professional Experience</h3>
                <div class="timeline">
                    ${eng.professionalExperience.map(exp => `
                        <div class="timeline__item reveal">
                            <div class="timeline__marker"></div>
                            <div class="timeline__content">
                                <span class="timeline__date">${esc(exp.date)}</span>
                                <h3 class="timeline__role">${esc(exp.role)}</h3>
                                <h4 class="timeline__company">${esc(exp.company)}</h4>
                                <ul class="timeline__list">
                                    ${exp.bullets.map(b => `<li>${esc(b)}</li>`).join('')}
                                </ul>
                            </div>
                        </div>`).join('')}
                </div>
            </div>
        </div>
    </section>`;

    /* === CREATIVE === */
    const cr = data.creative;

    // Helper: parse crop string "posX posY;zoom" into object-position style
    function cropStyle(crop) {
        if (!crop) return '';
        const parts = crop.split(';');
        const pos = parts[0] || '50 50';
        return `object-position: ${pos.split(/\s+/).map(v => v + '%').join(' ')}`;
    }

    function renderCategory(cat) {
        if (cat.type === 'photo-carousel') {
            return cat.groups.map(g => `
                <div class="photo-group">
                    <h4 class="photo-group-title">${g.link ? `<a href="${esc(g.link)}" target="_blank" rel="noopener">${esc(g.title)}</a>` : esc(g.title)} <span class="photo-group-date">${esc(g.date)}</span></h4>
                    <div class="photo-carousel">
                        ${g.images.map(img => {
                            const src = typeof img === 'string' ? img : img.src;
                            const crop = typeof img === 'object' ? img.crop : null;
                            return `<img src="${esc(src)}" alt="${esc(g.title)}" loading="lazy" style="${cropStyle(crop)}">`;
                        }).join('')}
                    </div>
                </div>`).join('');
        }
        if (cat.type === 'video-grid') {
            return `<div class="video-grid">
                ${cat.items.map(v => `
                    <div class="video-card">
                        <iframe src="https://www.youtube.com/embed/${esc(v.youtubeId)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
                        <div class="video-card__caption">
                            <p class="video-card__title">${v.link ? `<a href="${esc(v.link)}" target="_blank" rel="noopener">${esc(v.caption)}</a>` : esc(v.caption)}</p>
                            <p class="video-card__date">${esc(v.date)}</p>
                        </div>
                    </div>`).join('')}
            </div>`;
        }
        if (cat.type === 'canvas-grid') {
            return `<div class="photo-carousel">
                ${cat.items.map(c => `
                    <div class="canvas-card">
                        <img src="${esc(c.src)}" alt="${esc(c.caption)}" loading="lazy" style="${cropStyle(c.crop)}">
                        <p class="canvas-card__caption">${c.link ? `<a href="${esc(c.link)}" target="_blank" rel="noopener">${esc(c.caption)}</a>` : esc(c.caption)}</p>
                        <p class="canvas-card__date">${esc(c.date)}</p>
                    </div>`).join('')}
            </div>`;
        }
        return '';
    }

    main.innerHTML += `
    <section class="section modelling" id="modelling">
        <div class="container">
            <h2 class="section__title reveal">${esc(cr.sectionTitle)}</h2>
            <p class="section__subtitle reveal">${esc(cr.sectionSubtitle)}</p>

            <div class="modelling__intro reveal">
                <p>${esc(cr.intro)}</p>
            </div>

            <div class="modelling__skills reveal">
                <ul class="talent-skills-list">
                    ${cr.talentSkills.map(s => `<li>${esc(s)}</li>`).join('')}
                </ul>
            </div>

            ${cr.categories.map(cat => `
                <div class="creative-category reveal">
                    <h3 class="subsection-title">${esc(cat.title)}</h3>
                    ${renderCategory(cat)}
                </div>`).join('')}
        </div>
    </section>`;

    /* === PART-TIME === */
    const pt = data.partTimeExperience;
    main.innerHTML += `
    <section class="section experience-pt" id="experience-pt">
        <div class="container">
            <h2 class="section__title reveal">${esc(pt.sectionTitle)}</h2>
            <p class="section__subtitle reveal">${esc(pt.sectionSubtitle)}</p>
            <div class="timeline">
                ${pt.items.map(item => `
                    <div class="timeline__item reveal">
                        <div class="timeline__marker"></div>
                        <div class="timeline__content">
                            <span class="timeline__date">${esc(item.date)}</span>
                            <h3 class="timeline__role">${esc(item.role)}</h3>
                            <h4 class="timeline__company">${esc(item.company)}</h4>
                            <p class="timeline__desc">${esc(item.desc)}</p>
                        </div>
                    </div>`).join('')}
            </div>
        </div>
    </section>`;

    /* === CONTACT === */
    const ct = data.contact;
    main.innerHTML += `
    <section class="section contact" id="contact">
        <div class="container">
            <h2 class="section__title reveal">${esc(ct.sectionTitle)}</h2>
            <p class="section__subtitle reveal">${esc(ct.sectionSubtitle)}</p>
            <div class="contact__wrapper">
                <div class="contact__info reveal">
                    ${ct.items.map(c => `
                        <div class="contact__item">
                            <span class="contact__label">${esc(c.label)}</span>
                            <a href="${esc(c.href)}"${c.external ? ' target="_blank" rel="noopener"' : ''}>${esc(c.value)}</a>
                        </div>`).join('')}
                </div>
                <form class="contact__form reveal" id="contactForm">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required placeholder="Your name">
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required placeholder="your@email.com">
                    </div>
                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <input type="text" id="subject" name="subject" placeholder="What is this about?">
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="5" required placeholder="Your message..."></textarea>
                    </div>
                    <button type="submit" class="btn btn--primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>`;

    /* === DOCUMENT TITLE === */
    document.title = data.meta.title;
    document.querySelector('meta[name="description"]').setAttribute('content', data.meta.description);

    /* === SIGNAL READY === */
    document.dispatchEvent(new Event('contentRendered'));

});