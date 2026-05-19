#!/bin/bash

# Set DATABASE_URL environment variable
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/technest_dev"

# Run prisma db push
echo "Initializing database..."
npm run prisma:push

if [ $? -ne 0 ]; then
    echo "Database initialization failed!"
    exit 1
fi

# Run prisma seed
echo "Seeding database with admin user..."
npm run prisma:seed

if [ $? -ne 0 ]; then
    echo "Database seeding failed!"
    exit 1
fi

echo ""
echo "✓ Database setup completed successfully!"
echo ""
echo "Admin Credentials:"
echo "Email: technest12@technest.com"
echo "Password: TechNext123"
echo ""
echo "Login at: http://localhost:3000/admin/login"
echo ""
