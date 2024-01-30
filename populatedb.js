// add default data in database

const Artist = require('./src/models/artist');
const Song = require('./src/models/song');

const custom = require('debug')('custom-debug');

const mongoDB = process.argv.slice(2)[0] || 'mongodb+srv://minhhoccode111:mHfEeMaU9Wze4SRo@cluster0.qhizihs.mongodb.net/?retryWrites=true&w=majority';

custom(mongoDB);

const artists = [];
const songs = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const artistCreate = async (index, name, description, thumbnail, added_by, personal_rating) => {
  const artistDetail = { name, description, thumbnail, added_by, personal_rating };
  const artist = new Artist(artistDetail);
  await artist.save();
  artists[index] = artist;
  custom(`adding ${name}`);
};

const songCreate = async (index, name, description, artist, added_by, personal_rating) => {
  const songDetail = {
    name,
    description,
    added_by,
    personal_rating,
    artist,
  };
  const song = new Song(songDetail);
  await song.save();
  songs[index] = song;
  custom(`adding ${name}`);
};

main().catch((err) => custom(err));

async function main() {
  custom('about to connect to database');
  await mongoose.connect(mongoDB);
  custom('about to insert some documents');
  await createArtists();
  await createSongs();
  custom('finishes insert documents');
  await mongoose.connection.close();
  custom('connection closed');
}

async function createArtists() {
  await artistCreate(0, 'Ngọt', `Ngọt - We play music!`, 'ngotband.jpeg', 'mhc', 10);
  await artistCreate(1, 'Cá Hồi Hoang', `A rock band playing pop music from Da Lat City, started in 2013. They have released 6 albums.`, 'cahoihoangband.jpeg', 'mhc', 10);
  await artistCreate(2, `Phùng Khánh Linh`, `Collab with Cá Hồi Hoang in "Xúc Cảm Bộ Máy"`, 'placeholder.png', 'mhc', 9);
}

async function createSongs() {
  await songCreate(0, 'LẦN CUỐI (đi bên em xót xa người ơi)', `Taken from the album "3" (a collection of vibrant new Ngọt songs in 2019).`, [artists[0]], 'mhc', 10);

  await songCreate(
    1,
    `Thấy Chưa`,
    `"Thấy Chưa" is a power ballad that delves into the emotions leading up to a farewell moment. The lyrics provide consolation and hold hopes for a positive future awaiting the girl in the song's narrative.`,
    [artists[0]],
    'mhc',
    10
  );

  await songCreate(2, 'Không Điều Kiện', `"Không Điều Kiện" is the 16th track in the 6th studio album of the band titled "Chúng Ta Đều Muốn Một Thứ."`, [artists[1]], 'mhc', 10);

  await songCreate(
    3,
    'Hết Mực',
    `"Hết Mực" is a song from the album "Gấp," initially planned as the final album of Cá Hồi Hoang when the group faced some difficulties. Some members left the band and wanted to abandon the musical path. However, right after the album's release, it unexpectedly achieved success, motivating the entire group to continue their music career until now.
    Thành Luke, the person who shared the song, mentioned that it accurately reflects his emotions at that time, just like a pen running out of ink. Amidst the pressure from within himself and the uncertainty about the group's future direction.`,
    [artists[1]],
    'mhc',
    10
  );

  await songCreate(
    4,
    'Xúc Cảm Bộ Máy',
    'The song "Xúc Cảm Bộ Máy" by Cá Hồi Hoang explores the thoughts and emotions that arise when confronted with the uncertainties of the future and the fear of losing love.',
    [artists[1], artists[2]],
    'mhc',
    10
  );
}
