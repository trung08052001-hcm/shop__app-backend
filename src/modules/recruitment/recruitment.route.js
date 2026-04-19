const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { applyForJob, getApplications, updateStatus, deleteApplication } = require('./recruitment.controller');

// Ensure upload directory exists - using absolute path from project root
const projectRoot = path.resolve(__dirname, '../../../');
const uploadDir = path.join(projectRoot, 'uploads', 'cvs');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post('/apply', upload.single('cvFile'), applyForJob);
router.get('/', getApplications);
router.put('/:id/status', updateStatus);
router.delete('/:id', deleteApplication);

module.exports = router;
