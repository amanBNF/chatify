import Message from '../models/Message.js';
import User from '../models/User.js';
import cloudinary from '../lib/cloudinary.js';

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        res.status(200).json({ contacts: filteredUsers });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error while fetching contacts' });
        return;
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;


        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json({ messages });

    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error while fetching messages' });
        return;
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imgaeUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgaeUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imgaeUrl
        });

        await newMessage.save();
        res.status(201).json({ message: newMessage });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error while sending message' });
        return;
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggesInUserId = req.user._id;

        const messages = await Message.find({
            $or: [{ senderId: loggesInUserId }, { receiverId: loggesInUserId }],
        });

        const ChatPartnersIds = [...new Set(messages.map((msg) => msg.senderId.toString() === loggesInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()))];

        const ChatPartners = await User.find({_id: {$in:ChatPartnersIds}}).select('-password');

        res.status(200).json({chatPartners: ChatPartners});
    } catch (error) {
        console.error('Error fetching chat partners:', error);
        res.status(500).json({ message: 'Server error while fetching chat partners' });
        return;
    }
}