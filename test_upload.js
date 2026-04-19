const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        const formData = new FormData();
        formData.append('userEmail', 'test@gmail.com');
        formData.append('jobTitle', 'Frontend Developer');
        
        // Create a dummy PDF if not exists for testing
        const testPdfPath = path.join(__dirname, 'test.pdf');
        fs.writeFileSync(testPdfPath, 'dummy pdf content for testing');
        
        // Load file as Blob
        const fileBuffer = fs.readFileSync(testPdfPath);
        const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });
        
        formData.append('cvFile', fileBlob, 'test.pdf');

        const url = 'http://192.168.1.29:3000/api/recruitment/apply';
        console.log(`Sending request to ${url}...`);
        
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            // Header 'Content-Type' is automatically set with boundary for FormData
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if (response.status === 201) {
            console.log('SUCCESS: Upload is working!');
        } else {
            console.error('FAILED: Server returned error.');
        }
    } catch (error) {
        console.error('ERROR during testing:', error.message);
    }
}

testUpload();
