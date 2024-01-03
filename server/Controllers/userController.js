const userModel = require('../Models/userModel')
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config()


const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY;
    return JWT.sign({ _id }, jwtKey, { expiresIn: "3d" })
}


const regusterUser = async (req, res) => {
    try {

        const { name, email, password } = req.body || {};

        let user = await userModel.findOne({ email });
        if (user) return res.status(400).json({ message: "User is already exist with same email !!!" });

        if (!name || !password || !email) return res.status(400).json({ message: "All the fileds are mandetory !!!" });

        if (!validator.isEmail(email)) return res.status(400).json({ message: "Please enter valid email !!!" })

        if (!validator.isStrongPassword(password)) return res.status(400).json({ message: "Password must be a strong password !!!" })

        user = new userModel({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save()

        const token = createToken(user?._id);
        res.status(200).json({ _id: user?._id, name, email, token })
    }
    catch (error) {
        console.log(`Error while create user ${error}`);
        res.status(500).json(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name: user.name, email: user.email, token });

    } catch (error) {
        console.log(`Error while login user !!!`, error);
        res.status(500).json({ message: `Error while login user ${error}` })
    }
}

const findUser = async(req,res) => {
    try {
        const {id} = req.params || {}

        const user = await userModel.findById(id);
        res.status(200).json(user)

    }catch(error) {
        console.log(`Error while fetch user !!!`, error);
        res.status(500).json({ message: `Error while fetch user ${error}` })
    }
}

const getAllUser = async(req,res) => {
    try {

        const user = await userModel.find();
        res.status(200).json(user)

    }catch(error) {
        console.log(`Error while fetch user !!!`, error);
        res.status(500).json({ message: `Error while fetch user ${error}` })
    }
}

module.exports = { regusterUser, loginUser,findUser,getAllUser }