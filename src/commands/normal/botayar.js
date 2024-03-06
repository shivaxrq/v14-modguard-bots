const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "botayar",
    aliases: ["ayarlar"],
    run: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({ content: "Bu komutu kullanma yetkiniz bulunmamaktadır." });
        }


        const options = [
            { label: "Profil Fotoğrafını Değiştir", value: "change_profile" },
            { label: "Bot Adını Değiştir", value: "change_name" }
        ];


        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("bot_settings")
            .setPlaceholder("</> Güncellemek İstediğiniz Botunuzu Seçin")
            .addOptions(options);


        const restartButton = new ButtonBuilder()
            .setCustomId("restart_button")
            .setLabel("Tüm Botları Yeniden Başlat")
            .setEmoji('1214587227741487146')
            .setStyle(ButtonStyle.Danger);


        const row1 = new ActionRowBuilder().addComponents(selectMenu);
        const row2 = new ActionRowBuilder().addComponents(restartButton);


        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle("Bot Ayarları")
            .setDescription(`<:1654081175228:1213066469236015114> Aşağıda sıralanmakta olan, botların **profil & isim** değişterebilecek bir sistem yapılmıştır \`Seçeneklere\` basarak halledebilirsiniz
            <:71cc34c82052480591774fe9a3ab73e1:1213066483333079060> **Adminlerinizi Belirtsiniz**
            \`\`\`js
               Developed By : @shivaxrq
            \`\`\``);


        const reply = await message.channel.send({ embeds: [embed], components: [row1, row2] });


        const filter = i => i.user.id === message.author.id;
        const collector = reply.createMessageComponentCollector({ filter, time: 300000 }); 

        collector.on("collect", async interaction => {

            const selectedId = interaction.customId;


            if (selectedId === "restart_button") {

                await message.channel.send("Tüm botları yeniden başlatıyorum...");
                process.exit(0); 
            }


            interaction.deferUpdate();
        });

        collector.on("end", collected => {

            if (collected.size === 0) {
                message.channel.send("Toplama işlemi 5 dakika boyunca herhangi bir etkileşim olmaması nedeniyle sonlandırıldı.", { components: [] });
            }
        });
    }
};