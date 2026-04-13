const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // A user has exactly one chat room with the admin system
    },
    lastMessage: {
        type: String,
        default: ''
    },
    unreadCountAdmin: {
        type: Number,
        default: 0
    },
    unreadCountUser: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const MessageSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        required: true
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Admin']
    },
    text: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
const Message = mongoose.model('Message', MessageSchema);

module.exports = {
    ChatRoom,
    Message
};
