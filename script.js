document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling ---
    const initSmoothScroll = () => {
        document.querySelectorAll('.navigation a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    document.querySelectorAll('.navigation a').forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
        
        const sections = document.querySelectorAll('section');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= (sectionTop - 300)) {
                    current = section.getAttribute('id');
                }
            });
            
            document.querySelectorAll('.navigation a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    };

    // --- Animated Text ---
    const initAnimatedText = () => {
        const textElement = document.querySelector('.animated-text');
        if (!textElement) return;
        
        const phrases = [ "Creativity is intelligence having fun.", "Simplicity is the ultimate sophistication.", "Every frame tells a story.", "Concepts that captivate.", "Driven by creativity.", "Visuals that speak.", "Engineering engagement.", "The power of a good story." ];
        
        let phraseIndex = 0, charIndex = 0, isDeleting = false;
        const typeSpeed = 100, deleteSpeed = 50, pauseEnd = 2000;
        
        function typeWriter() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                textElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            if (!isDeleting && charIndex === currentPhrase.length) {
                setTimeout(() => isDeleting = true, pauseEnd);
            } else if (isDeleting && charIndex === 0) { 
                isDeleting = false; 
                phraseIndex = (phraseIndex + 1) % phrases.length; 
                setTimeout(typeWriter, 500);
                return;
            }
            setTimeout(typeWriter, isDeleting ? deleteSpeed : typeSpeed);
        }
        setTimeout(typeWriter, 1000);
    };

    // --- Section Animation on Scroll ---
    const initSectionAnimation = () => {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-animate');
                }
            });
        }, { threshold: 0.1 });
        sections.forEach(section => observer.observe(section));
    };

    // --- Category Popup Logic ---
    const initCategoryPopup = () => {
        const categoryPopup = document.getElementById('category-popup'), 
              popupTitle = document.getElementById('popup-title'), 
              popupContent = document.getElementById('popup-content'), 
              popupClose = document.getElementById('popup-close'), 
              filterButtons = document.querySelectorAll('.work-filters .filter-btn'), 
              workItemSource = document.querySelectorAll('.work-grid-source .work-item');
        
        if (!categoryPopup) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                popupContent.innerHTML = '';
                popupTitle.textContent = button.textContent;
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;
                popupContent.classList.remove('video-view');

                if (filter === 'video') {
                    popupContent.classList.add('video-view');
                    const videoIframes = `
                        <div class="video-iframe-wrapper"><iframe src="https://www.youtube.com/embed/zikwzXyTNIs?si=_6NvGK5q27ZxFigV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
                        <div class="video-iframe-wrapper"><iframe src="https://www.youtube.com/embed/TGE4qn2eHlo?si=jOEEHFWTHRGGy_89" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
                        <div class="video-iframe-wrapper"><iframe src="https://www.youtube.com/embed/ZijehaSM6T4?si=T1Sf2yDYKP58qp7C" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
                        <div class="video-iframe-wrapper"><iframe src="https://www.youtube.com/embed/Trv8ftpSQZA?si=Pra7E-beXN-cEMLl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
                        <div class="video-iframe-wrapper"><iframe src="https://www.youtube.com/embed/Iy4NpE5ouJM?si=jN7-SSFJVTfo1W91" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
                    `;
                    popupContent.innerHTML = videoIframes;
                } else {
                    workItemSource.forEach(item => {
                        if (item.classList.contains(filter)) {
                            popupContent.appendChild(item.cloneNode(true));
                        }
                    });
                }
                categoryPopup.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });
        
        const closePopup = () => {
            categoryPopup.classList.remove('show');
            document.body.style.overflow = '';
            popupContent.innerHTML = '';
        };
        
        popupClose.addEventListener('click', closePopup);
        categoryPopup.addEventListener('click', e => { if(e.target === categoryPopup) closePopup(); });
    };

    // --- Lightbox for items inside popup ---
    const initItemLightbox = () => {
        const lightbox = document.getElementById('lightbox'), 
              lightboxBody = document.getElementById('lightbox-body'), 
              lightboxClose = document.getElementById('lightbox-close');
        
        if (!lightbox) return;
        
        document.getElementById('category-popup').addEventListener('click', (e) => {
            const workItem = e.target.closest('.work-item');
            if (!workItem) return;
            
            const contentType = workItem.dataset.contentType;
            lightboxBody.innerHTML = '';
            
            switch (contentType) {
                case 'image': 
                    lightboxBody.innerHTML = `<img src="${workItem.dataset.source}" alt="Enlarged work">`; 
                    break;
                case 'video':
                    lightboxBody.innerHTML = `<iframe src="${workItem.dataset.source}?autoplay=1&rel=0" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`; 
                    break;
                case 'writing': 
                    lightboxBody.innerHTML = workItem.querySelector('.writing-content').innerHTML; 
                    break;
            }
            
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
        
        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightboxBody.innerHTML = ''; 
            // Keep body overflow hidden if category popup is still open
            if (!document.getElementById('category-popup').classList.contains('show')) {
                document.body.style.overflow = '';
            }
        };
        
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
    };

    // --- Universal Menu ---
    const initUniversalMenu = () => {
        const menuToggle = document.querySelector('.menu-toggle'), 
              navigation = document.querySelector('.navigation');
        
        if (!menuToggle || !navigation) return;
        
        menuToggle.addEventListener('click', (e) => { e.stopPropagation(); navigation.classList.toggle('show-menu'); });
        
        document.addEventListener('click', (e) => { 
            if (!navigation.contains(e.target) && !menuToggle.contains(e.target)) {
                navigation.classList.remove('show-menu'); 
            }
        });
        
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') navigation.classList.remove('show-menu'); });
        
        navigation.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navigation.classList.remove('show-menu'));
        });
    };
    
    // --- Floating Buttons ---
    const initFloatingButtons = () => {
        const floatingBtns = document.querySelectorAll('.floating-btn'),
              waSound = document.getElementById('notification-sound');
        
        if (floatingBtns.length === 0 || !waSound) return;
        
        setTimeout(() => {
            floatingBtns.forEach(btn => btn.classList.add('show'));
            waSound.play().catch(error => console.log("Sound autoplay blocked by browser."));
        }, 3000);
    };

    // --- Skill Bar Animation ---
    const initSkillBarAnimation = () => {
        const skillLevels = document.querySelectorAll('.skill-level');
        if (skillLevels.length === 0) return;

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    skillBar.style.width = skillBar.dataset.level;
                    observer.unobserve(skillBar);
                }
            });
        };

        const skillObserver = new IntersectionObserver(observerCallback, { threshold: 0.5 });
        skillLevels.forEach(skill => skillObserver.observe(skill));
    };

    // --- NEW: Theme Toggle ---
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Apply saved theme on load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    };

    // --- NEW: Language Toggle ---
    const initLanguageToggle = () => {
        const langToggle = document.getElementById('lang-toggle');
        if (!langToggle) return;
        
        const translatableElements = document.querySelectorAll('[data-en]');

        const setLanguage = (lang) => {
            translatableElements.forEach(el => {
                el.innerHTML = el.dataset[lang];
            });
            langToggle.textContent = lang === 'en' ? 'BN' : 'EN';
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang; // Update lang attribute on <html>
        };

        // Apply saved language on load
        const savedLang = localStorage.getItem('language') || 'en';
        setLanguage(savedLang);

        langToggle.addEventListener('click', () => {
            const currentLang = localStorage.getItem('language') || 'en';
            const newLang = currentLang === 'en' ? 'bn' : 'en';
            setLanguage(newLang);
        });
    };


    // --- Initialize all functionalities ---
    initSmoothScroll();
    initAnimatedText();
    initSectionAnimation();
    initCategoryPopup();
    initItemLightbox();
    initUniversalMenu();
    initFloatingButtons();
    initSkillBarAnimation();
    initThemeToggle(); // New
    initLanguageToggle(); // New
});