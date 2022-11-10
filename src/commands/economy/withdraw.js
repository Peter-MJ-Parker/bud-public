const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Money = require("../../models/money");

module.exports = {
  category: "economy",
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Get money out of your bank!")
    .setDMPermission(false)
    .addStringOption((amount) =>
      amount
        .setName("amount")
        .setDescription("How much money do you want to withdraw?")
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {},
};
