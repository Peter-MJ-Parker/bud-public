const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  false: true,
  category: "music",
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Goes to certain timestamp in current track.")
    .setDMPermission(false),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {},
};
