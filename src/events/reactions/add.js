const { welcomeCreate } = require("../../Structures/welcome");

module.exports = {
  name: "messageReactionAdd",
  /**
   *
   * @param {import("discord.js").ReactionManager} reaction
   * @param {import("discord.js").ReactionUserManager} user
   * @param {import("../../Structures/bot")} client
   * @returns
   */
  async execute(reaction, user, client) {
    let message = reaction.message;
    const memCount = reaction.message.guild.members.cache.filter(
      (m) => m.user.bot === false
    ).size;
    if (message.partial) await message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (message.id === "744940669834887218" && reaction.emoji.toString()) {
      let mmm = reaction.message.guild.members.cache.get(user.id);
      const welcomeChannel = mmm.guild.channels.fetch("763256419868475444");

      let lilbud = message.guild.roles.cache.get("678400106982277130");
      if (!mmm._roles.includes(lilbud.id)) {
        console.log(
          user.username +
            " reacted with " +
            reaction.emoji.name +
            " and gained role: lil' buds."
        );
        message.guild.members.cache
          .get(user.id)
          .roles.add(lilbud)
          .catch((err) => console.log(err));
        await welcomeCreate(mmm, mmm.guild.name, memCount, welcomeChannel);
        await message.channel
          .send(
            `You may now go to the <#744927896187043940> and introduce yourself!`
          )
          .then((m) => {
            setTimeout(() => {
              m.delete().catch((err) => {
                console.log("Regular Error. Couldn't Delete the message.");
              });
            }, 5 * 1000);
          });
      } else return null;
    }
  },
};
