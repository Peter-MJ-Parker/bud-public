const { InteractionType, EmbedBuilder, Collection } = require("discord.js");
const { Connect, BotOwnerID } = process.env;

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const { commands, cooldowns, utils } = client;

    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);
      if (!command) return;

      try {
        if (command.false)
          return await utils.errorReplyEmbed(
            `Command not set up yet, please wait!`,
            interaction
          );
        if (command.owner && utils.checkOwner(interaction.user.id)) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `\\📛 **Error:** \\📛\n You cannot use that command!`
                )
                .setColor("Red"),
            ],
            ephemeral: true,
          });
        }

        if (!Connect && command.dbRequired) {
          return await interaction.reply({
            content: `This command is unavailable due to having no database setup.`,
            ephemeral: true,
          });
        }

        if (!cooldowns.commands.has(command.data.name)) {
          cooldowns.commands.set(command.data.name, new Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.commands.get(command.data.name);
        const cooldownAmount = (command.cooldown || 10) * 1000; //default of 10 seconds

        if (timestamps.has(interaction.user.id)) {
          if (!utils.checkOwner(interaction.user.id))
            return command.execute(interaction, client);
          else {
            const expirationTime =
              timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000;
              const message = `please wait ${timeLeft.toFixed(
                1
              )} more second(s) before reusing the \`${
                command.data.name
              }\` command.`;
              return interaction.reply({
                embeds: [
                  {
                    title: `Command: \`${command.data.name}\` is on cooldown!`,
                    description: `\\📛 **Error:** \\📛\n ${message}`,
                    color: 0xfc0303,
                  },
                ],
                ephemeral: true,
              });
            }
          }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(
          () => timestamps.delete(interaction.user.id),
          cooldownAmount
        );

        return await command.execute(interaction, client);
      } catch (error) {
        console.log(error);
        const errorEmbed = new EmbedBuilder({
          title: `${interaction.member.displayName} ran into an error while running command ${command.data.name}:`,
          description: error.stack,
        });
        client.users.cache.get(BotOwnerID).send({
          embeds: [errorEmbed],
        });
        return await utils.errorReplyEmbed(
          `Something went wrong while executing this command, I have informed <@${BotOwnerID}> of this incident!`,
          interaction
        );
      }
    } else if (
      interaction.type == InteractionType.ApplicationCommandAutocomplete
    ) {
      const auto = commands.get(interaction.commandName);
      if (!auto) return;

      try {
        await auto.autocomplete(interaction, client);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: "Something went wrong...",
          ephemeral: true,
        });
      }
    }
  },
};
