export interface User {
    id: number;
    email: string;
    username: string;
    created_at: string;
}

export interface NutritionInfo {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    serving_size: string;
}

export interface PredictionResponse {
    food_item: string;
    confidence: number;
    nutrition: NutritionInfo;
}

export interface FoodLog {
    id: number;
    user_id: number;
    food_item: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    serving_size?: string;
    image_url?: string;
    confidence?: number;
    created_at: string;
}

export interface DailySummary {
    date: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    total_fiber: number;
    total_sugar: number;
    meal_count: number;
}

export interface AuthToken {
    access_token: string;
    token_type: string;
}
