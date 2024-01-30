const express = require('express');
const router = express.Router();
const debug = require('debug')('multer-debug-filesize');
const { body, validationResult } = require('express-validator');

const ArtistController = require('./../controllers/artistController');
const SongController = require('./../controllers/songController');

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

const limits = { fileSize: 1024 * 1024 * 4 }; // 4MB
const upload = multer({ storage, limits }).single('avatar');

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      req.isUploadError = true;
      if ((err.code = 'LIMIT_FILE_SIZE')) req.isLimitFileSize = true;
    }
    next();
  });
};

router.get('/', (req, res) => {
  res.render('artist_form', {
    title: 'Create Artist',
  });
});

router.post('/', uploadMiddleware, [
  body('avatar')
    .custom((value, { req }) => !req.isUploadError)
    .withMessage("There's an error with file upload")
    .custom((value, { req }) => !req.isLimitFileSize)
    .withMessage(`That file is too large`),
  body('name', 'Name cannot be empty').trim().notEmpty(),
  (req, res) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
      // do something
      debug('No errors occur');
    } else {
      error.array().forEach((e) => debug(e.msg));
    }
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
