import { Channel, Client,GatewayIntentBits } from "discord.js";
import fs from "fs";

import { config } from "dotenv";
config();

let responses: string[] = fs.readFileSync("ultraresponses.txt",{ encoding: "utf-8" }).split('\r\n');
let lastResponseIndex: number;
let ChannelIdToSpam: string = process.env.SPAM_CHANNEL_ID;

const client = new Client({intents: GatewayIntentBits.Guilds})
client.on("ready", readyClient => {
  console.log(`logged in ${readyClient.user.tag}`)
  setInterval(periodicallySendUltraMessage, 30000)
})

async function periodicallySendUltraMessage() {
  if (!client.isReady()) return;
  let channel = client.channels.cache.get(ChannelIdToSpam)
  if(channel === undefined) {
    console.error("babes, no channel found with id", ChannelIdToSpam)
    return;
  }
  if(channel.isTextBased()) {
    channel.send(generateUltraResponse())
  }
}

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === "getanultrareply") {
    await interaction.reply(generateUltraResponse())
  }
  if (interaction.commandName === "setchannel") {
    try {
      ChannelIdToSpam = interaction.channelId;
      await interaction.reply("set channel successfully")
    }
    catch (err) {
      console.error("error setting new channel id:", err)
    }
  }
})

function generateUltraResponse(): string {
  let randomIndex = getRandomIndex();
  console.log(`random message index: ${randomIndex}, sending message: ${responses[randomIndex]}`);
  return responses[randomIndex];
}

function getRandomIndex() {
  let randomIndex = Math.floor(Math.random() * (responses.length));
  if (randomIndex == lastResponseIndex) randomIndex = getRandomIndex();
  lastResponseIndex = randomIndex;
  return randomIndex;
}

client.login(process.env.TOKEN!)