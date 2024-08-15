const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const options = {
  user: "root",
  pass: "password"
};

mongoose.connect(process.env.DB_URL, options)
  .then(() => console.log("Database connected succesfully."))
  .catch(err => console.error(`Database connection failed: ${err}`));

const FileSchema = new Schema({
  name: String,
  type: {
    type: String,
    enum: ["file"],
    default: "file"
  },
  size: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  messageId: String,
  contentUrls: [String],
});

const DirectorySchema = new Schema({
  name: String,
  type: {
    type: String,
    enum: ["directory"],
    default: "directory"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  children: {
    type: Schema.Types.Mixed
  }
});

const UserSchema = new Schema({
  id: String,
  username: String,
  pfp: String,
  session: String
});

const FileModel = model("files", FileSchema);
const DirModel = model("directory", DirectorySchema);
const UserModel = model("users", UserSchema);

// TODO: I need to figure out what to export here.
module.exports = { UserModel, FileModel, DirModel };
