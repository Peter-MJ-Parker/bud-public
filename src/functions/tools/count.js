/**
 *
 * @param {import("../../Structures/bot")} client
 */
module.exports = async (client) => {
  client.memberCounter = async () => {
    const guild = client.guilds.cache.get("678398938046267402");
    setInterval(() => {
      const totalCount = guild.memberCount;
      const botCount = guild.members.cache.filter(
        (m) => m.user.bot === true
      ).size;
      const memberCount = guild.members.cache.filter(
        (m) => m.user.bot === false
      ).size;
      const chan1 = guild.channels.cache.get("825555222281060363");
      const chan2 = guild.channels.cache.get("825555223321640970");
      const chan3 = guild.channels.cache.get("825555224147263549");
      chan1.setName(`Total Members: ${totalCount.toLocaleString()}`);
      chan2.setName(`Users: ${memberCount.toLocaleString()}`);
      chan3.setName(`Bots: ${botCount.toLocaleString()}`);
      // console.log('Updating Member Count');
    }, 15000);
  };
};
