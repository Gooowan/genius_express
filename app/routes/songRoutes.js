const express = require('express');
const { getSongs, getSong, createSong, updateSong, deleteSong, getEditForm } = require('../controllers/songController');
const {login, signup} = require("../controllers/authController");

const router = express.Router();

router.get('/', getSongs);
router.get('/new', (req, res) => res.render('addSong'));
router.post('/new', createSong);
router.get('/login', login);
router.get('/signup', signup);
router.get('/:id', getSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);
router.get('/:id/edit', getEditForm);

module.exports = router;