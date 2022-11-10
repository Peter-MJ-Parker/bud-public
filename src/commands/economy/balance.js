const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Money = require("../../models/money");

module.exports = {
  category: "economy",
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Get wallet and bank balances of yourself or another user.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to display their money balance.")
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {},
};
