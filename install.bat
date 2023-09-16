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
echo Installing npm packages...
npm install express path fs.promises axios jimp

echo Packages installed successfully.
pause
