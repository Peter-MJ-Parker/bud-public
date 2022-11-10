const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports.musicEvents = (player) => {
  player
    .on("error", (queue, error) => {
      console.log(
        chalk.red.bold.italic(`(${queue.guild.name}) error: ${error.message}`)
      );
    })

    .on("botDisconnect", () => {
      console.log("bot disconnected");
    })

    .on("connectionError", (queue, error) => {
      console.log(
        chalk.red.bold.italic(
          `(${queue.guild.name}) connectionError: ${error.message}`
        )
      );
    })

    .on("trackAdd", (queue, track) => {
      queue.metadata.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Queued **[${track.title}](${track.url})**`)
            .setColor("0x44b868"),
        ],
      });
    })

    .on("tracksAdd", (queue, tracks) => {
      queue.metadata.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Queued **${tracks.length}** tracks from [${tracks[0].playlist.title}](${tracks[0].playlist.url})`
            )
            .setColor("0x44b868"),
        ],
      });
    })

    .on("trackStart", async (queue, track) => {
      if (
        !queue.guild.members.me
          .permissionsIn(queue.metadata.channel)
          .has(player.client.requiredTextPermissions)
      ) {
        console.log(
          chalk.red.bold.italic(
            `(${queue.guild.name}) destroying queue due to missing text channel permissions`
          )
        );
        return queue.destroy();
      }
      if (queue.npBed && queue.tracks.length >> 0) {
        queue.npBed.delete().catch((error) => {});
      }
      // queue.setVolume(20);

      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("buttoncontrol_play")
          .setLabel("Pause")
          .setStyle(3),
        new ButtonBuilder()
          .setCustomId("buttoncontrol_disconnect")
          .setLabel("Disconnect")
          .setStyle(4),
        new ButtonBuilder()
          .setCustomId("buttoncontrol_queue")
          .setLabel("Show queue")
          .setStyle(2),
        new ButtonBuilder()
          .setCustomId("buttoncontrol_lyrics")
          .setLabel("Show lyrics")
          .setStyle(2)
      );
      const row2 = new ActionRowBuilder().addComponents(
        ["🔉|Down", "⏮️|Back", "⏭️|Skip", "🔀|Shuffle", "🔊|Up"].map(
          (choice) => {
            const [emoji, name] = choice.split("|");
            return new ButtonBuilder({
              type: 2,
              custom_id: `buttoncontrol_${name}`,
              label: name.toString(),
              emoji: emoji.toString(),
              style: 2,
            });
          }
        )
      );

      queue.metadata.channel.setTopic(`▶️ Now Playing - **${track.title}**`);
      await queue.metadata.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Now playing`)
              .setDescription(
                `**[${track.title}](${track.url})** - ${track.requestedBy}\n\nVolume set to: \`20\``
              )
              .setThumbnail(`${track.thumbnail}`)
              .setColor("0x44b868"),
          ],
          components: [row1, row2],
        })
        .then((msg) => {
          queue.npBed = msg;
        });
    })

    .on("trackEnd", (queue, track) => {
      if (queue.npBed && queue.tracks.length == 0) {
        queue.npBed.delete().catch((error) => {
          console.error(error);
        });
      }
      console.log("song ended");
    })

    .on("queueEnd", (queue) => {
      queue.metadata.channel.send("Queue ended");
      queue.metadata.channel.setTopic(`⏹️ No Music Playing`);
    });
};
