const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("banuser")
        .setDescription("Ban user")
        .addStringOption((option) => 
        option
            .setName("user")
            .setDescription("User you wish to ban")
            .setRequired(true)
        )
		.addStringOption((option) => 
		option
            .setName("reason")
            .setDescription("Reason for the ban")
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()] })

        let user = interaction.options.getString("user")
        let reason = interaction.options.getString("reason")

        fetch(`https://authentication.astroz.cc/api/seller/?sellerkey=${c1de4dfa2bd1258381d6750e4371cc6c}&type=banuser&user=${user}&reason=${reason}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).setColor("GREEN").setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })] })
            } else {
                interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })] })
            }
        })
    },
};