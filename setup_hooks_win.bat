@echo off
setlocal enabledelayedexpansion

set "RED=0C"
set "GREEN=0A"

if not exist "tools\python\python.exe" (
    color %RED%
    echo tools\python\python.exe not found. Please ensure it exists in the current directory.
    pause
    exit /b 1
)

where git >nul 2>&1
if %errorlevel%==0 (
    color %GREEN%
    git config core.hooksPath .githooks-win
    echo Git hooks path successfully configured to .githooks-win
    pause
    exit /b 0
)

set "USERNAME=%USERNAME%"
set "GITHUB_PATH=C:\Users\%USERNAME%\AppData\Local\GitHubDesktop"

set "LATEST_APP="
for /f "delims=" %%A in ('dir "%GITHUB_PATH%\app-*" /b /ad-h /o-n') do (
    set "LATEST_APP=%%A"
    goto :found
)
:found

set "GIT_PATH=%GITHUB_PATH%\%LATEST_APP%\resources\app\git\cmd\git.exe"

if exist "%GIT_PATH%" (
    color %GREEN%
    "%GIT_PATH%" config core.hooksPath .githooks-win
    echo Git hooks path successfully configured to .githooks-win
    pause
    exit /b 0
) else (
    color %RED%
    echo Git is not available. Please install Git and try again.
    pause
    exit /b 1
)

endlocal
pause
