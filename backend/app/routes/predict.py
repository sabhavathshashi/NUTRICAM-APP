from fastapi import APIRouter, UploadFile, File, HTTPException, status
from ..models import get_model
from ..schemas import PredictionResponse

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("/", response_model=PredictionResponse)
async def predict_food(image: UploadFile = File(...)):
    """
    Predict food item from uploaded image and return nutrition information.
    
    This endpoint accepts an image file and returns:
    - Predicted food item
    - Confidence score
    - Nutrition information (calories, macros, etc.)
    """
    # Validate file type
    if not image.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    try:
        # Read image bytes
        image_bytes = await image.read()
        
        # Get model and make prediction
        model = get_model()
        food_item, confidence = model.predict(image_bytes)
        
        # Get nutrition information
        nutrition_info = model.get_nutrition_info(food_item)
        
        return {
            "food_item": food_item,
            "confidence": confidence,
            "nutrition": nutrition_info
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing image: {str(e)}"
        )
