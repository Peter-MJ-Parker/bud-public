const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const birthday = require("../../models/birthday");
const Guild = require("../../models/guild");

module.exports = {
  category: "mod",
  data: new SlashCommandBuilder()
    .setName("bday")
    .setDescription("Allows moderators to manage the birthday system.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommandGroup((button) =>
      button
        .setName("button")
        .setDescription("Sends a button to a specified channel.")
        .addSubcommand((send) =>
          send
            .setName("send")
            .setDescription("Sends Add Birthday button to specified channel.")
            .addChannelOption((channel) =>
              channel
                .setName("channel")
                .setDescription("Select the channel to send the button to.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((help) =>
      help
        .setName("help")
        .setDescription("Displays information how to use this command.")
        .addSubcommand((add) =>
          add
            .setName("add-help")
            .setDescription(
              "Displays information how to use `bday moderate add` command."
            )
        )
        .addSubcommand((edit) =>
          edit
            .setName("edit-help")
            .setDescription(
              "Displays information how to use `bday moderate edit` command."
            )
        )
        .addSubcommand((remove) =>
          remove
            .setName("delete-help")
            .setDescription(
              "Displays information how to use `bday moderate delete` command."
            )
        )
        .addSubcommand((button) =>
          button
            .setName("button-help")
            .setDescription(
              "Displays information how to use `bday button send` command."
            )
        )
    )
    .addSubcommandGroup((moderate) =>
      moderate
        .setName("moderate")
        .setDescription(
          "Allows a moderator to change birthday information in my database for a certain user."
        )
        .addSubcommand((add) =>
          add
            .setName("add")
            .setDescription(
              "Allows a moderator to add a birthday to my database manually."
            )
            .addUserOption((user) =>
              user
                .setName("user")
                .setDescription("Select the user you wish to add the date for.")
                .setRequired(true)
            )
            .addStringOption((date) =>
              date
                .setName("date")
                .setDescription("The new date to set for this user.")
                .setRequired(true)
            )
        )
        .addSubcommand((edit) =>
          edit
            .setName("edit")
            .setDescription(
              "Allows a moderator to edit a birthday in my database manually."
            )
            .addUserOption((user) =>
              user
                .setName("user")
                .setDescription(
                  "Select the user you wish to modify the date for."
                )
                .setRequired(true)
            )
            .addStringOption((date) =>
              date
                .setName("date")
                .setDescription("The new date to set for this user.")
                .setRequired(true)
            )
        )
        .addSubcommand((remove) =>
          remove
            .setName("delete")
            .setDescription(
              "Allows a moderator to delete a birthday from my database manually."
            )
            .addUserOption((user) =>
              user
                .setName("user")
                .setDescription(
                  "Select the user you wish to modify the date for."
                )
                .setRequired(true)
            )
        )
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const { utils } = client;
    await interaction.deferReply({ fetchReply: true, ephemeral: true });
    const { options, guild } = interaction;

    const group = options.getSubcommandGroup();
    const sub = options.getSubcommand();

    switch (group) {
      case "button":
        const channel = options.getChannel("channel");

        try {
          let doc = await Guild.findOne({ guildID: guild.id });
          if (doc.bdayButtonId) {
            await channel.messages
              .fetch({
                message: doc.bdayButtonId,
              })
              .then((m) => {
                m.delete();
              });
          }

          const embed = new EmbedBuilder({
            description: "Please press the button below to set your birthday!",
          });
          const row = new ActionRowBuilder({
            components: [
              new ButtonBuilder({
                custom_id: "bday_button",
                label: "Set Birthday",
                style: ButtonStyle.Secondary,
              }),
            ],
          });

          channel
            .send({
              embeds: [embed],
              components: [row],
            })
            .then(async (m) => {
              await Guild.findOneAndUpdate(
                { guildID: guild.id },
                { bdayButtonId: m.id },
                { upsert: true }
              );
            });
          return await interaction.editReply({
            content: `I have sent the button to ${channel}.`,
            ephemeral: true,
          });
        } catch (error) {
          console.log(error);
        }
        break;

      case "help":
        const helpEmbed = new EmbedBuilder({
          author: {
            name: "Mod Birthday Help",
            iconURL: client.config.urls.help,
          },
          title: `This shows you how to use this command. ${sub}`,
          footer: {
            text: client.user.username,
            iconURL: client.user.avatarURL(),
          },
        });
        switch (sub) {
          case "add-help":
            helpEmbed.setDescription(
              `To add someone's birthday, use \`/bday moderate add <user> <Date: ##/##>\``
            );
            await interaction.editReply({
              embeds: [helpEmbed],
            });
            break;
          case "edit-help":
            helpEmbed.setDescription(
              `To edit someone's birthday manually, use \`/bday moderate edit <user> <new birthday (##/##)>\``
            );
            await interaction.editReply({
              embeds: [helpEmbed],
            });
            break;
          case "delete-help":
            helpEmbed.setDescription(
              `To delete someone's bithday so they can re-enter it, use \`/bday moderate delete <user>\``
            );
            await interaction.editReply({
              embeds: [helpEmbed],
            });
            break;
          case "button-help":
            helpEmbed.setDescription(
              `This will only send a button to a certain channel that you select. Use \`/bday send\` and select the desired channel to send to.`
            );
            await interaction.editReply({
              embeds: [helpEmbed],
            });
            break;

          default:
            break;
        }
        break;

      case "moderate":
        const myExp = new RegExp(
          /^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])$/gm
        );
        const member = options.getMember("user");
        const date = options.getString("date");
        const event = new Date(date);
        const dateOptions = { dateStyle: "long" };
        const fdate = event.toLocaleString("en", dateOptions).slice(0, -6);
        let bday = await birthday.findOne({ userId: member.id });

        try {
          switch (sub) {
            case "add":
              if ((!member && !date) || (member && !date))
                return utils.errorEditEmbed(
                  `Please provide member and birthday to continue.\nExample: \`?modbirthday add user ##/##\``,
                  interaction
                );

              if (member && date && !bday) {
                if (!date.match(myExp)) {
                  return await utils.errorEditEmbed(
                    `Invalid Date format, Please try again. Format: ##/## (2 digit day, 2 digit month)`,
                    interaction
                  );
                }
                if (member.nickname) {
                  let newBirthday = await birthday.create({
                    userId: member.id,
                    date: fdate,
                    username: member.user.username,
                    nickname: member.nickname,
                    addedBy: interaction.user.username,
                  });
                  await newBirthday.save();
                  return await utils.successReplyEmbed(
                    `You recorded **${member.nickname}**'s birthday as: ${fdate}`,
                    interaction
                  );
                } else {
                  let newBirthdayNoNick = await birthday.create({
                    userId: member.user.id,
                    date: fdate,
                    username: member.user.username,
                    addedBy: interaction.user.username,
                  });
                  await newBirthdayNoNick.save();
                  return await utils.successEditEmbed(
                    `You recorded **${member.user.username}**'s birthday as: ${fdate}`,
                    interaction
                  );
                }
              } else
                await utils.errorEditEmbed(
                  `${member.user.username}'s birthday has already been recorded.\nPlease use the edit or delete command instead.`,
                  interaction
                );

              break;
            case "edit":
              try {
                if (bday) {
                  if (!date.match(myExp)) {
                    return await utils.errorEditEmbed(
                      `Invalid Date format, Please try again. Format: ##/## (2 digit day, 2 digit month)`,
                      interaction
                    );
                  }
                  if (fdate === bday.date) {
                    return await utils.errorEditEmbed(
                      `You ignorant fella, the new date cannot be the same as the current date.`,
                      interaction
                    );
                  }
                  await birthday.findOneAndUpdate(
                    { userId: member.id },
                    { date: fdate, editedBy: interaction.user.username }
                  );
                  utils.successEditEmbed(
                    `Birthday for ${member} has been changed to ${fdate}.`,
                    interaction
                  );
                } else {
                  await utils.errorEditEmbed(
                    `${member.user.username}'s birthday doesn't exist in my database. Please add manually.`,
                    interaction
                  );
                }
              } catch (error) {
                console.log(error);
              }
              break;
            case "delete":
              try {
                if (bday) {
                  await bday.deleteOne();
                  return utils.successEditEmbed(
                    `Birthday for ${member} has been removed from my database.`,
                    interaction
                  );
                }
                await utils.errorEditEmbed(
                  `That birthday doesn't exist in my database. Please try again.`,
                  interaction
                );
              } catch (error) {
                console.log(error);
              }
              break;

            default:
              break;
          }
        } catch (error) {
          console.log(error);
          return await utils.errorEditEmbed(
            `An error occured, please contact <@${process.env.BotOwnerID}>!`,
            interaction
          );
        }

        break;

      default:
        break;
    }
  },
};
