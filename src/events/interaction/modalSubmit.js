const { InteractionType, Collection } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const { components, cooldowns, utils } = client;
    const { modals } = components;

    if (interaction.type === InteractionType.ModalSubmit) {
      const modal = modals.get(interaction.customId);
      if (!modal) return;

      try {
        if (!cooldowns.modals.has(modal.data.id)) {
          cooldowns.modals.set(modal.data.id, new Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.modals.get(modal.data.id);
        const cooldownAmount = (modal.cooldown || 10) * 1000; //default of 10 seconds

        if (timestamps.has(interaction.user.id)) {
          if (!utils.checkOwner(interaction.user.id))
            return modal.execute(interaction, client);
          else {
            const expirationTime =
              timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000;
              const message = `please wait ${timeLeft.toFixed(
                1
              )} more second(s) before reusing the \`${modal.data.id}\` modal.`;
              return interaction.reply({
                embeds: [
                  {
                    title: `Modal: \`${modal.data.id}\` is on cooldown!`,
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
        await modal.execute(interaction, client);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: "There is no code for this modal!",
          ephemeral: true,
        });
      }
    }
  },
};
