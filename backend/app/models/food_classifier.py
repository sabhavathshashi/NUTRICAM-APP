import numpy as np
from PIL import Image
import io
import json
import os
from typing import Tuple, Dict

class FoodClassifier:
    """
    Food classification model wrapper.
    This is a mock implementation that uses simple heuristics.
    Replace with actual TensorFlow/PyTorch model for production.
    """
    
    def __init__(self):
        self.nutrition_db = self._load_nutrition_db()
        self.food_classes = list(self.nutrition_db.keys())
        
    def _load_nutrition_db(self) -> Dict:
        """Load nutrition database"""
        db_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "database",
            "nutrition_data.json"
        )
        with open(db_path, 'r') as f:
            return json.load(f)
    
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """Preprocess image for model input"""
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size
        image = image.resize((224, 224))
        
        # Convert to numpy array and normalize
        img_array = np.array(image) / 255.0
        
        return img_array
    
    def predict(self, image_bytes: bytes) -> Tuple[str, float]:
        """
        Predict food item from image.
        
        This is a MOCK implementation for demonstration.
        In production, replace with:
        - TensorFlow model: model.predict(preprocessed_image)
        - PyTorch model: model(torch.tensor(preprocessed_image))
        """
        # Preprocess image
        img_array = self.preprocess_image(image_bytes)
        
        # Mock prediction - analyze image colors/brightness to pick a food
        # In production, this would be: predictions = self.model.predict(img_array)
        avg_color = img_array.mean(axis=(0, 1))
        brightness = avg_color.mean()
        
        # Simple heuristic-based "prediction"
        if brightness > 0.7:
            # Bright images -> fruits
            food_item = np.random.choice(['banana', 'apple', 'orange'])
            confidence = 0.85 + np.random.random() * 0.1
        elif brightness > 0.5:
            # Medium brightness -> cooked food
            food_item = np.random.choice(['pizza', 'burger', 'sandwich', 'pasta'])
            confidence = 0.75 + np.random.random() * 0.15
        elif avg_color[1] > avg_color[0]:
            # Greenish -> vegetables
            food_item = np.random.choice(['salad', 'broccoli'])
            confidence = 0.80 + np.random.random() * 0.1
        else:
            # Default to common foods
            food_item = np.random.choice(['rice', 'chicken', 'bread'])
            confidence = 0.70 + np.random.random() * 0.2
        
        return food_item, float(confidence)
    
    def get_nutrition_info(self, food_item: str) -> Dict:
        """Get nutrition information for a food item"""
        return self.nutrition_db.get(
            food_item.lower(),
            {
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "fiber": 0,
                "sugar": 0,
                "serving_size": "unknown"
            }
        )

# Global model instance
_model_instance = None

def get_model() -> FoodClassifier:
    """Get or create the global model instance"""
    global _model_instance
    if _model_instance is None:
        _model_instance = FoodClassifier()
    return _model_instance
