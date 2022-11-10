const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Money = require("../../models/money");

module.exports = {
  category: "economy",
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Put money in your bank!")
    .setDMPermission(false),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {},
};
