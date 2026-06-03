@echo off
title Learnify Dev Server
cd /d "%~dp0"

echo ============================================
echo   Learnify - Install and Start
echo ============================================
echo.

echo [0/5] Stopping old dev servers...
powershell -NoProfile -Command ^
  "$ports = 3000,3001,3002,8000; foreach ($p in $ports) { Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }; Start-Sleep -Seconds 3; $next = Join-Path '%~dp0frontend' '.next'; if (Test-Path $next) { Remove-Item $next -Recurse -Force -ErrorAction SilentlyContinue }; Write-Host 'Ports cleared and cache removed.'"

echo [1/5] Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 (
  echo.
  echo Frontend npm install failed.
  pause
  exit /b 1
)

echo.
echo [2/5] Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
if errorlevel 1 (
  echo.
  echo Backend npm install failed.
  pause
  exit /b 1
)

echo.
echo [3/5] Starting backend API on http://localhost:8000...
start /B cmd /c "cd /d "%~dp0backend" && npm run dev"

echo.
echo [4/5] Waiting for backend health check...
timeout /t 3 /nobreak >nul
powershell -NoProfile -Command "try { Invoke-RestMethod -Uri 'http://localhost:8000/api/health' -TimeoutSec 5 | Out-Null; Write-Host 'Backend ready.' } catch { Write-Host 'Backend starting (may need a few more seconds)...' }"

echo [5/5] Starting frontend at http://localhost:3000
echo       Press Ctrl+C to stop the frontend server.
echo       If you see Internal Server Error, close ALL terminals and run start.bat again.
echo.
cd /d "%~dp0frontend"
call npm run dev

echo.
echo Frontend stopped.
pause
