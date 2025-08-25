// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQInteractions();
    initMapInteractions();
});

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateContactForm()) {
            showNotification('Por favor, completa todos los campos requeridos', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Get form data
            const formData = new FormData(contactForm);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Process form submission
            handleContactFormSubmission(contactData);
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Show success message
            showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            
        }, 2000);
    });
    
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error state when user starts typing
            const formGroup = this.closest('.form-group');
            formGroup.classList.remove('error');
        });
    });
}

// Validate contact form
function validateContactForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    let isValid = true;
    
    // Remove existing error states
    formGroup.classList.remove('error');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        formGroup.classList.add('error');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            formGroup.classList.add('error');
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            formGroup.classList.add('error');
            isValid = false;
        }
    }
    
    // Message length validation
    if (field.name === 'message' && value && value.length < 10) {
        formGroup.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

// Handle form submission
function handleContactFormSubmission(data) {
    // This is where you would send the data to your server
    console.log('Contact form submitted:', data);
    
    // Example: Send to WhatsApp
    const message = `
Nuevo mensaje de contacto:

Nombre: ${data.name}
Email: ${data.email}
Teléfono: ${data.phone || 'No proporcionado'}
Asunto: ${data.subject}

Mensaje:
${data.message}
    `.trim();
    
    // You could also send this via WhatsApp
    contactWhatsApp('', message);
    
    // Track form submission
    trackContactFormSubmission(data.subject);
}

// FAQ interactions
function initFAQInteractions() {
    console.log("hehehhehe")
    question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');
    
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
            faqItem.querySelector('.faq-answer').style.maxHeight = null;  // reset height
        });
    
        if (!isActive) {
            item.classList.add('active');
            const answer = item.querySelector('.faq-answer');
            answer.style.maxHeight = answer.scrollHeight + "px";  // asigna la altura real para animar
        }
    });
    
    
}

// Map interactions
function initMapInteractions() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    // Add click handler for map placeholder
    const mapPlaceholder = mapContainer.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            // Open Google Maps
            const mapsUrl = `https://maps.app.goo.gl/LrLNg51EH4igWnW39`;
            window.open(mapsUrl, '_blank');
        });
    }
}

// Contact method interactions
function initContactMethods() {
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const info = this.querySelector('.method-info p').textContent;
            
            if (icon.classList.contains('fa-phone')) {
                // Call phone number
                window.location.href = `tel:${info}`;
            } else if (icon.classList.contains('fa-whatsapp')) {
                // Open WhatsApp
                contactWhatsApp();
            } else if (icon.classList.contains('fa-envelope')) {
                // Open email client
                window.location.href = `mailto:${info}`;
            } else if (icon.classList.contains('fa-map-marker-alt')) {
                // Open maps
                const address = encodeURIComponent(info);
                const mapsUrl = `https://maps.app.goo.gl/LrLNg51EH4igWnW39`;
                window.open(mapsUrl, '_blank');
            }
        });
    });
}

// Social media interactions
function initSocialMediaLinks() {
    const socialLinks = document.querySelectorAll('.social-contact .social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const icon = this.querySelector('i');
            let url = '#';
            
            if (icon.classList.contains('fa-facebook-f')) {
                url = 'https://facebook.com/elrinconcito';
            } else if (icon.classList.contains('fa-instagram')) {
                url = 'https://instagram.com/elrinconcito';
            } else if (icon.classList.contains('fa-whatsapp')) {
                contactWhatsApp();
                return;
            }
            
            if (url !== '#') {
                window.open(url, '_blank');
            }
        });
    });
}

// Track contact form submission
function trackContactFormSubmission(subject) {
    console.log('Contact form submission tracked:', subject);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'form_name': 'contact_form',
            'form_subject': subject
        });
    }
}

// Auto-fill form from URL parameters
function autoFillFormFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Auto-fill product inquiry
    const product = urlParams.get('product');
    if (product) {
        const subjectSelect = form.querySelector('#subject');
        const messageTextarea = form.querySelector('#message');
        
        if (subjectSelect) {
            subjectSelect.value = 'consulta-producto';
        }
        
        if (messageTextarea) {
            messageTextarea.value = `Hola, me interesa obtener información sobre: ${product}`;
        }
    }
}

// Initialize contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactMethods();
    initSocialMediaLinks();
    autoFillFormFromURL();
});

// Add contact page specific styles
const contactStyles = `
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .form-group.error label {
        color: #ef4444;
    }
    
    .contact-method {
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 1rem;
        border-radius: 8px;
    }
    
    .contact-method:hover {
        background: #f9fafb;
        transform: translateY(-2px);
    }
    
    .map-placeholder {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .map-placeholder:hover {
        background: #f9fafb;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    }
    
    .notification-success {
        background: #22c55e;
    }
    
    .notification-error {
        background: #ef4444;
    }
    
    .notification-warning {
        background: #f59e0b;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

// Inject contact styles
const contactStyleSheet = document.createElement('style');
contactStyleSheet.textContent = contactStyles;
document.head.appendChild(contactStyleSheet);