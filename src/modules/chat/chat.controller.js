const { ChatRoom, Message } = require('./chat.model');

// [Admin] Lấy danh sách các phòng chat
exports.getRooms = async (req, res) => {
    try {
        const rooms = await ChatRoom.find()
            .populate('user', 'name email avatar')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách phòng chat',
            error: error.message
        });
    }
};

// [User & Admin] Lấy tin nhắn trong một phòng
exports.getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        
        // Reset unread count based on role. 
        // Currently we do not have strict role check here, but let's assume if user calls this it reads user unread, if admin reads admin unread.
        // For simplicity now we just return the messages. Real implementation might reset unread counts here.

        const messages = await Message.find({ room: roomId })
            .sort({ createdAt: 1 }); // Sort oldest to newest for UI display

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách tin nhắn',
            error: error.message
        });
    }
};

// [User] Khởi tạo hoặc lấy phòng chat của một user
exports.getMyRoom = async (req, res) => {
    try {
        const userId = req.user._id;

        let room = await ChatRoom.findOne({ user: userId }).populate('user', 'name email avatar');
        if (!room) {
            room = await ChatRoom.create({ user: userId });
            room = await ChatRoom.findById(room._id).populate('user', 'name email avatar');
        }

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy phòng chat',
            error: error.message
        });
    }
};
