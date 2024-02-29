const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "fullname not provided "],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: [true, "Please specify user role"]
    },
    password: {
        type: String,
        required: [true, "password not provided "]
    },
    likedSongs: [{
        type: Schema.Types.ObjectId,
        ref: 'Song'
    }]
});

module.exports = mongoose.model('User', userSchema);