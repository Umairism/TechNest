@echo off
REM Set DATABASE_URL environment variable
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/technest_dev

REM Run prisma db push
echo Initializing database...
call npm run prisma:push

if %ERRORLEVEL% NEQ 0 (
    echo Database initialization failed!
    pause
    exit /b 1
)

REM Run prisma seed
echo Seeding database with admin user...
call npm run prisma:seed

if %ERRORLEVEL% NEQ 0 (
    echo Database seeding failed!
    pause
    exit /b 1
)

echo.
echo ✓ Database setup completed successfully!
echo.
echo Admin Credentials:
echo Email: technest12@technest.com
echo Password: TechNext123
echo.
echo Login at: http://localhost:3000/admin/login
echo.
pause
