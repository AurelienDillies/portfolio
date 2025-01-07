document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour obtenir la hauteur du header
    function getHeaderHeight() {
        const header = document.querySelector('header');
        return header ? header.offsetHeight : 0;
    }

    // Fonction pour le scroll fluide
    function smoothScroll(targetElement, headerHeight) {
        if (!targetElement) return;
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight;

        try {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } catch (error) {
            // Fallback pour les navigateurs ne supportant pas smooth scroll
            window.scrollTo(0, offsetPosition);
        }
    }

    // Gestion du scroll interne
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerHeight = getHeaderHeight();
                smoothScroll(targetElement, headerHeight);
                history.pushState(null, '', `#${targetId}`);
            }
        });
    });

    // Gestion du logo
    const logoLink = document.querySelector('.h_logo a');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            history.pushState(null, '', window.location.pathname);
        });
    }

    // Gestion des modales
    const modals = document.querySelectorAll('.modal');
    const openModalButtons = document.querySelectorAll('.ouvrir-modal');
    const closeModalButtons = document.querySelectorAll('.fermer-modal');

    function toggleBodyScroll(isModalOpen) {
        document.body.style.overflow = isModalOpen ? 'hidden' : '';
    }

    function closeAllModals() {
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
        toggleBodyScroll(false);
    }

    openModalButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            modals[index].style.display = 'block';
            modals[index].setAttribute('aria-hidden', 'false');
            toggleBodyScroll(true);
        });
    });

    closeModalButtons.forEach((button) => {
        button.addEventListener('click', closeAllModals);
    });

    // Fermeture des modales en cliquant à l'extérieur
    window.addEventListener('click', (event) => {
        modals.forEach((modal) => {
            if (event.target === modal) {
                closeAllModals();
            }
        });
    });

    // Fermeture des modales avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
});

