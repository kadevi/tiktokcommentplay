const { TiktokConnection } = require("./TiktokConnection")
const MgbaServer = require("./MgbaServer")
const UiServer = require("./UiServer")
const readline = require('readline')
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output })
const uiServer = new UiServer()
const mgbaServer = new MgbaServer(uiServer)
const tiktokConnection = new TiktokConnection("k...dev")

let battery = 100

/** @type { import("./TiktokConnection").OnChatCallback } */
function onChatCallback(data) {
  if (battery <= 0) {
    uiServer.speak("Batre habis, tap tap untuk mengisi batre")
    return
  }
  uiServer.speak(data.chat)
  let commands = data.chat.toLowerCase().split(" ")
  mgbaServer.processCommands(data.user, commands)
}

/** @type { import("./TiktokConnection").OnLikeCallback } */
function onLikeCallback(data) {
  uiServer.flyAvatar('like', data.user.imageUrl)
  battery += data.likeCount / 2
  if (battery >= 100) battery = 101
  tickBattery()
}

/** @type { import("./TiktokConnection").OnJoinCallback } */
function onJoinCallback(data) {
  uiServer.speak(`Halo. Selamat datang ${data.username}. mainin aku dhong!`)
}

function tickBattery() {
  if (battery <= 0) return
  battery -= 1
  if (battery < 0) battery = 0
  else if (battery > 100) battery = 100
  uiServer.updateBattery(battery.toFixed(1))
}

mgbaServer.serve()
uiServer.serve()

tiktokConnection.onLike(onLikeCallback)
tiktokConnection.onChat(onChatCallback)
tiktokConnection.onJoin(onJoinCallback)

setInterval(tickBattery, 5000)

rl.on('line', line => {
  const lineSep = line.split(";")
  if (lineSep.length !== 2) return
  const [command, text] = lineSep
  let user = {
    id: "k...dev",
    username: "KDV",
    imageUrl: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/e6d990c727767fbc4cfb69d05976a732~c5_100x100.jpeg?lk3s=a5d48078&nonce=63711&refresh_token=845b9ec06a7205a239234d1414346113&x-expires=1716076800&x-signature=zwb4mGo9%2FV2uE8dGOqUGE8kGEas%3D&shp=a5d48078&shcp=81f88b70"
  }
  if (command === 'chat') {
    onChatCallback({
      user: user,
      chat: text
    })
  } else if (command === 'like') {
    onLikeCallback({
      user: user,
      likeCount: parseInt(text)
    })
  } else if (command === 'connect' && text === 'tiktok') {
    tiktokConnection.connect()
  }
})
