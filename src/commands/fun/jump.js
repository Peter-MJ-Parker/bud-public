const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "fun",
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Play the jumping game.")
    .setDMPermission(false)
    .addStringOption((message) =>
      message
        .setName("message")
        .setDescription("Where are you jumping?")
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
      content: `${interaction.user.username} jumps ${message}`,
    });
  },
};
