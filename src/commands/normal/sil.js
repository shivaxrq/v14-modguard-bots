const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'sil',
    description: 'Belirli miktarda mesajı silmek için butonlar içeren bir paneli açar.',
    run: async (client, message, args) => {
        const deleteButton25 = new ButtonBuilder()
            .setCustomId('delete25')
            .setLabel('25')
            .setStyle(ButtonStyle.Danger);

        const deleteButton40 = new ButtonBuilder()
            .setCustomId('delete40')
            .setLabel('40')
            .setStyle(ButtonStyle.Danger);

        const deleteButton80 = new ButtonBuilder()
            .setCustomId('delete80')
            .setLabel('80')
            .setStyle(ButtonStyle.Danger);

        const deleteButton100 = new ButtonBuilder()
            .setCustomId('delete100')
            .setLabel('100')
            .setStyle(ButtonStyle.Danger);

        const actionRow = new ActionRowBuilder().addComponents(
            deleteButton25,
            deleteButton40,
            deleteButton80,
            deleteButton100
        );

        message.channel.send({ content: 'Belirli miktarda mesajı silmek için bir seçenek seçin:', components: [actionRow] });

        const collector = message.channel.createMessageComponentCollector();

        collector.on('collect', async (interaction) => {
            let amount = 0;
            if (interaction.customId === 'delete25') {
                amount = 25;
            } else if (interaction.customId === 'delete40') {
                amount = 40;
            } else if (interaction.customId === 'delete80') {
                amount = 80;
            } else if (interaction.customId === 'delete100') {
                amount = 100;
            }

            if (amount > 0) {
                message.channel.bulkDelete(amount, true)
                    .then(messages => {
                        interaction.reply(`Başarıyla ${messages.size} mesaj silindi.`);
                    })
                    .catch(error => {
                        console.error('Mesajları silerken bir hata oluştu:', error);
                        interaction.reply('Mesajları silerken bir hata oluştu.');
                    });
            } else {
                interaction.reply('Geçersiz bir seçenek seçtiniz.');
            }
        });
    },
};
