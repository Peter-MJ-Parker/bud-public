const { SlashCommandBuilder, parseEmoji } = require("discord.js");
const { parse } = require("twemoji-parser");

module.exports = {
  category: "util",
  data: new SlashCommandBuilder()
    .setName("enlarge")
    .setDescription("Enlarges any discord emoji. Just provide the emoji!")
    .setDMPermission(false)
    .addStringOption((emoji) =>
      emoji
        .setName("emoji")
        .setDescription("Provide the emoji you would like to see enlarged.")
        .setRequired(true)
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const emojiToEnlarge = options.getString("emoji");
    console.log(emojiToEnlarge);

    try {
      let custom = parseEmoji(emojiToEnlarge);

      if (custom.id) {
        let embed = `https://cdn.discordapp.com/emojis/${custom.id}.${
          custom.animated ? "gif" : "png"
        }`;
        return await interaction.reply({
          content: `${embed}`,
          ephemeral: true,
        });
      } else {
        let parsed = parse(emojiToEnlarge, { assetType: "png" });
        if (!parsed[0]) {
          return await interaction.reply({
            content: `I cannot find that emoji...Is it in this server or default?`,
            ephemeral: true,
          });
        } else {
          let embed2 = parsed[0].url;
          return await interaction.reply({
            content: `${embed2}`,
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return await interaction.reply({
        content: `An error has occured. Please contact Marv!`,
        ephemeral: true,
      });
    }
  },
};
