const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Info On key")
        .addStringOption((option) => 
        option
            .setName("license")
            .setDescription("Specify key")
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()], })

        let key = interaction.options.getString("license")
        let hwid;
        let ip;

        fetch(`https://authentication.astroz.cc/api/seller/?sellerkey=ab8425cabdcfcb84bc9f578ea95f931c&type=info&key=${key}`)
        .then(res => res.json())
        .then(json => {
            if (!json.success) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Error`).setColor("RED").setTimestamp().setFooter({ text: "Cryptixed | Miner" })], })
            if (json.hwid == null) { hwid == null} else { }
            if (json.ip == null) { ip == null} else { }
            interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(`Key Information for ${key}`).addField('Expiry:', `${json['expiry']}`).addField('Last Login:', `${json['lastlogin']}`).addField('HWID:', `${hwid}`).addField('Status:', `${json['status']}`).addField('Level:', `${json['level']}`).addField('Created By:', `${json['createdby']}`).addField('Created On:', `${json['creationdate']}`).addField('IP Address:', `${ip}`).setColor("BLACK").setTimestamp()], })
        })
    },
};