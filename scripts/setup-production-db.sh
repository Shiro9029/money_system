#!/bin/bash

# Production Database Setup Script for Neon
echo "🚀 Setting up production database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL to your Neon connection string:"
    echo "export DATABASE_URL='postgresql://username:password@hostname/database?sslmode=require'"
    exit 1
fi

echo "📊 DATABASE_URL is set"

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Apply migrations to production database
echo "🔄 Applying database migrations..."
npx prisma migrate deploy

# Seed the database with initial data
echo "🌱 Seeding database with initial data..."
npx prisma db seed

echo "✅ Production database setup complete!"
echo "🌐 You can view your database at: https://console.neon.tech"