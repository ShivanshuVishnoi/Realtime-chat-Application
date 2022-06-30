const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const formatMessage = require('./utils/message');
const { userJoin, getCurrentUser, userLeave, getRoomUser } = require('./utils/user');

const botName = "ChatMania Bot";

app.use(express.static("public"));

io.on("connection", function (socket) {
    socket.on("joinRoom", function ({ username, room }) {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit("message", formatMessage(botName,
            "Welcome to chatMania!."));

        socket.broadcast.to(user.room).emit("message",
            formatMessage(botName, `${user.username} has joined the chat.`));

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUser(user.room)
        });
    })

    socket.on("chatMessage", function (msg) {

        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message",
            formatMessage(user.username, msg));
    })

    socket.on("disconnect", function () {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit("message",
                formatMessage(botName, `${user.username} has left the chat`));

            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUser(user.room)
            });
        }


    });

});

server.listen(process.env.PORT || 3000, function () {
    console.log("Server Connected to port 3000");
});