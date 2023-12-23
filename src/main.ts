import { Channel, Client,GatewayIntentBits } from "discord.js"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config();

let responsesLoaded = false;
let responses: string[] = [];
let lastResponse: number;
let channelIdToSendMessagesPeriodicallyInto = "1181427778747383821"

const client = new Client({intents: GatewayIntentBits.Guilds})
client.on("ready", readyClient => {
  console.log(`logged in ${readyClient.user.tag}`)
  setInterval(periodicallySendUltraMessage, 30000)
})

async function periodicallySendUltraMessage() {
  if (!client.isReady()) return;
  let channel = client.channels.cache.get(channelIdToSendMessagesPeriodicallyInto)
  if(channel === undefined) {
    console.error("babes, no channel found with id", channelIdToSendMessagesPeriodicallyInto)
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
    channelIdToSendMessagesPeriodicallyInto = interaction.channelId;
    await interaction.reply("set channel successfully")
    }
    catch (err) {
      console.error("error setting new channel id:", err)
    }
  }
})

function generateUltraResponse(): string {
  if(!responsesLoaded) return "budddyyy"
  let randomIndex = getRandomIndex();
  console.log(`random message index: ${randomIndex}, sending message: ${responses[randomIndex]}`);
  return responses[randomIndex];
}

function getRandomIndex() {
  let randomIndex = Math.floor(Math.random() * (responses.length));
  if (randomIndex == lastResponse) randomIndex = getRandomIndex();
  lastResponse = randomIndex;
  return randomIndex;
}

function getReadyToGenerateUltraResponse(): void {
  let responsesFromFile = fs.readFileSync("ultraresponses.txt",{encoding: "utf-8"})
  responses = responsesFromFile.split("\r\n")
  responsesLoaded = true;
}

getReadyToGenerateUltraResponse();

client.login(process.env.TOKEN!)