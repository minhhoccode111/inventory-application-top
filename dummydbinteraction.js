const Artist = require('./src/models/artist');
const Song = require('./src/models/song');

const debug = require('debug');

const custom = require('debug')('custom-debug');

const mongoDB = process.argv.slice(2)[0] || 'mongodb+srv://minhhoccode111:mHfEeMaU9Wze4SRo@cluster0.qhizihs.mongodb.net/?retryWrites=true&w=majority';

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug(err));

async;
