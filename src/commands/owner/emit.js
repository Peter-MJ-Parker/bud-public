const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  category: "owner",
  owner: true,
  data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("Emits an event")
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("event")
        .setDescription("event to emit")
        .setChoices(
          { name: "guildMemberAdd", value: "guildMemberAdd" },
          { name: "guildMemberRemove", value: "guildMemberRemove" },
          { name: "guildMemberUpdate", value: "guildMemberUpdate" },
          { name: "guildCreate", value: "guildCreate" },
          { name: "guildDelete", value: "guildDelete" },
          { name: "emojiCreate", value: "emojiCreate" },
          { name: "emojiDelete", value: "emojiDelete" },
          { name: "emojiUpdate", value: "emojiUpdatte" }
        )
        .setRequired(true)
    )
    .addUserOption((options) =>
      options
        .setName("user")
        .setDescription("Select a user to emit the event on.")
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   * @returns
   */
  async execute(interaction, client) {
    try {
      const event = interaction.options._hoistedOptions[0].value;
      const message = `Event: ***${client.utils.eventCapitalise(
        event
      )}*** has been triggered!`;
      const embed = new EmbedBuilder({
        description: `\\✅ **Success:** \\✅\n ${message}`,
        color: 0x13ad0e,
      });
      let member;
      switch (event) {
        case "guildMemberAdd":
          member = interaction.guild.members.cache.get(
            interaction.options.getUser("user").id
          );
          client.emit(event, member);
          break;
        case "guildMemberRemove":
          member = interaction.guild.members.cache.get(
            interaction.options.getUser("user").id
          );
          client.emit(event, member);
          break;
        case "guildMemberUpdate":
          member = interaction.guild.members.cache.get(
            interaction.options.getUser("user").id
          );
          client.emit(event, member);
          break;
        case "guildCreate":
          client.emit(event, interaction.guild);
          embed.addFields({
            name: "\u200b",
            value: "This event went to the console as it is not setup.",
          });
          break;
        case "guildDelete":
          client.emit(event, interaction.guild);
          embed.addFields({
            name: "\u200b",
            value: "This event went to the console as it is not setup.",
          });
          break;
        case "emojiCreate":
          client.emit(event, interaction.guild);
          embed.addFields({
            name: "\u200b",
            value: "This event went to the console as it is not setup.",
          });
          break;
        case "emojiDelete":
          client.emit(event, interaction.guild);
          embed.addFields({
            name: "\u200b",
            value: "This event went to the console as it is not setup.",
          });
          break;
        case "emojiUpdate":
          client.emit(event, interaction.guild);
          embed.addFields({
            name: "\u200b",
            value: "This event went to the console as it is not setup.",
          });
          break;

        default:
          break;
      }

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      await interaction.reply({
        embeds: [
          {
            description: `\\📛 **Error:** \\📛\n ${error.message}`,
            color: 0xfc0303,
          },
        ],
        ephemeral: true,
      });
    }
  },
};
