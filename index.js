const discord = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { GatewayIntentBits, Partials } = discord;

const fs = require('fs');
require('dotenv').config();
const client = new discord.Client({
  intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.Guilds],
  partials: [Partials.Channel, Partials.Message],
});

client.on('ready', () => {
  client.user.setActivity('League of Legends', { type: 0 });
  console.log('ready');
  const channel = client.channels.cache.get('1177655725149921315');
  joinVoiceChannel({
    channelId: channel.id,
	  guildId: channel.guild.id,
	  adapterCreator: channel.guild.voiceAdapterCreator,
  })
})

client.on('guildMemberAdd', (member) => {
  const guild = client.guilds.cache.get('1177655724701143040')
  guild.channels.cache.get('1177702132099584122').setName('Počet členů: '+guild.memberCount)
})

client.on('guildMemberRemove', (member) => {
  const guild = client.guilds.cache.get('1177655724701143040')
  guild.channels.cache.get('1177702132099584122').setName('Počet členů: '+guild.memberCount)
})

const prefix = "!";

client.on('messageCreate', async (message) => {
  if(message.author.bot) return;

  if(!message.guild) {
    if(message.content.includes(prefix)) {
      const text = message.content.split(prefix)[1];
      const channel = message.content.split(prefix)[0];
      if(channel && client.channels.cache.get(channel)) return client.channels.cache.get(channel).send(text);
      client.channels.cache.get('1162697308933210112').send(text);
    }
    return;
  }

  if(message.content.toLowerCase().includes('kys')) {
    if(message.member.id == '569599819014733856') message.channel.send('ok')
    else message.channel.send('mad?')
  } else if(message.content.toLowerCase() == 'bomba') {
    message.react('🤰')
    message.react('👶🏿')
  }

  if(message.content.startsWith(prefix+'nuke')) {
    const { channel } = message;

    function failmsg(text, message) {
      message.channel.send(text)
    }

    if(!message.member.permissions.has('ManageMessages')) return failmsg('Nemůžeš :)', message);
    if(!message.guild.members.cache.get(client.id).permissions.has('ManageMessages')) return failmsg('Ti komunisti mi nedali práva :(', message);

    let count = message.content.split(' ')[1]
    if(isNaN(count)) return;
    count = parseInt(count);
    if(!count) return failmsg('Napiš za to kolik zpráv chceš smazat', message);
    if(count > 99) return failmsg('Tolik zpráv fakt nesmažu', message);

    channel.send('bomba letí').then(msg => {
      setTimeout(() => {
        channel.bulkDelete(count+2);
      }, 500)
    })
  }

  if(message.content.startsWith(prefix+'random')) {
    const rndArr = [];
    // for(let i = 0; i < 10; i++) {
    //   rndArr.push(Math.ceil(Math.random() * 6));
    // }

    const count = message.content.split(' ')[1] || 6;
    if(count > 1000000) return message.reply('moc velké číslo sorry')

    let rnd = Math.ceil(Math.random() * parseInt(count) || 6);
    if(rnd == 0) rnd = 1;
    message.reply(rnd.toString());
  }

  if(message.content.startsWith(prefix+'say')) {
    return message.reply('Napiš mi do DMs ve stylu \`\`\`ID kanálu kde zprávu poslat (nemusíš psát, pokud to chceš poslat do commandů na besedu)!zpráva, kterou chceš abych napsal\`\`\`', { ephemeral: true })
  }
})

client.login(process.env.TOKEN);
