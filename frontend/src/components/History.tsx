import { useEffect, useState } from 'react';
import type { FoodLog, DailySummary } from '../types';
import { foodLogAPI } from '../services/api';
import './History.css';

const History: React.FC = () => {
    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [summary, setSummary] = useState<DailySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const [logsData, summaryData] = await Promise.all([
                foodLogAPI.getTodayLogs(),
                foodLogAPI.getTodaySummary(),
            ]);
            setLogs(logsData);
            setSummary(summaryData);
        } catch (err: any) {
            setError(err.message || 'Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (logId: number) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        try {
            await foodLogAPI.deleteLog(logId);
            fetchData(); // Refresh data
        } catch (err: any) {
            alert(err.message || 'Failed to delete entry');
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    if (loading) {
        return (
            <div className="history-container">
                <div className="loading-state">
                    <div className="spinner-large"></div>
                    <p>Loading your food history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="history-container">
                <div className="error-state">
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={fetchData}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="history-container">
            <h1 className="history-title">
                <span className="title-icon">📊</span>
                Today's Nutrition
            </h1>

            {summary && (
                <div className="summary-card glass-card">
                    <h3 className="summary-title">Daily Summary</h3>
                    <div className="summary-grid">
                        <div className="summary-item">
                            <div className="summary-icon">🔥</div>
                            <div className="summary-info">
                                <span className="summary-value">{summary.total_calories.toFixed(0)}</span>
                                <span className="summary-label">Total Calories</span>
                            </div>
                        </div>
                        <div className="summary-item">
                            <div className="summary-icon">💪</div>
                            <div className="summary-info">
                                <span className="summary-value">{summary.total_protein.toFixed(1)}g</span>
                                <span className="summary-label">Protein</span>
                            </div>
                        </div>
                        <div className="summary-item">
                            <div className="summary-icon">🌾</div>
                            <div className="summary-info">
                                <span className="summary-value">{summary.total_carbs.toFixed(1)}g</span>
                                <span className="summary-label">Carbs</span>
                            </div>
                        </div>
                        <div className="summary-item">
                            <div className="summary-icon">🥑</div>
                            <div className="summary-info">
                                <span className="summary-value">{summary.total_fat.toFixed(1)}g</span>
                                <span className="summary-label">Fat</span>
                            </div>
                        </div>
                    </div>
                    <div className="meal-count">
                        <span className="meal-count-icon">🍽️</span>
                        <span>{summary.meal_count} meal{summary.meal_count !== 1 ? 's' : ''} logged today</span>
                    </div>
                </div>
            )}

            <div className="logs-section">
                <h3 className="logs-title">Food Log</h3>
                {logs.length === 0 ? (
                    <div className="empty-state glass-card">
                        <div className="empty-icon">🍽️</div>
                        <h4>No meals logged yet</h4>
                        <p>Start scanning food to track your nutrition!</p>
                    </div>
                ) : (
                    <div className="logs-list">
                        {logs.map((log) => (
                            <div key={log.id} className="log-item glass-card card-hover">
                                <div className="log-header">
                                    <h4 className="log-food-name">
                                        {log.food_item.charAt(0).toUpperCase() + log.food_item.slice(1)}
                                    </h4>
                                    <div className="log-meta">
                                        <span className="log-time">{formatTime(log.created_at)}</span>
                                        {log.confidence && (
                                            <span className="log-confidence">
                                                {(log.confidence * 100).toFixed(0)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="log-nutrition">
                                    <span className="log-nutrient">
                                        <strong>{log.calories}</strong> cal
                                    </span>
                                    <span className="log-nutrient">
                                        <strong>{log.protein}g</strong> protein
                                    </span>
                                    <span className="log-nutrient">
                                        <strong>{log.carbs}g</strong> carbs
                                    </span>
                                    <span className="log-nutrient">
                                        <strong>{log.fat}g</strong> fat
                                    </span>
                                </div>
                                <button
                                    className="log-delete-btn"
                                    onClick={() => handleDelete(log.id)}
                                    title="Delete entry"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
