import { Channel, Client,GatewayIntentBits } from "discord.js"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config();

let responsesLoaded = false;
let responses: string[] = [];
let lastResponse: number;

const client = new Client({intents: GatewayIntentBits.Guilds})
client.on("ready", readyClient => {
  console.log(`logged in ${readyClient.user.tag}`)
  let val = readyClient.channels.cache.get("1181427778747383821")
  if(val) setInterval(periodicallySendUltraMessage, 30000, val)
  else throw new Error("no funny channel found")
})

async function periodicallySendUltraMessage(channel: Channel) {
  if(channel.isTextBased()) {
    channel.send(generateUltraResponse())
  }
}

client.on("interactionCreate", async interaction => {
  console.log(interaction);
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === "getanultrareply") {
    await interaction.reply(generateUltraResponse())
  }
})

function generateUltraResponse(): string {
  if(!responsesLoaded) return "budddyyy"
  let randomIndex = getRandomIndex();
  console.log(`random message index: ${randomIndex}, sending message: ${responses[randomIndex]}`);
  return responses[randomIndex];
}

function getRandomIndex() {
  let randomIndex = Math.floor(Math.random() * (responses.length + 1));
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