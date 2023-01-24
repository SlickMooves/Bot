const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetuser")
        .setDescription("Reset a user")
        .addStringOption((option) => 
        option
            .setName("username")
            .setDescription("Specify username")
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

        let un = interaction.options.getString("username")
        
        fetch(`https://authentication.astroz.cc/api/seller/?sellerkey=ab8425cabdcfcb84bc9f578ea95f931c&type=resetuser&user=${un}`)
        .then(res => res.json())
        .then(json => {
        if(json.success)
        {
            interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle('User Successfully Reset!').addField('Username:', `\`${un}\``).setColor("BLACK").setTimestamp()], })
        }
        else
        {
            interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Error`).setColor("RED").setTimestamp().setFooter({ text: "Cryptixed | Miner" })], })
        }
        })
    },
};