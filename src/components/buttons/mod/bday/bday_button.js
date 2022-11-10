const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const birthday = require("../../../../models/birthday");

module.exports = {
  data: {
    id: "bday_button",
  },
  /**
   *
   * @param {import("discord.js").ButtonInteraction} interaction
   * @param {import("../../../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const { utils } = client;
    let bday = await birthday.findOne({ userId: interaction.user.id });
    if (bday) {
      let user = interaction.member.nickname
        ? interaction.member.nickname
        : interaction.user.username;
      return await utils.errorReplyEmbed(
        `${user}, your birthday has already been recorded in my database as ${bday.date}!\nIf this birthday is incorrect, please inform a Moderator or Owner of the server and we would be happy to get it fixed for you!`,
        interaction,
        true
      );
    } else {
      const bdayModal = new ModalBuilder({
        custom_id: "bday_modal",
        title: "Tell me your birthday",
      }).addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("birthdayInput")
            .setLabel("What is your birthday? (format: ##/##)")
            .setStyle(TextInputStyle.Short)
            .setMinLength(5)
            .setMaxLength(5)
            .setRequired(true)
        )
      );
      await interaction.showModal(bdayModal);
    }
  },
};
