const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/images/uploads' });
const debug = require('debug')('multer');

const ArtistController = require('./../controllers/artistController');
const SongController = require('./../controllers/songController');

// test multer module
router.get('/', (req, res) => {
  res.render('artist_form', {
    title: 'Create Artist',
  });
});

router.post('/', upload.single('avatar'), (req, res) => {
  // req.file to access file
  // req.body to access other fields in form
  debug('the file object has: ');
  debug(req.file);
  res.end(req.file);
});

// router.get('/', ArtistController.index);

/////* HANDLE ARTIST NAVIGATION */////
router.get('/artists', ArtistController.artists_list);

router.get('/artist/create', ArtistController.artist_create_get);

router.post('/artist/create', ArtistController.artist_create_post);

router.get('/artist/:id', ArtistController.artist_detail);

router.get('/artist/:id/delete', ArtistController.artist_delete_get);

router.post('/artist/:id/delete', ArtistController.artist_delete_post);

router.get('/artist/:id/update', ArtistController.artist_update_get);

router.post('/artist/:id/update', ArtistController.artist_update_post);

/////* HANDLE SONG NAVIGATION */////
router.get('/songs', SongController.songs_list);

router.get('/song/create', SongController.song_create_get);

router.post('/song/create', SongController.song_create_post);

router.get('/song/:id', SongController.song_detail);

router.get('/song/:id/delete', SongController.song_delete_get);

router.post('/song/:id/delete', SongController.song_delete_post);

router.get('/song/:id/update', SongController.song_update_get);

router.post('/song/:id/update', SongController.song_update_post);

module.exports = router;
