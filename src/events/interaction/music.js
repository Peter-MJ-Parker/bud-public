const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {import("discord.js").ButtonInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId.startsWith("buttoncontrol_")) {
      const queue = client.player.getQueue(interaction.guild.id);
      if (
        !queue ||
        !queue.playing ||
        !interaction.member.voice.channelId ||
        (interaction.guild.members.me.voice.channelId &&
          interaction.member.voice.channelId !==
            interaction.guild.members.me.voice.channelId)
      )
        return;
      const _isPaused = queue.connection.paused;
      const embed = new EmbedBuilder();
      switch (interaction.customId) {
        case "buttoncontrol_play":
          let row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("buttoncontrol_play")
              .setLabel(_isPaused ? "Pause" : "Resume")
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
          let status;
          if (!_isPaused) {
            queue.setPaused(true);
            status = "paused";
          } else {
            queue.setPaused(false);
            status = "resumed";
          }
          queue.npBed.edit({
            embeds: [
              {
                title: `Now playing`,
                description: `**[${queue.current.title}](${queue.current.url})** - ${queue.current.requestedBy}\n\n${status} by ${interaction.user}`,
                thumbnail: {
                  url: `${queue.current.thumbnail}`,
                },
                color: _isPaused ? 0x44b868 : 0xb84e44,
              },
            ],
            components: [row1, row2],
          });
          await interaction.deferUpdate();
          break;
        case "buttoncontrol_disconnect":
          embed.setDescription(`👋 Disconnected.`);
          embed.setColor("#44b868");
          embed.setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          });
          queue.npBed.delete();
          interaction.channel.send({ embeds: [embed] }).then((m) => {
            setTimeout(() => {
              m.delete().catch((err) => {
                console.log(
                  "Regular Error. Couldn't Delete the Disconnected Embed."
                );
              });
            }, 2 * 1000);
          });
          await interaction.deferUpdate();
          queue.destroy(true);
          break;
        case "buttoncontrol_Down":
          queue.volume -= 10;
          setTimeout(async () => {
            await queue.npBed.edit({
              embeds: [
                {
                  title: `Now playing`,
                  description: `**[${queue.current.title}](${queue.current.url})** - ${queue.current.requestedBy}\n\n Volume set to: \`${queue.volume}\``,
                  thumbnail: {
                    url: `${queue.current.thumbnail}`,
                  },
                },
              ],
            });
          }, 1000);
          await interaction.deferUpdate();
          break;
        case "buttoncontrol_Up":
          if (queue.volume === 100) {
            embed.setDescription(
              `Volume set to: \`${queue.volume}\`, can't go higher!`
            );
            embed.setFooter({
              text: interaction.user.tag,
              iconURL: interaction.user.displayAvatarURL(),
            });
            interaction.channel.send({ embeds: [embed] }).then((m) => {
              setTimeout(() => {
                m.delete().catch((err) => {
                  console.log(
                    "Regular Error. Couldn't Delete the Volume Embed."
                  );
                });
              }, 2 * 1000);
            });
            await interaction.deferUpdate();
            return;
          }
          queue.volume += 10;
          setTimeout(async () => {
            await queue.npBed.edit({
              embeds: [
                {
                  title: `Now playing`,
                  description: `**[${queue.current.title}](${queue.current.url})** - ${queue.current.requestedBy}\n\n Volume set to: \`${queue.volume}\``,
                  thumbnail: {
                    url: `${queue.current.thumbnail}`,
                  },
                },
              ],
            });
          }, 1000);
          await interaction.deferUpdate();
          break;
        case "buttoncontrol_Shuffle":
          queue.shuffle();
          embed.setDescription("Shuffled!");
          embed.setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          });
          interaction.channel.send({ embeds: [embed] }).then((m) => {
            setTimeout(() => {
              m.delete().catch((err) => {
                console.log(
                  "Regular Error. Couldn't Delete the Shuffled Embed."
                );
              });
            }, 2 * 1000);
          });
          await interaction.deferUpdate();
          break;
        case "buttoncontrol_Skip":
          embed.setDescription(
            `Skipped **[${queue.current.title}](${queue.current.url})**`
          );
          embed.setColor("#44b868");
          embed.setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          });
          interaction.channel.send({ embeds: [embed] }).then((m) => {
            setTimeout(() => {
              m.delete().catch((err) => {
                console.log(
                  "Regular Error. Couldn't Delete the Skipped Embed."
                );
              });
            }, 2 * 1000);
          });
          queue.npBed.delete();
          await interaction.deferUpdate();
          queue.skip();
          break;
        case "buttoncontrol_queue":
          Queue1.execute(interaction, ["queue"], client, true);
          await interaction.deferUpdate();
          break;
        case "buttoncontrol_lyrics":
          Lyrics.execute(interaction, ["lyrics"], client, true);
          await interaction.deferUpdate();
          break;
        case "buttoncontrol_Back":
          await queue.back();
          await interaction.deferUpdate();
          break;
      }
    }
    return;
  },
};
