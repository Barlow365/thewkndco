@echo off
echo ================================
echo WKND_CO Quick Deploy Script
echo ================================
echo.

:: Check if in correct directory
if not exist "package.json" (
    echo ERROR: Not in project directory!
    echo Please run this script from: Desktop\WKND_CO\3_CODEBASE\frontend
    pause
    exit /b 1
)

echo Step 1: Checking Node modules...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Step 2: Building production version...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo BUILD FAILED! Fix errors above.
    pause
    exit /b 1
)

echo.
echo ================================
echo Build successful!
echo ================================
echo.
echo Next steps:
echo 1. Make sure database migration is run in Supabase
echo 2. Push to GitHub: git push origin main
echo 3. Deploy to Vercel: vercel --prod
echo.
echo Or run: vercel --prod (if you have Vercel CLI)
echo.

set /p deploy="Deploy to Vercel now? (y/n): "
if /i "%deploy%"=="y" (
    echo.
    echo Deploying to Vercel...
    call vercel --prod
) else (
    echo.
    echo Deployment skipped.
    echo Run 'vercel --prod' when ready to deploy.
)

echo.
pause
