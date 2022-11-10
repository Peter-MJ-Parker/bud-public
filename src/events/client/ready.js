const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  /**
   *
   * @param {import("../../Structures/bot")} client
   */
  async execute(client) {
    // client.checkSteamTwitch();
    // client.memberCounter(client);
    // let guild = client.guilds.cache.get("716249660838379541");
    // let amount = guild.members.cache.filter((m) => m.user.bot === false).size;
    // let activities = [
    //     `Pokemon with ${amount} users!`,
    //     `/help with ${amount} users!`,
    //   ],
    //   i = 0;
    // setInterval(
    //   () =>
    //     client.user.setActivity(`${activities[i++ % activities.length]}`, {
    //       type: ActivityType.Playing,
    //     }),
    //   15000
    // );
    //BIRTHDAY EVENT
    /*const { schedule } = require("node-cron");
    const birthday = require("../../models/birthday");
    const day = new Date();
    const options = { dateStyle: "long" };
    let fdate = day.toLocaleString("en", options);
    let currentDay = fdate.slice(0, -6);
    // console.log(currentDay);
    let bday = await birthday.find({ date: currentDay });
    schedule(
      `00 07 * * *`,
      async () => {
        if (bday) {
          bday.forEach((username) => {
            // let mem = guild.members.cache.get(username.id);
            // const { mods, budtenders } = client.config;
            // mem._roles.forEach((role) => {
            //   if (budtenders.some(role.id)) console.log("server owner");
            // });
            // mem._roles.forEach((role) => {
            //   if (mods.some(role.id)) console.log("server mod");
            // });

            // return;
            let announcements = guild.channels.cache.get("831499351541022800");
            announcements.send(
              `let's wish <@${username.userId}> a very happy birthday!`
            );
            // let gen = guild.channels.cache.get("763256419868475444");
            // const Tenor = require("tenorjs").client({
            //   Key: process.env.tenor,
            //   Filter: "off",
            //   Locale: "en_US",
            //   Media: "GIF_FORMAT",
            // });
            // Tenor.Search.Random("Happy birthday", "1").then((Results) => {
            //   Results.forEach((Post) => {
            //     gen.send(`Happy Birthday, <@${username._id}>`);
            //     gen.send(Post.url);
            //   });
            // });
          });
        }
      },
      { timezone: "America/Chicago" }
    );*/
  },
};
