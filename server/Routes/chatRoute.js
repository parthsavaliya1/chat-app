const express = require('express');
const { createChat, getUserChat, findChat } = require('../Controllers/chatController');
const router = express.Router();

router.post('/create', createChat);
router.get('/:userId',getUserChat);
router.get('/find-user-chat/:firstId/:secondId', findChat)

module.exports=router