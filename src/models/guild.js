const { Schema, model } = require("mongoose");

const Guild = new Schema({
  guildID: String,
  guildName: String,
  modC: { type: String, default: "744945603313795306" },
  verifiedRole: { type: String, default: "678400106982277130" },
  welcomeC: { type: String, default: "678400867799400468" },
  leaveC: { type: String, default: "744945603313795306" },
  introC: { type: String, default: "744927896187043940" },
  userCount: Number,
  botCount: Number,
  allCount: Number,
  userCountChan: { type: String, default: "825555223321640970" },
  botCountChan: { type: String, default: "825555224147263549" },
  allCountChan: { type: String, default: "825555222281060363" },
  bdayButtonId: String,
});

module.exports = model("Guild", Guild, "Guild");
