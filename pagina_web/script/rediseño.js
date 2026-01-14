// Datos de las carreras (puedes modificar esto según tus necesidades)
const carrerasData = [
    {
        title: "Técnico en Informática",
        description: "Formación completa en desarrollo de software, redes y sistemas computacionales.",
        image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg",
        tag: "Tecnología"
    },
    {
        title: "Administración de Empresas",
        description: "Gestión empresarial, finanzas y recursos humanos para el mundo corporativo.",
        image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        tag: "Administración"
    },
    {
        title: "Ingeniería Industrial",
        description: "Optimización de procesos productivos y gestión de operaciones.",
        image: "https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg",
        tag: "Ingeniería"
    },
    {
        title: "Psicología Organizacional",
        description: "Desarrollo humano y gestión del talento en entornos laborales.",
        image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
        tag: "Ciencias Sociales"
    },
    {
        title: "Arquitectura y Diseño",
        description: "Creación de espacios funcionales y estéticos para el hábitat humano.",
        image: "https://images.pexels.com/photos/280232/pexels-photo-280232.jpeg",
        tag: "Diseño"
    },
    {
        title: "Medicina General",
        description: "Formación integral en ciencias médicas y atención primaria.",
        image: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg",
        tag: "Ciencias de la Salud"
    }
];

class Carrusel {
    constructor() {
        this.carruselTrack = document.getElementById('carruselTrack');
        this.indicatorsContainer = document.getElementById('carruselIndicators');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');

        this.currentIndex = 0;
        this.totalItems = carrerasData.length;
        this.itemsPerView = this.getItemsPerView();
        this.autoSlideInterval = null;
        this.isTransitioning = false;

        this.init();
    }

    getItemsPerView() {
        if (window.innerWidth >= 1200) return 4;
        if (window.innerWidth >= 992) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    init() {
        this.createCards();
        this.createIndicators();
        this.addEventListeners();
        this.startAutoSlide();
        this.updateView();

        // Recalcular en resize
        window.addEventListener('resize', () => {
            this.itemsPerView = this.getItemsPerView();
            this.updateView();
        });
    }

    createCards() {
        carrerasData.forEach((carrera, index) => {
            const card = document.createElement('div');
            card.className = 'carrusel-card';
            card.setAttribute('data-index', index);

            card.innerHTML = `
                <div class="carrusel-card-bg" style="background-image: linear-gradient(rgba(26, 95, 122, 0.4), rgba(81, 192, 243, 0.3)), url('${carrera.image}')"></div>
                <div class="carrusel-card-overlay">
                    <div class="carrusel-card-content">
                        <h3>${carrera.title}</h3>
                        <p>${carrera.description}</p>
                        <span class="carrusel-tag">${carrera.tag}</span>
                    </div>
                </div>
            `;

            this.carruselTrack.appendChild(card);
        });
    }

    createIndicators() {
        for (let i = 0; i < this.totalItems; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carrusel-indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.setAttribute('data-index', i);
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    addEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Touch events para móviles
        let touchStartX = 0;
        let touchEndX = 0;

        this.carruselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.carruselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });

        // Pausar auto-slide al interactuar
        this.carruselTrack.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.carruselTrack.addEventListener('mouseleave', () => this.startAutoSlide());

        this.carruselTrack.addEventListener('touchstart', () => this.stopAutoSlide());
        this.carruselTrack.addEventListener('touchend', () => setTimeout(() => this.startAutoSlide(), 3000));
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    updateView() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const cardWidth = 100 / this.itemsPerView;
        const translateX = -(this.currentIndex * cardWidth);

        this.carruselTrack.style.transform = `translateX(${translateX}%)`;

        // Actualizar indicadores
        document.querySelectorAll('.carrusel-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        // Actualizar clases de visibilidad
        document.querySelectorAll('.carrusel-card').forEach((card, index) => {
            const cardIndex = parseInt(card.getAttribute('data-index'));
            const isVisible = cardIndex >= this.currentIndex &&
                cardIndex < this.currentIndex + this.itemsPerView;
            card.classList.toggle('active', isVisible);
        });

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    nextSlide() {
        if (this.isTransitioning) return;

        const maxIndex = this.totalItems - this.itemsPerView;
        this.currentIndex = (this.currentIndex >= maxIndex) ? 0 : this.currentIndex + 1;
        this.updateView();
        this.restartAutoSlide();
    }

    prevSlide() {
        if (this.isTransitioning) return;

        this.currentIndex = (this.currentIndex <= 0) ?
            this.totalItems - this.itemsPerView : this.currentIndex - 1;
        this.updateView();
        this.restartAutoSlide();
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;

        this.currentIndex = Math.min(index, this.totalItems - this.itemsPerView);
        this.updateView();
        this.restartAutoSlide();
    }

    startAutoSlide() {
        if (this.autoSlideInterval) return;
        this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    restartAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Carrusel();
});