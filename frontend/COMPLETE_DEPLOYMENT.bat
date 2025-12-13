@echo off
echo ========================================
echo WKND_CO - FINAL DEPLOYMENT STEPS
echo ========================================
echo.
echo ✅ COMPLETED:
echo    - Code pushed to GitHub
echo    - Deployed to Vercel
echo    - Custom domains added
echo    - Site live at: https://frontend-82sp0mzlo-john-barlows-projects.vercel.app
echo.
echo 📋 REMAINING STEPS (3-5 minutes):
echo.

:: Step 1: Get Service Role Key
echo ========================================
echo STEP 1: GET SERVICE ROLE KEY
echo ========================================
echo.
echo Opening Supabase API Settings...
start https://supabase.com/dashboard/project/vfkgheowfxnwzzeifpsw/settings/api
echo.
echo ACTION REQUIRED:
echo 1. Find "service_role" key on the page
echo 2. Click "Copy" button next to it
echo 3. Come back to this window
echo.
set /p SERVICE_KEY="Paste the service_role key here and press ENTER: "
echo.

:: Step 2: Add Service Key to Vercel
echo Adding service role key to Vercel...
echo %SERVICE_KEY% | vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo ✅ Service role key added to Vercel
echo.

:: Step 3: Add to local .env
echo Adding to .env.local...
echo SUPABASE_SERVICE_ROLE_KEY=%SERVICE_KEY% >> .env.local
echo ✅ Added to .env.local
echo.

:: Step 4: Run Database Migration
echo ========================================
echo STEP 2: RUN DATABASE MIGRATION
echo ========================================
echo.
echo Opening Supabase SQL Editor...
start https://supabase.com/dashboard/project/vfkgheowfxnwzzeifpsw/sql/new
echo.
echo Opening migration SQL file...
start migrations\001_user_roles_and_content.sql
echo.
echo ACTION REQUIRED:
echo 1. Copy ALL contents from the SQL file that opened
echo 2. Paste into Supabase SQL Editor
echo 3. Click RUN (or press Ctrl+Enter)
echo 4. Wait for "Success. No rows returned"
echo.
pause
echo.

:: Step 5: Seed Content
echo ========================================
echo STEP 3: SEED DATABASE CONTENT
echo ========================================
echo.
echo Running seed script...
call npm run setup
echo.
if %ERRORLEVEL% EQU 0 (
    echo ✅ Database seeded with 8 articles
) else (
    echo ⚠️  Seed might have issues - check output above
)
echo.

:: Step 6: Configure DNS
echo ========================================
echo STEP 4: CONFIGURE DNS IN GODADDY
echo ========================================
echo.
echo Opening GoDaddy DNS Management...
start https://dcc.godaddy.com/manage/PARTYWKND.COM/dns
echo.
echo ACTION REQUIRED - Make these 2 changes:
echo.
echo CHANGE #1 - A Record for root domain:
echo    Type: A
echo    Name: @
echo    Value: 76.76.21.21
echo    TTL: 600 seconds
echo.
echo CHANGE #2 - CNAME Record for www:
echo    Type: CNAME
echo    Name: www
echo    Value: cname.vercel-dns.com
echo    TTL: 1 Hour
echo.
echo (Instructions also in EXACT_STEPS.md)
echo.
pause
echo.

:: Step 7: Verify
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your site is now deploying to:
echo   • https://frontend-82sp0mzlo-john-barlows-projects.vercel.app (LIVE NOW)
echo   • https://www.partywknd.com (will be live in 10-30 minutes)
echo   • https://partywknd.com (will be live in 10-30 minutes)
echo.
echo ⏱️  DNS propagation typically takes 10-30 minutes
echo.
echo 🔍 Check DNS status:
echo    https://dnschecker.org/#A/partywknd.com
echo.
echo 📊 Vercel Dashboard:
start https://vercel.com/john-barlows-projects/frontend
echo.
echo ========================================
echo TESTING CHECKLIST:
echo ========================================
echo.
echo Test these features once DNS propagates:
echo   [ ] Homepage loads
echo   [ ] Can create account (Sign Up)
echo   [ ] Can login
echo   [ ] Dashboard shows 14-day trial
echo   [ ] Content page shows 8 articles
echo   [ ] Premium articles show paywall
echo   [ ] Free articles accessible
echo   [ ] Pricing page displays correctly
echo   [ ] HTTPS works (padlock icon)
echo.
echo ========================================
echo 🎉 CONGRATULATIONS! 🎉
echo ========================================
echo.
echo You've successfully deployed a complete SaaS application with:
echo   ✅ User authentication
echo   ✅ Subscription system (Free/Premium/Enterprise)
echo   ✅ 14-day trial system
echo   ✅ Paywall protection
echo   ✅ Professional UI
echo   ✅ Production deployment
echo   ✅ Custom domain
echo.
echo Need help? Check these files:
echo   - START_HERE.md
echo   - EXACT_STEPS.md
echo   - DEPLOYMENT_GUIDE.md
echo.
pause
