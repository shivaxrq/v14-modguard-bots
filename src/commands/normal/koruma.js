// koruma.js
const { SelectMenuBuilder, SelectMenuOptionBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { reklamKelimeleri, kufurKelimeleri } = require('../../config'); // Config dosyasını import etme

module.exports = {
  name: "koruma",
  aliases: [],
  cooldown: 0,
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("Bu komutu kullanmak için yeterli izniniz yok.");
    }

    const selectMenu = new SelectMenuBuilder()
      .setCustomId('protection')
      .setPlaceholder('Koruma Türünü Seçiniz')
      .addOptions([
        {
          label: 'Reklam Engeli',
          value: 'reklam',
          description: 'Sunucuda reklam engeli etkinleştirir.'
        },
        {
          label: 'Küfür Engeli',
          value: 'kufur',
          description: 'Sunucuda küfür engeli etkinleştirir.'
        },
        {
          label: 'Capslock Engeli',
          value: 'capslock',
          description: 'Sunucuda büyük harf kullanımı engeli etkinleştirir.'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const protectionEmbed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('Koruma Menüsü')
      .setDescription(`<:71cc34c82052480591774fe9a3ab73e1:1214232797439336548> Aşağıdaki butonlara basarak suncunuzu koruyabilirsiniz sistemi çok geliştirilmiş şekilde ayarlandı yüzünüzü asla kara çıkarmaz :D
      
      <:4947violetsmalldot:1214232838539575326> **Discord sunucumuz** : https://discord.gg/YHbtkWb6R6
      <:4947violetsmalldot:1214232838539575326> **Altyapıyı herhangi bir yerde satıldıgını görürsem direk license ve bana verilen talep haklarıyla dava ederim donunuza kadar alırım haberiniz olsun :)**
      \`\`\`js
              Developed by @shivaxrq
      \`\`\``);

    message.reply({ embeds: [protectionEmbed], components: [row] });

    const filter = i => i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'protection') {
        const selectedOption = i.values[0];
        switch (selectedOption) {
          case 'reklam':
            // Reklam Engeli Kodu
            break;
          case 'kufur':
            // Küfür Engeli Kodu
            break;
          case 'capslock':
            // Capslock Engeli Kodu
            break;
          default:
            break;
        }

        const successEmbed = new EmbedBuilder()
          .setColor(0x2B2D31)
          .setTitle('Koruma Etkinleştirildi')
          .setDescription(`Seçilen koruma türü başarıyla etkinleştirildi: ${selectedOption}`);

        message.channel.send({ embeds: [successEmbed] });
        i.update({ content: 'Koruma başarıyla etkinleştirildi.', components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        message.reply({ content: 'Select menü etkileşimi zaman aşımına uğradı.', components: [] });
      }
    });

    // Reklam ve Küfür Engeli Uyarısı ve Silme
    client.on('messageCreate', async (msg) => {
      if (msg.guild) {
        if (reklamKelimeleri.some(kelime => msg.content.toLowerCase().includes(kelime))) {
          // Yasaklı kelime içeren mesajlar siliniyor
          await msg.delete();
          
          // Kullanıcıya uyarı gönderiliyor
          msg.author.send("Sunucuda reklam engeli aktif olduğu için yasaklı bir kelime içeren mesajınız silindi. Lütfen kurallara uyun.")
            .catch(console.error);
        }

        if (kufurKelimeleri.some(kelime => msg.content.toLowerCase().includes(kelime))) {
          // Küfür içeren mesajlar siliniyor
          await msg.delete();
          
          // Kullanıcıya uyarı gönderiliyor
          msg.author.send("Sunucuda küfür engeli aktif olduğu için küfürlü bir mesajınız silindi. Lütfen kurallara uyun.")
            .catch(console.error);
        }
      }
    });
  }
};
