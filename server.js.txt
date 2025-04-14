const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

const ADMIN_EMAIL = "monikagphd@gmail.com";

app.use(express.static("public"));
app.use(express.json());

const VOTES_FILE = "votes.json";

if (!fs.existsSync(VOTES_FILE)) {
  fs.writeFileSync(VOTES_FILE, JSON.stringify({
    votes: { Alice: 0, Bob: 0, Charlie: 0 },
    votedUsers: {}
  }, null, 2));
}

function readVotes() {
  return JSON.parse(fs.readFileSync(VOTES_FILE));
}

function saveVotes(data) {
  fs.writeFileSync(VOTES_FILE, JSON.stringify(data, null, 2));
}

app.post("/vote", (req, res) => {
  const { voterId, candidate } = req.body;
  const data = readVotes();

  if (data.votedUsers[voterId]) {
    return res.status(403).send("You have already voted.");
  }

  data.votes[candidate]++;
  data.votedUsers[voterId] = candidate;
  saveVotes(data);

  res.send("Vote recorded");
});

app.get("/results", (req, res) => {
  const email = req.query.email?.toLowerCase();
  if (email !== ADMIN_EMAIL) {
    return res.status(401).send("Unauthorized");
  }

  const data = readVotes();
  res.json(data.votes);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
