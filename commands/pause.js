import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the song that is currently being played.'),
  async execute(interaction) {
    // Return if not in voice channel
    if (!interaction.member.voice.channel) {
      return await interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      });
    }

    const queue = interaction.client.player.getQueue(interaction.guild);

    if (!queue || !queue.playing) {
      return await interaction.reply({
        content: 'There is no song currently playing in the queue.',
        ephemeral: true,
      });
    }

    queue.setPaused(true);
    return await interaction.reply('Track paused!');
  },
};
