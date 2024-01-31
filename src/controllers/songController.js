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
  },
  body(),
  body(),
  body(),
  body(),
  body(),
  body(),
  asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: SONG CREATE POST`);
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
