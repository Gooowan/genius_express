const Song = require('../models/song');
const Comment = require('../models/comment');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

exports.getSongs = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Assuming 'Bearer <token>' format
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const songs = await Song.find();
        res.render('listSongs', { songs: songs, userId: userId });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        const comments = await Comment.find({songId: req.params.id});
        // console.log(comments);
        res.render('detailsSongs', { song: song, comments: comments });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.createSong = async (req, res) => {
    try {
        const newSong = new Song(req.body);
        await newSong.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateSong = async (req, res) => {
    try {
        await Song.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/${req.params.id}`);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteSong = async (req, res) => {
    try {
        await Song.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getEditForm = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).send('Song not found');
        }
        res.render('editSong', { song: song });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.toggleFavorite = async (req, res) => {
    const userId = req.body.userId;
    const songId = req.body.songId;

    try {
        const user = await User.findById(userId);
        const songIndex = user.likedSongs.indexOf(songId);

        if (songIndex > -1) {
            user.likedSongs.splice(songIndex, 1);
        } else {
            user.likedSongs.push(mongoose.Types.ObjectId(songId));
        }

        await user.save();
        res.status(200).send({ message: 'Favorite status updated' });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while updating favorite status' });
    }
};
