const Comment = require('../models/comment');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

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
};