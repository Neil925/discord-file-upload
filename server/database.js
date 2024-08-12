const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL);
const db = mongoose.connect;

db.on('error', err => console.error(err));
db.on('open', () => console.log("Database connected."));
