from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, date

from ..database import get_db, User, FoodLog
from ..schemas import FoodLogCreate, FoodLogResponse, DailySummary
from ..auth import get_current_user

router = APIRouter(prefix="/log", tags=["Food Logs"])

@router.post("/add", response_model=FoodLogResponse, status_code=status.HTTP_201_CREATED)
async def add_food_log(
    log_data: FoodLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new food log entry for the current user"""
    new_log = FoodLog(
        user_id=current_user.id,
        **log_data.model_dump()
    )
    
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    return new_log

@router.get("/history", response_model=List[FoodLogResponse])
async def get_food_history(
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get food log history for the current user"""
    logs = db.query(FoodLog).filter(
        FoodLog.user_id == current_user.id
    ).order_by(
        FoodLog.created_at.desc()
    ).limit(limit).offset(offset).all()
    
    return logs

@router.get("/today", response_model=List[FoodLogResponse])
async def get_today_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get today's food logs for the current user"""
    today = date.today()
    logs = db.query(FoodLog).filter(
        FoodLog.user_id == current_user.id,
        func.date(FoodLog.created_at) == today
    ).order_by(FoodLog.created_at.desc()).all()
    
    return logs

@router.get("/summary/today", response_model=DailySummary)
async def get_today_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get nutritional summary for today"""
    today = date.today()
    logs = db.query(FoodLog).filter(
        FoodLog.user_id == current_user.id,
        func.date(FoodLog.created_at) == today
    ).all()
    
    total_calories = sum(log.calories for log in logs)
    total_protein = sum(log.protein for log in logs)
    total_carbs = sum(log.carbs for log in logs)
    total_fat = sum(log.fat for log in logs)
    total_fiber = sum(log.fiber for log in logs)
    total_sugar = sum(log.sugar for log in logs)
    
    return {
        "date": today.isoformat(),
        "total_calories": total_calories,
        "total_protein": total_protein,
        "total_carbs": total_carbs,
        "total_fat": total_fat,
        "total_fiber": total_fiber,
        "total_sugar": total_sugar,
        "meal_count": len(logs)
    }

@router.get("/summary/date/{target_date}", response_model=DailySummary)
async def get_date_summary(
    target_date: date,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get nutritional summary for a specific date"""
    logs = db.query(FoodLog).filter(
        FoodLog.user_id == current_user.id,
        func.date(FoodLog.created_at) == target_date
    ).all()
    
    total_calories = sum(log.calories for log in logs)
    total_protein = sum(log.protein for log in logs)
    total_carbs = sum(log.carbs for log in logs)
    total_fat = sum(log.fat for log in logs)
    total_fiber = sum(log.fiber for log in logs)
    total_sugar = sum(log.sugar for log in logs)
    
    return {
        "date": target_date.isoformat(),
        "total_calories": total_calories,
        "total_protein": total_protein,
        "total_carbs": total_carbs,
        "total_fat": total_fat,
        "total_fiber": total_fiber,
        "total_sugar": total_sugar,
        "meal_count": len(logs)
    }

@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_food_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a food log entry"""
    log = db.query(FoodLog).filter(
        FoodLog.id == log_id,
        FoodLog.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food log not found"
        )
    
    db.delete(log)
    db.commit()
    
    return None
