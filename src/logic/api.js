module.exports = class extends think.Logic {
  loginAction() {
    this.allowMethods = 'post'
  }

  logoutAction() {
    this.allowMethods = 'post'
  }
}
