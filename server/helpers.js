const fs = require("fs");
require('dotenv').config();

exports.fileNameOccurances = (fileName, fileExt, dir) => {
  let files = fs.readdirSync(process.env.UPLOAD_PATH + dir, { withFileTypes: true, recursive: false });
  return files.filter(s => s.name.startsWith(fileName) && s.name.endsWith(fileExt)).length;
}
