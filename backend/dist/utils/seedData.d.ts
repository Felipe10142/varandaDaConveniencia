export declare const seedProducts: ({
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    isAvailable: boolean;
    rating: number;
    numReviews: number;
    tags: string[];
    nutritionalInfo: {
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        ingredients: string[];
        allergens: string[];
    };
    preparation: {
        time: number;
        instructions: string[];
    };
} | {
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    isAvailable: boolean;
    rating: number;
    numReviews: number;
    tags: string[];
    nutritionalInfo: {
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        ingredients: string[];
        allergens: string[];
    };
    preparation?: undefined;
})[];
export declare const seedDatabase: () => Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("../models/Product").IProduct> & import("../models/Product").IProduct & {
    _id: import("mongoose").Types.ObjectId;
}, Omit<{
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    isAvailable: boolean;
    rating: number;
    numReviews: number;
    tags: string[];
    nutritionalInfo: {
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        ingredients: string[];
        allergens: string[];
    };
    preparation: {
        time: number;
        instructions: string[];
    };
} | {
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    isAvailable: boolean;
    rating: number;
    numReviews: number;
    tags: string[];
    nutritionalInfo: {
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        ingredients: string[];
        allergens: string[];
    };
    preparation?: undefined;
}, "_id">>[]>;
