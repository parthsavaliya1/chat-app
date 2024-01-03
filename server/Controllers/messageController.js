const messageModel = require('../Models/messageModel');

const createMessage = async (req, res) => {
    const { chatId, text, senderId } = req.body || {};

    try {
        const message = new messageModel({
            chatId, senderId, text
        })

        const response = await message.save();
        res.status(200).send(response)
    } catch (error) {
        res.status(400).json({ message: 'Error while create message' });
    }
}

const getMessages = async (req, res) => {
    const { chatId } = req.params || {};

    try {
        const messages = await messageModel.find({ chatId })
        res.status(200).send(messages)

    } catch (error) {
        res.status(400).send({ message: "Error while get message" })
    }
}

module.exports = { createMessage,getMessages }