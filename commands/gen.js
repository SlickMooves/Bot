const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gen")
        .setDescription("Generate Key")
        .addStringOption((option) => 
        option
            .setName("expiry")
            .setDescription("How many days?")
            .setRequired(false)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
	
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()]})

        let license_mask = await db.get(`licensemask_${idfrom}`)
        if(license_mask === null) license_mask = "xxxx-xxxx";
        
        let days = interaction.options.getString("expiry")
        let level = interaction.options.getString("level")
        let amount = interaction.options.getString("amount")

		if(amount > 20) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle('Failure').addField('Reason:', `You cannot add more than twenty keys at a time.`).setColor("RED").setFooter({ text: "Cryptixed | Miner" }).setTimestamp()]})
		
        if(days) {
			fetch(`https://authentication.astroz.cc/api/seller/?sellerkey=ab8425cabdcfcb84bc9f578ea95f931c&type=add&expiry=${days}&mask=${license_mask}&level=1&amount=1&format=text`)
			.then(res => res.text())
			.then(text => {
				if(!text.includes("message"))
				{
					interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle('Key Generated').addField('Key Generated:', `${text}`).setColor("BLACK").addField('Day(s):', `${days}`).setTimestamp()]})
					db.fetch(`licenseAdd_${idfrom}`)
					db.set(`licenseAdd_${idfrom}`, `{ "days": ${days}, "level": ${level}, "amount": ${amount}}`)
				}
				else
				{
					let json = JSON.parse(text);
					interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "Cryptixed | Miner" }).setTimestamp()]})
				}
			})
		}
		else {
			
			let licenseAdd = await db.get(`licenseAdd_${idfrom}`)
			if(licenseAdd === null) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription(`No config saved for adding licenses yet. Please do a command with paramaters included then this will work.`).setColor("RED").setTimestamp()]})
			licenseAdd = JSON.parse(licenseAdd);
		
			fetch(`https://authentication.astroz.cc/api/seller/?sellerkey=ab8425cabdcfcb84bc9f578ea95f931c&type=add&expiry=${licenseAdd.days}&mask=${license_mask}&level=${licenseAdd.level}&amount=${licenseAdd.amount}&format=text`)
			.then(res => res.text())
			.then(text => {
				if(!text.includes("message"))
				{
					interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle('Key(s) Successfully Added!').addField('Key(s) Added:', `${text}`).setColor("BLACK").addField('Day(s):', `${days}`).setTimestamp()]})
				}
				else
				{
					let json = JSON.parse(text);
					interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "Cryptixed | Miner" }).setTimestamp()]})
				}
			})
		}
    },
};
