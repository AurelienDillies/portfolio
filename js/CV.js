document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');

    // Fonction pour obtenir la hauteur du header
    function getHeaderHeight() {
        return header ? header.offsetHeight : 0;
    }

    // Fonction pour le scroll fluide
    function smoothScroll(targetElement, headerHeight) {
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Gestion du scroll interne
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
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

    // Gestion du logo sur toutes les pages
    const logoLink = document.querySelector('.h_logo a');
    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            if (window.location.hash) {
                history.pushState("", document.title, window.location.pathname);
            }
        });
    }

    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Fonction pour afficher/masquer le loader
    function showLoader(show) {
        let loader = document.getElementById('pdf-loader');
        if (show && !loader) {
            loader = document.createElement('div');
            loader.id = 'pdf-loader';
            loader.innerHTML = '<div class="spinner"></div><p>Génération du PDF en cours...</p>';
            document.body.appendChild(loader);
        } else if (!show && loader) {
            loader.remove();
        }
    }

    // Fonction pour télécharger le contenu du main en PDF
    const downloadButton = document.getElementById('download-cv');
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            showLoader(true);
            
            const element = document.querySelector('main'); 
            if (!element) {
                console.error('Element main non trouvé');
                showLoader(false);
                return;
            }

            element.style.height = 'auto'; 

            html2canvas(element, { 
                scale: 1, 
                backgroundColor: '#fff', 
                useCORS: true 
            }).then(canvas => {
                const pdfWidth = 210;
                const pxPerMm = 96 / 25.4;
                const a4WidthPx = Math.floor(pdfWidth * pxPerMm);
                const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
                const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
                const imgData = canvas.toDataURL('image/jpeg', 0.8);
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('CV_Aurelien_Dillies.pdf');
                showLoader(false);
            }).catch(error => {
                console.error('Erreur lors de la génération du PDF:', error);
                showLoader(false);
                alert('Erreur lors de la génération du PDF');
            });
        });
    }
});