// Supporting classes for Property Search
class BasicPropertySearch {
    search(criteria) {
        // Basic search implementation
        return [];
    }
}

class AdvancedPropertySearch {
    search(criteria) {
        // Advanced search implementation
        return [];
    }
}

class MapPropertySearch {
    search(criteria) {
        // Map-based search implementation
        return [];
    }
}

// User Profile class
class UserProfile {
    constructor() {
        this.name = '';
        this.email = '';
        this.preferences = {};
        this.savedProperties = [];
    }
}

// Property Search Engine
class PropertySearchEngine {
    search(criteria) {
        // Search implementation
        return [];
    }
}

// Property Filter
class PropertyFilter {
    applyFilters(properties, filters) {
        return properties.filter(property => {
            let matches = true;
            if (filters.priceRange) {
                matches = matches && property.price >= filters.priceRange.min && 
                         property.price <= filters.priceRange.max;
            }
            if (filters.location) {
                matches = matches && property.location === filters.location;
            }
            if (filters.type) {
                matches = matches && property.type === filters.type;
            }
            return matches;
        });
    }
}

// Property Sorter
class PropertySorter {
    sort(properties, sortBy) {
        return properties.sort((a, b) => {
            switch(sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'location':
                    return a.location.localeCompare(b.location);
                default:
                    return 0;
            }
        });
    }
}

// Property data
const properties = [
    {
        id: 1,
        title: "Modern Apartment in Kilimani",
        price: "KSh 120,000",
        location: "Kilimani, Nairobi",
        type: "apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: "180 Sq Meters",
        description: "Spacious 3-bedroom apartment in Nairobi's most sought-after neighborhood. Features modern finishes, balcony with city views, and 24/7 security.",
        image: "./assets/images/property-1.jpg"
    },
    {
        id: 2,
        title: "Luxury Villa in Dar es Salaam",
        price: "TSh 850M",
        location: "Masaki, Dar es Salaam",
        type: "villa",
        bedrooms: 5,
        bathrooms: 4,
        area: "450 Sq Meters",
        description: "Stunning 5-bedroom villa with ocean views, private pool, and landscaped gardens. Located in the prestigious Masaki neighborhood.",
        image: "./assets/images/property-2.jpg"
    },
    {
        id: 3,
        title: "Traditional House in Kampala",
        price: "UGX 8M",
        location: "Kololo, Kampala",
        type: "house",
        bedrooms: 4,
        bathrooms: 3,
        area: "300 Sq Meters",
        description: "Beautiful 4-bedroom traditional house with modern amenities. Features a spacious compound, servant quarters, and secure parking.",
        image: "./assets/images/property-3.jpg"
    },
    {
        id: 4,
        title: "Apartment in Kigali",
        price: "RWF 1.2M",
        location: "Kiyovu, Kigali",
        type: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        area: "120 Sq Meters",
        description: "Modern 2-bedroom apartment in Kigali's most prestigious neighborhood. Features panoramic city views and access to premium amenities.",
        image: "./assets/images/property-4.png"
    }
];

// Property selection functionality
class PropertySelector {
    static getProperties() {
        return properties;
    }

    static getPropertyById(id) {
        return properties.find(property => property.id === id);
    }

    static getPropertiesByType(type) {
        return properties.filter(property => property.type === type);
    }

    static getPropertiesByLocation(location) {
        return properties.filter(property => property.location.includes(location));
    }

    static getPropertiesByPriceRange(minPrice, maxPrice) {
        return properties.filter(property => {
            const price = parseInt(property.price.replace(/[^0-9]/g, ''));
            return price >= minPrice && price <= maxPrice;
        });
    }
} 