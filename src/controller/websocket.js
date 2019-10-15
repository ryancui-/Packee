const Base = require('./base.js');

module.exports = class extends Base {
  async openAction() {
    console.log('open a webscoket');
    this.emit('opend', '啦啦啦啦啦');
  }

  async closeAction() {
    console.log('close a webscoket');
  }

  async addUserAction() {
    console.log('获取客户端 addUser 事件发送的数据', this.wsData);
    // console.log('获取当前 WebSocket 对象', this.websocket);
    console.log('判断当前请求是否是 WebSocket 请求', this.isWebsocket);
  }
};
