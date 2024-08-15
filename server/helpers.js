const fs = require("fs");
const { UserModel } = require("./database");
require('dotenv').config();

exports.fileNameOccurances = (fileName, fileExt, dir) => {
  let files = fs.readdirSync(process.env.UPLOAD_PATH + dir, { withFileTypes: true, recursive: false });
  return files.filter(s => s.name.startsWith(fileName) && s.name.endsWith(fileExt)).length;
}

exports.validSession = async session => {
  try {
    const user = await UserModel.findOne({ session: session });
    return user !== null;
  } catch (err) {
    console.error(`User search error!: ${err}`);
    return false;
  }
}
