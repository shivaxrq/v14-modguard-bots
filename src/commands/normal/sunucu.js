const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageEmbed, Permissions, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "sunucu",
    aliases: [],
    run: async (client, message, args) => {
        // Eğer kullanıcı yönetici yetkisine sahip değilse komutu kullanmayı engelle
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({ content: "Bu komutu kullanma yetkiniz bulunmamaktadır." });
        }

        // Butonları oluştur
        const changeImageButton = new ButtonBuilder()
            .setCustomId('change_image_button')
            .setLabel('Sunucu Resmi Değiştir')
            .setStyle(ButtonStyle.Primary);

        const changeNameButton = new ButtonBuilder()
            .setCustomId('change_name_button')
            .setLabel('Sunucu İsmi Değiştir')
            .setStyle(ButtonStyle.Secondary);

        // Butonları bir ActionRow'a yerleştir
        const row = new ActionRowBuilder()
            .addComponents(changeImageButton, changeNameButton);

        // Gömülü mesaj oluştur
        const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
            .setTitle('Sunucu Ayarları')
            .setDescription('Sunucu ayarlarını değiştirmek için aşağıdaki butonlardan birini seçin.');

        // Mesajı gönder
        const reply = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === message.author.id;

        const collector = reply.createMessageComponentCollector({
            filter,
            time: 15000
        });

        collector.on('collect', async i => {
            if (i.customId === 'change_image_button') {
                // Sunucu resmini değiştir
                // Kullanıcıdan resim iste, belirli bir süre içinde cevap vermezse iptal et
                const imageFilter = m => m.author.id === message.author.id && m.attachments.size > 0;
                const imageCollector = message.channel.createMessageCollector({
                    filter: imageFilter,
                    time: 30000, // 30 saniye
                    max: 1
                });

                message.channel.send("Lütfen sunucuya koymak istediğiniz profil resmini gönderin.");

                imageCollector.on('collect', async m => {
                    const attachment = m.attachments.first();
                    const imageUrl = attachment.url;

                    // Sunucu resmini değiştir
                    await message.guild.setIcon(imageUrl);

                    message.channel.send("Sunucu resmi başarıyla değiştirildi.");
                });

                imageCollector.on('end', collected => {
                    if (collected.size === 0) {
                        message.channel.send("Zaman aşımına uğradı, sunucu resmi değiştirme işlemi iptal edildi.");
                    }
                });
            } else if (i.customId === 'change_name_button') {
                // Sunucu ismini değiştir
                message.channel.send("Lütfen sunucunun yeni ismini yazın.");

                const nameFilter = m => m.author.id === message.author.id;
                const nameCollector = message.channel.createMessageCollector({
                    filter: nameFilter,
                    time: 30000, // 30 saniye
                    max: 1
                });

                nameCollector.on('collect', async m => {
                    const newName = m.content;

                    // Sunucu ismini değiştir
                    await message.guild.setName(newName);

                    message.channel.send("Sunucu ismi başarıyla değiştirildi.");
                });

                nameCollector.on('end', collected => {
                    if (collected.size === 0) {
                        message.channel.send("Zaman aşımına uğradı, sunucu ismi değiştirme işlemi iptal edildi.");
                    }
                });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0)
                message.reply({ content: 'İşlem zaman aşımına uğradı, lütfen tekrar deneyin.', components: [] });
        });
    }
};