const mongoose = require('mongoose');

const recruitmentSchema = new mongoose.Schema(
    {
        userEmail: {
            type: String,
            required: true,
        },
        jobTitle: {
            type: String,
            required: true,
            enum: ['Frontend Developer', 'Backend Developer', 'Mobile Developer'],
        },
        cvPath: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Reviewed', 'Rejected', 'Accepted'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Recruitment', recruitmentSchema);
