const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  false: true,
  category: "music",
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Plays current queue at random.")
    .setDMPermission(false),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {},
};
