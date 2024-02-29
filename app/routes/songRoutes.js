const express = require('express');
const { getSongs, getSong, createSong, updateSong, deleteSong, getAddForm, getEditForm, toggleFavorite} = require('../controllers/songController');
const {login, signup, saveuser, loginuser, logout, displayProfile } = require("../controllers/authController");

const router = express.Router();

router.get('/', getSongs);

router.post('/saveuser', saveuser);
router.post('/loginuser', loginuser);

router.get('/login', login);
router.get('/signup', signup);
router.get('/logout', logout);
router.post('/toggleFavorite', toggleFavorite);
router.get('/profile', displayProfile);

router.get('/new', getAddForm);
router.post('/new', createSong);
router.get('/:id', getSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);
router.get('/:id/edit', getEditForm);

module.exports = router;