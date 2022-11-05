import dotenv from 'dotenv';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Player } from 'discord-player';
import { readdirSync } from 'node:fs';

dotenv.config();

const { TOKEN } = process.env;
const COMMANDS_PATH = './commands'; // File path for event listeners and commands
const EVENTS_PATH = './events';

// Create a new client and attach discord-player instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.player = new Player(client);

// Add event listeners to client
const eventFiles = readdirSync(EVENTS_PATH).filter(file =>
  file.endsWith('.js')
);

for (const file of eventFiles) {
  const filePath = `${EVENTS_PATH}/${file}`;
  const { default: event } = await import(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Attach Collection of commands to Client for easy fetching in event modules
client.commands = new Collection();
const commandFiles = readdirSync(COMMANDS_PATH).filter(file =>
  file.endsWith('.js')
);

for (const file of commandFiles) {
  const filePath = `${COMMANDS_PATH}/${file}`;
  const { default: command } = await import(filePath);

  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.player.on('trackStart', (queue, track) => {
  queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`);
});
client.player.on('error', (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
  );
});
client.player.on('connectionError', (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  );
});

// Log in to Discord with your client's token
client.login(TOKEN);
