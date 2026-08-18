@echo off
setlocal

set "DIR=%CD%"
set "JSON=%DIR%\assets\data\enemies\carnellio-boss.json"
set "ZIP=%DIR%\carnellio.zip"
set "CCMOD=%DIR%\carnellio.ccmod"
set "TEMPZIP=%TEMP%\carnellio_%RANDOM%.zip"

echo Checking %JSON%...

if not exist "%JSON%" (
    echo ERROR: carnellio-boss.json was not found.
    pause
    exit /b 1
)

powershell -NoProfile -Command ^
    "$content = Get-Content -LiteralPath '%JSON%' -Raw; " ^
    "$debugCount = ([regex]::Matches($content, 'debugHack')).Count; " ^
    "$z3Count = ([regex]::Matches($content, 'z3Hack')).Count; " ^
    "Write-Host ('debugHack occurrences: ' + $debugCount); " ^
    "Write-Host ('z3Hack occurrences: ' + $z3Count); " ^
    "if ($debugCount -ne 1 -or $z3Count -ne 1) { " ^
    "    Write-Host ''; " ^
    "    Write-Host 'ERROR: Expected debugHack and z3Hack to each occur exactly once.' -ForegroundColor Red; " ^
    "    exit 1 " ^
    "}"

if errorlevel 1 (
    echo.
    echo ZIP CREATION ABORTED.
    pause
    exit /b 1
)

echo.
echo Validation passed.
echo.

REM Move previous versions to Recycle Bin
if exist "%ZIP%" powershell -NoProfile -Command "Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('%ZIP%', 'Delete old carnellio.zip', 'Recycle')"
if exist "%CCMOD%" powershell -NoProfile -Command "Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('%CCMOD%', 'Delete old carnellio.ccmod', 'Recycle')"

REM Zip everything in the current folder into a temporary location
powershell -NoProfile -Command "Compress-Archive -Path '%DIR%\*' -DestinationPath '%TEMPZIP%' -Force"

REM Put the ZIP in the current folder
move /Y "%TEMPZIP%" "%ZIP%" >nul

REM Make carnellio.ccmod an identical copy of carnellio.zip
copy /Y "%ZIP%" "%CCMOD%" >nul

echo Done.
echo Created:
echo   %ZIP%
echo   %CCMOD%

endlocal