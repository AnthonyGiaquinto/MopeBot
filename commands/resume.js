import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the song that is currently paused.'),
  async execute(interaction) {
    // Return if not in voice channel
    if (!interaction.member.voice.channel) {
      return await interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      });
    }

    const queue = interaction.client.player.getQueue(interaction.guild);

    if (!queue) {
      return await interaction.reply({
        content: 'There is no song currently in the queue.',
        ephemeral: true,
      });
    } else if (!queue.playing) {
      return await interaction.reply({
        content: 'There is no song currently playing.',
        ephemeral: true,
      });
    }

    queue.setPaused(false);
    return await interaction.reply('Track resumed!');
  },
};
