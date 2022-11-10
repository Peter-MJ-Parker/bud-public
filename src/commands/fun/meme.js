const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  category: "fun",
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Generate a meme")
    .setDMPermission(false),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const { utils } = client;
    const meme = await utils.getMeme();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("meme-next")
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Next Meme")
        .setEmoji("⏩")
    );

    return await interaction.reply({ embeds: [meme], components: [buttons] });
  },
};
