import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the currently playing song.'),
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
        content: 'There are no songs in the queue.',
        ephemeral: true,
      });
    }

    queue.skip();
    return await interaction.reply('Track skipped!');
  },
};
