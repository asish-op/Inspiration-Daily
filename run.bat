@echo off

where node > nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js not found. Please install Node.js.
    color 4
    pause
    exit /b
)

color 7
echo Node.js detected.
echo Starting server...
node index.js

echo Server is running at http://localhost:8080
pause
