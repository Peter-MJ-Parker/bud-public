const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  false: true,
  category: "util",
  data: new SlashCommandBuilder()
    .setName("live")
    .setDescription("Notifies everyone when you go live on twitch!")
    .setDMPermission(false),
  /**
   *
   * @param {import("../../Structures/bot")} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {},
};
