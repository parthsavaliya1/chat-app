const chatModel = require('../Models/chatModel');



const createChat = async (req,res) => {
    const {firstId, secondId} = req?.body || {};
    try {
        const chat = await chatModel.findOne({
            members: {$all:[firstId,secondId]}
        })

        if(chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members:[firstId,secondId]
        })

        const response = await newChat.save();
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json({message: 'Error while creating error !!!'})
    }

}

const getUserChat = async(req,res) => {
    const {userId} = req?.params || {};
    try{
        const chats = await chatModel.find({
            members:{$in: [userId]}
        })
        res.status(200).json(chats)

    }catch(error) {
        res.status(400).json({message:'Error while getting chat'});
    }
}

const findChat = async (req,res) => {
    const {firstId, secondId} = req?.params || {};
    try{
        const chat = await chatModel.findOne({
            members:{$all: [firstId,secondId]}
        })
        res.status(200).json(chat)

    }catch(error) {
        res.status(400).json({message:'Error while getting chat'});
    }
}

module.exports = {createChat,getUserChat,findChat}