#!/bin/bash

echo "🚀 YOKINA CAFE - SETUP SCRIPT"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"
echo ""

# Setup Backend
echo -e "${BLUE}Setting up Backend...${NC}"
cd backend
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo "❌ Backend installation failed"
    exit 1
fi

cp .env.example .env
echo -e "${GREEN}✅ Backend .env created (please edit with your MySQL credentials)${NC}"
cd ..
echo ""

# Setup Frontend
echo -e "${BLUE}Setting up Frontend...${NC}"
cd frontend
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

cp .env.example .env
echo -e "${GREEN}✅ Frontend .env created${NC}"
cd ..
echo ""

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MySQL credentials"
echo "2. Create database: mysql -u root -p < backend/database.sql"
echo "3. Run backend: cd backend && npm run dev"
echo "4. Run frontend: cd frontend && npm run dev"
