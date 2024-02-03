const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const print = require('debug')('artist-post-debug');

// work with files
const fs = require('fs');
const path = require('path');
const extra = require('fs-extra');

// promise based for async/await
const { readdir, unlink, rmdir } = require('fs/promises');

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
    if (err) req.hasError = true; // => file + error
    else if (req.file) req.hasError = false; // => file + 0 error
    // else req.hasError = undefined // => 0 file + 0 error
    print(`An error may occur: `, err);
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
    .withMessage(`An error occurs with uploaded file, maybe it's too large (>4MB)!`),
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

      // invalid
    } else {
      // a file uploaded
      if (req.hasError === false) {
        const dir = path.join(__dirname, `../../public/images/tmp`);
        // unlink every file in dir
        try {
          const files = await readdir(dir);
          files.forEach(async (file) => {
            const filePath = path.join(dir, file);
            print(`about to remove ${filePath} in dir`);
            await unlink(filePath);
            print(`successfully remove ${filePath} file`);
          });
        } catch (error) {
          print(error);
          throw error;
        }
      }

      print(`artist and errors send back to form: `, artist, error);

      // render form again
      res.render('artist_form', {
        title: 'Create Artist',
        artist,
        errors: error.array(),
      });
    }
  }),
];

module.exports.artist_update_post = [
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
    .withMessage(`An error occurs with uploaded file, maybe it's too large (>4MB)!`),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty or all spaces!')
    .custom((value) => value === process.env.PASSWORD)
    .withMessage(`INCORRECT PASSWORD, please try something else!`),
  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);

    const oldArtist = await Artist.findById(req.params.id).exec();

    // no artist with req.params.id
    if (oldArtist === null) {
      const err = new Error('Artist not found');
      err.status = 404;
      next(err);
    }

    const newArtist = new Artist({
      name: req.body.name,
      created_at: oldArtist.created_at, // keep
      last_modified: Date.now(),
      added_by: req.body.added_by,
      description: req.body.description,
      personal_rating: req.body.personal_rating,
      // case no file update or update the same file extension
      extension: oldArtist.extension, // keep
      _id: oldArtist._id, // keep
    });

    // all valid
    if (error.isEmpty()) {
      print('all valid');
      // has file, save file information
      if (req.hasError === false) {
        print(`has file, save file information`, req.file, req.body);
        const newExtension = req.file.originalname.split('.')[1];
        const oldExtension = oldArtist.extension; // null?
        newArtist.extension = newExtension; // update extension

        // delete old file manually
        if (newExtension !== oldExtension && oldExtension !== null) {
          print(`have to delete old file manually`);
          const oldFilename = oldArtist._id + '.' + oldExtension;
          const uploadsDir = path.join(__dirname, `../../public/images/uploads`);
          try {
            const files = await readdir(uploadsDir);
            print(`all files in uploads dir right now: `, files);
            files.forEach(async (file) => {
              const filePath = path.join(uploadsDir, file);
              if (file === oldFilename) {
                print(`found the file to delete: `, file);
                await unlink(filePath);
                print(`successfully remove file: `, file);
              }
            });
          } catch (error) {
            print(error);
            throw error;
          }
        }
        // move new file to uploads dir (after manually delete, if have)
        // old file have the same name (or null) will be override anyway
        print(`override old file anyway (whether null or not)`);
        const newFilename = oldArtist._id + '.' + newExtension;
        const src = path.join(__dirname, `../../public/images/tmp/${req.file.filename}`);
        const des = path.join(__dirname, `../../public/images/uploads/${newFilename}`);
        extra.move(src, des, { overwrite: true }, (err) => {
          if (err) throw err;
          print(`successfully move file from ${src} to ${des}`);
        });
      }
      print(`newly updated artist: `, newArtist);

      await Artist.findByIdAndUpdate(req.params.id, newArtist);
      res.redirect(`/music/artist/${req.params.id}`);

      // invalid
    } else {
      // a file uploaded
      if (req.hasError === false) {
        const dir = path.join(__dirname, `../../public/images/tmp`);
        // unlink every file in dir
        try {
          const files = await readdir(dir);
          files.forEach(async (file) => {
            const filePath = path.join(dir, file);
            print(`about to remove ${filePath} in dir`);
            await unlink(filePath);
            print(`successfully remove ${filePath} file`);
          });
        } catch (error) {
          print(error);
          throw error;
        }
      }

      print(`artist and errors send back to form: `, newArtist, error.array());

      // render form again
      res.render('artist_form', {
        isUpdate: true,
        artist: newArtist,
        errors: error.array(),
        title: 'Create Artist',
      });
    }
  }),
];
