require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./app/middleware/errorHandler');
const methodOverride = require('method-override');
const songRoutes = require('./app/routes/songRoutes');
const http = require('http');
const socketIo = require('socket.io');
const Comment = require("./app/models/comment");

const whitelist = ["http://localhost:3000", "http://127.0.0.1:8000"];

const corsOptions = {
    origin: originFunction,
};

function originFunction(origin, callback) {
    if (whitelist.includes(origin) || !origin) {
        callback(null, true);
    } else {
        callback(new Error("Not allowed by CORS"));
    }
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'pug');
app.set('views', 'views');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));


io.on('connection', (socket) => {
    console.log('A new client has connected');
    socket.on('newComment', async (data) => {
        try {
            console.log('New comment:', data);
            const newComment = await Comment.create({
                songId: data.songId,
                username: data.username,
                text: data.text,
            });

            io.emit('comment', newComment);
        } catch (err) {
            console.error('Error saving comment:', err);
        }
    });
});

app.use(cors(corsOptions));
app.use(errorHandler);

// app.use(cors());
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use('/', songRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));

// TODO 1 - add user page with possibility to add favourite songs (django)
// TODO 2 - add logging and error handling (express)
// TODO 3 - add interesting packages (express)