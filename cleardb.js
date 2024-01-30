// clear database

const Artist = require('./src/models/artist');
const Song = require('./src/models/song');

const debug = require('debug')('custom');

const mongoDB = process.argv.slice(2)[0] || 'mongodb+srv://minhhoccode111:mHfEeMaU9Wze4SRo@cluster0.qhizihs.mongodb.net/?retryWrites=true&w=majority';

custom(mongoDB);

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug(err));

async function main() {
  debug('about to connect to database');
  mongoose.connect(mongoDB);
  debug('about to clear database');
  clearSongs();
  clearArtists();
  debug('database cleared');
  debug('about to close connection');
  mongoose.connection.close();
  debug('connection closed');
}

async function clearArtists() {
  await Artist.deleteMany({}).exec();
  debug('Artists cleared');
}

async function clearSongs() {
  await Song.deleteMany({}).exec();
  debug('Songs cleared');
}
