const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "fun",
  data: new SlashCommandBuilder()
    .setName("highfive")
    .setDescription("Highfive another user through the internet.")
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
    const user = interaction.options.getUser("user");
    const Tenor = require("tenorjs").client({
      Key: process.env.tenor,
      Filter: "off",
      Locale: "en_US",
      Media: "GIF_FORMAT",
    });
    Tenor.Search.Random("high five", "1")
      .then((Results) => {
        Results.forEach(async (Post) => {
          await interaction.reply({
            content: `${interaction.user.username} highfives ${user.username}`,
          });
          interaction.channel.send(Post.url);
        });
      })
      .catch(console.error);
  },
};
