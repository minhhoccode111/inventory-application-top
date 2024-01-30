const mongoose = require('mongoose');

const { DateTime } = require('luxon'); // for date handling

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  name: {
    type: String,
    require: true,
    maxLength: 100,
  },
  description: {
    type: String,
    require: true,
    maxLength: 1000,
  },
  thumbnail: String,
  added_by: String,
  personal_rating: Number,
  created_at: Date,
  lastModified: Date,
});

ArtistSchema.virtual('url').get(function () {
  return '/music/artist/' + this._id;
});

ArtistSchema.virtual('query').get(function () {
  return this.name.replace(' ', '+');
});

ArtistSchema.virtual('last_modified_formatted').get(function () {
  return DateTime.fromJSDate(this.last_modified).toLocaleString(DateTime.DATE_MED);
});

ArtistSchema.virtual('created_at_formatted').get(function () {
  return DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Artist', ArtistSchema);
