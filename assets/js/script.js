'use strict';

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [overlay, navCloseBtn, navOpenBtn];

/**
 * close navbar when click on any navbar link
 */

for (let i = 0; i < navbarLinks.length; i++) { navElemArr.push(navbarLinks[i]); }

/**
 * addd event on all elements for toggling navbar
 */

for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    elemToggleFunc(navbar);
    elemToggleFunc(overlay);
  });
}



/**
 * header active state
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 400 ? header.classList.add("active")
    : header.classList.remove("active");
});

// Modal handling
document.addEventListener('DOMContentLoaded', () => {
    // Clear any existing cart data and initialize fresh
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Initialize profile data if not exists
    if (!localStorage.getItem('userProfile')) {
        localStorage.setItem('userProfile', JSON.stringify({
            isLoggedIn: false,
            name: '',
            email: '',
            password: '',
            savedProperties: []
        }));
    }
    
    if (!localStorage.getItem('userPreferences')) {
        localStorage.setItem('userPreferences', JSON.stringify({
            notifications: false,
            newsletter: false,
            priceUpdates: false,
            saveSearch: false,
            autoFilter: false
        }));
    }

    // Get all modals and close buttons
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const searchBtn = document.querySelector('.header-bottom-actions-btn[aria-label="Search"]');
    const profileBtn = document.querySelector('.header-bottom-actions-btn[aria-label="Profile"]');
    const cartBtn = document.querySelector('.header-bottom-actions-btn[aria-label="Cart"]');
    const saveProfileBtn = document.getElementById('saveProfile');
    const savePreferencesBtn = document.getElementById('savePreferences');

    // Function to close all modals
    function closeAllModals() {
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Close modals when clicking close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target === modal) {
                closeAllModals();
            }
        });
    });

    // Search button now scrolls to properties section
    searchBtn.addEventListener('click', () => {
        document.getElementById('property').scrollIntoView({ behavior: 'smooth' });
    });

    // Profile button opens profile modal
    profileBtn.addEventListener('click', () => {
        closeAllModals(); // Close any open modals first
        const modal = document.getElementById('profileModal');
        modal.style.display = 'block';
        checkLoginStatus();
    });

    // Cart button opens cart modal
    cartBtn.addEventListener('click', () => {
        closeAllModals(); // Close any open modals first
        const modal = document.getElementById('cartModal');
        modal.style.display = 'block';
        updateCartDisplay();
    });

    // Save profile button
    saveProfileBtn.addEventListener('click', () => {
        const profileData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            password: document.getElementById('userPassword').value
        };
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        alert('Profile saved successfully!');
    });

    // Save preferences button
    savePreferencesBtn.addEventListener('click', () => {
        const preferencesData = {
            notifications: document.getElementById('notifications').checked,
            newsletter: document.getElementById('newsletter').checked,
            priceUpdates: document.getElementById('priceUpdates').checked,
            saveSearch: document.getElementById('saveSearch').checked,
            autoFilter: document.getElementById('autoFilter').checked
        };
        localStorage.setItem('userPreferences', JSON.stringify(preferencesData));
        alert('Preferences saved successfully!');
    });

    // Add event listeners to property cards for cart functionality
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        const addToCartBtn = card.querySelector('.card-footer-actions-btn:last-child');
        addToCartBtn.addEventListener('click', () => {
            const propertyId = card.dataset.propertyId;
            addToCart(propertyId);
        });
    });
});

function setupPropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        const addToCartBtn = card.querySelector('.card-footer-actions-btn:last-child');
        addToCartBtn.addEventListener('click', () => {
            const propertyId = card.dataset.propertyId;
            addToCart(propertyId);
        });
    });
}

function loadProfileData() {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
    const savedPreferences = JSON.parse(localStorage.getItem('userPreferences'));

    // Load profile data
    if (savedProfile) {
        document.getElementById('userName').value = savedProfile.name || '';
        document.getElementById('userEmail').value = savedProfile.email || '';
        document.getElementById('userPhone').value = savedProfile.phone || '';
        document.getElementById('userPassword').value = savedProfile.password || '';
    }

    // Load preferences
    if (savedPreferences) {
        document.getElementById('notifications').checked = savedPreferences.notifications || false;
        document.getElementById('newsletter').checked = savedPreferences.newsletter || false;
        document.getElementById('priceUpdates').checked = savedPreferences.priceUpdates || false;
        document.getElementById('saveSearch').checked = savedPreferences.saveSearch || false;
        document.getElementById('autoFilter').checked = savedPreferences.autoFilter || false;
    }
}

// Property Selection and Cart Management
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart if not exists
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Get all property cards
    const propertyCards = document.querySelectorAll('.property-card');
    
    // Add click event to each property's add button
    propertyCards.forEach(card => {
        const addButton = card.querySelector('.card-footer-actions-btn:last-child');
        if (addButton) {
            addButton.addEventListener('click', (event) => {
                event.preventDefault();
                const propertyId = card.dataset.propertyId;
                addToCart(propertyId);
            });
        }
    });

    // Update cart display on page load
    updateCartDisplay();
});

function addToCart(propertyId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.includes(propertyId)) {
        cart.push(propertyId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        alert('Property added to cart!');
    } else {
        alert('Property already in cart!');
    }
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cart || cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }

    cartItems.innerHTML = cart.map(propertyId => {
        const property = document.querySelector(`[data-property-id="${propertyId}"]`);
        if (!property) return '';
        
        const title = property.querySelector('.card-title a').textContent;
        const price = property.querySelector('.card-price').textContent;
        const image = property.querySelector('.card-banner img').src;

        return `
            <div class="cart-item">
                <img src="${image}" alt="${title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${title}</h4>
                    <p>${price}</p>
                </div>
                <button onclick="removeFromCart('${propertyId}')">Remove</button>
            </div>
        `;
    }).join('');

    cartTotal.textContent = cart.length;
}

function removeFromCart(propertyId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(id => id !== propertyId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Profile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all profile menu buttons and tabs
    const menuButtons = document.querySelectorAll('.profile-menu-btn');
    const tabs = document.querySelectorAll('.profile-tab');

    // Add click event listeners to menu buttons
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and tabs
            menuButtons.forEach(btn => btn.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding tab
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Handle form submissions
    const personalInfoForm = document.getElementById('personalInfoForm');
    const preferencesForm = document.getElementById('preferencesForm');

    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Save to localStorage
            localStorage.setItem('userProfile', JSON.stringify(data));
            
            // Show success message
            alert('Profile information saved successfully!');
        });
    }

    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Save to localStorage
            localStorage.setItem('userPreferences', JSON.stringify(data));
            
            // Show success message
            alert('Preferences saved successfully!');
        });
    }

    // Load saved data if exists
    const savedProfile = localStorage.getItem('userProfile');
    const savedPreferences = localStorage.getItem('userPreferences');

    if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        Object.keys(profileData).forEach(key => {
            const input = personalInfoForm.querySelector(`[name="${key}"]`);
            if (input) input.value = profileData[key];
        });
    }

    if (savedPreferences) {
        const preferencesData = JSON.parse(savedPreferences);
        Object.keys(preferencesData).forEach(key => {
            const input = preferencesForm.querySelector(`[name="${key}"]`);
            if (input) input.checked = preferencesData[key] === 'on';
        });
    }
});

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Profile Management
document.addEventListener('DOMContentLoaded', () => {
    // Initialize profile data if not exists
    if (!localStorage.getItem('userProfile')) {
        localStorage.setItem('userProfile', JSON.stringify({
            isLoggedIn: false,
            name: '',
            email: '',
            password: '',
            savedProperties: []
        }));
    }

    const profileBtn = document.querySelector('.header-bottom-actions-btn[aria-label="Profile"]');
    const signupButton = document.getElementById('signupButton');
    const editProfileButton = document.getElementById('editProfile');
    const logoutButton = document.getElementById('logoutButton');
    const signupForm = document.getElementById('signupForm');
    const profileDisplay = document.getElementById('profileDisplay');

    // Profile button click handler
    profileBtn.addEventListener('click', () => {
        const modal = document.getElementById('profileModal');
        modal.style.display = 'block';
        checkLoginStatus();
    });

    // Sign up button click handler
    signupButton.addEventListener('click', () => {
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;

        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        const userProfile = {
            isLoggedIn: true,
            name: name,
            email: email,
            password: password,
            savedProperties: []
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        alert('Sign up successful!');
        checkLoginStatus();
    });

    // Edit profile button click handler
    editProfileButton.addEventListener('click', () => {
        signupForm.style.display = 'block';
        profileDisplay.style.display = 'none';
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        document.getElementById('userName').value = userProfile.name;
        document.getElementById('userEmail').value = userProfile.email;
        document.getElementById('userPassword').value = userProfile.password;
    });

    // Logout button click handler
    logoutButton.addEventListener('click', () => {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        userProfile.isLoggedIn = false;
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        checkLoginStatus();
        alert('Logged out successfully');
    });

    // Check login status and update UI
    function checkLoginStatus() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (userProfile.isLoggedIn) {
            signupForm.style.display = 'none';
            profileDisplay.style.display = 'block';
            document.getElementById('displayName').textContent = userProfile.name;
            document.getElementById('displayEmail').textContent = userProfile.email;
            updateSavedProperties();
        } else {
            signupForm.style.display = 'block';
            profileDisplay.style.display = 'none';
            document.getElementById('userName').value = '';
            document.getElementById('userEmail').value = '';
            document.getElementById('userPassword').value = '';
        }
    }

    // Update saved properties display
    function updateSavedProperties() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        const savedPropertiesList = document.getElementById('savedPropertiesList');
        
        if (userProfile.savedProperties.length === 0) {
            savedPropertiesList.innerHTML = '<p>No saved properties yet</p>';
            return;
        }

        savedPropertiesList.innerHTML = userProfile.savedProperties.map(propertyId => {
            const property = document.querySelector(`[data-property-id="${propertyId}"]`);
            if (!property) return '';
            
            const title = property.querySelector('.card-title a').textContent;
            const price = property.querySelector('.card-price').textContent;
            const image = property.querySelector('.card-banner img').src;

            return `
                <div class="saved-property">
                    <img src="${image}" alt="${title}" class="saved-property-image">
                    <div class="saved-property-details">
                        <h5>${title}</h5>
                        <p>${price}</p>
                    </div>
                    <button onclick="removeFromSaved('${propertyId}')">Remove</button>
                </div>
            `;
        }).join('');
    }

    // Add to saved properties
    window.addToSaved = function(propertyId) {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (userProfile.isLoggedIn) {
            if (!userProfile.savedProperties.includes(propertyId)) {
                userProfile.savedProperties.push(propertyId);
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
                updateSavedProperties();
                alert('Property saved successfully!');
            } else {
                alert('Property already saved!');
            }
        } else {
            alert('Please sign up to save properties');
        }
    };

    // Remove from saved properties
    window.removeFromSaved = function(propertyId) {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        userProfile.savedProperties = userProfile.savedProperties.filter(id => id !== propertyId);
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        updateSavedProperties();
    };
});

// Hero section button functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get the Start Your Search button
    const startSearchBtn = document.querySelector('.hero .btn');
    
    // Add click event to scroll to properties section
    if (startSearchBtn) {
        startSearchBtn.addEventListener('click', () => {
            document.getElementById('property').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
}); 