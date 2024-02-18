const Song = require('../models/song');

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
        res.render('songDetails.pug', { song: song });
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
