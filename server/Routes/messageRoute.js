const express = require('express');
const router = express.Router()
const { createMessage, getMessages } = require('../Controllers/messageController');

router.post('/create',createMessage);
router.get('/:chatId',getMessages);

module.exports= router