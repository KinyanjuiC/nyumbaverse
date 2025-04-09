// Abstract Factory Pattern - For creating different types of property searches
class PropertySearchFactory {
    createSearch(type) {
        switch(type) {
            case 'basic':
                return new BasicPropertySearch();
            case 'advanced':
                return new AdvancedPropertySearch();
            case 'map':
                return new MapPropertySearch();
            default:
                throw new Error('Invalid search type');
        }
    }
}

// Builder Pattern - For constructing user profiles
class UserProfileBuilder {
    constructor() {
        this.profile = new UserProfile();
    }

    setName(name) {
        this.profile.name = name;
        return this;
    }

    setEmail(email) {
        this.profile.email = email;
        return this;
    }

    setPreferences(preferences) {
        this.profile.preferences = preferences;
        return this;
    }

    setSavedProperties(properties) {
        this.profile.savedProperties = properties;
        return this;
    }

    build() {
        return this.profile;
    }
}

// Adapter Pattern - For adapting different property data sources
class PropertyDataAdapter {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    getProperties() {
        if (this.dataSource.type === 'external') {
            return this.adaptExternalData(this.dataSource.getData());
        }
        return this.dataSource.getData();
    }

    adaptExternalData(data) {
        // Convert external data format to our internal format
        return data.map(item => ({
            id: item.propertyId,
            title: item.propertyName,
            price: item.propertyPrice,
            location: item.propertyLocation,
            type: item.propertyType
        }));
    }
}

// Facade Pattern - For simplifying property search operations
class PropertySearchFacade {
    constructor() {
        this.searchEngine = new PropertySearchEngine();
        this.filter = new PropertyFilter();
        this.sorter = new PropertySorter();
    }

    searchProperties(criteria) {
        const results = this.searchEngine.search(criteria);
        const filtered = this.filter.applyFilters(results, criteria.filters);
        return this.sorter.sort(filtered, criteria.sortBy);
    }
}

// Strategy Pattern - For different property search algorithms
class PropertySearchStrategy {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    search(criteria) {
        return this.strategy.search(criteria);
    }
}

class BasicSearchStrategy {
    search(criteria) {
        // Implement basic search logic
        return properties.filter(property => 
            property.title.toLowerCase().includes(criteria.term.toLowerCase())
        );
    }
}

class AdvancedSearchStrategy {
    search(criteria) {
        // Implement advanced search logic
        return properties.filter(property => {
            const matchesPrice = property.price >= criteria.minPrice && 
                               property.price <= criteria.maxPrice;
            const matchesLocation = property.location === criteria.location;
            const matchesType = property.type === criteria.type;
            return matchesPrice && matchesLocation && matchesType;
        });
    }
}

// Observer Pattern - For property inventory updates
class PropertyInventory {
    constructor() {
        this.observers = [];
        this.properties = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update(this.properties));
    }

    addProperty(property) {
        this.properties.push(property);
        this.notifyObservers();
    }

    removeProperty(propertyId) {
        this.properties = this.properties.filter(p => p.id !== propertyId);
        this.notifyObservers();
    }
}

class PropertyObserver {
    update(properties) {
        // Update UI with new properties
        this.updatePropertyList(properties);
    }

    updatePropertyList(properties) {
        const propertyList = document.querySelector('.property-list');
        propertyList.innerHTML = properties.map(property => `
            <div class="property-card">
                <h3>${property.title}</h3>
                <p>Price: ${property.price}</p>
                <p>Location: ${property.location}</p>
            </div>
        `).join('');
    }
}

// Usage examples
document.addEventListener('DOMContentLoaded', () => {
    // Initialize property search
    const searchFactory = new PropertySearchFactory();
    const basicSearch = searchFactory.createSearch('basic');
    
    // Initialize user profile builder
    const userProfile = new UserProfileBuilder()
        .setName('John Doe')
        .setEmail('john@example.com')
        .setPreferences({ notifications: true })
        .build();
    
    // Initialize property inventory with observer
    const inventory = new PropertyInventory();
    const observer = new PropertyObserver();
    inventory.addObserver(observer);
    
    // Initialize search strategy
    const searchStrategy = new PropertySearchStrategy(new BasicSearchStrategy());
    
    // Event listeners for search functionality
    document.querySelector('.header-bottom-actions-btn[aria-label="Search"]')
        .addEventListener('click', () => {
            const searchTerm = document.querySelector('.search-input').value;
            const results = searchStrategy.search({ term: searchTerm });
            observer.updatePropertyList(results);
        });
}); 