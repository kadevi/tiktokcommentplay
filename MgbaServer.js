const net = require("net")
const { randomUUID } = require("crypto")
const { delay } = require("./util")
const UiServer = require("./UiServer")
const { MGBAKeys } = require("./MgbaKeys")

/** @type {Map<string, MGBAKeys} */
const KeyMap = new Map([
  ["aa", MGBAKeys.A],
  ["bb", MGBAKeys.B],
  ["se", MGBAKeys.Select],
  ["st", MGBAKeys.Start],
  ["ka", MGBAKeys.Kanan],
  ["ki", MGBAKeys.Kiri],
  ["at", MGBAKeys.Atas],
  ["ba", MGBAKeys.Bawah],
  ["rr", MGBAKeys.R],
  ["ll", MGBAKeys.L],
])

class MgbaServer {
  /** @type { net.Socket } */
  #socket

  /** @type { UiServer } */
  #uiServer

  #isPressing = false

  /**
  * @param {UiServer} uiServer 
  */
  constructor(uiServer) {
    this.#uiServer = uiServer
  }

  serve() {
    let netServer = net.createServer(socket => {
      console.info("Mgba connected")
      this.#socket = socket
      socket.on('close', err => {
        this.#socket = undefined
        console.info("Mgba disconnected")
      })
    })
    netServer.listen(3000, () => {
      console.info("Mgba server running on", netServer.address())
    })
  }

  /**
  * @param {import("./Types").TiktokUser} user
  * @param {string[]} commands lowercased 
  * @returns { boolean } wether commands is processed or ignored
  */
  processCommands(user, commands) {
    let keyToPress = []
    if (commands.length === 2) {
      let key = KeyMap.get(commands[0])
      let pressTime = parseInt(commands[1])
      if (key !== undefined && !isNaN(pressTime) && pressTime > 0 && pressTime <= 10) {
        this.#press([key], pressTime * 1000, user.imageUrl)
        return true
      }
    }
    for (const command of commands) {
      let key = KeyMap.get(command)
      if (key === undefined) {
        return false
      } else {
        keyToPress.push(key)
      }
    }
    this.#press(keyToPress, undefined, user.imageUrl)
    return true
  }

  async #press(keys, pressTime, imageUrl) {
    if (this.#isPressing || this.#socket === undefined) return
    this.#isPressing = true
    for (const key of keys) {
      this.#socket.write('1 ' + key)
      this.#uiServer.updateGbaInputViewer(key, true, imageUrl)
      await delay(pressTime ?? 100)
      this.#socket.write('0 ' + key)
      this.#uiServer.updateGbaInputViewer(key, false, imageUrl)
      await delay(300)
    }
    this.#isPressing = false
  }
}

module.exports = MgbaServer
