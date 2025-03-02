document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = 'https://yaquitadeveloper.github.io/mi-galeria/';
    const galleryContainer = document.getElementById('gallery');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    const modalImage = document.getElementById('modalImage');
    const downloadBtn = document.getElementById('downloadBtn');

    async function loadImages(category) {
        try {
            galleryContainer.innerHTML = ''; // Evita duplicación de imágenes
            const response = await fetch(`${baseUrl}imagenes.json`);
            const data = await response.json();

            let images = [];
            if (category === 'all') {
                images = [...new Set(Object.values(data).flat())]; // Elimina duplicados
            } else {
                images = data[category] ? [...new Set(data[category])] : []; // Verifica si existe la categoría
            }

            if (images.length > 0) {
                images.forEach(relativeUrl => {
                    const img = document.createElement('img');
                    img.src = `${baseUrl}${relativeUrl}`;
                    img.alt = `${category} image`;
                    img.classList.add('gallery-image', 'img-thumbnail', 'm-2', 'rounded');
                    img.addEventListener('click', () => openModal(`${baseUrl}${relativeUrl}`));
                    galleryContainer.appendChild(img);
                });
            } else {
                galleryContainer.innerHTML = '<p>No hay imágenes disponibles.</p>';
            }
        } catch (error) {
            console.error('Error al cargar las imágenes:', error);
            galleryContainer.innerHTML = '<p>Error al cargar las imágenes. Por favor, intenta más tarde.</p>';
        }

        // Cerrar sidebar en móviles tras seleccionar una categoría
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }

    function openModal(imageUrl) {
        // Restablecer valores de los sliders
        document.getElementById('brightness').value = 100;
        document.getElementById('contrast').value = 100;
        document.getElementById('saturation').value = 100;
        document.getElementById('blur').value = 0;

        // Restablecer filtros de la imagen
        modalImage.style.filter = 'none';

        // Mostrar la nueva imagen en el modal
        modalImage.src = imageUrl;
        modal.show();
    }


    downloadBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = modalImage.src;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = modalImage.style.filter;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const link = document.createElement('a');
            link.download = 'imagen-editada.png';
            link.href = canvas.toDataURL();
            link.click();
        };
    });

    function updateFilters() {
        const brightness = document.getElementById('brightness').value;
        const contrast = document.getElementById('contrast').value;
        const saturation = document.getElementById('saturation').value;
        const blur = document.getElementById('blur').value;

        modalImage.style.filter = `
            brightness(${brightness}%) 
            contrast(${contrast}%) 
            saturate(${saturation}%) 
            blur(${blur}px)
        `;
    }

    document.querySelectorAll('.form-range').forEach(input => {
        input.addEventListener('input', updateFilters);
    });

    loadImages('all');

    // Manejo del botón hamburguesa
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    // Cerrar el menú al hacer clic fuera de él en móviles
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('open');
        }
    });

    // Asegurar que el sidebar sea visible en pantallas grandes
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.add('open');
        } else {
            sidebar.classList.remove('open');
        }
    });

    // Evento para los botones de categoría
    document.querySelectorAll('.mi-boton').forEach(button => {
        button.addEventListener('click', () => {
            loadImages(button.getAttribute('data-category'));
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
});
