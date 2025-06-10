#!/bin/bash

# Standardize route parameters to use [slug] instead of [id]

# Rename directories
mv "src/app/(main)/attractions/[id]" "src/app/(main)/attractions/[slug]"
mv "src/app/(main)/blog/[id]" "src/app/(main)/blog/[slug]"
mv "src/app/[lang]/tours/[id]" "src/app/[lang]/tours/[slug]"
mv "src/app/admin/tours/[id]" "src/app/admin/tours/[slug]"

# Update imports and references in files
find src/app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/\[id\]/[slug]/g'
find src/app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/params\.id/params.slug/g'
find src/app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/:id/:slug/g'

echo "Routes have been standardized to use [slug] parameter."
