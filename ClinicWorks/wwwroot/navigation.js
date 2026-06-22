let removeNavigationListeners;

export function initializeSectionNavigation() {
    if (removeNavigationListeners) {
        removeNavigationListeners();
    }

    const links = [...document.querySelectorAll('.desktop-side-nav a[href^="#"]')];
    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!links.length || !sections.length) {
        return;
    }

    const setActive = id => {
        links.forEach(link => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    };

    let scheduled = false;
    const updateActiveSection = () => {
        scheduled = false;
        const marker = window.scrollY + window.innerHeight * .36;
        let current = sections[0];
        sections.forEach(section => {
            if (section.offsetTop <= marker) current = section;
        });
        if (current) setActive(current.id);
    };

    const handleScroll = () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    removeNavigationListeners = () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateActiveSection);
    };
    updateActiveSection();
}

export function disposeSectionNavigation() {
    if (removeNavigationListeners) {
        removeNavigationListeners();
        removeNavigationListeners = undefined;
    }
}
