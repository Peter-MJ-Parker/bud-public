const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "fun",
  data: new SlashCommandBuilder()
    .setName("cloud")
    .setDescription("User gets contact high.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user
        .setName("user")
        .setDescription("Tagged user gets contact high.")
        .setRequired(true)
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const user = interaction.options.getMember("user");

    await interaction.reply({
      content: `${user} is now contact-high and flying in the clouds after ${interaction.member} choked on the first hit of the joint.`,
    });
  },
};
