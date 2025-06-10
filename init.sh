#!/bin/bash

# Create necessary directories
mkdir -p cms/collections web/{pages,lib,public,styles}

# Install CMS dependencies
cd cms
npm init -y
npm install payload @payloadcms/db-mongodb @payloadcms/richtext-slate @payloadcms/plugin-cloud-storage @payloadcms/plugin-cloudinary dotenv express mongoose nodemon typescript @types/node @types/express

# Install Web dependencies
cd ../web
npm init -y
npm install next@15.3.3 react@^18.2.0 react-dom@^18.2.0 @headlessui/react @heroicons/react react-hook-form swr tailwindcss@latest postcss@latest autoprefixer@latest typescript @types/node @types/react @types/react-dom

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create .env files
cd ..
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > web/.env.local
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> web/.env.local

# Set execute permissions
chmod +x init.sh

echo "Setup complete!"
echo "1. Start the CMS: cd cms && npm run dev"
echo "2. Start the web app: cd web && npm run dev"
