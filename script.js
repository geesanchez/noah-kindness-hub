// Remove dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form validation for submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                // Handle form submission
                submitForm(this);
            }
        });
    });

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });

    // Loading states for buttons
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                this.innerHTML = '<span class="spinner"></span> Loading...';
                
                // Simulate loading (remove in production)
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = this.getAttribute('data-original-text') || 'Submit';
                }, 1000);
            }
        });
    });

    // Gallery category filtering
    const galleryCategories = document.querySelectorAll('.gallery-category');
    const galleryCards = document.querySelectorAll('.gallery-card');

    if (galleryCategories.length > 0) {
        galleryCategories.forEach(category => {
            category.addEventListener('click', function() {
                // Remove active class from all categories
                galleryCategories.forEach(cat => cat.classList.remove('active'));
                // Add active class to clicked category
                this.classList.add('active');

                const selectedCategory = this.textContent.toLowerCase();
                
                // Filter gallery cards
                galleryCards.forEach(card => {
                    const cardCategory = card.querySelector('.gallery-badge').textContent.toLowerCase();
                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        card.style.display = 'block';
                        // Add animation
                        card.style.animation = 'fadeIn 0.5s ease-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Gallery form submission
    const galleryForm = document.getElementById('galleryForm');
    if (galleryForm) {
        galleryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Submitting...';

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success';
                successMessage.textContent = 'Thank you for your submission! Your creation will be reviewed and added to the gallery soon.';
                this.parentNode.insertBefore(successMessage, this);

                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalText;

                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        });
    }

    // Image preview for gallery form
    const imageInput = document.getElementById('image');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Create preview container if it doesn't exist
                    let previewContainer = document.querySelector('.image-preview');
                    if (!previewContainer) {
                        previewContainer = document.createElement('div');
                        previewContainer.className = 'image-preview';
                        imageInput.parentNode.appendChild(previewContainer);
                    }

                    // Create or update preview image
                    let previewImage = previewContainer.querySelector('img');
                    if (!previewImage) {
                        previewImage = document.createElement('img');
                        previewContainer.appendChild(previewImage);
                    }
                    previewImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Track current page
    const currentPage = document.title.replace(' - Noah\'s Kindness Hub', '');
    trackActivity(currentPage, window.location.pathname);

    // Add click tracking to navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const pageName = this.textContent.trim();
            trackActivity(pageName, this.href);
        });
    });

    // Update display
    updateRecentActivityDisplay();
});

// Form validation function
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'This field is required';
            field.parentNode.appendChild(errorMessage);
        } else {
            field.classList.remove('error');
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    });
    
    return isValid;
}

// Form submission function
function submitForm(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span> Submitting...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your submission!';
        form.appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }, 1500);
}

// Add loading animation styles
const style = document.createElement('style');
style.textContent = `
    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-right: 10px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .error {
        border-color: var(--red-accent) !important;
    }
    
    .error-message {
        color: var(--red-accent);
        font-size: 0.8rem;
        margin-top: 5px;
    }
    
    .success-message {
        color: var(--green-accent);
        font-size: 1rem;
        margin-top: 10px;
        text-align: center;
    }
    
    .loading {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Recent Activity Tracking
const MAX_RECENT_ACTIVITIES = 5;

function trackActivity(pageName, pageUrl) {
    const activity = {
        page: pageName,
        url: pageUrl,
        timestamp: new Date().toISOString()
    };

    // Get existing activities
    let recentActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
    
    // Add new activity at the beginning
    recentActivities.unshift(activity);
    
    // Keep only the most recent activities
    recentActivities = recentActivities.slice(0, MAX_RECENT_ACTIVITIES);
    
    // Save back to localStorage
    localStorage.setItem('recentActivities', JSON.stringify(recentActivities));
    
    // Update the display if the element exists
    updateRecentActivityDisplay();
}

function updateRecentActivityDisplay() {
    const recentActivityContainer = document.querySelector('.recent-activity');
    if (!recentActivityContainer) return;

    const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
    
    if (activities.length === 0) {
        recentActivityContainer.innerHTML = '<p>No recent activity</p>';
        return;
    }

    const activityList = activities.map(activity => {
        const date = new Date(activity.timestamp);
        const timeAgo = getTimeAgo(date);
        return `
            <div class="activity-item">
                <a href="${activity.url}">${activity.page}</a>
                <span class="activity-time">${timeAgo}</span>
            </div>
        `;
    }).join('');

    recentActivityContainer.innerHTML = `
        <h3>Recent Activity</h3>
        <div class="activity-list">
            ${activityList}
        </div>
    `;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
} 