const Song = require('../models/song');
const Comment = require('../models/comment');
const Users = require('../models/user');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require('../models/role');

exports.getSongs = async (req, res) => {
    try {
        const token = req.cookies.token
        console.log(token);
        if (!token) {
            return res.redirect('/login');
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const user = await Users.findById(userId);
        const songs = await Song.find();
        res.render('listSongs', { songs: songs, user: user, userId: userId});
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        const comments = await Comment.find({songId: req.params.id});
        const token = req.cookies.token
        console.log(token);
        if (!token) {
            return res.redirect('/login');
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId).populate('likedSongs');

        res.render('detailsSongs', { song: song, comments: comments, user: user, userId: userId, Role: Role});
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAddForm = (req, res) => {
    res.render('addSong');
}
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
    const { userId, songId } = req.body;
    console.log(userId, songId)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(songId);

    if (!userId || !songId || !isValidObjectId) {
        return res.status(400).send({ error: 'Invalid userId or songId' });
    }

    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const objectId = new mongoose.Types.ObjectId(songId);
        const songIndex = user.likedSongs.indexOf(objectId);

        if (songIndex > -1) {
            user.likedSongs.splice(songIndex, 1);
        } else {
            user.likedSongs.push(objectId);
        }

        await user.save();
        res.status(200).send({ message: 'Favorite status updated' });
    } catch (error) {
        console.error('Error in toggleFavorite:', error);
        res.status(500).send({ error: 'An error occurred while updating favorite status' });
    }
};
