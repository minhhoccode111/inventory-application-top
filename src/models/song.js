const mongoose = require('mongoose');

const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const SongSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  artist: {
    type: [{ type: Schema.ObjectId, ref: 'Artist' }],
    require: true,
  },
  added_by: {
    type: String,
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
  return DateTime.fromJSDate(this.last_modified).toLocaleString(DateTime.DATE_MED) + ' - ' + DateTime.fromJSDate(this.last_modified).toLocaleString(DateTime.TIME_24_SIMPLE);
});

SongSchema.virtual('created_at_formatted').get(function () {
  return DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.DATE_MED) + ' - ' + DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.TIME_24_SIMPLE);
});

SongSchema.virtual('description_short').get(function () {
  if (this.description.length > 150) return this.description.slice(0, 148) + '...';
  return this.description;
});

module.exports = mongoose.model('Song', SongSchema);
