document.addEventListener('DOMContentLoaded', function () {
    const images = [
        {
            before: "/imagenes/imagen1.png",
            after: "/imagenes/imagen-editada1.png"
        },
        {
            before: "/imagenes/imagen2.png",
            after: "/imagenes/imagen-editada2.png"
        },
        {
            before: "/imagenes/imagen3.png",
            after: "/imagenes/imagen-editada3.png"
        }
    ];

    let currentIndex = 0;
    const afterElement = document.getElementById('after');
    const comparison = document.getElementById('comparison');
    const beforeImage = comparison.querySelector('.before img');
    const afterImage = afterElement.querySelector('img');

    function updateImages(index) {
        beforeImage.src = images[index].before;
        afterImage.src = images[index].after;
    }

    function animateSlider() {
        const duration = 2000; // 2 segundos
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            afterElement.style.clipPath = `inset(0 ${100 - progress * 100}% 0 0)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    function startSlideshow() {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImages(currentIndex);
            afterElement.style.clipPath = "inset(0 100% 0 0)";
            setTimeout(animateSlider, 500);
        }, 5000);
    }

    // Iniciar el slideshow
    updateImages(currentIndex);
    animateSlider();
    startSlideshow();
});