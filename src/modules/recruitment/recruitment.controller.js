const Recruitment = require('../../models/recruitment.model');
const User = require('../../models/user.model');
const { createNotification } = require('../../services/notification.service');

exports.applyForJob = async (req, res, next) => {
    try {
        const { userEmail, jobTitle } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a CV PDF' });
        }

        const cvPath = `/uploads/cvs/${req.file.filename}`;
        const application = await Recruitment.create({
            userEmail,
            jobTitle,
            cvPath
        });

        res.status(201).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

exports.getApplications = async (req, res, next) => {
    try {
        const apps = await Recruitment.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: apps });
    } catch (error) {
        next(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await Recruitment.findById(id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        // Notify user
        const user = await User.findOne({ email: application.userEmail });
        if (user) {
            const statusLabels = {
                'Pending': 'Chờ xử lý',
                'Reviewed': 'Đã xem hồ sơ',
                'Interviewing': 'Phỏng vấn',
                'Accepted': 'Đã trúng tuyển',
                'Rejected': 'Rất tiếc, hồ sơ không phù hợp'
            };
            
            // Normalize status for label lookup
            const label = statusLabels[status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()] || status;

            await createNotification({
                userId: user._id,
                title: 'Cập nhật trạng thái ứng tuyển',
                body: `Hồ sơ cho vị trí ${application.jobTitle} của bạn đã được chuyển sang: ${label}`,
                type: 'recruitment_updated'
            });
        }

        res.status(200).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

exports.deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Recruitment.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        res.status(200).json({ success: true, message: 'Application deleted successfuly' });
    } catch (error) {
        next(error);
    }
};
