const express = require('express');
const { regusterUser, loginUser, findUser, getAllUser } = require('../Controllers/userController');

const router = express.Router();

router.post('/register', regusterUser);
router.post('/login',loginUser);
router.get('/find/:id',findUser);
router.get('/',getAllUser)


module.exports=router;