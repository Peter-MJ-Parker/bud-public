const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "fun",
  data: new SlashCommandBuilder()
    .setName("smoke")
    .setDescription("User gets covered in smoke.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user
        .setName("user")
        .setDescription("Tagged user to cover in smoke.")
        .setRequired(true)
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const user = interaction.options.getMember("user");
    const Tenor = require("tenorjs").client({
      Key: process.env.tenor,
      Filter: "off",
      Locale: "en_US",
      Media: "GIF_FORMAT",
    });
    Tenor.Search.Random("cloud of smoke", "1")
      .then((Results) => {
        Results.forEach(async (Post) => {
          await interaction.reply({
            content: `${interaction.user.username} covers ${user} in a cloud of smoke!`,
          });
          await interaction.channel.send(Post.url);
        });
      })
      .catch(console.error);
  },
};
