const { SlashCommandBuilder } = require("discord.js");
const birthday = require("../../models/birthday");

module.exports = {
  category: "util",
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Sets or displays users birthday in my database.")
    .setDMPermission(false)
    .addStringOption((bday) =>
      bday
        .setName("date")
        .setDescription("Give me your birthday (Date: ##/##).")
    ),
  /**
   *
   * @param {import("../../Structures/bot")} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {
    const { utils } = client;
    const { options, member, user } = interaction;
    try {
      let bday = await birthday.findOne({ userId: user.id });
      const day = options.getString("date");

      let myExp = new RegExp(/^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])$/gm);

      if (!day && bday)
        return interaction.reply({
          content: `Your birthday is set to: \`${bday.date}\``,
        });
      if (!day && !bday)
        return await utils.errorReplyEmbed(
          `Please use \`/birthday <Date: ##/##>\` command to set your birthday if you want to be notified on the day of your birthday!`,
          interaction
        );

      const event = new Date(day);
      const dateOptions = { dateStyle: "long" };
      let fdate = event.toLocaleString("en", dateOptions);
      fdate = fdate.slice(0, -6);

      if (!bday) {
        if (day) {
          if (!myExp.test(day)) {
            return await utils.errorReplyEmbed(
              `You ignorant fella, that's an invalid Date format.\n Please try again. Format: ##/## (2 digit day, 2 digit month)\n Hint: I do check to see if it's a valid day in a month!`,
              interaction
            );
          }
        }
        if (member.nickname) {
          let newBirthday = await birthday.create({
            userId: user.id,
            date: fdate,
            username: user.username,
            nickname: member.nickname,
          });
          await newBirthday.save();
          return utils.successReplyEmbed(
            `Your birthday has been recorded as: ${fdate}`,
            interaction
          );
        } else {
          let newBirthdayNoNick = await birthday.create({
            userId: user.id,
            date: fdate,
            username: user.username,
          });
          await newBirthdayNoNick.save();
          return utils.successReplyEmbed(
            `Your birthday has been recorded as: ${fdate}`,
            interaction
          );
        }
      } else
        client.utils.errorReplyEmbed(
          `${user.username} ,your birthday has already been recorded.\nIf you made a mistake while entering your birthday, please contact server owner or mod to have it changed.`,
          interaction
        );
    } catch (error) {
      console.log(error);
      return await utils.errorReplyEmbed(
        `An error occured, please contact <@${process.env.BotOwnerID}>!`,
        interaction
      );
    }
  },
};
