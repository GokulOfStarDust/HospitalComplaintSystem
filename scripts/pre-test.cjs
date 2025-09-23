const fs = require('fs');
const path = require('path');

const urlFilePath = path.resolve(__dirname, '../src/pages/Url.jsx');
const tempFilePath = path.resolve(__dirname, '../.url_original_content.tmp'); // Temporary file

const originalUrlFileContent = fs.readFileSync(urlFilePath, 'utf8');

// Save original content to a temporary file
fs.writeFileSync(tempFilePath, originalUrlFileContent, 'utf8');

// Define the mock environment variables
const mockEnv = {
  VITE_BASE_URL: 'http://localhost:8000/',
  VITE_DEPARTMENT_URL: 'api/departments/',
  VITE_ISSUE_CATEGORY_URL: 'api/issue-categories/',
  VITE_ROOMS_URL: 'api/rooms/',
  VITE_COMPLAINT_URL: 'api/complaints/',
  VITE_REPORT_URL: 'api/reports/',
  VITE_TICKET_TAT_URL: 'api/ticket-tat/',
};

// Construct the new, simplified Url.jsx content for testing
const simplifiedUrlContent = `
export const BASE_URL = '${mockEnv.VITE_BASE_URL}';
export const DEPARTMENT_URL = '${mockEnv.VITE_DEPARTMENT_URL}';
export const ISSUE_CATEGORY_URL = '${mockEnv.VITE_ISSUE_CATEGORY_URL}';
export const ROOMS_URL = '${mockEnv.VITE_ROOMS_URL}';
export const COMPLAINT_URL = '${mockEnv.VITE_COMPLAINT_URL}';
export const REPORT_URL = '${mockEnv.VITE_REPORT_URL}';
export const TICKET_TAT_URL = '${mockEnv.VITE_TICKET_TAT_URL}';
`;

// Overwrite the original file with the modified content
// This is a temporary measure for the test run
fs.writeFileSync(urlFilePath, simplifiedUrlContent, 'utf8');

console.log('Url.jsx temporarily modified for testing.');