// Product page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initProductFilters();
    initProductCards();
    initQuickView();
});

// Product filtering functionality
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products with animation
            productCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    // Show product with staggered animation
                    setTimeout(() => {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            card.style.transition = 'all 0.3s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 50);
                } else {
                    // Hide product
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Product card interactions
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add hover effect to product image
        const image = card.querySelector('.product-image img');
        if (image) {
            card.addEventListener('mouseenter', function() {
                image.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', function() {
                image.style.transform = 'scale(1)';
            });
        }
        
        // Add click analytics (you can replace this with actual analytics)
        card.addEventListener('click', function() {
            const productName = card.querySelector('h3').textContent;
            console.log('Product clicked:', productName);
            
            // Track product view
            trackProductView(productName);
        });
    });
}

// Quick view functionality
function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            showQuickView(productCard);
        });
    });
}

// Show quick view modal
function showQuickView(productCard) {
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const productImage = productCard.querySelector('.product-image img').src;
    const productDescription = productCard.querySelector('p').textContent;
    
    const modal = createQuickViewModal({
        name: productName,
        price: productPrice,
        image: productImage,
        description: productDescription
    });
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    [closeBtn, overlay].forEach(element => {
        element.addEventListener('click', function() {
            closeQuickView(modal);
        });
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeQuickView(modal);
        }
    });
}

// Create quick view modal
function createQuickViewModal(product) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-info">
                    <h2>${product.name}</h2>
                    <p class="modal-description">${product.description}</p>
                    <div class="modal-price">${product.price}</div>
                    <div class="modal-actions">
                        <button class="whatsapp-btn" onclick="contactWhatsApp('${product.name}')">
                            <i class="fab fa-whatsapp"></i>
                            Consultar por WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// Close quick view modal
function closeQuickView(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Product search functionality
function initProductSearch() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;
    
    const productCards = document.querySelectorAll('.product-card');
    
    searchInput.addEventListener('input', utils.debounce(function() {
        const searchTerm = this.value.toLowerCase();
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDescription = card.querySelector('p').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.add('fade-in-up');
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in-up');
            }
        });
        
        // Show no results message if needed
        const visibleCards = Array.from(productCards).filter(card => 
            card.style.display !== 'none'
        );
        
        showNoResultsMessage(visibleCards.length === 0);
    }, 300));
}

// Show/hide no results message
function showNoResultsMessage(show) {
    let noResultsElement = document.querySelector('.no-results-message');
    
    if (show && !noResultsElement) {
        noResultsElement = document.createElement('div');
        noResultsElement.className = 'no-results-message';
        noResultsElement.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términ os de búsqueda</p>
            </div>
        `;
        
        const productsGrid = document.getElementById('products-grid');
        productsGrid.appendChild(noResultsElement);
    } else if (!show && noResultsElement) {
        noResultsElement.remove();
    }
}

// Product comparison functionality
function initProductComparison() {
    const compareButtons = document.querySelectorAll('.compare-btn');
    let comparisonList = [];
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            
            if (comparisonList.includes(productId)) {
                // Remove from comparison
                comparisonList = comparisonList.filter(id => id !== productId);
                this.classList.remove('active');
            } else {
                // Add to comparison (max 3 products)
                if (comparisonList.length < 3) {
                    comparisonList.push(productId);
                    this.classList.add('active');
                } else {
                    showNotification('Máximo 3 productos para comparar', 'warning');
                }
            }
            
            updateComparisonBar();
        });
    });
}

// Update comparison bar
function updateComparisonBar() {
    let comparisonBar = document.querySelector('.comparison-bar');
    
    if (comparisonList.length > 0) {
        if (!comparisonBar) {
            comparisonBar = createComparisonBar();
            document.body.appendChild(comparisonBar);
        }
        
        comparisonBar.querySelector('.comparison-count').textContent = comparisonList.length;
        comparisonBar.classList.add('show');
    } else if (comparisonBar) {
        comparisonBar.classList.remove('show');
    }
}

// Create comparison bar
function createComparisonBar() {
    const bar = document.createElement('div');
    bar.className = 'comparison-bar';
    bar.innerHTML = `
        <div class="comparison-content">
            <span class="comparison-text">
                <span class="comparison-count">0</span> productos seleccionados para comparar
            </span>
            <div class="comparison-actions">
                <button class="btn btn-primary btn-sm" onclick="showComparison()">
                    Comparar
                </button>
                <button class="btn btn-secondary btn-sm" onclick="clearComparison()">
                    Limpiar
                </button>
            </div>
        </div>
    `;
    
    return bar;
}

// Product sorting functionality
function initProductSorting() {
    const sortSelect = document.getElementById('product-sort');
    if (!sortSelect) return;
    
    const productGrid = document.getElementById('products-grid');
    const productCards = Array.from(productGrid.querySelectorAll('.product-card'));
    
    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        let sortedCards = [...productCards];
        
        switch (sortBy) {
            case 'name-asc':
                sortedCards.sort((a, b) => {
                    const nameA = a.querySelector('h3').textContent;
                    const nameB = b.querySelector('h3').textContent;
                    return nameA.localeCompare(nameB);
                });
                break;
            case 'name-desc':
                sortedCards.sort((a, b) => {
                    const nameA = a.querySelector('h3').textContent;
                    const nameB = b.querySelector('h3').textContent;
                    return nameB.localeCompare(nameA);
                });
                break;
            case 'price-asc':
                sortedCards.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                sortedCards.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                    return priceB - priceA;
                });
                break;
        }
        
        // Re-append sorted cards
        sortedCards.forEach(card => {
            productGrid.appendChild(card);
        });
        
        // Add animation
        sortedCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    });
}

// Track product view (analytics)
function trackProductView(productName) {
    // This is where you would send data to your analytics service
    console.log('Product view tracked:', productName);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_item', {
            'item_name': productName,
            'item_category': 'Oil Products'
        });
    }
}

// Initialize all product functionality
document.addEventListener('DOMContentLoaded', function() {
    initProductSearch();
    initProductComparison();
    initProductSorting();
});

// Add CSS for quick view modal and other product features
const productStyles = `
    .quick-view-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .quick-view-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
    }
    
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 1;
        color: #666;
    }
    
    .modal-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
    }
    
    .modal-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
    }
    
    .modal-info h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #1f2937;
    }
    
    .modal-description {
        color: #6b7280;
        margin-bottom: 1rem;
    }
    
    .modal-price {
        font-size: 2rem;
        font-weight: 700;
        color: #1e40af;
        margin-bottom: 1.5rem;
    }
    
    .comparison-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #1f2937;
        color: white;
        padding: 1rem;
        transform: translateY(100%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }
    
    .comparison-bar.show {
        transform: translateY(0);
    }
    
    .comparison-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .comparison-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .no-results-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #6b7280;
    }
    
    .no-results-content i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #d1d5db;
    }
    
    @media (max-width: 768px) {
        .modal-body {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
        }
        
        .comparison-content {
            flex-direction: column;
            gap: 1rem;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = productStyles;
document.head.appendChild(styleSheet);