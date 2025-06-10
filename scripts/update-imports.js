const fs = require('fs');
const path = require('path');

// Define the mapping of old import paths to new ones
const pathMappings = [
  { old: '@/components/', new: '@/src/components/' },
  { old: '@/lib/', new: '@/src/lib/' },
  { old: '@/providers/', new: '@/src/providers/' },
  { old: '@/auth/', new: '@/src/auth/' },
  // Add any other path mappings as needed
];

// Function to update imports in a file
function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    pathMappings.forEach(({ old, new: newPath }) => {
      if (content.includes(old)) {
        content = content.replace(new RegExp(old, 'g'), newPath);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to process all files in a directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      // Skip node_modules and .next directories
      if (file.name === 'node_modules' || file.name === '.next') {
        return;
      }
      processDirectory(fullPath);
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx') || file.name.endsWith('.js') || file.name.endsWith('.jsx')) {
      updateImportsInFile(fullPath);
    }
  });
}

// Start processing from the src directory
const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
  console.log('Import updates completed!');
} else {
  console.error('src directory not found!');
}
