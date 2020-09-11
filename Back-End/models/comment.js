const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, required: true, default: 0 },
  userId: { type: String, required: true },
  songId: { type: String, required: true },
  dateTime: { type: Date, required: true, default: Date.now },
  editDateTime: { type: Date, required: false },
});

module.exports = mongoose.model("Comment", commentSchema);
