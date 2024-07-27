const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 7777;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection string from .env file
const dbURI = process.env.DB_CONNECT;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error while connecting to MongoDB", err));

// Note model

const Note = require("./models/Note");

// Routes
app.post("/api/notes", async (req, res) => {
  const { content } = req.body;
  try {
    const newNote = new Note({ content });
    await newNote.save();
    res.status(201).send(newNote);
  } catch (err) {
    res.status(400).send({ error: "Error saving note" });
  }
});

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.send(notes);
  } catch (err) {
    res.status(400).send({ error: "Error fetching notes" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Note.findByIdAndDelete(id);
    res.send({ message: "Note deleted" });
  } catch (err) {
    res.status(400).send({ error: "Error deleting note" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
