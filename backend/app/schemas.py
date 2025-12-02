from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Food Prediction Schemas
class PredictionResponse(BaseModel):
    food_item: str
    confidence: float
    nutrition: dict

class NutritionInfo(BaseModel):
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    sugar: float
    serving_size: str

# Food Log Schemas
class FoodLogCreate(BaseModel):
    food_item: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float = 0
    sugar: float = 0
    serving_size: Optional[str] = None
    image_url: Optional[str] = None
    confidence: Optional[float] = None

class FoodLogResponse(BaseModel):
    id: int
    user_id: int
    food_item: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    sugar: float
    serving_size: Optional[str]
    image_url: Optional[str]
    confidence: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

class DailySummary(BaseModel):
    date: str
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    total_fiber: float
    total_sugar: float
    meal_count: int
