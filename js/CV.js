document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const menuPrincipal = document.getElementById('menu-principal');
    const nav = document.querySelector('.h_lien');

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
    });

    // Fermer le menu en cliquant sur un lien
    menuPrincipal.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {  
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Gestion de la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}); 