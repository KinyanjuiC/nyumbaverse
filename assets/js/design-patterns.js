// Abstract Factory Pattern
class PropertySearchFactory {
    createBasicSearch() {
        return new BasicPropertySearch();
    }

    createAdvancedSearch() {
        return new AdvancedPropertySearch();
    }

    createMapSearch() {
        return new MapPropertySearch();
    }
}

// Adapter Pattern
class PropertyDataAdapter {
    constructor(property) {
        this.property = property;
    }

    adapt() {
        return {
            id: this.property.id,
            title: this.property.title,
            price: this.property.price,
            location: this.property.location,
            type: this.property.type,
            image: this.property.image,
            details: {
                bedrooms: this.property.bedrooms,
                bathrooms: this.property.bathrooms,
                area: this.property.area
            }
        };
    }
}

// Facade Pattern
class PropertySearchFacade {
    constructor() {
        this.searchFactory = new PropertySearchFactory();
        this.searchStrategy = new PropertySearchStrategy();
    }

    search(criteria) {
        const searchType = criteria.type || 'basic';
        const searchInstance = this.searchFactory[`create${searchType.charAt(0).toUpperCase() + searchType.slice(1)}Search`]();
        return this.searchStrategy.executeSearch(searchInstance, criteria);
    }
}

// Strategy Pattern
class PropertySearchStrategy {
    executeSearch(searchInstance, criteria) {
        return searchInstance.search(criteria);
    }
}

// Observer Pattern
class PropertyInventory {
    constructor() {
        this.observers = [];
        this.properties = [];
        this.initializeProperties();
    }

    initializeProperties() {
        // Initialize with the existing properties from the HTML
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach(card => {
            const property = {
                id: card.dataset.propertyId,
                title: card.querySelector('.card-title a').textContent,
                price: card.querySelector('.card-price').textContent,
                description: card.querySelector('.card-text').textContent,
                location: card.querySelector('.banner-actions-btn address').textContent,
                type: card.querySelector('.card-badge').textContent,
                image: card.querySelector('.card-banner img').src,
                details: {
                    bedrooms: card.querySelector('.card-item:first-child strong').textContent,
                    bathrooms: card.querySelector('.card-item:nth-child(2) strong').textContent,
                    area: card.querySelector('.card-item:last-child strong').textContent
                },
                agent: {
                    name: card.querySelector('.author-name a').textContent,
                    title: card.querySelector('.author-title').textContent
                },
                actions: {
                    hasResize: card.querySelector('.card-footer-actions-btn:first-child') !== null,
                    hasHeart: card.querySelector('.card-footer-actions-btn:nth-child(2)') !== null,
                    hasAdd: card.querySelector('.card-footer-actions-btn:last-child') !== null
                }
            };
            this.properties.push(property);
        });
    }

    addObserver(observer) {
        this.observers.push(observer);
        // Notify new observer with current properties
        observer.update(this.properties);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update(this.properties));
    }

    addProperty(property) {
        if (!this.properties.some(p => p.id === property.id)) {
            this.properties.push(property);
            this.notifyObservers();
        }
    }

    removeProperty(propertyId) {
        this.properties = this.properties.filter(prop => prop.id !== propertyId);
        this.notifyObservers();
    }

    getProperties() {
        return this.properties;
    }
}

class PropertyObserver {
    constructor(callback) {
        this.callback = callback;
    }

    update(properties) {
        this.callback(properties);
    }
}

// Builder Pattern
class UserProfileBuilder {
    constructor() {
        this.profile = {
            name: '',
            email: '',
            password: '',
            preferences: {},
            savedProperties: []
        };
    }

    setName(name) {
        this.profile.name = name;
        return this;
    }

    setEmail(email) {
        this.profile.email = email;
        return this;
    }

    setPassword(password) {
        this.profile.password = password;
        return this;
    }

    setPreferences(preferences) {
        this.profile.preferences = preferences;
        return this;
    }

    addSavedProperty(propertyId) {
        this.profile.savedProperties.push(propertyId);
        return this;
    }

    build() {
        return this.profile;
    }
}

