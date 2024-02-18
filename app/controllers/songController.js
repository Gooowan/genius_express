const Song = require('../models/song');
const Comment = require('../models/comment');

exports.getSongs = async (req, res) => {
    try {
        const songs = await Song.find();
        res.render('listSongs', { songs: songs });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        const comments = await Comment.find({ songId: song._id });
        console.log(comments);
        res.render('songDetails', { song: song, comments: comments });
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
