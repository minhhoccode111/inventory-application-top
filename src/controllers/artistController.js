const asyncHandler = require('express-async-handler');
const debug = require('debug')('custom-debug');

// to remove files
const { unlink } = require('node:fs/promises');
const path = require('path');

const Artist = require('./../models/artist');
const Song = require('./../models/song');

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
      if (artist.image !== null) {
        // remove uploaded thumbnail
        const image_path = path.join(__dirname, `../../public/images/uploads/`, artist.image);
        try {
          await unlink(image_path);
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
  const artist = await Artist.findById(req.params.id).exec();

  if (artist === null) {
    const err = new Error('Artist not found');
    err.status = 404;
    next(err);
  }

  res.render('artist_form', {
    title: 'Update Artist',
    artist,
  });
});
