document.addEventListener('DOMContentLoaded', function() {
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

const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
});

// téléchargement du CV
document.getElementById('download-cv').addEventListener('click', function() {
    const element = document.querySelector('main'); 
    const originalHeight = element.style.height;
    element.style.height = 'auto'; 

    html2canvas(element, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Ajuster la hauteur de l'image pour remplir la page
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, pageHeight);
        pdf.save('CV_Aurelien_Dillies.pdf');
    });
});