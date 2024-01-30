const mongoose = require('mongoose');

const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const SongSchema = new Schema({
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
  artist: {
    type: [{ type: Schema.ObjectId, ref: 'Artist' }],
    require: true,
  },
  added_by: {
    type: String,
    maxLength: 100,
    require: true,
  },
  personal_rating: {
    type: Number,
    require: true,
  },
  created_at: {
    type: Date,
    require: true,
  },
  last_modified: {
    type: Date,
    require: true,
  },
});

SongSchema.virtual('url').get(function () {
  return '/music/song/' + this._id;
});

SongSchema.virtual('query').get(function () {
  return this.name.replace(' ', '+');
});

SongSchema.virtual('last_modified_formatted').get(function () {
  return DateTime.fromJSDate(this.last_modified).toLocaleString(DateTime.DATE_MED);
});

SongSchema.virtual('created_at_formatted').get(function () {
  return DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Song', SongSchema);
