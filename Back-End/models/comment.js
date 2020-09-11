const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, required: true, default: 0 },
  votesUsers: { type: Array, required: true, default: [] },
  userId: { type: String, required: true },
  songId: { type: String, required: true },
  dateTime: { type: Date, required: true, default: Date.now },
  editDateTime: { type: Date, required: false },
  replies: { type: Array, required: true, default: [] },
});

module.exports = mongoose.model("Comment", commentSchema);
