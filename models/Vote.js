const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voterId: { type: String, required: true },
  votes: [{
    postId: String,
    nominationId: String
  }]
});

const Vote = mongoose.model("Vote", voteSchema);
module.exports = Vote;
