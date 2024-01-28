const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('about', {
    title: 'About',
  });
});

module.exports = router;
