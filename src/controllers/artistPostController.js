const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const print = require('debug')('artist-post-debug');
const fs = require('fs');
const path = require('path');
const extra = require('fs-extra');

// database models
const Artist = require('./../models/artist');
const Song = require('./../models/song');

// multer to work with file upload
const multer = require('multer');
const limits = { fileSize: 1024 * 1024 * 4 }; // 4MB
const storage = multer.diskStorage({
  destination: 'public/images/tmp',
});
const upload = multer({ storage, limits }).single('avatar');
const uploadWrapper = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) req.hasError = true; // file + error
    else if (req.file) req.hasError = false; // file + 0 error
    // else req.hasError = undefined // 0 file + 0 error
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
    .escape()
    // validate file uploaded here to get proper error message
    .custom((value, { req }) => !req.hasError)
    .withMessage(`That's file is too large (>4MB)!`),
  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);

    print(`how error array structure: `, error);

    const artist = new Artist({
      name: req.body.name,
      created_at: Date.now(),
      last_modified: Date.now(),
      added_by: req.body.added_by,
      description: req.body.description,
      personal_rating: req.body.personal_rating,
      extension: null, // default no file
    });

    // all valid
    if (error.isEmpty()) {
      // has file, save file
      if (req.hasError === false) {
        const extension = req.file.originalname.split('.')[1];
        const src = path.join(__dirname, `../../public/images/tmp/${req.file.filename}`);
        const des = path.join(__dirname, `../../public/images/uploads/${artist._id + '.' + extension}`);
        // move from tmp to uploads
        extra.move(src, des, (err) => {
          if (err) throw err;
          print(`successfully move file from ${src} to ${des}`);
        });
        artist.extension = extension; // update extension
      }

      await artist.save();
      res.redirect(`/music/artist/${artist._id}`);
    }

    // invalid

    // a file uploaded
    if (req.hasError === false) {
      const dir = path.join(__dirname, `../../public/images/tmp`);
      // wipe whole tmp dir
      fs.rm(dir, { recursive: true, force: true }, (err) => {
        if (err) throw err;
        print(`${dir} is deleted!`);
      });
    }

    print(`artist and errors send back to form: `, artist, error);

    // render form again
    res.render('artist_form', {
      title: 'Create Artist',
      artist,
      errors: error.array(),
    });
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
