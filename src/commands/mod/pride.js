const {
  ChannelType,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  category: "mod",
  data: new SlashCommandBuilder()
    .setName("pride")
    .setDescription("Sends an embed with a button for pride month.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((channel) =>
      channel
        .setName("channel")
        .setDescription("Select the channel to send the embed to.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((emoji) =>
      emoji
        .setName("emoji")
        .setDescription("Emoji to set to nickname upon clicking button.")
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const channel = options.getChannel("channel");
    const emoji = options.getString("emoji") || `🌈`;

    if (!emoji)
      return await client.utils.errorReplyEmbed(
        `I can't find that emoji! Please make sure it is in this server or a Discord Default emoji! If it is, please contact Marv!`,
        interaction
      );
    const Embed = new EmbedBuilder()

      .setTitle("Pride Month 🏳️‍🌈")
      .setDescription(`_Click the button to add a ${emoji} to your username!_`)
      .setColor("#2F3136");

    const Row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle("Secondary")
        .setCustomId("lgbtq")
        .setEmoji(emoji)
    );

    await channel.send({ embeds: [Embed], components: [Row] });
    await interaction.reply({
      content: `Sent the message to ${channel}`,
      ephemeral: true,
    });
  },
};
