const { WebcastPushConnection } = require("tiktok-live-connector")

/**
* @callback OnChatCallback
* @param {{user: import("./Types").TiktokUser, chat: string}} data
*/

/**
* @callback OnLikeCallback
* @param {{likeCount: string}} data
*/

/**
* @callback OnJoinCallback
* @param {{username: string}} data
*/

class TiktokConnection {

  /** @type { WebcastPushConnection } */
  #tiktokLiveConnection

  /** @type { boolean } */
  #connected = false

  /** @param {string} id */
  constructor(id) {
    this.#tiktokLiveConnection = new WebcastPushConnection(id)
    this.#tiktokLiveConnection.on('connected', data => {
      console.info(`TiktokConnection Connected to live room ${data.roomInfo.owner.nickname} [${data.roomInfo.title}]`)
      this.#connected = true
    })

    this.#tiktokLiveConnection.on('error', data => {
      console.error("TiktokConnection error")
    })
  }

  connect() {
    this.#tiktokLiveConnection.connect()
  }

  /**
  * @param {OnChatCallback} callback
  */
  onChat(callback) {
    this.#tiktokLiveConnection.on('chat', data => {
      if (!this.#connected) return
      callback(
        {
          chat: data.comment,
          user: {
            username: data.nickname,
            imageUrl: data.profilePictureUrl
          }
        })
    })
  }

  /**
  * @param {OnLikeCallback} callback 
  */
  onLike(callback) {
    this.#tiktokLiveConnection.on('like', data => {
      callback({ likeCount: data.likeCount })
    })
  }

  /**
  * @param {OnJoinCallback} callback
  */
  onJoin(callback) {
    this.#tiktokLiveConnection.on('member', data => {
      callback({ username: data.nickname })
    })
  }
}

module.exports = {
  TiktokConnection,
}
