
        document.addEventListener('DOMContentLoaded', function() {
            // --- About Carousel (infinite loop with clones) ---
            const carouselContainer = document.querySelector('.about-carousel');
            const carouselInner = carouselContainer.querySelector('.about-carousel-inner');
            const images = carouselInner.querySelectorAll('img');
            const total = images.length;
            let currentIndex = 1; // Start at first real image
            let autoSlideInterval;

            carouselInner.style.width = `${total * 100}%`;
            images.forEach(img => {
                img.style.width = `${100 / total}%`;
            });

            function showImage(index, instant = false) {
                carouselInner.style.transition = instant ? 'none' : 'transform 0.5s ease-in-out';
                const offset = -index * (100 / total);
                carouselInner.style.transform = `translateX(${offset}%)`;
                if (instant) {
                    // Force reflow to apply the transition reset
                    void carouselInner.offsetWidth;
                    carouselInner.style.transition = 'transform 0.5s ease-in-out';
                }
            }

            function autoAdvanceCarousel() {
                currentIndex++;
                showImage(currentIndex);
                if (currentIndex === total - 1) {
                    setTimeout(() => {
                        currentIndex = 1;
                        showImage(currentIndex, true);
                    }, 500);
                }
            }

            function startAutoSlide() {
                clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(autoAdvanceCarousel, 3000);
            }

            function stopAutoSlide() {
                clearInterval(autoSlideInterval);
            }

            function manualNext() {
                stopAutoSlide();
                currentIndex++;
                showImage(currentIndex);
                if (currentIndex === total - 1) {
                    setTimeout(() => {
                        currentIndex = 1;
                        showImage(currentIndex, true);
                    }, 500);
                }
                startAutoSlide();
            }

            function manualPrev() {
                stopAutoSlide();
                currentIndex--;
                showImage(currentIndex);
                if (currentIndex === 0) {
                    setTimeout(() => {
                        currentIndex = total - 2;
                        showImage(currentIndex, true);
                    }, 500);
                }
                startAutoSlide();
            }

            const prevBtn = carouselContainer.querySelector('.carousel-control.prev');
            const nextBtn = carouselContainer.querySelector('.carousel-control.next');
            prevBtn.addEventListener('click', manualPrev);
            nextBtn.addEventListener('click', manualNext);

            // Initial position (first real image, no transition)
            showImage(currentIndex, true);
            startAutoSlide();


            // --- Scroll Animation for About Section ---
            const aboutSection = document.querySelector('.about-section.scroll-animate');
            const fundSection = document.querySelector('.fund-section.scroll-animate'); // Get the new fund section

            const sectionsToAnimate = [aboutSection, fundSection].filter(Boolean); // Filter out null if a section doesn't exist

            if (sectionsToAnimate.length > 0) {
                const observerOptions = {
                    root: null, // relative to the viewport
                    rootMargin: '0px 0px -100px 0px', // Triggers when element is 100px *further* into the viewport
                    threshold: 0.1 // Triggers when 10% of the element is visible
                };

                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            observer.unobserve(entry.target); // Stop observing once it's visible and animated
                        }
                    });
                }, observerOptions);

                sectionsToAnimate.forEach(section => {
                    observer.observe(section);
                });
            }
            // --- End Scroll Animation ---


            // --- Start Dynamic Number Counter Animation ---
            // Use an IntersectionObserver to trigger the animation when the element is visible
            const impactSnapshot = document.querySelector('.impact-snapshot');
            let hasAnimated = false; // Flag to ensure animation runs only once

            function animateNumbers() {
                const statNumbers = document.querySelectorAll('.impact-snapshot .stat-number');

                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'), 10);
                    const duration = 2000; // Animation duration in milliseconds
                    let start = 0;
                    let startTime = null;

                    // Reset text content to 0 or an empty string before animation
                    stat.textContent = '0'; 

                    function animate(currentTime) {
                        if (!startTime) startTime = currentTime;
                        const progress = (currentTime - startTime) / duration;

                        if (progress < 1) {
                            const easedProgress = easeOutQuad(progress); // Apply easing function
                            let currentNumber = Math.ceil(easedProgress * target);

                            // Add commas for thousands
                            let formattedNumber = currentNumber.toLocaleString();

                            // Add '+' sign if it's the 5000+ stat or 200+ stat
                            if (target === 5000) {
                                formattedNumber = '+' + formattedNumber;
                            } else if (target === 200) {
                                formattedNumber = formattedNumber + '+';
                            }
                            

                            stat.textContent = formattedNumber;
                            requestAnimationFrame(animate);
                        } else {
                            // Ensure the final target value is set correctly
                            let finalFormattedNumber = target.toLocaleString();
                            if (target === 5000) {
                                finalFormattedNumber = '+' + finalFormattedNumber;
                            } else if (target === 200) {
                                finalFormattedNumber = finalFormattedNumber + '+';
                            }
                            stat.textContent = finalFormattedNumber;
                        }
                    }

                    // Easing function for a smoother animation
                    function easeOutQuad(t) {
                        return t * (2 - t);
                    }

                    requestAnimationFrame(animate);
                });
            }

            if (impactSnapshot) {
                const observerOptions = {
                    root: null, // viewport
                    rootMargin: '0px',
                    threshold: 0.5 // Trigger when 50% of the element is visible
                };

                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !hasAnimated) {
                            animateNumbers();
                            hasAnimated = true; // Set flag to true
                            observer.unobserve(entry.target); // Stop observing after animation
                        }
                    });
                }, observerOptions);

                observer.observe(impactSnapshot);
            }
            // --- End Dynamic Number Counter Animation ---

            // --- Smooth scroll for Home link ---
            const homeLink = document.getElementById('home-link');
            if (homeLink) {
                homeLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Update active state
                    document.querySelectorAll('.main-nav a').forEach(link => link.classList.remove('active'));
                    homeLink.classList.add('active');
                    history.replaceState(null, '', '#top');
                });
            }


            // Hamburger menu toggle for responsive nav
            const hamburger = document.getElementById('hamburger-menu');
            const mainNav = document.getElementById('mainNav');
            hamburger.addEventListener('click', function() {
    this.classList.toggle('open');
    mainNav.classList.toggle('open');
});
            // Optional: close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
                    mainNav.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });

