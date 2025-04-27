export interface Order {
    id: string
}

export interface Notification {
    id: string
}

export interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    orders?: Order[]
    notifications: Notification[]
}

export interface Category {
    name: string
    description: string
    id: string
}

export interface Product {
    id: string
    title: string
    price: number
    description: string
    images: string[]
    user: {
        image: string | null;
        id: string;
        name: string | null;
    }
    category: {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
    }
}