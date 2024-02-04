const express = require('express');
const router = express.Router();

const ArtistController = require('./../controllers/artistController');
const ArtistPostController = require('./../controllers/artistPostController');
const SongController = require('./../controllers/songController');

router.get('/', ArtistController.index);

router.get('/about', ArtistController.about);

/////* HANDLE ARTIST NAVIGATION */////
router.get('/artists', ArtistController.artists_list);

router.get('/artist/create', ArtistController.artist_create_get);

router.post('/artist/create', ArtistPostController.artist_create_post);

router.get('/artist/:id', ArtistController.artist_detail);

router.get('/artist/:id/delete', ArtistController.artist_delete_get);

router.post('/artist/:id/delete', ArtistController.artist_delete_post);

router.get('/artist/:id/update', ArtistController.artist_update_get);

router.post('/artist/:id/update', ArtistPostController.artist_update_post);

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
