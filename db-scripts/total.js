const Artist = require('./../src/models/artist');
const Song = require('./../src/models/song');

// const debug = require('debug')('custom-debug');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] || 'mongodb+srv://minhhoccode111:mHfEeMaU9Wze4SRo@cluster0.qhizihs.mongodb.net/?retryWrites=true&w=majority';

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug('some errors occur', err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  const artistNum = await Artist.countDocuments({}).exec();
  const songNum = await Song.countDocuments({}).exec();

  debug(`number of artist currently in database: ${artistNum}`);
  debug(`number of song currently in database: ${songNum}`);
  debug('connected');
  debug('about to disconnect to database');
  await mongoose.connection.close();
}
