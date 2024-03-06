const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "ban",
  aliases: [],
  cooldown: 0,
  run: async (client, message, args) => {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.reply("Bu komutu kullanmak için yeterli izniniz yok.");
    }

    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.reply('Lütfen yasaklamak istediğiniz kullanıcıyı etiketleyin veya ID\'sini belirtin.');

    const banButton = new ButtonBuilder()
      .setCustomId('ban_yes')
      .setLabel('Evet')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('ban_no')
      .setLabel('Hayır')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(banButton).addComponents(cancelButton);

    const banEmbed = new EmbedBuilder()
    .setColor(0x2B2D31)
      .setTitle('Kullanıcı Yasaklama')
      .setDescription(`Kullanıcıyı yasaklamak istediğinizden emin misiniz?`)
      .addFields(
        { name: 'Kullanıcı', value: `${user.tag} (${user.id})` }
      );

    message.reply({ embeds: [banEmbed], components: [row] });

    const filter = i => i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'ban_yes') {
        await message.guild.members.ban(user.id, { reason: 'Yasaklama komutu ile yasaklandı' })
          .then(() => {
            const successEmbed = new EmbedBuilder()
            .setColor(0x2B2D31)
              .setTitle('Kullanıcı Yasaklandı')
              .setDescription(`${user.tag} başarıyla yasaklandı.`)
              .addFields(
                { name: 'Yasaklanma Tarihi', value: new Date().toLocaleString() },
                { name: 'Yasaklayan', value: message.author.tag }
              );
          })
          .catch(error => message.channel.send(`Yasaklama sırasında bir hata oluştu: ${error}`));
        i.update({ content: `Kullanıcı başarıyla yasaklandı.`, components: [] });
      }
      else if (i.customId === 'ban_no') {
        i.update({ content: `Yasaklama işlemi iptal edildi.`, components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        message.reply({ content: 'Buton etkileşimi zaman aşımına uğradı.', components: [] });
      }
    });
  }
};
