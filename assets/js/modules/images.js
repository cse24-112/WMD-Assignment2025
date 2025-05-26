// Image handling module
export function initImageHandling() {
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize image error handling
    initImageErrorHandling();
    
    // Initialize background image handling
    initBackgroundImages();
}

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        loadImage(img, img.dataset.src)
                            .then(() => observer.unobserve(img))
                            .catch(error => handleImageError(img, error));
                    }
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

function initImageErrorHandling() {
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }

        img.addEventListener('error', function(e) {
            handleImageError(this, e);
        });

        img.addEventListener('load', function() {
            this.classList.remove('error');
            this.classList.add('loaded');
        });
    });
}

function initBackgroundImages() {
    const elementsWithBgImage = document.querySelectorAll('[data-background]');
    elementsWithBgImage.forEach(el => {
        const url = el.dataset.background;
        if (url) {
            loadImage(el, url)
                .then(() => {
                    el.style.backgroundImage = `url(${url})`;
                    el.classList.add('background-loaded');
                })
                .catch(error => {
                    console.error('Background image loading error:', error);
                    handleBackgroundImageError(el);
                });
        }
    });
}

function loadImage(element, src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        
        img.src = src;
    });
}

function handleImageError(img, error) {
    console.error('Image loading error:', error);
    
    img.classList.add('error');
    
    // Try alternative image formats
    if (img.src.endsWith('.jpg')) {
        tryAlternativeFormat(img, '.jpg', '.jpeg');
    } else if (img.src.endsWith('.jpeg')) {
        tryAlternativeFormat(img, '.jpeg', '.jpg');
    } else if (img.src.endsWith('.png')) {
        tryAlternativeFormat(img, '.png', '.jpg');
    }
    
    // Add placeholder or fallback
    if (img.classList.contains('error')) {
        addImagePlaceholder(img);
    }
}

function handleBackgroundImageError(element) {
    element.classList.add('background-error');
    
    // Try alternative formats for background images
    const currentBg = element.style.backgroundImage;
    if (currentBg) {
        const url = currentBg.slice(4, -1).replace(/"/g, "");
        if (url.endsWith('.jpg')) {
            tryAlternativeBackgroundFormat(element, '.jpg', '.jpeg');
        } else if (url.endsWith('.jpeg')) {
            tryAlternativeBackgroundFormat(element, '.jpeg', '.jpg');
        }
    }
}

function tryAlternativeFormat(img, currentExt, newExt) {
    const newSrc = img.src.replace(currentExt, newExt);
    loadImage(img, newSrc)
        .then(() => {
            img.src = newSrc;
            img.classList.remove('error');
        })
        .catch(() => {
            // Keep the error class if alternative format also fails
            img.classList.add('error');
        });
}

function tryAlternativeBackgroundFormat(element, currentExt, newExt) {
    const currentBg = element.style.backgroundImage;
    const url = currentBg.slice(4, -1).replace(/"/g, "");
    const newUrl = url.replace(currentExt, newExt);
    
    loadImage(element, newUrl)
        .then(() => {
            element.style.backgroundImage = `url(${newUrl})`;
            element.classList.remove('background-error');
        })
        .catch(() => {
            // Keep the error class if alternative format also fails
            element.classList.add('background-error');
        });
}

function addImagePlaceholder(img) {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    
    // Add icon or text based on image type
    if (img.classList.contains('testimonial-avatar')) {
        placeholder.innerHTML = '<i class="fas fa-user"></i>';
    } else if (img.classList.contains('logo')) {
        placeholder.innerHTML = '<i class="fas fa-building"></i>';
    } else {
        placeholder.innerHTML = '<i class="fas fa-image"></i>';
    }
    
    // Add aria-label for accessibility
    placeholder.setAttribute('aria-label', img.alt || 'Image placeholder');
    
    // Replace image with placeholder
    img.parentNode.insertBefore(placeholder, img);
    img.style.display = 'none';
} 