const asyncHandler = require('express-async-handler');
const print = require('debug')('artist-post-debug');

// database models
const Artist = require('./../models/artist');
const Song = require('./../models/song');

// custom format string method
const format = require('./../functions');

// form validation
const { body, validationResult } = require('express-validator');

// multer to work with file upload
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads');
  },
  filename: (req, file, cb) => {
    const thumbnail_extension = file.originalname.split('.')[1];

    const thumbnail_name = format(req.body.name) + '.' + thumbnail_extension;

    cb(null, thumbnail_name);

    req.body.thumbnail_extension = thumbnail_extension;

    req.body.thumbnail_name = thumbnail_name;

    req.isUploaded = true;
  },
});
const limits = { fileSize: 1024 * 1024 * 4 }; // max 4MB
const upload = multer({ storage, limits }).single('avatar');
const uploadWrapper = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      req.isUploaded = false;
      req.thumbnail_extension = null;
      if (err.code === 'LIMIT_FILE_SIZE') req.isLimitFileSize = true;
    }
    next();
  });
};

module.exports.artist_create_post = [
  uploadWrapper,
  body('name', 'Name field cannot be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description field cannot be empty.').trim().isLength({ min: 1 }).escape(),
  body('added_by', 'Added by field cannot be empty.').trim().isLength({ min: 1 }).escape(),
  body('personal_rating')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Personal rating field cannot be empty.')
    .custom((value) => !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 10)
    .withMessage('Personal rating value must between 0 and 10.')
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();

    debug(`how error array structure: `, errors);

    const artist = new Artist({
      name: req.body.name,
      created_at: Date.now(),
      last_modified: Date.now(),
      added_by: req.body.added_by,
      description: req.body.description,
      personal_rating: req.body.personal_rating,
      thumbnail_extension: req.thumbnail_extension, // undefined (not uploaded || error) || string (uploaded)
    });

    if (req.isLimitFileSize) {
      errors.push({ msg: `Can't handle that huge file! (>4MB)` });
    }

    if (errors.length === 0) {
      // save if no error
      await artist.save();
      res.redirect(`/music/artist/${artist._id}`);
    } else {
      // errors occur and have uploaded an image (and image not throw file size error)
      if (req.isUploaded) {
        // then manually unlink it
        const thumbnail_path = path.join(__dirname, `../../public/images/uploads/`, req.body.thumbnail_name);
        await unlink(thumbnail_path);
        debug('successfully removed file when form validation has errors', artist, errors);
      }

      debug(`after reject creation of this artist: `, artist);

      res.render('artist_form', {
        title: 'Create Artist',
        artist,
        errors,
      });
    }
  }),
];

module.exports.artist_update_post = [
  //
  body(),
  body(),
  body(),
  body(),
  body(),
  body(),
  asyncHandler(async (req, res, next) => {}),
];
