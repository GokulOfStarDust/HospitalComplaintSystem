const fs = require('fs');
const path = require('path');

const urlFilePath = path.resolve(__dirname, '../src/pages/Url.jsx');
const tempFilePath = path.resolve(__dirname, '../.url_original_content.tmp'); // Temporary file

try {
  const originalUrlFileContent = fs.readFileSync(tempFilePath, 'utf8');
  fs.writeFileSync(urlFilePath, originalUrlFileContent, 'utf8');
  fs.unlinkSync(tempFilePath); // Delete the temporary file
  console.log('Url.jsx restored to original content.');
} catch (error) {
  console.warn('Failed to restore Url.jsx. Original content might be missing or file not found:', error.message);
  console.warn('Manual restoration of Url.jsx might be needed.');
}