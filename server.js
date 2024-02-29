require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./app/middleware/errorHandler');
const methodOverride = require('method-override');
const songRoutes = require('./app/routes/songRoutes');
const http = require('http');
const socketIo = require('socket.io');
const Comment = require("./app/models/comment");
const cacheControl = require('express-cache-controller');
const cookieParser = require('cookie-parser');

const whitelist = ["http://localhost:3000", "http://127.0.0.1:8000", "http://127.0.0.1:3000", "http://localhost:8000"];

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

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.use(cacheControl({
    maxAge: 300
}));

app.use('/', songRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
