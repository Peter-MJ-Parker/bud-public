const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Money = require("../../models/money");

module.exports = {
  category: "economy",
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Look for money!")
    .setDMPermission(false),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {},
};
