module.exports = function (message, args, client) {
  client.DisTube.play(message.member.voice.channel, args.join(" "), {
    member: message.member,
    textChannel: message.channel,
    message
  })

  client.DisTube.on("playSong", (queue, song) => {
    queue.textChannel.send("Playing "+song.name);
  })
}