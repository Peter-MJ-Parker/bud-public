const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  false: true,
  category: "util",
  data: new SlashCommandBuilder()
    .setName("twitch")
    .setDescription("Manage you twitch notify.")
    .setDMPermission(false),
  /**
   *
   * @param {import("../../Structures/bot")} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {},
};
