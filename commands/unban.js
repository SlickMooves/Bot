const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban license key")
        .addStringOption((option) => 
        option
            .setName("key")
            .setDescription("Key you wish to unban")
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

        let key = interaction.options.getString("key")

        fetch(`https://authentication.astroz.cc/api/seller/?sellerkey=ab8425cabdcfcb84bc9f578ea95f931c&type=unban&key=${key}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).setColor("BLACK").setTimestamp().setFooter({ text: "Cryptixed | Miner" })], })
            } else {
                interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Error`).setColor("RED").setTimestamp().setFooter({ text: "Cryptixed | Miner" })], })
            }
        })
    },
};