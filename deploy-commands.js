import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'node:fs';

dotenv.config();

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const COMMANDS_PATH = './commands';

const commands = [];

// Grab all the command files from the commands directory
const commandFiles = readdirSync(COMMANDS_PATH).filter(file =>
  file.endsWith('.js')
);

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const { default: command } = await import(`${COMMANDS_PATH}/${file}`);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(TOKEN);

// Deploy commands
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // Fully refresh all commands in the guild with the current set.
    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (err) {
    console.error(err);
  }
})();
