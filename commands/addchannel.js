const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addchannel")
        .setDescription("Add chat channel")
        .addStringOption((option) => 
        option
            .setName("name")
            .setDescription("Chat channel name")
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("delay")
            .setDescription("Chat channel delay (how often user can send messages in seconds)")
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()], ephemeral: true})

        let name = interaction.options.getString("name")
        let delay = interaction.options.getString("delay")

        fetch(`https://authentication.astroz.cc/api/seller/?sellerkey=${c1de4dfa2bd1258381d6750e4371cc6c}&type=addchannel&name=${name}&delay=${delay}`)
        .then(res => res.json())
        .then(json => {
			if (json.success) {
				interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).setColor("GREEN").setTimestamp()], ephemeral: true})
			} else {
                interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            }
        })
    },
};