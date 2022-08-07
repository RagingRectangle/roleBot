const {
	Client,
	ChannelType,
	GatewayIntentBits,
	Partials
} = require('discord.js');
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const fs = require('fs');
const config = require('./config.json');

client.on('ready', async () => {
	console.log("Role Bot Logged In");
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (user.bot == true) {
		return;
	}
	let channel = reaction.message.channel;
	if (!config.roleChannelIDs.includes(channel.id)) {
		return;
	}
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Error fetching the message:', error);
			return;
		}
	}
	module.exports.roles(reaction, user, 'add');
}); //End of messageReactionAdd

client.on('messageReactionRemove', async (reaction, user) => {
	if (user.bot == true) {
		return;
	}
	let channel = reaction.message.channel;
	if (!config.roleChannelIDs.includes(channel.id)) {
		return;
	}
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Error fetching the message:', error);
			return;
		}
	}
	module.exports.roles(reaction, user, 'remove');
}); //End of messageReactionRemove

module.exports = {
	roles: async function roles(reaction, user, type) {
		roleConfig = config.roles;
		for (var r in roleConfig) {
         if (roleConfig[r]['emojiName'] === reaction._emoji.name) {
            let guildUser = await reaction.message.guild.members.cache.find(m => m.id === user.id);
            let newRole = await reaction.message.guild.roles.cache.find(s => s.id === roleConfig[r]['roleID']);
            if (!newRole) {
               console.log(`Error fetching role for ${roleConfig[r]['emojiName']}`);
               return;
            }
            var errorCheck = false;
            if (type === 'add') {
               guildUser.roles.add(newRole).catch(err => {
                     console.log("err:", err)
                     console.log(`Error adding ${newRole.name} role to user ${user.username}: ${err}`).catch(console.error);
                     errorCheck = true;
                  }).catch(console.error)
                  .then(() => {
                     if (errorCheck !== true) {
                        console.log(`${user.username} added ${newRole.name} role`);
                        reaction.message.channel.send(`${user} has added the ${newRole.name} role.`).catch(console.error)
                           .then(msg => {
                              if (config.roleMessageDeleteSeconds > 0) {
                                 setTimeout(() => msg.delete().catch(err => console.log("Error deleting role message:", err)), (config.roleMessageDeleteSeconds * 1000));
                              }
                           });
                     }
                  });
            } //End of add()
            else {
               guildUser.roles.remove(newRole).catch(err => {
                     console.log(`Error removing ${newRole.name} role to user ${user.username}: ${err}`).catch(console.error);
                     errorCheck = true;
                  }).catch(console.error)
                  .then(() => {
                     if (errorCheck !== true) {
                        console.log(`${user.username} removed ${newRole.name} role`);
                        reaction.message.channel.send(`${user} has removed the ${newRole.name} role.`).catch(console.error)
                           .then(msg => {
                              if (config.roleMessageDeleteSeconds > 0) {
                                 setTimeout(() => msg.delete().catch(err => console.log("Error deleting role message:", err)), (config.roleMessageDeleteSeconds * 1000));
                              }
                           });
                     }
                  });
            } //End of remove()
         } //End of emojiName match
      } //End of r loop
	} //End of roles()
} //End of exports()

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.login(config.botToken);