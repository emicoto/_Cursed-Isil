@echo off

:: Set working directory
pushd %~dp0
@set TWEEGO_PATH="%~dp0.twine\StoryFormats"

:: Run the appropriate compiler for the user's CPU architecture.
if %PROCESSOR_ARCHITECTURE% == AMD64 (
	CALL "%~dp0.twine\tweego_win64.exe" -d -o "%~dp0game.twee" "%~dp0public\index.html"
) else (
	CALL "%~dp0.twine\tweego_win86.exe" -d -o "%~dp0game.twee" "%~dp0public\index.html"
)