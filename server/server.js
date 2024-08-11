const express = require("express");
const upload = require("./upload.js");

const app = express();

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.post('/upload', upload.single("file"), (req, res) => {
  res.send("Processing file upload");
});

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
