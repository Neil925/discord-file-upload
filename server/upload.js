const multer = require("multer");
const os = require("os");
const fs = require("fs");
const { fileNameOccurances } = require("./helpers.js");
require('dotenv').config();

if (process.env.UPLOAD_PATH == null)
  throw new Error("No UPLOAD_PATH env variable found!");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = process.env.UPLOAD_PATH ?? os.tmpdir()
    path += req.body.path ?? "";

    if (!fs.existsSync(path))
      fs.mkdirSync(path);

    cb(null, process.env.UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    let fileExtIndex = file.originalname.lastIndexOf('.');

    let fileName = file.originalname.substring(0, fileExtIndex);
    let fileExt = file.originalname.substring(fileExtIndex + 1);

    let num = undefined;

    try {
      num = fileNameOccurances(fileName, fileExt, req.body.path ?? "");
    }
    catch (err) {
      if (err.code === 'ENOENT')
        num = 0;
      else
        throw err;
    }

    if (num != 0) {
      cb(null, `${fileName} (${num}).${fileExt}`);
    } else {
      cb(null, file.originalname);
    }
  }
})

module.exports = multer({ storage });
