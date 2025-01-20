document.addEventListener('DOMContentLoaded', function() {
    // Regroupement des sélecteurs fréquemment utilisés
    const header = document.querySelector('header');
    const intro = document.querySelector('.intro');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');

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
                updateActiveLink();
            }
        });
    });

    // Gestion du logo sur toutes les pages
    const logoLink = document.querySelector('.h_logo a');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Empêcher l'ajout du # dans l'URL
            if (window.location.hash) {
                history.pushState("", document.title, window.location.pathname);
            }
            updateActiveLink();
        });
    }

    // Gestion des modales
    const modals = document.querySelectorAll('.modal');
    const openModalButtons = document.querySelectorAll('.ouvrir-modal');
    const closeModalButtons = document.querySelectorAll('.fermer-modal');

    function toggleBodyScroll(isModalOpen) {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function closeAllModals() {
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
        toggleBodyScroll(false);
    }

    // Données des projets
    const projets = [
        {
            titre: "Application de Dessin",
            image: "./image/projets/application_dessin.png",
            description: "Une application interactive de dessin en ligne qui permet de créer des dessins librement. Utilise l'API Canvas pour offrir une expérience de dessin fluide avec des fonctionnalités comme le choix des couleurs et la taille du pinceau.",
            technologies: ["HTML5", "CSS3", "JavaScript", "Canvas API"],
            lien: "https://aureliendillies.github.io/application-dessin/"
        },
        {
            titre: "Juste Prix",
            image: "./image/projets/juste_prix.png",
            description: "Un jeu du Juste Prix où l'utilisateur doit deviner un nombre aléatoire. Inclut des fonctionnalités comme le comptage des essais.",
            technologies: ["HTML5", "CSS3", "JavaScript"],
            lien: "https://aureliendillies.github.io/juste-prix/"
        },
        {
            titre: "Effet de Flashlight",
            image: "./image/projets/flashlight.png",
            description: "Un effet visuel de lampe torche qui suit le curseur de la souris, créant une expérience interactive unique. Utilise des techniques avancées de CSS pour créer un effet de lumière dynamique.",
            technologies: ["HTML5", "CSS3", "JavaScript"],
            lien: "https://aureliendillies.github.io/effet-flashlight/"
        }
    ];

    // Modification de la gestion des modales
    openModalButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const projet = projets[index];
            const modal = modals[0]; 

            // Mise à jour du contenu de la modale
            modal.querySelector('#modal-title').textContent = projet.titre;
            modal.querySelector('#modal-image').src = projet.image;
            modal.querySelector('#modal-image').alt = `Capture d'écran du projet ${projet.titre}`;
            modal.querySelector('#modal-description').textContent = projet.description;
            
            // Mise à jour des technologies
            const techList = modal.querySelector('#modal-tech-list');
            techList.innerHTML = projet.technologies
                .map(tech => `<li>${tech}</li>`)
                .join('');
            
            modal.querySelector('#modal-link').href = projet.lien;

            // Affichage de la modale
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
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

    // Intersection Observer pour le lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    // Observer les images
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Optimisation de la révélation du site
    document.querySelector('.reveal-site').addEventListener('click', function(e) {
        e.preventDefault();
        intro.style.display = 'none';
        [header, main, footer].forEach(el => el.style.display = 'block');
        
        // Réinitialiser les liens actifs
        document.querySelectorAll('.h_lien a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Activer le lien "accueil" par défaut
        const accueilLink = document.querySelector('.h_lien a[href="#accueil"]');
        if (accueilLink) {
            accueilLink.classList.add('active');
        }
        
        // Scroll vers le haut de la page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Fonction pour mettre à jour les liens actifs
    function updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.h_lien a');

        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - getHeaderHeight();
            if (window.scrollY >= sectionTop - 2) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Vérifier si l'utilisateur est en bas de la page
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
            currentSectionId = 'contact';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    // Appel initial pour définir le lien actif
    updateActiveLink();

    // Mise à jour des liens actifs lors du défilement
    window.addEventListener('scroll', updateActiveLink);

    // Optimisation du carousel
    class TechCarousel {
        constructor() {
            this.container = document.querySelector('.carousel-slides');
            this.slides = document.querySelectorAll('.carousel-slide');
            this.currentSlide = 1;
            this.isTransitioning = false;
            this.transitionDuration = 500;
            
            // Cloner le premier et le dernier slide
            const firstSlideClone = this.slides[0].cloneNode(true);
            const lastSlideClone = this.slides[this.slides.length - 1].cloneNode(true);
            
            this.container.appendChild(firstSlideClone);
            this.container.insertBefore(lastSlideClone, this.slides[0]);
            
            // Position initiale
            this.updatePosition(this.currentSlide, false);
            this.init();
        }

        init() {
            this.startAutoSlide();
        }

        updatePosition(index, useTransition = true) {
            if (useTransition) {
                this.container.style.transition = `transform ${this.transitionDuration}ms ease-in-out`;
            } else {
                this.container.style.transition = 'none';
            }
            this.container.style.transform = `translateX(-${index * 100}%)`;
        }

        showSlide(index) {
            if (this.isTransitioning) return;
            this.isTransitioning = true;
            this.currentSlide = index;

            this.updatePosition(index);

            const handleTransitionEnd = () => {
                if (index === this.slides.length + 1) {
                    this.currentSlide = 1;
                    this.updatePosition(this.currentSlide, false);
                } else if (index === 0) {
                    this.currentSlide = this.slides.length;
                    this.updatePosition(this.currentSlide, false);
                }
                
                this.isTransitioning = false;
                this.container.removeEventListener('transitionend', handleTransitionEnd);
            };

            this.container.addEventListener('transitionend', handleTransitionEnd);
        }

        startAutoSlide() {
            setInterval(() => {
                if (!document.hidden && !this.isTransitioning) {
                    this.showSlide(this.currentSlide + 1);
                }
            }, 4000);
        }
    }

    // Initialisation optimisée
    new TechCarousel();

    const scrollThreshold = 100; // Nombre de pixels à scroller avant l'effet

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});