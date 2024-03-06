const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: "forceban",
  aliases: [],
  cooldown: 0,
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("Bu komutu kullanmak için yeterli izniniz yok.");
    }

    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.reply('Lütfen yasaklamak istediğiniz kullanıcıyı etiketleyin veya ID\'sini belirtin.');

    const banButton = new ButtonBuilder()
      .setCustomId('force_ban')
      .setLabel('Hemen Yasakla')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(banButton);

    const banEmbed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('Kullanıcı Hemen Yasaklama')
      .setDescription(`Kullanıcıyı sunucudan hemen yasaklamak istediğinizden emin misiniz?`)
      .addFields(
        { name: 'Kullanıcı', value: `${user.tag} (${user.id})` }
      );

    message.reply({ embeds: [banEmbed], components: [row] });

    const filter = i => i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'force_ban') {
        await message.guild.members.ban(user.id, { reason: 'Hemen yasaklama komutu ile yasaklandı' })
          .then(() => {
            const successEmbed = new EmbedBuilder()
              .setColor(0x2B2D31)
              .setTitle('Kullanıcı Hemen Yasaklandı')
              .setDescription(`${user.tag} başarıyla sunucudan hemen yasaklandı.`)
              .addFields(
                { name: 'Yasaklanma Tarihi', value: new Date().toLocaleString() },
                { name: 'Yasaklayan', value: message.author.tag }
              );
            message.channel.send({ embeds: [successEmbed] });
          })
          .catch(error => message.channel.send(`Yasaklama sırasında bir hata oluştu: ${error}`));
        i.update({ content: `Kullanıcı başarıyla sunucudan hemen yasaklandı.`, components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        message.reply({ content: 'Buton etkileşimi zaman aşımına uğradı.', components: [] });
      }
    });
  }
};
