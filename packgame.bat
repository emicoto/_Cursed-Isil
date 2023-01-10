@echo off

:: Set working directory
pushd %~dp0
@set TWEEGO_PATH="%~dp0.twine\StoryFormats"

:: Run the appropriate compiler for the user's CPU architecture.
if %PROCESSOR_ARCHITECTURE% == AMD64 (
	CALL "%~dp0.twine\tweego_win64.exe" -o "%~dp0public\index.html" --head "%~dp0head.html" "%~dp0gamecode"  --module "%~dp0modules"
) else (
	CALL "%~dp0.twine\tweego_win86.exe" -o "%~dp0public\index.html" --head "%~dp0head.html" "%~dp0gamecode"  --module "%~dp0modules"
)