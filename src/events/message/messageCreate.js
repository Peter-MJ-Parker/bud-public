const data = {};
const Money = require("../../models/money");

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {import("discord.js").Message} message
   * @param {import("../../Structures/bot")} client
   * @returns
   */
  async execute(message, client) {
    const { utils } = client;
    if (
      message.author.bot ||
      message.system ||
      message.channel.type === "dm" ||
      !message.guild
    )
      return null;

    data.guild = await utils.guild(message.guild.id);

    const profileData = await Money.findOne({
      userID: message.author.id,
      serverID: message.guild.id,
    });
    if (!profileData) {
      let profile = await Money.create({
        userID: message.author.id,
        serverID: message.guild.id,
        guildName: message.guild.name,
        userName: message.author.username,
        coins: 100,
        bank: 0,
      });

      await profile.save();
    }
    try {
      if (!message.content.startsWith(data.guild.prefix)) {
        const coinsToAdd = Math.floor(Math.random() * 50) + 1;
        await Money.findOneAndUpdate(
          {
            userID: message.author.id,
            serverID: message.guild.id,
          },
          {
            $inc: {
              coins: coinsToAdd,
            },
          },
          {
            upsert: true,
          }
        );
      }
    } catch (error) {
      console.log(error);
    }

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>)\\s*`);

    if (prefixRegex.test(message.content))
      return message.reply({
        content: `I do not support legacy commands due to Discord limitations. Please check out my slash (/) commands!`,
      });
  },
};
