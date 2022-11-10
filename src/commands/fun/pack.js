const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "fun",
  developer: true,
  data: new SlashCommandBuilder()
    .setName("pack")
    .setDescription("Pack up and ready up for a public smoke show!")
    .setDMPermission(false),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   * @returns
   */
  async execute(interaction, client) {
    await interaction.reply({
      content:
        "`\\|/\\|/ ` **listen up... public announcement**: Pick it, Pack it, just be ready for a chain wide toke-out in 30 seconds. `\\|/\\|/`",
    });
    setTimeout(async () => {
      await interaction.followUp(
        "`\\|/\\|/` Ladies & Gents, get your __BØTTE, BOWLS, BONGS, DAB RIGS__ **READY**! `\\|/\\|/`"
      );
      setTimeout(async () => {
        await interaction.followUp({
          content: "`\\|/\\|/\\|//\\|/\\|/\\|/` 5 `\\|/\\|/\\|//\\|/\\|/\\|/`",
        });
      }, 1500);
      setTimeout(async () => {
        await interaction.followUp({
          content: "`\\|/\\|/\\|/\\|/`4 `\\|/\\|/\\|/\\|/`",
        });
      }, 2500);
      setTimeout(async () => {
        await interaction.followUp({
          content: "`\\|/\\|/\\|/`3 `\\|/\\|/\\|/`",
        });
      }, 3500);
      setTimeout(async () => {
        await interaction.followUp({ content: "`\\|/\\|/`2 `\\|/\\|/`" });
      }, 4500);
      setTimeout(async () => {
        await interaction.followUp({ content: "`\\|/`1 `\\|/`" });
      }, 5500);
      setTimeout(async () => {
        await interaction.followUp({
          content:
            "SYNCHRONIZED! `\\|/\\|/` FIRE UP YOUR DANK SHIT!! `\\|/\\|/`",
        });
      }, 6500);
    }, 30000);
    return;
  },
};
