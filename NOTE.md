I will create a site which everyone can add their favorite songs and know what songs everyone else like, at the same time

## Database design

- Artist
  - name (user input, required)
  - description (user input, required)
  - thumbnail_extension (user input, optional)
  - added_by (user input, optional)
  - personal_rating (user input, optional, select options)
  - created_at (auto generated)
  - last_modified (auto generated)
  - id
  - create_at_formatted (virtual generate using `created_at` and `luxon` lib)
    - e.g. `Jan 29, 2024` (`DATE_MED`) + `11:32` (`TIME_24_SIMPLE`)
  - last_modified_formatted (virtual generate using `last_modified` and `luxon` lib)
    - e.g. `Jan 29, 2024` (`DATE_MED`) + `11:32` (`TIME_24_SIMPLE`)
  - url (virtual generate using `id`)
    - e.g. `/music/artist/(artist id)` to READ
    - e.g. `/music/artist/(artist id)/delete` to DELETE
    - e.g. `/music/artist/(artist id)/update` to UPDATE
  - query (virtual generate using `name`)
    - e.g. `this.name.replace(' ', '+')}`
  - thumbnail_name (virtual generate using `name + '.' + thumbnail_extension`)
    - e.g. `khong_dieu_kien.png`
- Song
  - name (user input, required)
  - link:
    - Artist (user input, required, checkboxes (in case many artists))
  - description (user input, required)
  - thumbnail_file (user input, optional)
    - comeback to design after i know how it works
  - personal_rating (user input, required, select options)
  - added_by (user input, optional, required)
  - created_at (auto generated)
  - last_modified (auto generated)
  - id
  - create_at_formatted (virtual generate using `created_at` and `luxon` lib)
    - e.g. `Jan 29, 2024` (`DATE_MED`) + `11:32` (`TIME_24_SIMPLE`)
  - last_modified_formatted (virtual generate using `last_modified` and `luxon` lib)
    - e.g. `Jan 29, 2024` (`DATE_MED`) + `11:32` (`TIME_24_SIMPLE`)
  - url (virtual generate using id)
    - e.g. `/music/song/(song id)` to READ
    - e.g. `/music/song/(song id)/delete` to DELETE
    - e.g. `/music/song/(song id)/update` to UPDATE
  - query (virtual generate using name)
    - e.g. `this.name.replace(' ', '+')}`

## assignments

- [x] plan models all out
- [x] boiler plate express project
- [x] MongoDB
  - [x] collections
  - [x] schemas
  - [x] models
- [x] database operation
  - [x] `populatedb.js` with data
    - [x] default artists
    - [x] default songs
    - [x] default links
  - [x] `cleardb.js`
  - [x] `dummy.js`
- [x] routes
- [x] controllers
  - [x] index
  - [x] artists
  - [x] songs
  - [x] artist/create
  - [x] song/create
  - [x] artist/:id
  - [x] song/:id
  - [x] artist/:id/update
  - [x] song/:id/update
  - [x] artist/:id/delete
  - [x] song/:id/delete
- [x] thumbnail images (`multer`)
- [x] password for
  - [x] UPDATE
  - [x] DELETE
- [x] styles
- [ ] responsive
- [ ] animations
- [x] deploy

## how this app's navigation

- `/music` will be our based route
- `/` on `GET` will be handled by `ArtistController.index` and serve `index.pug` view which has
  - a title
  - an all `artists` link and total number of artists
    - link click will navigate to `/artists` with `GET` request
  - an all `songs` link and total number of songs
    - link click will navigate to `/songs` with `GET` request
  - a `create artist` link
    - link will navigate to `/artist/create` with `GET` request
  - a `create song` link
    - link will navigate to `/song/create` with `GET` request
