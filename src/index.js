const token = process.env.token
const Discord = require('discord.js');
const express = require('express')
const app = express()
app.get('/', (req, res) => {
res.status(200);
})
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { EmbedBuilder } = require('discord.js');
const rbx = require('noblox.js');
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('a contest for the messiest code', { type: 'COMPETING' });
})


const commands = [
	new SlashCommandBuilder().setName('traceback').setDescription('get the discord traceback').addStringOption(option =>
		option.setName('id')
			.setDescription('discord id')
			.setRequired(true))
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);
rest.put(Routes.applicationCommands(''), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

client.on('interactionCreate', async (interaction) => {
    const functions = require('./functions');
	if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;
    if (!commandName === 'traceback') return
        const id = interaction.options.getString('id');
        const roverUser = await functions.getRoverUser(id);
        const bloxlinkUser = await functions.getBloxlinkUser(id);
        const avatarUrl = await functions.getUserAvatarUrl(bloxlinkUser.user.primaryAccount);
        let d 
        try { d=await client.users.fetch(id);
        } catch (e) {
            return interaction.reply('User not found');
        }
    let userna
        if (bloxlinkUser.user.primaryAccount > 0) {
            userna = await rbx.getUsernameFromId(bloxlinkUser.user.primaryAccount)
        } else {
            userna = 'Unknown'
        }
        if (d.bot) return interaction.reply('Bots are not allowed');
        const embed = new EmbedBuilder()
        embed.setTitle(d.username + "'s profile")
        if (bloxlinkUser.user.primaryAccount > 0) {
        embed.setURL('https://roblox.com/users/' + bloxlinkUser.user.primaryAccount + '/profile')
        } else {
            embed.setURL('https://roblox.com/users/' + roverUser.robloxId + '/profile')
        }
        embed.setThumbnail(avatarUrl)
        embed.addFields({ name: 'Rover', value: roverUser.robloxUsername}, { name: 'Bloxlink', value: userna ?? 'Unknown' })
        embed.setTimestamp()
        embed.setColor('#0099ff');
        interaction.reply({ embeds: [embed] });
    
    
})
client.login(token);
app.listen(1288)
