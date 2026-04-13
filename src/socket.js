const { Server } = require("socket.io");
const { ChatRoom, Message } = require("./modules/chat/chat.model");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Cần thay đổi trên production
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Tham gia phòng chat (roomId thường sẽ là ID của ChatRoom document)
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
        });

        // Xử lý gửi tin nhắn
        socket.on("send_message", async (data) => {
            // Hỗ trợ 2 format:
            // 1. Flat: { roomId, senderId, senderModel, text }
            // 2. Flutter nested: { roomId, sender: { userId, type }, content }
            try {
                // Parse senderId và senderModel linh hoạt
                const senderId = data.senderId || data.sender?.userId;
                const senderModel = data.senderModel || data.sender?.type || 'User';
                const text = data.text || data.content;

                if (!senderId || !text) {
                    console.error("Thiếu dữ liệu tin nhắn:", data);
                    return;
                }

                // 1. Lưu tin nhắn vào Database
                const newMessage = await Message.create({
                    room: data.roomId,
                    sender: senderId,
                    senderModel: senderModel,
                    text: text
                });

                // 2. Cập nhật lastMessage của phòng chat
                const updateQuery = { lastMessage: text };
                if (senderModel === 'User') {
                    updateQuery.$inc = { unreadCountAdmin: 1 };
                } else {
                    updateQuery.$inc = { unreadCountUser: 1 };
                }
                
                await ChatRoom.findByIdAndUpdate(data.roomId, updateQuery);

                // 3. Phát lại tin nhắn cho cả 2 phía trong phòng
                io.to(data.roomId).emit("receive_message", {
                    _id: newMessage._id,
                    room: newMessage.room,
                    sender: newMessage.sender,
                    senderModel: newMessage.senderModel,
                    text: newMessage.text,
                    content: newMessage.text, // Alias để Flutter tương thích
                    isRead: newMessage.isRead,
                    createdAt: newMessage.createdAt,
                });

                // 4. Phát notification cho admin nếu user gửi
                if (senderModel === 'User') {
                    io.emit("admin_receive_notification", { 
                        roomId: data.roomId, 
                        text: text, 
                        timestamp: newMessage.createdAt 
                    });
                }

            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn socket: ", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = { initSocket };
