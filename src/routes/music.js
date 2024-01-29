const express = require('express');
const router = express.Router();
const debug = require('debug')('multer');
const { body, validationResult } = require('express-validator');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads');
  },
  filename: (req, file, cb) => {
    debug('file object upload', file);
    cb(null, Date.now() + '.' + file.originalname.split('.')[1]);
  },
});
// const upload = multer({ storage });
const upload = multer({
  storage,
  limits: {
    fileSize: 4000000, // throw if above this
  },
  fileFilter: (req, file, cb) => {
    //
    debug(file);
  },
});

const ArtistController = require('./../controllers/artistController');
const SongController = require('./../controllers/songController');

// test multer module
router.get('/', (req, res) => {
  res.render('artist_form', {
    title: 'Create Artist',
  });
});

router.post('/', upload.single('avatar'), [
  body('avatar', `Image size is too large`).custom((value, { req }) => {
    if (req.file.size > 4000000) {
      debug('file size too large');
      return false;
    }
    return true;
  }),
  (req, res) => {
    const error = validationResult(req).array();
    debug(error);
    debug('the file object has: ', req.file.size);
    if (req.file === undefined) debug('no file uploaded');
    res.end();
  },
]);

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
