const asyncHandler = require('express-async-handler');
const debug = require('debug')('custom-debug');

// to remove files
const { unlink } = require('node:fs/promises');
const path = require('path');

const Artist = require('./../models/artist');
const Song = require('./../models/song');

const format = require('./../functions');

const { body, validationResult } = require('express-validator');

module.exports.index = asyncHandler(async (req, res, next) => {
  const [artists, songs] = await Promise.all([Artist.countDocuments({}).exec(), Song.countDocuments({}).exec()]);

  debug(artists, songs);

  res.render('index', {
    title: 'Gimme music',
    artists,
    songs,
  });
});

module.exports.artists_list = asyncHandler(async (req, res, next) => {
  const artists_list = await Artist.find({}).exec();

  debug(artists_list);

  res.render('artists_list', {
    title: 'Artists',
    artists_list,
  });
});

module.exports.artist_detail = asyncHandler(async (req, res, next) => {
  const [artist, artist_songs] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    Song.find({ artist: { $in: req.params.id } }, 'name url personal_rating')
      .populate({ path: 'artist', select: 'name url' })
      .exec(),
  ]);

  if (artist === null) {
    const err = new Error(`Artist not found`);
    err.status = 404;
    next(err);
  }

  res.render('artist_detail', {
    artist,
    artist_songs,
    title: 'Artist Detail',
  });
});

module.exports.artist_create_get = (req, res, next) => {
  res.render('artist_form', {
    title: 'Create Artist',
  });
};

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads');
  },
  filename: (req, file, cb) => {
    debug('file object upload', file);
    // mark file extension on req object
    req.body.thumbnail_extension = file.originalname.split('.')[1];
    // name to save the file
    const thumbnail_name = format(req.body.name + '.' + file.originalname.split('.')[1]);
    // mark saved name on req object, so that when we sanitize date with express-validator we don't lose track of the file we just save
    req.body.thumbnail_name = thumbnail_name;
    // then save with that file name
    cb(null, thumbnail_name);
  },
});
const limits = { fileSize: 1024 * 1024 * 4 }; // max 4MB
const upload = multer({ storage, limits }).single('avatar');
const uploadWrapper = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      // mark on req object that there's errors to handle
      req.isUploadError = true;
      if (err.code === 'LIMIT_FILE_SIZE') req.isLimitFileSize = true;
    }
    next();
  });
};

module.exports.artist_create_post = [
  uploadWrapper,
  body('name', 'Name should not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description should not be empty.').trim().isLength({ min: 1 }).escape(),
  body('added_by', 'Added by should not be empty.').trim().isLength({ min: 1 }).escape(),
  body('personal_rating')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Personal rating should not be empty.')
    .custom((value) => !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 10)
    .withMessage('Personal rating must between 0 and 10.')
    .escape(),
  body('avatar')
    .custom((value, { req }) => !req.isUploadError)
    .withMessage("There's an error with file upload.")
    .custom((value, { req }) => !req.isLimitFileSize)
    .withMessage(`That file is too large.`),
  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);
    debug('in artist create post '.padEnd(200, '-'));
    debug(`the request body now: `, req.body);

    const artist = new Artist({
      name: req.body.name,
      description: req.body.description,
      added_by: req.body.added_by,
      personal_rating: req.body.personal_rating,
      created_at: Date.now(),
      last_modified: Date.now(),
      thumbnail_extension: req.body.thumbnail_extension,
    });

    if (error.isEmpty()) {
      await artist.save();
      res.redirect(`/music/artist/${artist._id}`);
    } else {
      if (req.body.thumbnail_name !== undefined) {
        // we are in /src/controllers
        const thumbnail_path = path.join(__dirname, `../../public/images/uploads/`, req.body.thumbnail_name);
        await unlink(thumbnail_path);
        debug('successfully removed file when form validation has errors');
      }

      res.render('artist_form', {
        title: 'Create Artist',
        artist,
        errors: error.array(),
      });
    }
  }),
];

module.exports.artist_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ARTIST DELETE GET : ID: ${req.params.id}`);
});

module.exports.artist_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ARTIST DELETE POST : ID: ${req.params.id}`);
});

module.exports.artist_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ARTIST UPDATE GET : ID: ${req.params.id}`);
});

module.exports.artist_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ARTIST UPDATE POST : ID: ${req.params.id}`);
});
