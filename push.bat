@echo off
echo Pushing updates to your portfolio website...
cd /d "%~dp0"
git add -A
git commit -m "Update content"
git push
echo.
echo Done! Your site will update in about 1 minute.
echo Hard refresh (Ctrl+Shift+R) to see changes.
pause