// 直接使用 lowdb 进行数据存储
const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(path.join(think.ROOT_PATH, 'runtime/db.json'))
const db = low(adapter)

db.defaults({
  projects: [],
  tasks: []
}).write()

module.exports = db
