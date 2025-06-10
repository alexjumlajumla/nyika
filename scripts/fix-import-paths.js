const fs = require('fs');
const path = require('path');

// Define the root directory
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// File extensions to process
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

// Function to process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Replace @/src/ with @/
    const newContent = content.replace(
      /from ['"]@\/src\/([^'"\s]+)['"]/g, 
      (match, p1) => {
        updated = true;
        return `from '@/${p1}'`;
      }
    );
    
    // If the content was updated, write it back to the file
    if (updated) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated imports in: ${path.relative(rootDir, filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Recursively process all files in a directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && !file.startsWith('.') && !file.includes('dist')) {
        processDirectory(fullPath);
      }
    } else if (fileExtensions.includes(path.extname(file).toLowerCase())) {
      processFile(fullPath);
    }
  });
}

console.log('Starting to fix import paths...');
processDirectory(srcDir);
console.log('Finished fixing import paths.');
