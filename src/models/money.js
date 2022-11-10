const { Schema, model } = require("mongoose");

const Money = new Schema({
  userName: { type: String },
  userID: { type: String, require: true },
  guildName: { type: String, require: true },
  serverID: { type: String, require: true },
  coins: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
});

module.exports = model("Money", Money, "Money");
