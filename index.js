const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    await axios.post(process.env.N8N_WEBHOOK_URL, {
      content: message.content,
      author: message.author.username,
      channel: message.channel.id,
    });
  } catch (error) {
    console.error('Error sending to n8n:', error.message);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
