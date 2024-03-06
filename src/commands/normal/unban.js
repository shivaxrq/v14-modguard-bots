const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "unban",
  aliases: [],
  cooldown: 0,
  run: async (client, message, args) => {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.reply("Bu komutu kullanmak için yeterli izniniz yok.");
    }

    const user = await client.users.fetch(args[0]);
    if (!user) return message.reply('Lütfen yasağını kaldırmak istediğiniz kullanıcının ID\'sini belirtin.');

    const unbanButton = new ButtonBuilder()
      .setCustomId('unban_yes')
      .setLabel('Evet')
      .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
      .setCustomId('unban_no')
      .setLabel('Hayır')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(unbanButton).addComponents(cancelButton);

    const unbanEmbed = new EmbedBuilder()
    .setColor(0x2B2D31)
      .setTitle('Kullanıcı Yasak Kaldırma')
      .setDescription(`Kullanıcının yasağını kaldırmak istediğinizden emin misiniz?`)
      .addFields(
        { name: 'Kullanıcı', value: `${user.tag} (${user.id})` }
      );

    message.reply({ embeds: [unbanEmbed], components: [row] });

    const filter = i => i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'unban_yes') {
        await message.guild.bans.remove(user.id)
          .then(() => {
            const successEmbed = new EmbedBuilder()
            .setColor(0x2B2D31)
              .setTitle('Kullanıcı Yasak Kaldırıldı')
              .setDescription(`${user.tag} adlı kullanıcının yasağı başarıyla kaldırıldı.`)
              .addFields(
                { name: 'Yasağı Kaldırma Tarihi', value: new Date().toLocaleString() },
                { name: 'Kaldıran', value: message.author.tag }
              );
            message.channel.send({ embeds: [successEmbed] });
          })
          .catch(error => message.channel.send(`Yasak kaldırma sırasında bir hata oluştu: ${error}`));
        i.update({ content: `Kullanıcının yasağı başarıyla kaldırıldı.`, components: [] });
      }
      else if (i.customId === 'unban_no') {
        i.update({ content: `Yasak kaldırma işlemi iptal edildi.`, components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        message.reply({ content: 'Buton etkileşimi zaman aşımına uğradı.', components: [] });
      }
    });
  }
};
