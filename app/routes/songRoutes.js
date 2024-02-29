const express = require('express');
const { getSongs, getSong, createSong, updateSong, deleteSong, getEditForm, toggleFavorite} = require('../controllers/songController');
const {login, signup, saveuser, loginuser, displayProfile } = require("../controllers/authController");

const router = express.Router();

router.get('/', getSongs);
router.get('/new', (req, res) => res.render('addSong'));
router.post('/saveuser', saveuser);
router.post('/loginuser', loginuser);
router.post('/new', createSong);
router.get('/login', login);
router.get('/signup', signup);
router.post('/toggleFavorite', toggleFavorite);
router.get('/profile/:userId', displayProfile);
router.get('/:id', getSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);
router.get('/:id/edit', getEditForm);

module.exports = router;