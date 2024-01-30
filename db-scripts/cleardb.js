// clear database

const Artist = require('./../src/models/artist');
const Song = require('./../src/models/song');

// const debug = require('debug')('custom');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] ?? 'mongodb+srv://minhhoccode111:mHfEeMaU9Wze4SRo@cluster0.qhizihs.mongodb.net/?retryWrites=true&w=majority';

debug(mongoDB);

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug(err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  debug('about to clear database');
  await clearSongs();
  await clearArtists();
  debug('database cleared');
  debug('about to close connection');
  await mongoose.connection.close();
  debug('connection closed');
}

async function clearArtists() {
  await Artist.deleteMany({}).exec();
  const count = await Artist.countDocuments({}).exec();
  debug(`Artist models is having: ${count} documents`);
  debug('Artists cleared');
}

async function clearSongs() {
  await Song.deleteMany({}).exec();
  const count = await Song.countDocuments({}).exec();
  debug(`Song models is having: ${count} documents`);
  debug('Songs cleared');
}
