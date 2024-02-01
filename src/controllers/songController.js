const asyncHandler = require('express-async-handler');
const debug = require('debug')('debug-custom');

const Artist = require('./../models/artist');
const Song = require('./../models/song');

const { body, validationResult } = require('express-validator');

module.exports.songs_list = asyncHandler(async (req, res, next) => {
  const songs_list = await Song.find({}).exec();

  res.render('songs_list', {
    title: 'Songs',
    songs_list,
  });
});

module.exports.song_detail = asyncHandler(async (req, res, next) => {
  const song = await Song.findById(req.params.id).populate({ path: 'artist', select: 'name url' }).exec();

  debug(song);

  if (song === null) {
    const err = new Error('Song not found');
    err.status = 404;
    next(err);
  }

  res.render('song_detail', {
    title: 'Song Detail',
    song,
  });
});

module.exports.song_create_get = asyncHandler(async (req, res, next) => {
  const artists_list = await Artist.find({}, 'name').exec();

  debug(artists_list);

  // artists_list.forEach((artist) => (artist.checked = true));

  res.render('song_form', {
    title: 'Create Song',
    artists_list,
  });
});

module.exports.song_create_post = [
  (req, res, next) => {
    // convert checkboxes values to array
    const body = req.body;
    if (!Array.isArray(body.artist_checkboxes)) {
      if (body.artist_checkboxes === undefined) body.artist_checkboxes = [];
      else body.artist_checkboxes = [body.artist_checkboxes];
    }
    next();
  },

  body('name', 'Name field cannot be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description field cannot be empty').trim().isLength({ min: 1 }).escape(),
  body('added_by', 'Added by field cannot be empty').trim().isLength({ min: 1 }).escape(),
  body('personal_rating')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Personal rating field cannot be empty')
    .custom((value) => !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 10)
    .withMessage('Personal rating value must be between 0 and 10'),
  body('artist_checkboxes', `The song must have at least 1 artist`)
    .custom((value) => value.length > 0)
    .escape(),
  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);

    const artists_list = await Artist.find({}, 'name').exec();
    // mark the ones that have been checked previously
    artists_list.forEach((artist) => {
      if (req.body.artist_checkboxes.includes(artist._id.toString())) artist.checked = true;
    });

    debug(artists_list);
    const song = new Song({
      name: req.body.name,
      description: req.body.description,
      added_by: req.body.added_by,
      personal_rating: req.body.personal_rating,
      created_at: Date.now(),
      last_modified: Date.now(),
      artist: artists_list,
    });

    if (error.isEmpty()) {
      // no errors
      await song.save();
      res.redirect(`/music/song/${song._id}`);
    } else {
      res.render('song_form', {
        song,
        artists_list,
        title: 'Create Song',
        errors: error.array(),
      });
    }
  }),
];

module.exports.song_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: SONG DELETE GET : ID: ${req.params.id}`);
});

module.exports.song_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: SONG DELETE POST : ID: ${req.params.id}`);
});

module.exports.song_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: SONG UPDATE GET : ID: ${req.params.id}`);
});

module.exports.song_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: SONG UPDATE POST : ID: ${req.params.id}`);
});