- `/artist/create` (mean we can't access `req.params.id`)
  - on `GET` will be handled by `ArtistController.artist_create_get` and serve `artist_form` view without any additional variable (like `artist` and `errors`)
    - for practice purpose we won't validate form too strict on the frontend with JavaScript, instead we handle with `express-validator` to display a list of errors to user
    - the form will then be submitted to `/artist/create` with `POST` request
  - on `POST` will be handled by `ArtistController.artist_create_post` and validate and sanitize user input data with `express-validator`
    - if user's data is valid then we will create new `artist` and save to database, then `res.redirect(artist.url)` to view newly created `artist`
    - if user's data is NOT valid then we serve `artist_form` view again with additional variables: `artist` is an object stores the valid data that user has inputed to fill in the form again (so they don't have to re-type themselves), `errors` is an array stores all error messages created by `express-validator`
- `/song/create` (mean we can't access `req.params.id`)
  - on `GET` will be handled by `SongController.song_create_get` and serve `song_form` view without any additional variable (like `song` and `errors`)
    - for practice purpose we don't validate form too strict on the frontend with JavaScript, instead we handle with `express-validator` to display a list of errors to user
    - the form will then be submitted to `/song/create` with `POST` request
  - on `POST` will be handled by `SongController.song_create_post` and validate and sanitize user input data with `express-validator`
    - if user's data is valid then we will create new artist and save to database, then `res.redirect(song.url)` to view newly created `song`
    - if user's data is NOT valid then we serve `song_form` view again with additional variables: `song` is an object stores the valid data that user has inputed to fill in the form again (so they don't have to re-type themselves), `errors` is an array stores all error messages created by `express-validator`
- `/artists` on `GET` will be handled by `ArtistController.artists_list` and serve `artists_list` view with an `artists` variable is an array of all `artist` existed in database, each will have
  - Thumbnail (specific or default)
  - Name (a link)
    - will navigate to `/artist/:id` with `GET` request to READ the artist
  - Description
  - Personal rating
- `/songs` on `GET` will be handled by `SongController.songs_list` and serve `songs_list` view with an `songs` variable is an array of all `song`s existed in database, each will have
  - Thumbnail (specific or default)
  - Name (a link)
    - will navigate to `/song/:id` with `GET` request to READ the song
  - Watch on YouTube (a link)
    - will open this `song` YouTube link in new tab
  - Personal rating
- `/artist/:id` on `GET` will be handled by `ArtistController.artist_detail` (and check existence) and serve `artist_detail` view with an `artist` variable to display `artist`'s detail and a `artist_songs` variable to display all `song`s of this `artist`
  - name
    - clickable link to open new tab and search google with `query`
  - description
  - thumbnail
    - default or user input file
  - added_by
  - personal_rating
  - created_at (formatted)
  - last_modified (formatted)
  - a list of all `song`s created by this `artist`
    - display the similar to `song_list` view
    - clickable links to navigate to `/song/:id` with `GET` request to READ the `song`
  - update
    - clickable link to navigate to `/artist/:id/update` with `GET` request
  - delete
    - clickable link to navigate to `/artist/:id/delete` with `GET` request
- `/song/:id` on `GET` will be handled by `SongController.song_detail` (and check existence) and serve `song_detail` view with a `song` variable to display `song`'s detail
  - name (clickable link to open new tab and search youtube with `query`)
  - artist
    - clickable link to navigate to `/artist/:id` with `GET` request to READ the `artist`
  - description
  - thumbnail ()
    - default or user input file
  - added_by
  - personal_rating
  - created_at (formatted)
  - last_modified (formatted)
  - update
    - clickable link to navigate to `/song/:id/update` with `GET` request
  - delete
    - clickable link to navigate to `/song/:id/delete` with `GET` request
