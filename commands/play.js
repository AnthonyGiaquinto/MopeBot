import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube')
    .addStringOption(option =>
      option
        .setName('song')
        .setDescription('Song to play from YouTube')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Return if not in voice channel
    if (!interaction.member.voice.channelId) {
      return await interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      });
    }
    const player = interaction.client.player;
    const query = interaction.options.getString('song');
    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
      ytdlOptions: {
        // Seems necessary for playing to work. Haven't figured this out yet
        quality: 'highestaudio',
        highWaterMark: 1 << 30,
        dlChunkSize: 0,
      },
      bufferingTimeout: 1,
    });

    // Verify VC connection
    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.reply({
        content: 'Could not join your voice channel!',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const track = await player
      .search(query, {
        requestedBy: interaction.user,
      })
      .then(res => res.tracks[0]);

    if (!track) {
      return await interaction.followUp({
        content: `❌ | Track **${query}** not found!`,
      });
    }

    queue.play(track);

    return await interaction.followUp({
      content: `⏱️ | Loading track **${track.title}**!`,
    });
  },
};
