const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config()
require('./db.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });

client.once(Events.ClientReady, c => {
    console.log(`Bot online! Logged in as ${c.user.tag}`);
});

async function sendEmbed(userId, content) {
    await client.users.fetch(userId).then((user) => {
        if (user == null) {
            return user
        } else {
            try {
                user.send(content)
                return true
            } catch (e) {
                return e
            }
        }
    })
}

async function sendEmbedChannel(channelId, content) {
    await client.channels.fetch(channelId).then((channel) => {
        if (channel == null) {
            return channel
        } else {
            try {
                channel.send(content)
                return true
            } catch (e) {
                return e
            }
        }
    })
}

module.exports = { sendEmbed, sendEmbedChannel }

client.login(process.env.DISCORD);