document.querySelectorAll('.fund-goal-carousel').forEach(function(carousel) {
    const images = carousel.querySelectorAll('img');
    let current = 0;
    let intervalId;

    function showImage(idx) {
        images.forEach((img, i) => img.classList.toggle('active', i === idx));
    }

    function nextImage() {
        current = (current + 1) % images.length;
        showImage(current);
    }

    function prevImage() {
        current = (current - 1 + images.length) % images.length;
        showImage(current);
    }

    // Auto-slide every 3 seconds
    function startAutoSlide() {
        intervalId = setInterval(nextImage, 3000);
    }

    function stopAutoSlide() {
        clearInterval(intervalId);
    }

    carousel.querySelector('.carousel-prev').onclick = function() {
        prevImage();
        stopAutoSlide();
        startAutoSlide();
    };
    carousel.querySelector('.carousel-next').onclick = function() {
        nextImage();
        stopAutoSlide();
        startAutoSlide();
    };

    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    showImage(current);
    startAutoSlide();
});

(function() {
    // Get all carousels and their images
    const carousels = Array.from(document.querySelectorAll('.fund-goal-carousel'));
    const allImages = carousels.map(carousel => carousel.querySelectorAll('img'));
    let current = 0;
    let intervalId;

    function showImage(idx) {
        carousels.forEach((carousel, cIdx) => {
            allImages[cIdx].forEach((img, i) => img.classList.toggle('active', i === idx));
        });
    }

    function nextImage() {
        // Assume all carousels have the same number of images as the first
        const total = allImages[0].length;
        current = (current + 1) % total;
        showImage(current);
    }

    function prevImage() {
        const total = allImages[0].length;
        current = (current - 1 + total) % total;
        showImage(current);
    }

    function startAutoSlide() {
        intervalId = setInterval(nextImage, 3000);
    }

    function stopAutoSlide() {
        clearInterval(intervalId);
    }

    // Button events (sync all carousels)
    carousels.forEach(carousel => {
        carousel.querySelector('.carousel-prev').onclick = function() {
            prevImage();
            stopAutoSlide();
            startAutoSlide();
        };
        carousel.querySelector('.carousel-next').onclick = function() {
            nextImage();
            stopAutoSlide();
            startAutoSlide();
        };
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    });

    // Initialize
    showImage(current);
    startAutoSlide();
})();

        // --- Highlight nav link based on scroll position and hash ---
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.main-nav a');
            const sections = [
                { id: 'about', link: document.querySelector('.main-nav a[data-section="about"]') },
                { id: 'impact', link: document.querySelector('.main-nav a[data-section="impact"]') },
                { id: 'fund', link: document.querySelector('.main-nav a[data-section="fund"]') }
            ];
            const homeLink = document.querySelector('.main-nav a[data-section="home"]');

            function clearActive() {
                navLinks.forEach(link => link.classList.remove('active'));
            }

            function setActiveByHash() {
                const hash = window.location.hash;
                if (!hash || hash === '#home') {
                    clearActive();
                    homeLink.classList.add('active');
                    return;
                }
                let found = false;
                sections.forEach(({ id, link }) => {
                    if (hash === '#' + id) {
                        clearActive();
                        link.classList.add('active');
                        found = true;
                    }
                });
                if (!found) {
                    clearActive();
                    homeLink.classList.add('active');
                }
            }

            // On click, scroll, and hashchange, update active nav
            function setActiveByScroll() {
                let scrollPos = window.scrollY || window.pageYOffset;
                let found = false;
                for (let i = sections.length - 1; i >= 0; i--) {
                    const section = document.getElementById(sections[i].id);
                    if (section && section.offsetTop - 80 <= scrollPos) {
                        clearActive();
                        sections[i].link.classList.add('active');
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    clearActive();
                    homeLink.classList.add('active');
                }
            }

            // Click handler for smooth scroll and highlight
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const sectionId = this.getAttribute('href');
                    if (sectionId.startsWith('#')) {
                        e.preventDefault();
                        const target = document.querySelector(sectionId);
                        if (target) {
                            window.scrollTo({
                                top: target.offsetTop - 60,
                                behavior: 'smooth'
                            });
                        }
                        // Update active state
                        clearActive();
                        this.classList.add('active');
                        history.replaceState(null, '', sectionId);
                    }
                });
            });

            // Update on scroll
            window.addEventListener('scroll', setActiveByScroll);

            // Update on hashchange (for direct navigation)
            window.addEventListener('hashchange', setActiveByHash);

            // Initial highlight
            setActiveByHash();
        });

