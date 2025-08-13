// Grand Crispy's Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initScrollEffects();
    initFormHandling();
    initScrollAnimations();
});

// Navigation functionality - Fixed
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const offsetTop = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Add active class to current section on scroll
    window.addEventListener('scroll', debounce(function() {
        const scrollPosition = window.scrollY + 150;
        
        navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const sectionTop = targetSection.offsetTop;
                const sectionHeight = targetSection.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }, 100));
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Scroll effects for navbar
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }, 10));
}

// Form handling - Fixed validation
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Add real-time validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');
        
        // Add input event listeners for real-time feedback
        [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
            if (input) {
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                input.addEventListener('input', function() {
                    // Remove error styling while typing
                    this.classList.remove('error');
                    const errorMsg = this.parentNode.querySelector('.field-error');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                });
            }
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            
            // Clear previous errors
            clearFormErrors();
            
            // Validate all fields
            let isValid = true;
            if (!validateField(nameInput)) isValid = false;
            if (!validateField(emailInput)) isValid = false;
            if (!validateField(phoneInput)) isValid = false;
            if (!validateField(messageInput)) isValid = false;
            
            if (isValid) {
                // Show success message
                showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Track form submission
                trackEvent('form_submitted', { name, email });
            } else {
                showMessage('Please correct the errors below and try again.', 'error');
            }
        });
    }
}

// Field validation helper
function validateField(field) {
    if (!field) return false;
    
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldId = field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation rules
    switch (fieldId) {
        case 'name':
            if (value === '') {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value === '') {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\+]?[0-9\-\s\(\)]{10,}$/;
            if (value === '') {
                errorMessage = 'Phone number is required';
                isValid = false;
            } else if (!phoneRegex.test(value)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
            break;
            
        case 'message':
            if (value === '') {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }
    
    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--color-error);
        font-size: 12px;
        margin-top: 4px;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear form errors
function clearFormErrors() {
    const errorFields = document.querySelectorAll('.form-control.error');
    const errorMessages = document.querySelectorAll('.field-error');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(msg => msg.remove());
}

// Show message function - Enhanced
function showMessage(text, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message status ${type === 'success' ? 'status--success' : 'status--error'}`;
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-weight: 500;
        text-align: center;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(-10px);
    `;
    
    // Insert message before form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.parentNode.insertBefore(messageDiv, contactForm);
        
        // Animate in
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }, 5000);
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.section-header, .special-card, .highlight-card, .pricing-card, .combo-card, .about-text, .about-image'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}


    
    // Show/hide button based on scroll position


// Loading animation for images
function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading placeholder
        img.style.backgroundColor = '#f0f0f0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.backgroundColor = 'transparent';
        });
        
        img.addEventListener('error', function() {
            console.warn('Failed to load image:', this.src);
            this.style.backgroundColor = '#f0f0f0';
            this.alt = 'Image not available';
        });
        
        // If image is already loaded
        if (img.complete && img.naturalHeight !== 0) {
            img.style.opacity = '1';
            img.style.backgroundColor = 'transparent';
        }
    });
}

// Initialize image loading
initImageLoading();

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced mobile menu styles
function addMobileMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 70px;
                right: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 2rem;
                transition: right 0.3s ease;
                z-index: 999;
            }
            
            .nav-menu.active {
                right: 0;
            }
            
            .nav-menu li {
                margin: 1rem 0;
            }
            
            .nav-link {
                font-size: 1.2rem;
                color: var(--color-text);
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px);
            }
            
            .scroll-to-top {
                bottom: 80px !important;
                right: 16px !important;
                width: 45px !important;
                height: 45px !important;
                font-size: 18px !important;
            }
        }
        
        .form-control.error {
            border-color: var(--color-error);
            box-shadow: 0 0 0 2px rgba(192, 21, 47, 0.1);
        }
        
        .field-error {
            animation: slideInError 0.3s ease;
        }
        
        @keyframes slideInError {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Add mobile menu styles
addMobileMenuStyles();

// Add hover effects for interactive elements
function initHoverEffects() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.matches(':active') && !this.disabled) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.special-card, .highlight-card, .pricing-card, .combo-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize hover effects
initHoverEffects();

// Console welcome message
console.log(`
🍗 Welcome to Grand Crispy's Website!
🌟 Authentic Halal Fried Chicken & Al Faham Specialists
📞 Contact us for orders and inquiries
`);

// Analytics helper (placeholder for real implementation)
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // In a real application, you would send this to an analytics service
}

// Track navigation clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-link')) {
        const section = e.target.getAttribute('href').replace('#', '');
        trackEvent('navigation_click', { section });
    }
    
    if (e.target.matches('.btn')) {
        const buttonText = e.target.textContent.trim();
        trackEvent('button_click', { button_text: buttonText });
    }
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'https://pplx-res.cloudinary.com/image/upload/v1752920127/pplx_project_search_images/ac5820d55fc2a9bdeafd8d322a595cf2e306fa65.jpg',
        'https://pplx-res.cloudinary.com/image/upload/v1748683933/pplx_project_search_images/1f0f08f74c4af3f30783c33a729fcc8ab39865cb.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// Ensure all images are properly loaded and visible
window.addEventListener('load', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
            img.style.opacity = '1';
        }
    });
});

document.head.appendChild(style);



