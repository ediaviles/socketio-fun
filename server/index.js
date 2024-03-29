const express = require("express");
const app = express();
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app); // this is how we create a http server using express

let messages = new Map();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
}); // this is how you create a socket

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("send_message", (data) => {
        console.log(data);
        messages.get(socket.id).push(data.message);
        socket.to(data.room).emit("receive_message", data);
    })
    socket.on("join_room", (data) => {
        socket.join(data);
        if(!messages.has(socket.id)){
            messages[socket.id] = [];
        }
    })
})

server.listen(3001, () => {
    console.log("Server is running");
})