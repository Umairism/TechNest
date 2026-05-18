#!/bin/bash

# TechNest Backend Setup Script for Pakistan Market
# This script initializes the entire backend infrastructure

echo "🚀 TechNest Backend Setup Script"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Step 2: Setup environment variables
if [ ! -f .env.local ]; then
    echo "📝 Setting up .env.local..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual configuration"
    echo "   Key variables to configure:"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - Payment gateway credentials"
else
    echo "✅ .env.local already exists"
fi

echo ""

# Step 3: Initialize Prisma
echo "🗄️  Setting up database..."
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo "⚠️  Database migration failed. Make sure DATABASE_URL is correctly set."
    echo "   Check .env.local and try again"
fi

echo ""

# Step 4: Generate Prisma Client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Update .env.local with your actual configuration"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Visit http://localhost:3000"
echo ""
echo "📖 For detailed setup instructions, see BACKEND_SETUP.md"
echo ""
