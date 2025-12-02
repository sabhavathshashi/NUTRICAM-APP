import { useState, useEffect } from 'react';
import Camera from './components/Camera';
import ResultCard from './components/ResultCard';
import History from './components/History';
import Auth from './components/Auth';
import { authAPI, predictionAPI, foodLogAPI } from './services/api';
import type { PredictionResponse } from './types';
import './App.css';

type View = 'scan' | 'history';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('scan');
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const authenticated = authAPI.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setUsername(authAPI.getUsername() || '');
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setUsername(authAPI.getUsername() || '');
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUsername('');
    setPredictionResult(null);
    setCurrentView('scan');
  };

  const handleCapture = async (imageFile: File) => {
    setIsProcessing(true);
    try {
      const result = await predictionAPI.predictFood(imageFile);
      setPredictionResult(result);
    } catch (error: any) {
      alert(error.message || 'Failed to analyze image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveResult = async () => {
    if (!predictionResult) return;

    setIsSaving(true);
    try {
      await foodLogAPI.addLog({
        food_item: predictionResult.food_item,
        calories: predictionResult.nutrition.calories,
        protein: predictionResult.nutrition.protein,
        carbs: predictionResult.nutrition.carbs,
        fat: predictionResult.nutrition.fat,
        fiber: predictionResult.nutrition.fiber,
        sugar: predictionResult.nutrition.sugar,
        serving_size: predictionResult.nutrition.serving_size,
        confidence: predictionResult.confidence,
      });

      alert('✅ Food logged successfully!');
      setPredictionResult(null);
      setCurrentView('history');
    } catch (error: any) {
      alert(error.message || 'Failed to save food log');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardResult = () => {
    setPredictionResult(null);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1 className="app-logo">
              <span className="logo-icon">🥗</span>
              <span className="text-gradient">Nutricam</span>
            </h1>
            <div className="header-actions">
              <span className="user-greeting">
                👋 Hey, <strong>{username}</strong>
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <div className="container">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${currentView === 'scan' ? 'active' : ''}`}
              onClick={() => setCurrentView('scan')}
            >
              <span className="nav-icon">📸</span>
              Scan Food
            </button>
            <button
              className={`nav-tab ${currentView === 'history' ? 'active' : ''}`}
              onClick={() => setCurrentView('history')}
            >
              <span className="nav-icon">📊</span>
              History
            </button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          {currentView === 'scan' ? (
            <div className="scan-view">
              <div className="view-header">
                <h2>Scan Your Food</h2>
                <p className="view-subtitle">
                  Point your camera at food and capture to get instant nutrition info
                </p>
              </div>

              <Camera onCapture={handleCapture} isProcessing={isProcessing} />

              {predictionResult && (
                <ResultCard
                  result={predictionResult}
                  onSave={handleSaveResult}
                  onDiscard={handleDiscardResult}
                  isSaving={isSaving}
                />
              )}
            </div>
          ) : (
            <History />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            Made with ❤️ using AI • Nutricam {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
