import { Channel, Client, GatewayIntentBits, GuildTextBasedChannel } from "discord.js";
import fs from "fs";

import { config } from "dotenv";
config();

//															optional \r since that's only on windows
let responses: string[] = fs.readFileSync("ultraresponses.txt", { encoding: "utf-8" }).split(/\r?\n/g);
let spamChannel: GuildTextBasedChannel | undefined = undefined;
const SPAM_INTERVAL = 30000;

const client = new Client({ intents: GatewayIntentBits.Guilds })
client.on("ready", async (readyClient) => {
	console.log(`logged in ${readyClient.user.tag}`)

	// load spam channel
	spamChannel = await fetchTextBasedChannel(process.env.SPAM_CHANNEL_ID);

	setInterval(() => {
		spamChannel.send(generateUltraResponse());
	}, SPAM_INTERVAL)
})

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return

	// handle commands
	switch (interaction.commandName) {
		case "getanultrareply": {
			await interaction.reply(generateUltraResponse());
			break;
		}
		case "setchannel": {
			spamChannel = interaction.channel;
			await interaction.reply("set channel successfully")
			break;
		}
		default: {
			break;
		}
	}
})

// tries to fetch the channel with the given id. returned undefined if it does not exist or it is not text based. (lol based) 
async function fetchTextBasedChannel(channel_id: string): Promise<GuildTextBasedChannel | undefined> {
	return await client.channels.fetch(channel_id, { cache: true }).then(ch => {
		return ch.isTextBased() ? ch : undefined;
	}).catch(e => {
		console.error(`Could not load default spam channel: ${e}`);
		return undefined;
	});
}

function generateUltraResponse(): string {
	let randomIndex = getRandomIndex();
	console.log(`random message index: ${randomIndex}, sending message: ${responses[randomIndex]}`);
	return responses[randomIndex];
}

let lastResponseIndex: number;
function getRandomIndex() {
	let randomIndex = Math.floor(Math.random() * (responses.length));
	if (randomIndex == lastResponseIndex) randomIndex = getRandomIndex();
	lastResponseIndex = randomIndex;
	return randomIndex;
}

client.login(process.env.TOKEN!)