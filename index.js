const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');
const express = require('express');
require('dotenv').config();

// Setup Express untuk keep-alive server
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is alive!');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

// Setup Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Fungsi untuk fetch ke Langflow
async function fetchLangflow(messageContent) {
    const payload = {
        input_value: messageContent,
        output_type: "chat",
        input_type: "chat",
        session_id: "shaquille"
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LANGFLOW_API_TOKEN}`
        },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch('https://api.langflow.astra.datastax.com/lf/0b2a2275-fa16-46b5-9507-98d0e3edf12b/api/v1/run/48b90162-14a1-482d-bffc-af1b5fad1497', options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("❌ Gagal mengambil data dari Langflow:", error);
        return { error: true };
    }
}

// Event saat bot ready
client.once('ready', () => {
    console.log(`✅ Bot ready sebagai ${client.user.tag}`);
});

// Event saat pesan dibuat
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Cek kalau bot di-mention
    const isMentioned = message.mentions.has(client.user);
    if (!isMentioned) return;

    console.log(`💬 Pesan dari ${message.author.tag}: ${message.content}`);

    try {
        const result = await fetchLangflow(message.content);

        if (result.error) {
            await message.reply("⚠️ Bot mengalami kesulitan menjawab, coba lagi nanti.");
            return;
        }

        let reply = "⚠️ Langflow tidak memberikan respons.";

        if (
            result &&
            result.outputs &&
            result.outputs[0] &&
            result.outputs[0].outputs &&
            result.outputs[0].outputs[0] &&
            result.outputs[0].outputs[0].outputs &&
            result.outputs[0].outputs[0].outputs.message &&
            result.outputs[0].outputs[0].outputs.message.message
        ) {
            reply = result.outputs[0].outputs[0].outputs.message.message;
        } else {
            console.log("🧪 Struktur respons Langflow tidak sesuai:", JSON.stringify(result, null, 2));
        }

        if (!reply || reply.trim().length === 0) {
            reply = "⚠️ Langflow memberikan respons kosong.";
        } else {
            console.log("✅ Balasan dari Langflow:", reply);
        }

        await message.reply(reply);
    } catch (error) {
        console.error("❌ Error saat membalas:", error);
        await message.reply("⚠️ Terjadi kesalahan saat memproses pesan.");
    }
});

// Login ke Discord
client.login(process.env.DISCORD_BOT_TOKEN);
