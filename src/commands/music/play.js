const { SlashCommandBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music")
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName("query").setDescription("Keyword of song to play.")
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    let query = interaction.options.getString("query");
    if (!interaction.member.voice.channelId)
      return client.utils.errorReplyEmbed(
        `You are not in a voice channel!`,
        interaction
      );
    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.members.me.voice.channelId
    )
      return client.utils.errorReplyEmbed(
        `You are not in my voice channel!`,
        interaction.channel
      );
    if (!query) {
      const queue = client.player.getQueue(interaction.guild.id);
      if (queue && queue.playing) {
        const paused = queue.setPaused(false);
        if (paused) interaction.react("▶️");
      }
      return;
    }

    if (
      !interaction.guild.members.me
        .permissionsIn(interaction.member.voice.channel)
        .has(client.requiredVoicePermissions)
    )
      return client.utils.errorReplyEmbed(
        `I do not have the required Voice permissions to connect to your channel. \n(${client.requiredVoicePermissions
          .map()
          .join("\n")})`,
        interaction.channel
      );

    const searchResult = await client.player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });
    if (!searchResult || !searchResult.tracks.length)
      return interaction.reply({
        embeds: [{ description: `No results found!`, color: 0xb84e44 }],
      });

    const queue = await client.player.createQueue(interaction.guild.id, {
      metadata: { channel: interaction.channel },
      ytdlOptions: {
        filter: "audioonly",
        highWaterMark: 1 << 30,
        dlChunkSize: 0,
      },
      initialVolume: 20,
    });
    try {
      if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel);
      }
    } catch {
      client.player.deleteQueue(interaction.guild.id);
      return interaction.reply({
        embeds: [
          {
            description: `Could not join your voice channel!`,
            color: 0xb84e44,
          },
        ],
        ephemeral: true,
      });
    }
    try {
      await interaction.reply({
        content: `⏱ | Loading your ${
          searchResult.playlist ? "playlist" : "track"
        }...`,
      });
    } catch (error) {
      console.log(error);
    }

    (await searchResult.playlist)
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);
    if (!queue.playing) queue.play();
  },
};
