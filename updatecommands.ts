import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const commands = [
  {
    name: 'getanultrareply',
    description: 'generate an ultracide response',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

console.log('Started refreshing application (/) commands.');

rest.put(Routes.applicationCommands(process.env.ID!), { body: commands }).then(() => {
  console.log('Successfully reloaded application (/) commands.')
});