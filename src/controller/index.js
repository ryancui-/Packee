const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display('packee-web/dist/index.html');
  }
};
