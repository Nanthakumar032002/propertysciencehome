
// use-cases 
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 20,
        },
    },

    on: {
        slideChange: function () {
          updateScrollBar();
        },
      },
});


// Scroll Bar Update Function
function updateScrollBar() {
      const scrollBar = document.getElementById('scrollBar');
      const totalSlides = swiper.slides.length;
      const visibleSlides = swiper.params.slidesPerView;
      const currentSlide = swiper.activeIndex;

      // Calculate percentage of slides scrolled
      const scrolledPercentage = (currentSlide / (totalSlides - visibleSlides)) * 100;

      // Ensure it's between 0 and 100
      const clampedPercentage = Math.max(0, Math.min(scrolledPercentage, 100));

      // Set the width of the scroll bar
      scrollBar.style.width = `${clampedPercentage}%`;
    }


    document.addEventListener('DOMContentLoaded', function () {
        const sliderWrapper = document.querySelector('.uc_slider_wrapper');
        const slides = document.querySelectorAll('.uc_slider_slide');
        const progressBarFill = document.querySelector('.uc_progress_fill');
        const sliderContainer = document.querySelector('.uc_slider_container');

        let slideIndex = 0;
        let isDragging = false;
        let startPosition = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        // Set initial width for progress bar
        updateProgressBar();

        // Touch and Mouse Events
        sliderWrapper.addEventListener('mousedown', dragStart);
        sliderWrapper.addEventListener('touchstart', dragStart);

        sliderWrapper.addEventListener('mousemove', drag);
        sliderWrapper.addEventListener('touchmove', drag);

        sliderWrapper.addEventListener('mouseup', dragEnd);
        sliderWrapper.addEventListener('mouseleave', dragEnd);
        sliderWrapper.addEventListener('touchend', dragEnd);


        function dragStart(event) {
            isDragging = true;
            startPosition = getPositionX(event);
            prevTranslate = currentTranslate;
            sliderWrapper.classList.add('grabbing');
        }

        function drag(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                currentTranslate = prevTranslate + currentPosition - startPosition;
                setPosition();
            }
        }

        function dragEnd() {
            isDragging = false;
            sliderWrapper.classList.remove('grabbing');
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && slideIndex < slides.length - 1) {
                slideIndex++;
            }

            if (movedBy > 100 && slideIndex > 0) {
                slideIndex--;
            }

            setPosition();
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function setPosition() {
            currentTranslate = slideIndex * -slides[0].offsetWidth;
            sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
            updateProgressBar();
        }

        function updateProgressBar() {
            const progress = (slideIndex / (slides.length - 1)) * 100;
            progressBarFill.style.width = `${(progress / 100) * 250}px`;
        }

        // Prevent scrolling on touch devices
        sliderContainer.addEventListener('touchstart', (e) => {
            startPosition = e.touches[0].clientX;
        });

        sliderContainer.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
            }

            const currentPosition = e.touches[0].clientX;
            const diff = startPosition - currentPosition;
            const scrollLeft = sliderContainer.scrollLeft;
        });
    });