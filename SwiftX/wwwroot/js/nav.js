(function () {
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (!nav || !toggle || !menu) return;

    const setOpen = (open) => {
        // toggle existing nav-open class (used for hamburger X animation)
        nav.classList.toggle('nav-open', open);

        // update accessibility attributes
        toggle.setAttribute('aria-expanded', String(!!open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

        // prevent body scroll when menu is open on mobile
        document.body.style.overflow = open ? 'hidden' : '';

        // close menu links will collapse because CSS uses nav-open to show/hide
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('nav-open')));
    menu.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
})();