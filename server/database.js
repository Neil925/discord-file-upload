const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL)
  .then(() => console.log("Database connected succesfully."))
  .catch(err => console.error(`Database connection failed: ${err}`));


// FIX: WRONG WRONG WRONG WRONG WRONG! ALL WRONG! REEEEEEEEEEEEEEEEEEEEEEEEEEEEE
// TODO: Replace this with a directory schema and a file schema. Every user gets a single root directory. {SOMEIDHERE}_dir document per user, all files are within the children in there.
const fileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  uploadDate: Date,
  contentUrls: [String],
  belongsTo: String
});

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  pfp: String,
  session: String
});

const fileModel = mongoose.model("files", fileSchema);
const userModel = mongoose.model("users", userSchema);

module.exports = { fileModel, userModel };
