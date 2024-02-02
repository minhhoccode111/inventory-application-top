const mongoose = require('mongoose');

const { DateTime } = require('luxon'); // for date handling

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  extension: String,
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

ArtistSchema.virtual('url').get(function () {
  return '/music/artist/' + this._id;
});

ArtistSchema.virtual('query').get(function () {
  return this.name.replace(' ', '+');
});

ArtistSchema.virtual('last_modified_formatted').get(function () {
  return DateTime.fromJSDate(this.last_modified).toLocaleString(DateTime.DATE_MED) + ' - ' + DateTime.fromJSDate(this.last_modified).toLocaleString(DateTime.TIME_24_SIMPLE);
});

ArtistSchema.virtual('created_at_formatted').get(function () {
  return DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.DATE_MED) + ' - ' + DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.TIME_24_SIMPLE);
});

ArtistSchema.virtual('image').get(function () {
  if (this.extension !== null) return this._id + '.' + this.extension;
  return null;
});

ArtistSchema.virtual('description_short').get(function () {
  if (this.description.length > 150) return this.description.slice(0, 148) + '...';
  return this.description;
});

module.exports = mongoose.model('Artist', ArtistSchema);
