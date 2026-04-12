const User = require('../user.model');

const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const users = await User.find(query).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await User.countDocuments(query);

        res.json({
            data: users,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Ngăn không cho xoá chính mình nếu lỡ bấm nghiệm
        if (req.user._id.toString() === id) {
            return res.status(400).json({ message: 'Không thể tự xoá tài khoản đang đăng nhập' });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json({ message: 'Đã xoá người dùng thành công' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllUsers,
    deleteUser
};
