const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  false: true,
  category: "music",
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loops the server queue.")
    .setDMPermission(false),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {},
};
