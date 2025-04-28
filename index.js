client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Cek apakah bot di-mention
    const isMentioned = message.mentions.has(client.user);

    if (!isMentioned) return; // Kalau tidak mention bot, jangan balas

    try {
        const result = await fetchLangflow(message.content);
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
        console.error("❌ Gagal menghubungi Langflow:", error);
        await message.reply("⚠️ Terjadi kesalahan saat menghubungi Langflow.");
    }
});
