const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const Vote = require("./models/Vote");
const path = require("path");
const fs = require("fs");
const csvWriter = require("csv-writer");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB Error:", err);
});

// Dummy password for admin login
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

// Voting route
app.post("/vote", async (req, res) => {
  const { voterId, votes } = req.body;
  try {
    const existingVote = await Vote.findOne({ voterId });
    if (existingVote) {
      return res.status(403).send("Already voted");
    }

    const newVote = new Vote({ voterId, votes });
    await newVote.save();
    res.status(200).send("Vote submitted");
  } catch (err) {
    res.status(500).send("Error submitting vote");
  }
});

// Admin results route
app.get("/admin/results", (req, res) => {
  const password = req.query.password;
  if (password !== adminPassword) {
    return res.status(403).send("Unauthorized");
  }

  Vote.find().then((votes) => {
    res.json(votes);
  }).catch((err) => {
    res.status(500).send("Error fetching results");
  });
});

// Admin download route for CSV
app.get("/admin/download/results", (req, res) => {
  const password = req.query.password;
  if (password !== adminPassword) {
    return res.status(403).send("Unauthorized");
  }

  Vote.find().then((votes) => {
    const csvPath = path.join(__dirname, "results.csv");
    const writer = csvWriter.createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'voterId', title: 'Voter ID' },
        { id: 'votes', title: 'Votes' }
      ]
    });

    writer.writeRecords(votes)
      .then(() => {
        res.download(csvPath, "results.csv", () => {
          fs.unlinkSync(csvPath); // Clean up after download
        });
      });
  }).catch((err) => {
    res.status(500).send("Error downloading results");
  });
});

// Admin voter details download route
app.get("/admin/download/voters", (req, res) => {
  const password = req.query.password;
  if (password !== adminPassword) {
    return res.status(403).send("Unauthorized");
  }

  Vote.find().then((votes) => {
    const csvPath = path.join(__dirname, "voters.csv");
    const writer = csvWriter.createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'voterId', title: 'Voter ID' },
        { id: 'votes', title: 'Votes' }
      ]
    });

    writer.writeRecords(votes)
      .then(() => {
        res.download(csvPath, "voters.csv", () => {
          fs.unlinkSync(csvPath); // Clean up after download
        });
      });
  }).catch((err) => {
    res.status(500).send("Error downloading voter details");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
