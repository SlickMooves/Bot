const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("download")
        .setDescription("Download all keys"),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()], ephemeral: true})
        var keylist = `https://authentication.astroz.cc/api/seller/?sellerkey=${c1de4dfa2bd1258381d6750e4371cc6c}&type=fetchallkeys&format=text`;
					interaction.editReply({
					embeds: [new Discord.MessageEmbed().setAuthor({ name: "KeyAuth Keys" }).setFooter({ text: "KeyAuth Discord Bot" }).setColor("GREEN").setTimestamp()],
					files: [{
						attachment: keylist,
						name: 'keys.txt'
					}],
					ephemeral: true
					})
    },
};
