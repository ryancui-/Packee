const Base = require('./base.js')
const { websockets } = require('../model/socket')

module.exports = class extends Base {
  async openAction() {
    websockets.push(this.websocket)
    console.log(websockets.length)
  }

  async closeAction() {
    console.log('close a webscoket')
    websockets.splice(websockets.findIndex(_ => _ === this.websocket), 1)
    console.log(websockets.length)
  }
}
