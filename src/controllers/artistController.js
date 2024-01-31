const asyncHandler = require('express-async-handler');
const debug = require('debug')('custom-debug');

const Artist = require('./../models/artist');
const Song = require('./../models/song');

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

module.exports.artist_create_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ARTIST CREATE GET`);
});
module.exports.artist_create_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ARTIST CREATE POST`);
});

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
