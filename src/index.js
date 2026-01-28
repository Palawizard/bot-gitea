// src/index.js
require('dotenv').config();
const express = require('express');
const { config } = require('./config');
const { verifyGiteaSignature } = require('./utils/verifySignature');
const { handleGiteaWebhook } = require('./handlers/gitea');

const app = express();

// Capture raw body for HMAC verification
app.use(express.json({
    verify: (req, res, buf) => { req.rawBody = buf; }
}));

const { Client, GatewayIntentBits, Events } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, () => {
    console.log(`Discord bot logged in as ${client.user.tag}`);
});

app.post('/webhooks/gitea', async (req, res) => {
    try {
        const signatureHeader = req.get('X-Gitea-Signature') || '';
        const event = req.get('X-Gitea-Event') || '';
        if (!verifyGiteaSignature(signatureHeader, req.rawBody, config.webhookSecret)) {
            return res.status(401).json({ ok: false, error: 'Invalid signature' });
        }
        await handleGiteaWebhook({ client, config, event, payload: req.body });
        res.json({ ok: true });
    } catch (err) {
        console.error('Webhook handling error:', err);
        res.status(500).json({ ok: false, error: 'Server error' });
    }
});

const port = config.port;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

client.login(config.discordToken);
