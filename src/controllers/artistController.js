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

    if (req.isLimitFileSize) {
      errors.push({ msg: `The previous uploaded file is too large` });
    }

    debug(`how error array structure: `, errors);

    const artist = new Artist({
      name: req.body.name,
      created_at: Date.now(),
      last_modified: Date.now(),
      added_by: req.body.added_by,
      description: req.body.description,
      personal_rating: req.body.personal_rating,
      thumbnail_extension: req.body.thumbnail_extension, // undefined (not uploaded || error) || string (uploaded)
    });

    if (errors.length === 0) {
      // save if no error
      await artist.save();
      res.redirect(`/music/artist/${artist._id}`);
    } else {
      // errors occur and have uploaded an image (and image not throw file size error)
      if (req.isUploaded) {
        // we are in /src/controllers
        const thumbnail_path = path.join(__dirname, `../../public/images/uploads/`, req.body.thumbnail_name);
        await unlink(thumbnail_path);
        debug('successfully removed file when form validation has errors');
      }

      res.render('artist_form', {
        title: 'Create Artist',
        artist,
        errors,
      });
    }
  }),
];

module.exports.artist_delete_get = asyncHandler(async (req, res, next) => {
  const [artist, artist_songs] = await Promise.all([Artist.findById(req.params.id).exec(), Song.find({ artist: { $in: req.params.id } }, 'name').exec()]);

  if (artist === null) {
    const err = new Error('Artist not found');
    err.status = 404;
    next(err);
  }

  res.render('artist_delete', {
    title: 'Delete Artist',
    artist,
    artist_songs,
  });
});

module.exports.artist_delete_post = [
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty or all spaces!')
    .custom((value) => value === process.env.PASSWORD)
    .withMessage(`INCORRECT PASSWORD, please try something else!`),
  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);

    // check for existence
    const [artist, artist_songs] = await Promise.all([Artist.findById(req.params.id).exec(), Song.find({ artist: { $in: req.params.id } }, 'name').exec()]);

    if (artist === null) {
      const err = new Error('Artist not found');
      err.status = 404;
      next(err);
    }

    // delete artist if no errors occur
    if (error.isEmpty()) {
      if (artist.thumbnail_name !== '') {
        // remove uploaded thumbnail
        const thumbnail_path = path.join(__dirname, `../../public/images/uploads/`, artist.thumbnail_name);
        try {
          await unlink(thumbnail_path);
          debug('successfully removed file when form validation has errors');
        } catch (err) {
          debug(err);
        }
      }

      await Artist.findByIdAndDelete(req.params.id);
      res.redirect('/music/artists');
    }

    res.render('artist_delete', {
      artist,
      artist_songs,
      errors: error.array(),
      title: 'Delete Artist',
    });
  }),
];

module.exports.artist_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ARTIST UPDATE GET : ID: ${req.params.id}`);
});

module.exports.artist_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ARTIST UPDATE POST : ID: ${req.params.id}`);
});
