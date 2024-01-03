const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

const userRoute= require('./Routes/userRoute')
const chatRoute = require('./Routes/chatRoute')
const messageRoute = require('./Routes/messageRoute')


const app = express();
const PORT = process.env.PORT || 5000;
const URI = process.env.ATLAS_URI;

app.use(express.json())
app.use(cors())
app.use('/api/users',userRoute);
app.use('/api/chat',chatRoute);
app.use('/api/message', messageRoute)


app.listen(PORT, (req, res) => {
    console.log(`Server is running on ${PORT}`)
})

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connection SuccessFully')).catch((err) => console.log(`Error when connect mongoDB ${err}`))