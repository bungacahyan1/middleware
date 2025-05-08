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

client.on('ready', () => {
  console.log(`🤖 Bot is ready! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    await axios.post(process.env.N8N_WEBHOOK_URL, {
      content: message.content,
      author: message.author.username,
      channel: message.channel.id,
      guild: message.guild?.name || 'DM',
    });
    console.log(`📨 Message forwarded: ${message.content}`);
  } catch (err) {
    console.error('❌ Error sending to n8n:', err.message);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