- `/artist/:id/update`
  - on `GET` will be handled by `ArtistController.artist_update_get` (and check existence of `req.params.id`) and serve `artist_form` view with additional variable: `artist` (the `artist` we are updating to fill in the form with old data so that user don't have to re-type themselves) and with that `artist_form` can differentiate between `create` and `update`
    - the form will then be submitted to this `/artist/:id/update` with `POST` request and a `password` field (so that we can validate `password` field with `body()` )
  - on `POST` will be handled by `ArtistController.artist_update_post` (and check existence) and validate and sanitize user input data with `express-validator`, then verify administrator by `body('password').custom((value, {req}) => value === process.env.PASSWORD)`
    - then we format the validation `result` with `result = result.formatWith(error=> error.msg)`
    - then we check the `password`
      - if the `password` DO NOT MATCH then we push a string `Your password DO NOT MATCH` to the `result` array
    - if `result.length !== 0` then we serve `artist_form` view again with additional variables: `artist` is an object stores the valid data that user has inputed to fill in the form again, `errors` is the `result` array stores all error messages created by `express-validator`
    - if `result.length === 0` then we find the `artist` with `id` is `req.params.id` in database to update then `res.redirect('/artist/${req.params.id}')` to view the newly updated `artist`
- `/artist/:id/delete`
  - on `GET` will be handled by `ArtistController.artist_delete_get` (and check existence) and serve `artist_delete` view with additional variable: `artist_songs` is a list of `song`s to delete before trying to delete this `artist`
    - if `artist_songs.length !== 0` then `artist_delete` view will render a list for `song`s to delete before trying to delete this `artist`
    - if `artist_songs.length === 0` then `artist_delete` view will render a form with a `password` field
  - on `POST` will be handled by `ArtistController.artist_delete_post` (and check existence) and then verify administrator by `body('password').custom((value, {req}) => value === process.env.PASSWORD)`
    - if success verification then we find the `artist` in database and delete, then `res.redirect('artists')`
    - if fail verification then we send another `GET` request to this route again (with `res.redirect(req.originalUrl)`)
- `/song/:id/update`
  - on `GET` will be handled by `SongController.song_update_get` (and check existence) and serve `song_form` view with additional variable: `song` (the `song` we are updating to fill in the form with old data so that user don't have to re-type themselves) and with that `song_form` can differentiate between `create` and `update`
    - the form will then be submitted to this `/song/:id/update` with `POST` request
  - on `POST` will be handled by `SongController.song_update_post` (and check existence) and validate and sanitize user input date with `express-validator`, then verify administrator by `body('password').custom((value, {req}) => value === process.env.PASSWORD)`
    - then we format the validation `result` with `result = result.formatWith(error => error.msg)`
    - if `result.length !== 0` then we serve `song_form` view again with additional variables: `song` is an object stores the valid data that user has inputed to fill in the form again, `errors` is the `result` array stores all error messages created by `express-validator`
    - if `result.length === 0` then we find the `song` with `id` is `req.params.id` in database to update then `req.redirect('/song/${req.params.id}')` to view the newly updated `song`
- `/song/:id/delete`
  - on `GET` will be handled by `SongController.song_delete_get` (and check existence) and serve `song_delete` view which has a `password` input field
  - on `POST` will be handled by `SongController.song_delete_post` (and check existence) and then verify administrator by `body('password').custom((value, {req}) => value === process.env.PASSWORD)`
    - if success verification then we find the `song` in database and delete, then `res.redirect('/songs')`
    - if fail verification then we serve `song_delete` view again

## how this app's view

-

## learn to setup express + pug + tailwind

- init project with `express-generator` and set `--view=pug`
- install `tailwind`, `postcss`, `postcsscli`, `autoprefixer`
- create `tailwind` and `postcss` config files
- tell `postcss` to require `tailwindcss` and `autoprefixer`
- tell `tailwind` to look for content in `./src/views/*.pug`
- create `style.css` and `tailwind.css` in `public/stylesheets`
- import `base`, `components`, `utilities` in `tailwind.css`
- link `style.css` in `layout.pug`
- add a script to auto generate tailwind code to `style.css` using `postcss`
- `"tailwind": "postcss public/stylesheets/tailwind.css -o public/stylesheets/style.css --watch"`
- start using `tailwind` in `pug`

## middleware in this project

### use `multer` to collect images in this project

- user submit a form with an image file attach to `req.file`
- we specify a destination on host machine to store that file
  install

```bash
npm install --save multer
```

The disk storage engine gives you full control on storing files to disk.

```js
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // specify directory to store
    cb(null, 'public/images/uploads');
  },
  filename: (req, file, cb) => {
    debug('file object upload', file);
    // specify filename but keep original file extension
    cb(null, Date.now() + '.' + file.originalname.split('.')[1]);
  },
});
const limits = { fileSize: 1024 * 1024 * 4 }; // 4MB
const upload = multer({ storage, limites }).single('avatar'); // listen for upload from 'avatar' file in form
// create a wrapper to prevent error throw in the middleware chain
const uploadWrapper = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      req.isUploadError = true;
      if (err.code === `LIMIT_FILE_SIZE`) req.isLimitFileSize = true;
    }
    next();
  });
};
// test multer module
router.get('/', (req, res) => {
  res.render('artist_form', {
    title: 'Create Artist',
  });
});
router.post('/', uploadMiddleware, [
  body('avatar')
    .custom((value, { req }) => !req.isUploadError)
    .withMessage("There's an error with file upload")
    .custom((value, { req }) => !req.isLimitFileSize)
    .withMessage(`That file is too large`),
  body('name', 'Name cannot be empty').trim().notEmpty(),
  (req, res) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
      // do something
      debug('No errors occur');
    } else {
      error.array().forEach((e) => debug(e.msg));
    }
    res.end();
  },
]);
```

## work with artist image

- so now I know why social media allow us to use a default placeholder image but after we uploaded once then they only allow us to update that image to new one but not completely remove it, because it such a headache to work with it 😅
- so first is `/artist/create`, the following cases can happen (notice that `multer` save the file before we can do anything with form data and it makes things worse because we have to go back and remove it in our directory)
  - form data is NOT valid and NO file sent
  - form data is NOT valid and file is valid (remove `file`)
  - form data is NOT valid and file is NOT valid (too big)
  - form data is valid and file is NOT valid
  - form data is valid and NO file sent (save `artist`)
  - form data is valid and file is valid (save `artist`, save `file`)
- second is `/artist/:id/update`, the following cases can happen (and again, `multer` try to save the file before we can do anything with form data and it makes things worse because we have to go back and remove it in our derectory, and now for update)
  - form data is NOT valid and NO file sent and NO file existed
  - form data is NOT valid and file is NOT valid (too big) and NO file existed
  - form data is NOT valid and file is valid and NO file existed (remove `file`)
  - form data is valid and NO file sent and NO file existed (save `artist`)
  - form data is valid and file is valid and NO file existed (save `artist`, save `file`)
  - form data is valid and file is NOT valid and NO file existed
  - form data is NOT valid and NO file sent and file DID existed
  - form data is NOT valid and file is NOT valid (too big) and file DID existed
  - form data is NOT valid and file is valid and file DID existed
  - form data is valid and file is NOT valid and file DID existed
  - form data is valid and file is valid and and file DID existed
  - form data is valid and NO file sent and file DID existed

but the problem with using `_id` to be `image` name is that we cannot create default documents (since we don't know how to name the default images of default artists)

```js
// how _id in mongoose look like
const _id = new ObjectId('65bc48ab54cf8df122ec1e67');
```

```js
// default _id of my artist
'111111111111111111111111';
```

```js
// default _id of my artist
'222222222222222222222222';
```

so now if i want the image and the document sync, i have to generate the `_id` manually then pass it to the form (if user already send an invalid one)

I've implemented a workaround so that the file is initially uploaded to a tmp directory, then when the text data is saved to MongoDB (and a unique \_id is generated), a new folder is created with that unique \_id. Then the uploaded file in the tmp directory is moved into this new directory

the `uploadWrapper` middleware is being execute anyway no matter a file being uploaded or not

## solve upload image problem using a tmp directory (refactor)

`artist/create` notice that the file is being saved before anything else, and the following cases can happen (respectively)

- ### file SEND, file VALID, data VALID (save)
- ### file SEND, file VALID, data ERROR
- ### file SEND, file ERROR, data VALID
- ### file SEND, file ERROR, data ERROR
- ### file NONE, data VALID (save)
- ### file NONE, data ERROR
  and a step by step to handle will be
- after knowing the file is SENT
  - after knowing the file is ERROR, we mark on `req` object `req.hasError = true`, and know that the file is automatically removed, then continue validate form data
    - after knowing form has data VALID, we still ignore those data and display the file ERROR
    - after knowing form has data ERROR, we collect every errors and add up with the file ERROR to display
  - after knowing the file is VALID, we mark on `req` object `req.hasError = false`, and know that the file is saved to `tmp` dir, we mark on `req` object `req.extension = 'something'`
    - after knowing form has data ERROR,
      - then we comeback to `tmp` dir to `delete` every files in it
      - then we collect every form errors to display
    - after knowing form has data VALID,
      - then we move the only file in `tmp` to `uploads` dir and set its `name` to be `artist._id + '.' + req.extension`
      - then **save** the `artist` with the `artist.extension = req.extension`
- after know the file is NONE (`req.hasError` is `undefined`) - after knowing form has data ERROR, - then we collect every form errors to display - after knowing form has data VALID, - then **save** the `artist` with the `artist.extension = null`
  and a step by step to know things in the last middleware handler
- knowing whether file is SENT or NOT by checking `req.hasError` (`boolean` vs `undefined`)
- knowing whether file is ERROR or VALID by checking `req.hasError` (`true` vs `false`)
- knowing whether form data is VALID or NOT by `validationResult(req)`

```js
// last handler
asyncHandler(async (req, res, next) => {
  const error = validationResult(req);

  const artist = new Artist({
    // ...
    extension: null,
  });

  if (error.isEmpty()) {
    // all valid
    if (req.hasError === false) {
      // has file, so save it
      // move image from tmp to uploads dir
      artist.extension = extension;
    }
    await artist.save();
  }

  // invalid
  if (req.hasError === false) {
    // wipe the whole tmp dir
  }
  res.render('artist_form', {
    // render form again, with valid artist properties and errors
  });
});
```

`artist/:id/update` the following cases can happen

- ### file SEND, file VALID, data VALID, file UPDATE (remove old, save new)
- ### file SEND, file VALID, data VALID, file CREATE (save new)
- ### file NONE, data VALID, file UPDATE (save)
- ### file NONE, data VALID, file CREATE (save)
- ### file SEND, file ERROR, data VALID, file UPDATE (autoremove new)
- ### file SEND, file ERROR, data VALID, file CREATE (autoremove new)
- ### file SEND, file VALID, data ERROR, file UPDATE (remove new)
- ### file SEND, file VALID, data ERROR, file CREATE (remove new)
- ### file SEND, file ERROR, data ERROR, file UPDATE (autoremove new)
- ### file SEND, file ERROR, data ERROR, file CREATE (autoremove new)
- ### file NONE, data ERROR, file UPDATE
- ### file NONE, data ERROR, file CREATE

what are the differences between `/artist/create` and `/artist/:id/update` handler?

- the handle file upload, validation, sanitize are pretty much the same (mean we will check `req.hasError` and `validationResult(req)`)
- if ANY error occurs, we just wipe the whole `tmp` dir and `artist.extension` will be kept original
- if NO errors occur,

and a step by step to know things in the last middleware handler

- knowing whether file is SENT or NOT by checking `req.hasError` (`boolean` vs `undefined`)
- knowing whether file is ERROR or VALID by checking `req.hasError` (`true` vs `false`)
- knowing whether form data is VALID or NOT by `validationResult(req)`
- knowing whether it's a file UPDATE or file CREATE by checking `oldArtist.extension !== null`
- knowing whether it's the same extension or not by checking `oldArtist.extension !== req.file.originalname.split('.')[1]`

---

- so the problem i am currently deal with this is that something about asynchronous when the `readDir` and `unlink` file section is out of sync and move straight to `newly updated artist` without waiting for deletion
  clue

```bash
  artist-post-debug the error might occur after upload file:  [Error: ENOENT: no such file or directory, open 'public/images/tmp/7a5121efcf7a18ff044c00e044b12ea1'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: 'public/images/tmp/7a5121efcf7a18ff044c00e044b12ea1',
  storageErrors: []
} +15s
```

clue (solve with `else` block)

```bash
POST /music/artist/65bcc5ef35b81d17bf16138f/update 500 179.724 ms - 120
  finalhandler default 500 +0ms
  finalhandler cannot 500 after headers sent +0ms
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    at ServerResponse.setHeader (node:_http_outgoing:703:11)
    at ServerResponse.header (/home/mhc/project/inventory-app-top/node_modules/express/lib/response.js:794:10)
    at ServerResponse.send (/home/mhc/project/inventory-app-top/node_modules/express/lib/response.js:174:12)
    at done (/home/mhc/project/inventory-app-top/node_modules/express/lib/response.js:1035:10)
    at exports.renderFile (/home/mhc/project/inventory-app-top/node_modules/pug/lib/index.js:448:12)
    at exports.__express [as engine] (/home/mhc/project/inventory-app-top/node_modules/pug/lib/index.js:493:11)
    at View.render (/home/mhc/project/inventory-app-top/node_modules/express/lib/view.js:135:8)
    at tryRender (/home/mhc/project/inventory-app-top/node_modules/express/lib/application.js:657:10)
    at Function.render (/home/mhc/project/inventory-app-top/node_modules/express/lib/application.js:609:3)
    at ServerResponse.render (/home/mhc/project/inventory-app-top/node_modules/express/lib/response.js:1039:7)
  artist-post-debug /home/mhc/project/inventory-app-top/public/images/tmp is deleted! +43ms
```

so the problem can be about wipe out the whole `tmp` dir, maybe switch to loop through every files and try to delete all files instead of wipe dir (because there's can be a permission error rise) and but have to understand what happens under the hood even if i fix the problem
first i have to manually create `tmp` dir,

- if the update when there's no image before then it's success
- if the update when there's an image exists then it's fail and wipe the whole `tmp` with 2 images

so the error `500` can't set header after the response being send to user maybe because i don't use `else` block, and that's true because i MUST use the `else` block to separate, because if not then i try to `res.render()` after `res.redirect()` which is insane
now new error occurs, the file being uploaded to update doesn't move to `uploads` dir and stay in `tmp` dir, the error only occur when we try to replace old image with new one (not when we replace the `null` with the new one) (maybe because of out sync?) it's true that the `fs.readdir` is using callback, and now i must solve the problem with `fs/promises` with `async/await`

- so it's actually the `out of sync` bug, when I remove `tmp` dir before I move the file in it to `uploads` dir
- the second bug is when i try to `res.render()` after I `res.redirect()` because i thought that after I `res.redirect()` then the below code will be ignore so i don't add a `else` block to it (I thought it works like `return` in `function` but it's not)

## now a new bug occur and that's bug is no `tmp` file is created before i upload an image (or when the first is DATA is ERROR but the `tmp` dir is removed anyway so the second attempt there's no `tmp` dir to store image)

- so when I make a `post` request to `update` or `create` an `artist` but DATE is ERROR and AT THE SAME TIME I send an VALID file with it then the `tmp` will be wiped and that's exactly when the `bug` occur next time when the DATA is VALID and the FILE is VALID but there's not `tmp` dir to upload image so it keeps telling us that's an error occur during file sending
- so now i will try to loop though `tmp` dir and delete every file in it instead of wiping the whole `tmp`
  - and this actually fix the bug
  - i quite don't get it, i wipe the whole `tmp` dir because the `multer` document said this: "**Note:** You are responsible for creating the directory when providing `destination` as a function. When passing a string, multer will make sure that the directory is created for you." and I thought that the `tmp` dir will be created every time an image is uploaded, but maybe it only create the `tmp` dir once, not EVERY TIME and image is uploaded

## and another bug the `escape` in `description` keep increasing

- I solved it by adding the `!` in the `input` to display the safe data (or the escaped data) we already validate
- `input(type="text" name="description" value!=(undefined===artist?"":artist.description) )`
-

## and another bug is that when the `description` has `(` and `)` the after update it will be disappear

- maybe the bug occur because of the `""` in data
- maybe because the default data i put in have the `""` that had not been escaped yet and that's cause the bug in my application
