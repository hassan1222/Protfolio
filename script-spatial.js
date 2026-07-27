/* Spatial Gaze Cursor Tracker */
const cursor = document.getElementById('spatialCursor');
const cursorDot = cursor?.querySelector('.cursor-dot');
const cursorRing = cursor?.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0; // Actual mouse position
let ringX = 0, ringY = 0;   // Interpolated ring position
let dotX = 0, dotY = 0;     // Interpolated dot position

let isHovering = false;
let targetEl = null;

// Track mouse moves
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
});

// Update cursor positions with damping (smooth follow)
function updateCursor() {
    if (!cursor) return;

    if (isHovering && targetEl) {
        // Snap to center of hovered element (magnetic eye-tracking effect)
        const rect = targetEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Damping towards the snapped target
        ringX += (centerX - ringX) * 0.25;
        ringY += (centerY - ringY) * 0.25;
        
        // Dot still follows mouse slightly for interactive depth
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
    } else {
        // Normal follow
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
    }

    if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
    }
    if (cursorDot) {
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
    }

    requestAnimationFrame(updateCursor);
}
requestAnimationFrame(updateCursor);

// Set up cursor hover state triggers
function initCursorInteractions() {
    const interactables = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .contact-link');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            isHovering = true;
            targetEl = e.currentTarget;
            cursor.classList.add('hovering');
        });
        
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            targetEl = null;
            cursor.classList.remove('hovering');
        });
    });
}

/* 3D Tilt Effect on Spatial Cards */
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt], .skill-card, .project-card, .experience-card');
    
    tiltElements.forEach(card => {
        // Ensure styling supports reflection glows
        if (!card.querySelector('.card-glow')) {
            const glow = document.createElement('div');
            glow.className = 'card-glow';
            card.appendChild(glow);
        }
        
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                background: radial-gradient(circle 120px at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255, 255, 255, 0.08), transparent 80%);
                z-index: 3;
                border-radius: inherit;
                opacity: 0;
                transition: opacity 0.3s;
            `;
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside element
            const y = e.clientY - rect.top;  // y coordinate inside element
            
            // Normalize values (-0.5 to 0.5)
            const normX = (x / rect.width) - 0.5;
            const normY = (y / rect.height) - 0.5;
            
            // Max rotation degrees
            const maxRot = 10;
            const rotateX = -normY * maxRot;
            const rotateY = normX * maxRot;
            
            // Apply 3D rotations
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            card.style.boxShadow = `0 35px 70px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(6, 182, 212, 0.15)`;
            
            // Position reflection glow
            if (glow) {
                glow.style.opacity = '1';
                card.style.setProperty('--glow-x', `${x}px`);
                card.style.setProperty('--glow-y', `${y}px`);
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transforms smoothly
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            card.style.boxShadow = '';
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
}

/* Floating Navigation ScrollSpy */
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link-item');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // offset for triggers
        
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
        
        // Update header background blur styling on scroll
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 15, 0.7)';
                navbar.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            } else {
                navbar.style.background = 'rgba(10, 10, 15, 0.45)';
                navbar.style.borderColor = 'var(--border-glass)';
            }
        }
    });
}

/* Scroll Progress Indicator */
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

/* CV Download Handler */
function downloadCV() {
    const link = document.createElement('a');
    link.href = 'assets/HassanShahzad (cv).pdf';
    link.download = 'Hassan_Shahzad_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('<i class="bx bx-check-circle"></i> CV download started!');
}

/* Custom Notification System */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: rgba(18, 18, 28, 0.85);
        backdrop-filter: blur(20px);
        border: 1px solid var(--accent-cyan);
        color: var(--text-primary);
        padding: 16px 28px;
        border-radius: 50px;
        font-family: var(--font-heading);
        font-weight: 600;
        z-index: 100000;
        box-shadow: var(--spatial-shadow), 0 0 20px rgba(6, 182, 212, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    `;
    
    // Inject animation styles
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInUp {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOutDown {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 3000);
}

/* Image Slideshows Synchronized with Dots */
function initSlideshows() {
    document.querySelectorAll(".slideshow").forEach(img => {
        const images = JSON.parse(img.dataset.images);
        const card = img.closest('.project-card');
        const dots = card?.querySelectorAll('.indicator-dot');
        
        let index = 0;
        
        setInterval(() => {
            index = (index + 1) % images.length;
            img.src = images[index];
            
            // Sync indicators
            if (dots && dots.length > index) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
            }
        }, 3000);
    });
}

/* Smooth Scrolling for Navigation Links */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Focus active tab manually on click
                document.querySelectorAll('.nav-link-item').forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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

/* Intersection Observer animations for Spatial entrance */
function initEntranceAnimations() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.skill-card, .project-card, .experience-card, .about-text, .contact-wrapper, .hero-panel, .hero-widget').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        observer.observe(el);
    });
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
    initCursorInteractions();
    initTiltEffect();
    initScrollSpy();
    initScrollIndicator();
    initSlideshows();
    initSmoothScroll();
    initEntranceAnimations();
    
    // Hide loading screen after short delay
    setTimeout(() => {
        hideLoadingScreen();
    }, 1200);
});