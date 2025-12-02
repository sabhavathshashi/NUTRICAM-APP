# Nutricam Development Startup Script
# This script starts both the backend and frontend servers

Write-Host "🥗 Starting Nutricam..." -ForegroundColor Green
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: Please run this script from the NUTRICAM MAIN directory" -ForegroundColor Red
    exit 1
}

# Start Backend Server
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    
    # Activate virtual environment
    if (Test-Path "venv\Scripts\Activate.ps1") {
        & "venv\Scripts\Activate.ps1"
    }
    
    # Run backend
    python run.py
}

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Magenta
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location frontend
    npm run dev
}

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend API: http://localhost:8000" -ForegroundColor Yellow
Write-Host "📍 Frontend App: http://localhost:5173" -ForegroundColor Yellow
Write-Host "📍 API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Gray
Write-Host ""

# Monitor jobs
try {
    while ($true) {
        # Check if jobs are still running
        if ($backendJob.State -ne "Running" -and $frontendJob.State -ne "Running") {
            Write-Host "⚠️ Both servers have stopped" -ForegroundColor Yellow
            break
        }
        
        Start-Sleep -Seconds 1
    }
}
finally {
    # Cleanup
    Write-Host ""
    Write-Host "🛑 Stopping servers..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Write-Host "✅ Servers stopped" -ForegroundColor Green
}
