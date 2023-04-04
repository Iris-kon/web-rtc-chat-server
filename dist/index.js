"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Server is running!");
});
io.on("connection", (socket) => {
    socket.emit("me", socket.id);
    socket.on("disconnect", () => {
        socket.broadcast.emit("callended");
    });
    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    });
    socket.on("answercall", (data) => {
        io.to(data.io).emit("callaccepted", data.signal);
    });
});
server.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