// Usage Examples
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Property Inventory
    const propertyInventory = new PropertyInventory();
    
    // Add observer for UI updates
    const uiObserver = new PropertyObserver((properties) => {
        updatePropertyList(properties);
    });
    propertyInventory.addObserver(uiObserver);

    // Initialize Search Facade
    const searchFacade = new PropertySearchFacade();

    // Example of using the Builder Pattern
    const userProfile = new UserProfileBuilder()
        .setName('John Doe')
        .setEmail('john@example.com')
        .setPassword('secure123')
        .setPreferences({
            notifications: true,
            newsletter: true
        })
        .build();

    // Example of using the Adapter Pattern
    const property = {
        id: 'property5',
        title: 'New Property',
        price: 'KSh 150,000/Month',
        location: 'Westlands, Nairobi',
        type: 'Apartment',
        image: './assets/images/property-1.jpg',
        details: {
            bedrooms: '2',
            bathrooms: '2',
            area: '100'
        }
    };
    
    const propertyAdapter = new PropertyDataAdapter(property);
    const adaptedProperty = propertyAdapter.adapt();
    propertyInventory.addProperty(adaptedProperty);
});

// Helper function to update UI
function updatePropertyList(properties) {
    const propertyList = document.querySelector('.property-list');
    if (propertyList) {
        propertyList.innerHTML = properties.map(property => `
            <li>
                <div class="property-card" data-property-id="${property.id}">
                    <figure class="card-banner">
                        <a href="#">
                            <img src="${property.image}" alt="${property.title}" class="w-100">
                        </a>
                        <div class="card-badge ${property.type === 'For Rent' ? 'green' : 'orange'}">${property.type}</div>
                        <div class="banner-actions">
                            <button class="banner-actions-btn">
                                <ion-icon name="location"></ion-icon>
                                <address>${property.location}</address>
                            </button>
                            <button class="banner-actions-btn">
                                <ion-icon name="camera"></ion-icon>
                                <span>4</span>
                            </button>
                            <button class="banner-actions-btn">
                                <ion-icon name="film"></ion-icon>
                                <span>2</span>
                            </button>
                        </div>
                    </figure>
                    <div class="card-content">
                        <div class="card-price">
                            <strong>${property.price}</strong>
                        </div>
                        <h3 class="h3 card-title">
                            <a href="#">${property.title}</a>
                        </h3>
                        <p class="card-text">
                            ${property.description}
                        </p>
                        <ul class="card-list">
                            <li class="card-item">
                                <strong>${property.details.bedrooms}</strong>
                                <ion-icon name="bed-outline"></ion-icon>
                                <span>Bedrooms</span>
                            </li>
                            <li class="card-item">
                                <strong>${property.details.bathrooms}</strong>
                                <ion-icon name="man-outline"></ion-icon>
                                <span>Bathrooms</span>
                            </li>
                            <li class="card-item">
                                <strong>${property.details.area}</strong>
                                <ion-icon name="square-outline"></ion-icon>
                                <span>Sq Meters</span>
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer">
                        <div class="card-author">
                            <div>
                                <p class="author-name">
                                    <a href="#">${property.agent.name}</a>
                                </p>
                                <p class="author-title">${property.agent.title}</p>
                            </div>
                        </div>
                        <div class="card-footer-actions">
                            ${property.actions.hasResize ? `
                                <button class="card-footer-actions-btn">
                                    <ion-icon name="resize-outline"></ion-icon>
                                </button>
                            ` : ''}
                            ${property.actions.hasHeart ? `
                                <button class="card-footer-actions-btn">
                                    <ion-icon name="heart-outline"></ion-icon>
                                </button>
                            ` : ''}
                            ${property.actions.hasAdd ? `
                                <button class="card-footer-actions-btn" onclick="addToCart('${property.id}')">
                                    <ion-icon name="add-circle-outline"></ion-icon>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </li>
        `).join('');

        // Reattach event listeners to the add buttons
        const addButtons = document.querySelectorAll('.card-footer-actions-btn:last-child');
        addButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const propertyId = button.closest('.property-card').dataset.propertyId;
                addToCart(propertyId);
            });
        });
    }
} 