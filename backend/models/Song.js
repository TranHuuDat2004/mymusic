const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artistName: { type: String, required: true },
    artistId: { type: String, required: true }, // ID của nghệ sĩ liên quan
    artUrl: String,
    audioSrc: { type: String, required: true },
    plays: { type: Number, default: 0 },
    isFavorite: { type: Boolean, default: false }
});
module.exports = mongoose.model('Song', songSchema);