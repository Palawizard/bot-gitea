// src/discord.js
const { EmbedBuilder } = require('discord.js');

async function sendEmbed(client, channelId, embed, options = {}) {
    const channel = await client.channels.fetch(channelId);
    if (!channel) throw new Error(`Channel not found: ${channelId}`);
    return channel.send({ embeds: [embed], ...options });
}

function baseEmbed(repo, color = 0x2f3136) {
    return new EmbedBuilder()
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: repo?.full_name || repo?.name || 'Repository' });
}

module.exports = {
    sendEmbed,
    baseEmbed
};
