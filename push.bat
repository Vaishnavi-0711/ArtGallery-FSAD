@echo off
REM Helper script to push changes to GitHub with a custom message
REM Usage: push.bat "Your commit message here"

if "%1"=="" (
    echo Usage: push.bat "Your commit message"
    echo Example: push.bat "Add new feature"
    exit /b 1
)

echo 📝 Committing changes: %1
git add .

git commit -m "%1"

if %ERRORLEVEL% equ 0 (
    echo ✅ Commit successful. Pushing to GitHub...
    git push origin main
    
    if %ERRORLEVEL% equ 0 (
        echo 🎉 Successfully pushed to GitHub!
    ) else (
        echo ❌ Push failed. Check your connection or permissions.
        exit /b 1
    )
) else (
    echo ⚠️ Nothing to commit or commit failed.
    exit /b 1
)
