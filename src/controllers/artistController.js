const asyncHandler = require('express-async-handler');

module.exports.index = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: INDEX`);
});

module.exports.artists_list = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ARTISTS LIST`);
});

module.exports.artist_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ARTIST DETAIL : ID: ${req.params.id}`);
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
