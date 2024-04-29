const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema({
  name: String,
  ip: String,
  port: String,
});

module.exports = mongoose.model("User", userSchema);
