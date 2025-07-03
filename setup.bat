@echo off
echo Setting up Text to PowerPoint Converter...
echo.

echo Installing backend dependencies...
cd backend
pip install -r requirements.txt
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo Setup complete! You can now run the application using start.bat
echo.
