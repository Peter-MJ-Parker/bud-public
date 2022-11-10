module.exports = {
  name: "messageReactionRemove",
  /**
   *
   * @param {import("discord.js").ReactionManager} reaction
   * @param {import("discord.js").ReactionUserManager} user
   * @param {import("../../Structures/bot")} client
   */
  async execute(reaction, user, client) {
    let msg = reaction.message;

    if (msg.partial) await msg.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!msg.guild) return;

    if (msg.id === "744940669834887218" && reaction.emoji.toString()) {
      console.log(user.username + " removed reaction " + reaction.emoji.name);
    }
  },
};
