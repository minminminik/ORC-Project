@echo off
rem ORCHEM homepage preview - opens _preview\preview.html in an Edge app window
setlocal
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" (
  start "" "%~dp0_preview\preview.html"
  exit /b
)
set "PAGE=%~dp0_preview\preview.html"
set "PAGE=file:///%PAGE:\=/%"
start "" "%EDGE%" --app="%PAGE%" --user-data-dir="%LOCALAPPDATA%\ORCHEM-Preview" --window-size=1440,900 --no-first-run --no-default-browser-check --allow-file-access-from-files
