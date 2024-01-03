const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let onlineUser = [];

io.on("connection", (socket) => {
    console.log(socket?.id)

    socket.on('addNewUser', (userId) => {
        !onlineUser?.some((u) => u?.userId === userId) &&
            onlineUser.push({
                userId,
                socketId: socket?.id,
            })
            io.emit('getOnlineUsers',onlineUser)
    })

    socket.on('sendMessage', (message) =>{
        const user = onlineUser?.find((us) => us?.userId === message?.recipientId);
        if(user){
            io.to(user?.socketId).emit("getMessage",message)
            io.to(user?.socketId).emit("getNotification",{
                senderId:message?.senderId,
                isRead:false,
                date:new Date()
            })

        }
    })

    socket.on('disconnect', () => {
        onlineUser= onlineUser?.filter((user) => user.socketId !== socket?.id)
        io.emit('getOnlineUsers',onlineUser)
    })
});

io.listen(3000);