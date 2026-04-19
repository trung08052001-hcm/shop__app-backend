
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads/cvs');
console.log('Target Dir:', uploadDir);
console.log('Exists:', fs.existsSync(uploadDir));

try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created successfully');
} catch (e) {
    console.error('Failed to create:', e.message);
}
