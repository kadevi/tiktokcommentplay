const net = require("net")
const { randomUUID } = require("crypto")
const { delay } = require("./util")
const UiServer = require("./UiServer")

class FceuxServer {
  /** @type { net.Socket } */
  #socket

  serve() {
    const netServer = net.createServer(socket => {
      console.info("Fceux connected")
      this.#socket = socket
      socket.on('close', err => {
        this.#socket = undefined
        console.info("Fceux disconnected")
      })
    })
    netServer.listen(3000, () => {
      console.info("Fceux server running on", netServer.address())
    })
  }

  #send(msg) {
    if (this.#socket === undefined) return
    this.#socket.write(msg)
  }

  
  /**
  * @param {import("./Types").TiktokUser} user
  * @param {string[]} commands lowercased 
  * @returns { boolean } wether commands is processed or ignored
  */
  processCommands(user, commands) {
    let keyToPress = []
    if (commands.length === 1) {
      let command = commands[0]
      switch (command) {
        case 'haduken':
          this.#send("haduken")
          break;
        case 'shoryuken':
          this.#send("shoryuken")
          break;
      }
    } 
    // if (commands.length === 2) {
    //   let key = KeyMap.get(commands[0])
    //   let pressTime = parseInt(commands[1])
    //   if (key !== undefined && !isNaN(pressTime) && pressTime > 0 && pressTime <= 10) {
    //     this.#press([key], pressTime * 1000, user.imageUrl)
    //     return true
    //   }
    // }
    // for (const command of commands) {
    //   let key = KeyMap.get(command)
    //   if (key === undefined) {
    //     return false
    //   } else {
    //     keyToPress.push(key)
    //   }
    // }
    // this.#press(keyToPress, undefined, user.imageUrl)
    return true
  }
}

module.exports = FceuxServer
