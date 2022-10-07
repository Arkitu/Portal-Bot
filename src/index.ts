import { Collection, Intents, Interaction, Message, MessageActionRow, MessageButton, Client as DiscordClient } from 'discord.js';
import { readdirSync } from 'fs';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js';
import * as path from 'path';
import { dirname } from 'dirname-filename-esm';
import './sequelize/models/index.js';
import { OtherListeners } from './listeners/OtherListeners.js';
import { TimeStringUtils, LogUtils } from './Utils.js';

const __dirname = dirname(import.meta);

// Import config and constants
global.config = new JsonDB(new Config(path.join(__dirname, "..", "config.json"), true, true, '/'));
global.constants = new JsonDB(new Config(path.join(__dirname, "..", "constants.json"), true, true, '/'));

export class Client extends DiscordClient {
	public commands: Collection<string, any> = new Collection();
}

// Create a new client instance
global.client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MEMBERS
] });

// When the client is ready, run this code (only once)
client.once('ready', async () => {
	LogUtils.log('Bot logged !');
	client.users.fetch(config.getData("/creator_id")).then(u => u.send("🔄 Le bot a redemarré !"));
	await db.authenticate();
});

// Set up listeners
client.setMaxListeners(0);
client.on('interactionCreate', OtherListeners.command);
client.on('messageCreate', (message) => {
    if (!message.content) return;
    OtherListeners.help(message);
});

// Import all the commands from the commands files
client.commands = new Collection();
const admin_path = path.join(__dirname, "commands", "admin");
const everyone_path = path.join(__dirname, "commands", "everyone");
const commandFiles = {
	admin: readdirSync(admin_path).filter(file => file.endsWith(".js")),
	everyone: readdirSync(everyone_path).filter(file => file.endsWith(".js"))
};

for (const file of commandFiles.admin) {
	import(path.join(admin_path, file))
  		.then((command) => {
    		client.commands.set(command.data.name, command);
  		});
}
for (const file of commandFiles.everyone) {
	import(path.join(everyone_path, file))
  		.then((command) => {
    		client.commands.set(command.data.name, command);
  		});
}

// Login to Discord
client.login(config.getData("/token"));
