export interface Address {
    id: string;
    type: 'Home' | 'Work' | 'Other';
    isDefault: boolean;
    firstName: string;
    lastName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    deliveryInstructions?: string | null;
}

export interface CreditCard {
    id: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
}

export interface UserPreferences {
    newsletter: boolean;
    smsNotifications: boolean;
    culturalMode: 'Standard' | 'Ramadan' | 'Eid';
    currency: string;
    language: 'en' | 'ar';
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: string | null;
    gender?: string | null;
    memberSince: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    points: number;
    lifetimeSpent: number;
    totalOrders: number;
    addresses: Address[];
    paymentMethods: CreditCard[];
    preferences: UserPreferences;
    wishlist: string[]; // Array of Product IDs
    orderHistory: string[]; // Array of Order IDs
}

export const MOCK_USER: User = {
    id: "u_123456",
    email: "sarah.ahmed@example.com",
    firstName: "Sarah",
    lastName: "Ahmed",
    displayName: "Sarah A.",
    phone: "+971 50 123 4567",
    memberSince: "Jan 15, 2025",
    tier: "gold",
    points: 2450,
    lifetimeSpent: 5500,
    totalOrders: 12,
    addresses: [
        {
            id: "addr_1",
            type: "Home",
            isDefault: true,
            firstName: "Sarah",
            lastName: "Ahmed",
            street: "Villa 23, Palm Jumeirah",
            city: "Dubai",
            state: "Dubai",
            zipCode: "00000",
            country: "United Arab Emirates",
            phone: "+971 50 123 4567"
        }
    ],
    paymentMethods: [
        {
            id: "card_1",
            brand: "Visa",
            last4: "4242",
            expiryMonth: 12,
            expiryYear: 2028,
            isDefault: true
        }
    ],
    preferences: {
        newsletter: true,
        smsNotifications: false,
        culturalMode: "Standard",
        currency: "AED",
        language: "en"
    },
    wishlist: ["prod_1", "prod_3"],
    orderHistory: ["ord_1847", "ord_1720"]
};
