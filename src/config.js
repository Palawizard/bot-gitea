// src/config.js
function required(name, value) {
    if (!value) throw new Error(`Missing required env: ${name}`);
    return value;
}

const config = {
    discordToken: required('DISCORD_TOKEN', process.env.DISCORD_TOKEN),
    port: parseInt(process.env.PORT || '3000', 10),
    webhookSecret: required('WEBHOOK_SECRET', process.env.WEBHOOK_SECRET),
    channels: {
        pr: required('CHANNEL_PR_ID', process.env.CHANNEL_PR_ID),
        commits: required('CHANNEL_COMMITS_ID', process.env.CHANNEL_COMMITS_ID),
        branches: required('CHANNEL_BRANCHES_ID', process.env.CHANNEL_BRANCHES_ID)
    }
};

module.exports = { config };
