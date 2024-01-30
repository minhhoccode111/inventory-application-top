const asyncHandler = require('express-async-handler');
const debug = require('debug')('debug-custom');

const Artist = require('./../models/artist');
const Song = require('./../models/song');

module.exports.songs_list = asyncHandler(async (req, res, next) => {
  const songs_list = await Song.find({}).exec();

  res.render('songs_list', {
    title: 'Songs',
    songs_list,
  });
});

module.exports.song_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: SONG DETAIL : ID: ${req.params.id}`);
});

module.exports.song_create_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: SONG CREATE GET`);
});
module.exports.song_create_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: SONG CREATE POST`);
});

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
