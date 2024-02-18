const express = require('express');
const { getSongs, getSong, createSong } = require('../controllers/songController');

const router = express.Router();

router.get('/', getSongs);
router.get('/new', (req, res) => res.render('addSong'));
router.post('/new', createSong);
router.get('/:id', getSong);

module.exports = router;