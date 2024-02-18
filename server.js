require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./app/middleware/errorHandler');
const methodOverride = require('method-override');
const userRoutes = require('./app/routes/userRoutes');
const songRoutes = require('./app/routes/songRoutes');
const socketHandler = require('./app/sockets/socketHandler');
const http = require('http');
const socketIo = require('socket.io');
// const postRoutes = require('./app/routes/postRoutes');

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
    socketHandler(socket);
});

app.use(cors());
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use('/', songRoutes);
app.use('/users', userRoutes);
// app.use('/posts', postRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));