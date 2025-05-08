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
  console.log('N8N_WEBHOOK_URL:', process.env.N8N_WEBHOOK_URL);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    const response = await axios.post(
      process.env.N8N_WEBHOOK_URL,
      {
        content: message.content,
        author: message.author.username,
        channel: message.channel.id,
        guild: message.guild?.name || 'DM',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`📨 Message forwarded: ${message.content}`, response.status);
  } catch (err) {
    console.error('❌ Error sending to n8n:', err.message, err.response?.data);
  }
});

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error('❌ DISCORD_BOT_TOKEN is not set');
  process.exit(1);
}

client.login(token).catch((err) => {
  console.error('❌ Discord login failed:', err.message);
  process.exit(1);
});
