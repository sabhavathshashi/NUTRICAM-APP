import type { PredictionResponse } from '../types';
import './ResultCard.css';

interface ResultCardProps {
    result: PredictionResponse;
    onSave: () => void;
    onDiscard: () => void;
    isSaving?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
    result,
    onSave,
    onDiscard,
    isSaving = false,
}) => {
    const { food_item, confidence, nutrition } = result;
    const confidencePercent = (confidence * 100).toFixed(1);

    return (
        <div className="result-card glass-card animate-fadeIn">
            <div className="result-header">
                <h2 className="result-title">
                    <span className="food-emoji">🍽️</span>
                    {food_item.charAt(0).toUpperCase() + food_item.slice(1)}
                </h2>
                <div className={`confidence-badge ${confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low'}`}>
                    {confidencePercent}% confident
                </div>
            </div>

            <div className="nutrition-grid">
                <div className="nutrition-item calories">
                    <div className="nutrition-icon">🔥</div>
                    <div className="nutrition-info">
                        <span className="nutrition-value">{nutrition.calories}</span>
                        <span className="nutrition-label">Calories</span>
                    </div>
                </div>

                <div className="nutrition-item protein">
                    <div className="nutrition-icon">💪</div>
                    <div className="nutrition-info">
                        <span className="nutrition-value">{nutrition.protein}g</span>
                        <span className="nutrition-label">Protein</span>
                    </div>
                </div>

                <div className="nutrition-item carbs">
                    <div className="nutrition-icon">🌾</div>
                    <div className="nutrition-info">
                        <span className="nutrition-value">{nutrition.carbs}g</span>
                        <span className="nutrition-label">Carbs</span>
                    </div>
                </div>

                <div className="nutrition-item fat">
                    <div className="nutrition-icon">🥑</div>
                    <div className="nutrition-info">
                        <span className="nutrition-value">{nutrition.fat}g</span>
                        <span className="nutrition-label">Fat</span>
                    </div>
                </div>

                <div className="nutrition-item fiber">
                    <div className="nutrition-icon">🌿</div>
                    <div className="nutrition-info">
                        <span className="nutrition-value">{nutrition.fiber}g</span>
                        <span className="nutrition-label">Fiber</span>
                    </div>
                </div>

                <div className="nutrition-item sugar">
                    <div className="nutrition-icon">🍬</div>
                    <div className="nutrition-info">
                        <span className="nutrition-value">{nutrition.sugar}g</span>
                        <span className="nutrition-label">Sugar</span>
                    </div>
                </div>
            </div>

            <div className="serving-size">
                <span className="serving-label">Serving Size:</span>
                <span className="serving-value">{nutrition.serving_size}</span>
            </div>

            <div className="result-actions">
                <button
                    className="btn btn-secondary"
                    onClick={onDiscard}
                    disabled={isSaving}
                >
                    ❌ Discard
                </button>
                <button
                    className="btn btn-success btn-lg"
                    onClick={onSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <span className="spinner"></span>
                            Saving...
                        </>
                    ) : (
                        <>
                            ✅ Save to Log
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ResultCard;
