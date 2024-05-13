const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { MGBAKeys } = require('./MgbaKeys')

class UiServer {
  #app = express()
  #httpServer = createServer(this.#app)
  #batterySocket
  #speakerSocket
  #gbaInputViewerSocket
  #socketIo = new Server(this.#httpServer, {
    cors: {
      origin: '*'
    }
  })

  constructor() {
    this.#app.use(express.static('public'))
    this.#socketIo.on('connection', socket => {
      socket.on('register', (type) => {
        switch (type) {
          case "battery":
            console.info("Battery socket registered")
            this.#batterySocket = socket
            socket.on('disconnect', () => {
              console.info("Battery socket disconnected")
              this.#batterySocket = undefined
            })
            break
          case "speaker":
            console.info("Speaker socket registered")
            this.#speakerSocket = socket
            socket.on('disconnect', () => {
              console.info("Speaker socket disconnected")
              this.#speakerSocket = undefined
            })
            break
          case "gbainputviewer":
            console.info("GBA input viewer socket registered")
            this.#gbaInputViewerSocket = socket
            socket.on('disconnect', () => {
              console.info("GBA input viewer socket disconnected")
              this.#gbaInputViewerSocket = undefined
            })
            break
        }
      })
    })
  }

  serve() {
    let port = 4000
    this.#httpServer.listen(port)
    console.info('Ui server running at http://localhost:' + port)
  }

  /** @param {number} amount */
  updateBattery(amount) {
    if (this.#batterySocket === undefined) return
    this.#batterySocket.emit("setamount", amount)
  }

  /** @param {string} toSpeak */
  speak(toSpeak) {
    if (this.#speakerSocket === undefined) return
    this.#speakerSocket.emit("speak", toSpeak)
  }

  /** 
  * @param {MGBAKeys} key 
  * @param {boolean} isPress
  * @param {string} imageUrl
  */
  updateGbaInputViewer(key, isPress, imageUrl) {
    if (this.#gbaInputViewerSocket === undefined) return
    this.#gbaInputViewerSocket.emit(
      "updateinput",
      {
        key: key,
        isPress: isPress,
        imageUrl: imageUrl
      })
  }
}

module.exports = UiServer
