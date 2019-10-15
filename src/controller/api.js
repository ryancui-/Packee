const Base = require('./base.js')
// const path = require('path')
// const fork = require('child_process').fork

// function initRepoWorker(payload) {
//   return new Promise(resolve => {
//     const worker = fork(path.join(__dirname, '../task/initRepo.js'))
//     worker.on('message', payload => {
//       switch (payload.type) {
//         case 'processing':
//           console.log(payload.data)
//           break
//         case 'error':
//           resolve({ success: false })
//           break
//         case 'finish':
//           resolve({ success: payload.data })
//           break
//       }
//     })
//     worker.send(payload)
//   })
// }

module.exports = class extends Base {
  async __before() {
    if (this.ctx.url === '/api/login' || this.ctx.url === '/api/logout') {
      return true
    }

    const userInfo = await this.session('auth')
    // 获取用户的 session 信息，如果为空，返回 false 阻止后续的行为继续执行
    if (think.isEmpty(userInfo)) {
      this.fail('no auth')
      return false
    }
    return true
  }

  async loginAction() {
    const token = this.post('token')
    if (token === this.config('authToken')) {
      const userInfo = { name: '小伙子' }
      await this.session('auth', userInfo)
      return this.success(userInfo)
    } else {
      return this.fail('error token')
    }
  }

  async logoutAction() {
    await this.session(null)
    return this.success()
  }

  async checkLoginAction() {
    return this.success()
  }
}
