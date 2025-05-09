// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        image: "/api/placeholder/300/300",
        category: "electronics",
        featured: true
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 129.99,
        image: "/api/placeholder/300/300",
        category: "electronics",
        featured: true
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 24.99,
        image: "/api/placeholder/300/300",
        category: "clothing",
        featured: false
    },
    {
        id: 4,
        name: "Kitchen Blender",
        price: 89.99,
        image: "/api/placeholder/300/300",
        category: "home",
        featured: true
    },
    {
        id: 5,
        name: "Denim Jeans",
        price: 49.99,
        image: "/api/placeholder/300/300",
        category: "clothing",
        featured: false
    },
    {
        id: 6,
        name: "Coffee Maker",
        price: 59.99,
        image: "/api/placeholder/300/300",
        category: "home",
        featured: true
    },
    {
        id: 7,
        name: "Smartphone",
        price: 399.99,
        image: "/api/placeholder/300/300",
        category: "electronics",
        featured: false
    },
    {
        id: 8,
        name: "Desk Lamp",
        price: 34.99,
        image: "/api/placeholder/300/300",
        category: "home",
        featured: false
    }
];

// DOM Elements
const cartLink = document.getElementById('cart-link');
const cartModal = document.getElementById('cart-modal');
const closeBtn = document.querySelector('.close-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const featuredProductsContainer = document.getElementById('featured-products');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');

// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    
    // Initialize features based on current page
    if (document.querySelector('.featured-products')) {
        loadFeaturedProducts();
    }
    
    if (document.getElementById('all-products')) {
        loadAllProducts();
        setupFilters();
    }
    
    if (document.getElementById('newsletter-form')) {
        setupNewsletterForm();
    }
    
    if (document.getElementById('contactForm')) {
        setupContactForm();
    }
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
});

// Cart Modal Functionality
if (cartLink) {
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        updateCartModal();
        cartModal.style.display = 'block';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Update cart modal content
function updateCartModal() {
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        
        total += product.price * item.quantity;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="cart-item-details">
                <h4>${product.name}</h4>
                <p>$${product.price.toFixed(2)} x ${item.quantity}</p>
                <button class="remove-btn" data-id="${product.id}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Add to cart function
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show added to cart notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

// Load featured products on home page
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;
    
    const featuredProducts = products.filter(product => product.featured);
    
    featuredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        featuredProductsContainer.appendChild(productElement);
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Load all products on products page
function loadAllProducts() {
    const allProductsContainer = document.getElementById('all-products');
    if (!allProductsContainer) return;
    
    displayProducts(products, allProductsContainer);
}

// Display products in container
function displayProducts(productsToDisplay, container) {
    container.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        document.getElementById('no-results').style.display = 'block';
        return;
    }
    
    document.getElementById('no-results').style.display = 'none';
    
    productsToDisplay.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="category">${product.category}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        container.appendChild(productElement);
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Setup product filters
function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortBy = document.getElementById('sort-by');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const productsContainer = document.getElementById('all-products');
    
    if (!categoryFilter || !priceFilter || !sortBy) return;
    
    function filterAndSortProducts() {
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;
        const selectedSort = sortBy.value;
        
        let filteredProducts = [...products];
        
        // Filter by category
        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(
                product => product.category === selectedCategory
            );
        }
        
        // Filter by price
        if (selectedPrice !== 'all') {
            switch (selectedPrice) {
                case 'under50':
                    filteredProducts = filteredProducts.filter(
                        product => product.price < 50
                    );
                    break;
                case '50to100':
                    filteredProducts = filteredProducts.filter(
                        product => product.price >= 50 && product.price <= 100
                    );
                    break;
                case 'over100':
                    filteredProducts = filteredProducts.filter(
                        product => product.price > 100
                    );
                    break;
            }
        }
        
        // Sort products
        switch (selectedSort) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
        
        displayProducts(filteredProducts, productsContainer);
    }
    
    categoryFilter.addEventListener('change', filterAndSortProducts);
    priceFilter.addEventListener('change', filterAndSortProducts);
    sortBy.addEventListener('change', filterAndSortProducts);
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            categoryFilter.value = 'all';
            priceFilter.value = 'all';
            sortBy.value = 'default';
            filterAndSortProducts();
        });
    }
}

// Setup newsletter form
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Validate email (simple validation)
        if (!email || !email.includes('@')) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // In a real app, you would send this to your server
        console.log('Subscribed email:', email);
        
        // Show success message
        showNotification('Thanks for subscribing!', 'success');
        
        // Reset form
        this.reset();
    });
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('#name').value;
            const email = this.querySelector('#email').value;
            const subject = this.querySelector('#subject').value;
            const message = this.querySelector('#message').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            if (!email.includes('@')) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            const formData = { name, email, subject, message };
            
            // In a real app, you would send this to your server
            console.log('Contact form submitted:', formData);
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Checkout button functionality
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        // In a real app, this would redirect to checkout page
        showNotification('Proceeding to checkout!', 'success');
        console.log('Checkout with items:', cart);
        
        // Clear cart after checkout
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartModal();
        cartModal.style.display = 'none';
    });
}