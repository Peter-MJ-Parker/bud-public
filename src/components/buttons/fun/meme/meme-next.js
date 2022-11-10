module.exports = {
  data: {
    id: "meme-next",
  },
  /**
   *
   * @param {import("discord.js").ButtonInteraction} interaction
   * @param {import("../../../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const { utils } = client;
    const meme = await utils.getMeme();
    await interaction.deferUpdate();
    await interaction.message.edit({ embeds: [meme] });
  },
};
