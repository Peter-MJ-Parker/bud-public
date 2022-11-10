const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "fun",
  data: new SlashCommandBuilder()
    .setName("wish")
    .setDescription("Wish for something.")
    .setDMPermission(false)
    .addStringOption((message) =>
      message
        .setName("message")
        .setDescription("What are you wishing for?")
        .setRequired(true)
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const message = interaction.options.getString("message");

    await interaction.reply({
      content: `${interaction.user.username} wishes ${message}`,
    });
  },
};
