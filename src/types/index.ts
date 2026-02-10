export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    description: string;
    colors?: string[];
    sizes?: string[];
    isNew?: boolean;
    onSale?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}
