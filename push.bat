@echo off
title Push to GitHub - 0916
echo =======================================================
echo Pushing Personal Page to https://github.com/yenyen0921/0916.git
echo =======================================================
echo.

cd /d "C:\Users\user\.gemini\antigravity-ide\scratch\personal-page"

git config user.name "yenyen0921"
git config user.email "yenyen0921@users.noreply.github.com"
git remote set-url origin https://github.com/yenyen0921/0916.git

echo Current status:
git status
echo.
echo Pushing branch 'main' to origin...
git push -u origin main

echo.
echo =======================================================
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Your code has been pushed to GitHub!
    echo Visit: https://github.com/yenyen0921/0916
) else (
    echo [INFO] If a browser window opened, please complete the sign-in.
)
echo =======================================================
echo.
pause
