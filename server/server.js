require('dotenv').config();

const express = require("express");
const upload = require("./upload.js");
const Discord = require("./discord.js");
const { DirModel, FileModel, UserModel } = require("./database.js");
const { validSession } = require("./helpers.js");

const discord = new Discord();
const app = express();

app.get('/', function(req, res) {
  res.send('Hi :3');
});

app.post("/createuser", upload.none(), async (req, res) => {
  const { userid, username, pfp, session } = req.body;

  const newUser = new UserModel({
    id: userid,
    username: username,
    pfp: pfp,
    session: session
  });

  newUser.save();

  res.status(201).send("User created succesfully!");
});

app.post('/uploadfile', upload.single("file"), async (req, res) => {
  let { userid, session, filepath } = req.body;

  if (userid === undefined || session === undefined) {
    res.status(402).send("Bad request.");
    return;
  }

  if (!await validSession(session)) {
    res.status(403).json({ message: "Invalid user session" });
    return;
  }

  const base = `${userid}_root`;

  if (filepath === null || filepath === undefined || filepath === "")
    filepath = base;
  else if (filepath.startsWith("root"))
    filepath = `${userid}_${filepath}`;
  else if (!filepath.startsWith(base))
    filepath = `${base}/${filepath}`;

  let userRoot = await DirModel.findOne({ name: base });

  if (userRoot === null)
    userRoot = new DirModel({
      name: base,
      children: []
    });

  let loc = userRoot;
  const arr_path = filepath.replace(`${base}/`, "").split('/');

  for (const path of arr_path) {
    let next = loc.children.find(child => child.type === "directory" && child.name === path);

    if (!next) {
      loc.children.push(new DirModel({ name: path, children: [] }))
      loc = loc.children[loc.children.length - 1];
    }
    else
      loc = next;
  }

  const discordResult = await discord.uploadFiles(req.file.buffer);

  let file = new FileModel({
    name: req.file.filename,
    size: req.file.size,
    messageId: discordResult.messageid,
    contentUrls: discordResult.attachmentUrls
  });

  loc.children.push(file);

  userRoot.markModified("children");
  await userRoot.save();

  res.send("File uploaded succesfully!");
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
