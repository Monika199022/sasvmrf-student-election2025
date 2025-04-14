const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voterId: { type: String, required: true, unique: true },
  votes: [{ post: String, candidate: String }]
});

module.exports = mongoose.model("Vote", voteSchema);
