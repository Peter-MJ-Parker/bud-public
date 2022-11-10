const { Schema, model } = require("mongoose");

const Birthday = new Schema({
  userId: String,
  date: String,
  username: String,
  nickname: String,
  addedBy: String,
  editedBy: String,
});

module.exports = model("Birthday", Birthday, "Birthday");
