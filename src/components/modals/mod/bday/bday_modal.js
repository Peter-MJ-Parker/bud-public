const birthday = require("../../../../models/birthday");

module.exports = {
  data: {
    id: "bday_modal",
  },
  /**
   *
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("../../../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const { utils } = client;
    const bday = await birthday.findOne({ userId: interaction.user.id });
    const myExp = new RegExp(/^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])$/gm);
    const newBday = interaction.fields.getTextInputValue("birthdayInput");
    if (!newBday.match(myExp))
      return await utils.errorReplyEmbed(
        `You ignorant fella, please try again with the specified format.`,
        interaction,
        true
      );
    const event = new Date(newBday);
    const options = { dateStyle: "long" };
    let date = event.toLocaleString("en", options);
    const fdate = date.slice(0, -6);

    if (!bday) {
      if (interaction.member.nickname) {
        let newBirthday = await birthday.create({
          userId: interaction.user.id,
          date: fdate,
          username: interaction.user.username,
          nickname: interaction.member.nickname,
        });
        await newBirthday.save();
        return await utils.successReplyEmbed(
          `${interaction.member.nickname}, your birthday has been recorded as: ${fdate}`,
          interaction,
          true
        );
      } else {
        let newBirthdayNoNick = await birthday.create({
          userId: interaction.user.id,
          date: fdate,
          username: interaction.user.username,
        });
        await newBirthdayNoNick.save();
        return await utils.successReplyEmbed(
          `${interaction.user.username}, your birthday has been recorded as: ${fdate}`,
          interaction,
          true
        );
      }
    }
  },
};