/* --- JAVASCRIPT FOR IMPACT STORY POPUP MODAL --- */
document.addEventListener('DOMContentLoaded', function() {
    const impactCards = document.querySelectorAll('.impact-item');
    const modalOverlay = document.getElementById('impact-modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('modal-close-btn');

    if (impactCards.length > 0 && modalOverlay) {
        impactCards.forEach(card => {
            const learnMoreBtn = card.querySelector('.read-more-button');

            learnMoreBtn.addEventListener('click', function(event) {
                event.preventDefault(); // Stop the link from trying to navigate

                // 1. Get the content from the card that was clicked
                const title = card.querySelector('h3').innerText;
                const paragraphs = card.querySelectorAll('p');
                let fullDescription = '';
                paragraphs.forEach(p => {
                    fullDescription += `<p>${p.innerHTML}</p>`;
                });

                // 2. Put the content into the modal
                modalTitle.innerText = title;
                modalBody.innerHTML = fullDescription;

                // 3. Show the modal
                modalOverlay.classList.add('active');
                document.body.classList.add('modal-open'); // Lock background scroll
            });
        });

        // Function to close the modal
        function closeModal() {
            modalOverlay.classList.remove('active');
            document.body.classList.remove('modal-open'); // Unlock background scroll
        }

        // Add event listeners to close the modal
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', function(event) {
            // Only close if the click is on the dark overlay itself, not the white content box
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }
});
 