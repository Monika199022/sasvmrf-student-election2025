const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Vote = require("./models/Vote");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("MongoDB Error:", err));

// API to cast a vote
app.post("/vote", async (req, res) => {
  const { voterId, votes } = req.body;

  try {
    const existing = await Vote.findOne({ voterId });
    if (existing) return res.status(403).send("Already voted");

    const newVote = new Vote({ voterId, votes });
    await newVote.save();

    res.status(200).send("Vote submitted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Admin results (basic)
app.get("/results", async (req, res) => {
  const allVotes = await Vote.find();
  res.json(allVotes); // You can aggregate and count per post/candidate
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
