/* Floating Navigation ScrollSpy & Background Header update */
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 180; // offset for navbar height + buffer
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
        
        // Toggle scrolled class on navbar on scroll
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

/* Mobile Navigation Menu Toggle Handler */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');
    
    if (!mobileToggle || !navLinks) return;
    
    function openMenu() {
        navLinks.classList.add('active');
        if (navBackdrop) navBackdrop.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.className = 'bx bx-x';
        }
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        navLinks.classList.remove('active');
        if (navBackdrop) navBackdrop.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.className = 'bx bx-menu';
        }
        document.body.style.overflow = '';
    }
    
    function toggleMenu() {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    mobileToggle.addEventListener('click', toggleMenu);
    
    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking nav links
    const linkItems = navLinks.querySelectorAll('a');
    linkItems.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu when window resizes beyond mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* Scroll Progress Bar at very top of screen */
function initScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    
    window.addEventListener('scroll', () => {
        if (!scrollIndicator) return;
        
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollIndicator.style.width = scrolled + "%";
    });
}

/* Sticky Scroll Projects Intersection */
function initSplitScreenProgress() {
    const textBlocks = document.querySelectorAll('.project-text-block');
    const imageViews = document.querySelectorAll('.project-image-view');
    
    if (!textBlocks.length || !imageViews.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger exactly when block is in the vertical center of the viewport
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const projectIndex = entry.target.getAttribute('data-project-index');
                
                // Set active text block
                textBlocks.forEach(block => {
                    if (block.getAttribute('data-project-index') === projectIndex) {
                        block.classList.add('active');
                    } else {
                        block.classList.remove('active');
                    }
                });
                
                // Set active image view
                imageViews.forEach(view => {
                    if (view.getAttribute('data-project-image') === projectIndex) {
                        view.classList.add('active');
                    } else {
                        view.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    textBlocks.forEach(block => observer.observe(block));
}

/* Scroll-linked Timeline filling progress bar */
function initTimelineProgress() {
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineContainer = document.getElementById('timelineContainer');
    const nodes = document.querySelectorAll('.timeline-node');
    
    if (!timelineContainer || !timelineProgress) return;
    
    function updateTimeline() {
        const rect = timelineContainer.getBoundingClientRect();
        const containerHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Start filling timeline when top passes 65% height of viewport
        const startOffset = viewportHeight * 0.65;
        // End when bottom reaches 45% height of viewport
        const endOffset = viewportHeight * 0.45;
        
        let progress = (startOffset - rect.top) / (containerHeight - (endOffset - startOffset));
        progress = Math.max(0, Math.min(1, progress));
        
        timelineProgress.style.height = `${progress * 100}%`;
        
        // Stagger marker lighting as scroll crosses node offsets
        nodes.forEach(node => {
            const nodeRect = node.getBoundingClientRect();
            // Light node when it reaches middle-upper screen viewport height
            if (nodeRect.top < viewportHeight * 0.55) {
                node.classList.add('passed');
            } else {
                node.classList.remove('passed');
            }
        });
    }
    
    window.addEventListener('scroll', updateTimeline);
    window.addEventListener('resize', updateTimeline);
    updateTimeline();
}

/* Intersection Observer entrance reveal animations */
function initEntranceReveals() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -60px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Select elements to reveal
    const revealElements = document.querySelectorAll(
        '.hero-title, .hero-desc, .cta-buttons, .skill-card-item, .timeline-content, .live-site-card, .projects-title, .projects-desc, .contact-headline, .big-email, .social-item'
    );
    
    revealElements.forEach(el => {
        el.classList.add('reveal-text');
        observer.observe(el);
    });
}

/* Image Slideshows Synchronized with Dots */
function initSlideshows() {
    document.querySelectorAll(".slideshow").forEach(img => {
        const images = JSON.parse(img.dataset.images);
        const card = img.closest('.project-image-view');
        const dots = card?.querySelectorAll('.indicator-dot');
        
        let index = 0;
        
        setInterval(() => {
            index = (index + 1) % images.length;
            img.src = images[index];
            
            // Sync indicator dots
            if (dots && dots.length > index) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
            }
        }, 3000);
    });
}

/* CV Download Handler */
function downloadCV() {
    const link = document.createElement('a');
    link.href = 'assets/HassanShahzad (cv).pdf';
    link.download = 'Hassan_Shahzad_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('CV download started!');
}

/* Elegant minimalist bottom-right notification */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 40px;
        background: #18181b;
        border: 1px solid #27272a;
        color: #f4f4f5;
        padding: 14px 24px;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0.5px;
        z-index: 100000;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        animation: slideIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    `;
    
    if (!document.getElementById('minimal-notif-styles')) {
        const style = document.createElement('style');
        style.id = 'minimal-notif-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(50px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2500);
}

/* Initialize Lenis Smooth Scroll */
let lenis;
function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    window.lenis = lenis;

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

/* Smooth Scrolling for Navigation Links */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                if (window.lenis) {
                    window.lenis.scrollTo(target, { offset: -80 });
                } else {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/* Loading Screen Management */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 600);
    }
}

/* Horizontal Scroll on Vertical Page Scroll for Live Sites (Universal Desktop + Mobile/Tablet) */
function initHorizontalScroll() {
    const section = document.getElementById('live-sites');
    const wrapper = document.querySelector('.live-sites-sticky-wrapper');
    const track = document.querySelector('.live-sites-slider-container');
    
    if (!section || !wrapper || !track) return;
    
    let initialTranslate = 0;
    let maxScroll = 0;
    
    function recalculateMetrics() {
        // Temporarily clear transform to measure pure layout coordinates
        const oldTransform = track.style.transform;
        track.style.transform = '';
        
        const cards = track.querySelectorAll('.live-site-card');
        if (cards.length > 0) {
            const firstCard = cards[0];
            const lastCard = cards[cards.length - 1];
            
            const firstCardRect = firstCard.getBoundingClientRect();
            const lastCardRect = lastCard.getBoundingClientRect();
            const viewportCenter = window.innerWidth / 2;
            
            const firstCardCenter = firstCardRect.left + firstCardRect.width / 2;
            initialTranslate = viewportCenter - firstCardCenter;
            
            const lastCardCenter = lastCardRect.left + lastCardRect.width / 2;
            maxScroll = lastCardCenter - firstCardCenter;
        }
        
        // Restore old transform so we don't cause flicker
        track.style.transform = oldTransform;
    }
    
    function updateScroll() {
        const rect = section.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        const totalScrollableDistance = sectionHeight - viewportHeight;
        if (totalScrollableDistance > 0) {
            let progress = -rect.top / totalScrollableDistance;
            progress = Math.max(0, Math.min(1, progress));
            
            const translateX = initialTranslate - progress * maxScroll;
            track.style.transform = `translateX(${translateX}px)`;
        }
        
        // Find the card closest to the viewport center and toggle active-center class
        let closestCard = null;
        let minDistance = Infinity;
        const viewportCenter = window.innerWidth / 2;
        
        const cards = track.querySelectorAll('.live-site-card');
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - viewportCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });
        
        cards.forEach(card => {
            if (card === closestCard) {
                card.classList.add('active-center');
            } else {
                card.classList.remove('active-center');
            }
        });
    }
    
    function setupMetrics() {
        recalculateMetrics();
        updateScroll();
    }
    
    window.addEventListener('scroll', updateScroll);
    window.addEventListener('resize', setupMetrics);
    setupMetrics();
}

/* Interactive Floating Character Drone (Desktop, Tablet & Mobile) */
function initCharacterInteraction() {
    const container = document.getElementById('characterContainer');
    const avatar = document.getElementById('character-avatar');
    
    if (!container || !avatar) return;
    
    function getCoordinates(sectionId) {
        const isMobile = window.innerWidth <= 900;
        const desktopCoords = {
            'hero': { top: '40vh', left: '76vw', scale: 1 },
            'skills': { top: '55vh', left: '16vw', scale: 0.9 },
            'about': { top: '40vh', left: '78vw', scale: 1 },
            'live-sites': { top: '22vh', left: '80vw', scale: 0.8 },
            'projects': { top: '50vh', left: '78vw', scale: 0.95 },
            'contact': { top: '55vh', left: '78vw', scale: 1 }
        };
        
        const mobileCoords = {
            'hero': { top: '38vh', left: '84vw', scale: 0.65 },
            'skills': { top: '45vh', left: '84vw', scale: 0.55 },
            'about': { top: '38vh', left: '84vw', scale: 0.6 },
            'live-sites': { top: '22vh', left: '84vw', scale: 0.55 },
            'projects': { top: '38vh', left: '84vw', scale: 0.55 },
            'contact': { top: '48vh', left: '84vw', scale: 0.6 }
        };

        return isMobile ? (mobileCoords[sectionId] || mobileCoords['hero']) : (desktopCoords[sectionId] || desktopCoords['hero']);
    }
    
    // 1. Move character based on active section
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                const targetPos = getCoordinates(sectionId);
                
                if (targetPos) {
                    container.style.top = targetPos.top;
                    container.style.left = targetPos.left;
                    container.style.transform = `translate(-50%, -50%) scale(${targetPos.scale})`;
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => observer.observe(section));
    
    // 2. Cursor & Touch tracking (Head and Eyes movement)
    function trackTarget(clientX, clientY) {
        const rect = avatar.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;
        
        const deltaX = clientX - charX;
        const deltaY = clientY - charY;
        const distance = Math.hypot(deltaX, deltaY) || 1;
        
        const maxPupilMove = 6;
        const maxHeadMove = 8;
        const maxHeadRotate = 12;
        
        const factor = Math.min(distance / 500, 1);
        const angle = Math.atan2(deltaY, deltaX);
        
        const pupilX = Math.cos(angle) * maxPupilMove * factor;
        const pupilY = Math.sin(angle) * maxPupilMove * factor;
        
        const headX = Math.cos(angle) * maxHeadMove * factor;
        const headY = Math.sin(angle) * maxHeadMove * factor;
        const headRotate = (deltaX / window.innerWidth) * maxHeadRotate;
        
        // Transform Pupils
        avatar.querySelectorAll('.eye-pupil').forEach(pupil => {
            pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        });
        
        // Transform Head Group
        const head = avatar.querySelector('.avatar-head');
        if (head) {
            head.style.transform = `translate(${headX}px, ${headY}px) rotate(${headRotate}deg)`;
        }
    }

    window.addEventListener('mousemove', (e) => trackTarget(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
            trackTarget(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initScrollSpy();
    initMobileMenu();
    initScrollIndicator();
    initSplitScreenProgress();
    initTimelineProgress();
    initEntranceReveals();
    initSlideshows();
    initSmoothScroll();
    initHorizontalScroll();
    initCharacterInteraction();
    
    // Hide loader screen
    setTimeout(() => {
        hideLoadingScreen();
    }, 1000);
});