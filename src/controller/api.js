const Base = require('./base.js');

module.exports = class extends Base {
  initAction() {
    const repo = this.post('repo');
    console.log(repo);
    return this.success();
  }
};
