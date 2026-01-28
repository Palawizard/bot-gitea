// src/handlers/gitea.js
const { baseEmbed, sendEmbed } = require('../discord');

function refToBranch(ref) {
    return (ref || '').replace(/^refs\/heads\//, '');
}

async function handlePullRequest({ client, config, payload }) {
    const ROLE_IDS = ['1417475711928635412', '1417475625391751228', '1417476355913941074'];
    const { action, number, pull_request: pr, repository: repo, sender } = payload || {};
    const repoName = repo?.full_name || repo?.name;
    const title = pr?.title || `PR #${number}`;
    const prUrl = pr?.html_url || pr?.url || '';
    const author = pr?.user?.login || sender?.login || 'unknown';
    const base = pr?.base?.ref || '';
    const head = pr?.head?.ref || '';
    const merged = !!pr?.merged;

    let color = 0x5865f2;
    let actionLabel = action || 'updated';
    if (action === 'opened' || action === 'reopened') color = 0x57f287;
    if (action === 'synchronized') color = 0xfaa61a;
    if (action === 'closed' && !merged) color = 0xed4245;
    if (action === 'closed' && merged) { color = 0x57f287; actionLabel = 'merged'; }

    const embed = baseEmbed(repo, color)
        .setTitle(`PR ${actionLabel}: ${title}`)
        .setURL(prUrl)
        .setDescription(`PR #${number} from ${head} into ${base}`)
        .addFields(
            { name: 'Repository', value: String(repoName), inline: true },
            { name: 'Author', value: String(author), inline: true }
        );

    const content = ROLE_IDS.map(id => `<@&${id}>`).join(' ');
    const allowedMentions = { roles: ROLE_IDS, parse: [] };

    await sendEmbed(client, config.channels.pr, embed, { content, allowedMentions });
}

function summarizeCommits(commits = [], limit = 5) {
    const items = commits.slice(0, limit).map(c => {
        const sha = (c.id || c.sha || '').slice(0, 7);
        const msg = (c.message || '').split('\n')[0].slice(0, 100);
        const author = c.author?.name || c.committer?.name || 'unknown';
        return `• ${sha} — ${msg} (${author})`;
    });
    const rest = commits.length - limit;
    if (rest > 0) items.push(`• …and ${rest} more commits`);
    return items.join('\n');
}

async function handlePush({ client, config, payload }) {
    const { ref, commits = [], repository: repo, pusher, total_commits_count } = payload || {};
    const branch = refToBranch(ref);
    const count = total_commits_count || commits.length;
    if (count === 0) return;

    const embed = baseEmbed(repo, 0x5865f2)
        .setTitle(`Push on ${branch} (${count} commit${count > 1 ? 's' : ''})`)
        .setDescription(summarizeCommits(commits))
        .addFields(
            { name: 'Repository', value: String(repo?.full_name || repo?.name || ''), inline: true },
            { name: 'Pusher', value: String(pusher?.full_name || pusher?.username || 'unknown'), inline: true },
            { name: 'Branch', value: String(branch), inline: true }
        );

    await sendEmbed(client, config.channels.commits, embed);
}

async function handleCreate({ client, config, payload }) {
    const { ref, ref_type, repository: repo, sender } = payload || {};
    const isBranch = (ref_type || '').toLowerCase() === 'branch';
    const branch = isBranch ? ref : refToBranch(ref);
    const embed = baseEmbed(repo, 0x57f287)
        .setTitle(isBranch ? `Branch created: ${branch}` : `Ref created: ${ref}`)
        .addFields(
            { name: 'Repository', value: String(repo?.full_name || repo?.name || ''), inline: true },
            { name: 'By', value: String(sender?.login || 'unknown'), inline: true }
        );

    await sendEmbed(client, config.channels.branches, embed);
}

async function handleGiteaWebhook({ client, config, event, payload }) {
    switch ((event || '').toLowerCase()) {
        case 'pull_request':
            return handlePullRequest({ client, config, payload });
        case 'push':
            return handlePush({ client, config, payload });
        case 'create':
            return handleCreate({ client, config, payload });
        default:
            return;
    }
}

module.exports = { handleGiteaWebhook };
