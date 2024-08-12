const express = require("express");
const upload = require("./upload.js");
const Discord = require("./discord.js");
const db = require("./database.js");

require('dotenv').config();

const discord = new Discord();
const app = express();

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.post('/uploadfile', upload.single("file"), (req, res) => {
  discord.uploadFiles(req.file.buffer);

  res.send("Processing file upload");
});

app.post('/uploadfiles', upload.array("files"), async (req, res) => {
  if (req.files === undefined || req.files === null || req.files.length === 0) {
    res.status(500).send("No files content.");
    return;
  }

  await discord.uploadFiles(req.files.map(x => x.buffer));

  res.send("Processing files.");
})

app.param('fileid', (req, res, next, fileid) => {
  console.log(`Checking file ${fileid}`);
  next();
});

app.get('/download/:fileid', (req, res) => {
  console.log("downloading file.");
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
