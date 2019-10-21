// invoked in master
const fse = require('fs-extra')

think.beforeStartServer(() => {
  return fse.ensureDir(think.config('projectRoot'))
})
