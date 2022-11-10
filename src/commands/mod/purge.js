const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { BotOwnerID } = process.env;

module.exports = {
  category: "mod",
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription(
      "Delete certain amount of messages in a channel or from a user."
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Clears messages from a selected user.")
        .addUserOption((user) =>
          user
            .setName("target")
            .setDescription("Select the user to purge messages from.")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("t-amount")
            .setDescription("Amount of messages to delete sent from the user.")
            .setRequired(true)
        )
        .addChannelOption((channel) =>
          channel
            .setName("t-channel")
            .setDescription(
              "OPTIONAL: Select the channel to purge the users messages from or current channel."
            )
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription(
          "Clears messages from a selected channel or current channel."
        )
        .addNumberOption((option) =>
          option
            .setName("c-amount")
            .setDescription("Amount of messages to delete sent in channel.")
            .setRequired(true)
        )
        .addChannelOption((channel) =>
          channel
            .setName("c-channel")
            .setDescription(
              "OPTIONAL: Select the channel to purge the messages from or current channel."
            )
            .addChannelTypes(ChannelType.GuildText)
        )
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const { utils } = client;
    const { options, channel, member } = interaction;
    const sub = options.getSubcommand();
    let targetChannel;
    let deleteAmount;
    let description;
    const deletedEmbed = new EmbedBuilder()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    const sent = await interaction.reply({
      embeds: [
        deletedEmbed.setDescription(
          `${client.config.emojis.loading} Clearing messages....`
        ),
      ],
      ephemeral: true,
    });

    try {
      switch (sub) {
        case "user":
          const user = options.getMember("target");
          await utils.wait(1000);
          targetChannel = options.getChannel("t-channel") || channel;
          deleteAmount = options.getNumber("t-amount");
          const Messages = await targetChannel.messages.fetch();

          let i = 0;
          const filtered = [];
          (await Messages).filter((m) => {
            if (m.author.id === user.id && deleteAmount > i) {
              filtered.push(m);
              i++;
            }
          });

          await targetChannel
            .bulkDelete(filtered, true)
            .then(async (messages) => {
              description = `🧹 Cleared \`${messages.size}\` messages from ${user} in ${targetChannel}.`;
              deletedEmbed.setDescription(description);
              if (user.id === client.user.id) {
                return await interaction.editReply({
                  embeds: [deletedEmbed],
                  ephemeral: true,
                });
              } else
                await interaction.editReply({
                  embeds: [deletedEmbed],
                  ephemeral: true,
                });
            });
          break;

        case "channel":
          targetChannel = options.getChannel("c-channel") || channel;
          deleteAmount = options.getNumber("c-amount");
          let c = 0;
          let filter = [];
          let ms = await targetChannel.messages.fetch();
          (await ms).filter((m) => {
            if (deleteAmount > c) {
              filter.push(m);
              c++;
            }
          });
          await targetChannel.bulkDelete(filter, true);

          if (!deleteAmount || deleteAmount < 1 || deleteAmount > 100) {
            deletedEmbed.setDescription(
              `\\📛 **Error:** \\📛\nInvalid amount! Please enter an amount of 1 to 100`
            );
          }
          deletedEmbed.setDescription(
            `\\✅ **Success:** \\✅\n${member.user.username} successfully deleted ${deleteAmount} messages from ${targetChannel}.`
          );

          await utils.wait(1000);
          await interaction.followUp({
            embeds: [deletedEmbed],
            ephemeral: true,
          });
          //   await sent.edit({
          //     embeds: [deletedEmbed],
          //     ephemeral: true,
          //   });

          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      return await utils.errorEditEmbed(
        `Unable to comply with your request. Please ping <@${BotOwnerID}> for help.`,
        interaction
      );
    }
  },
};
