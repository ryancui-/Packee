const Base = require('./base.js')
const db = require('../model')
const shortid = require('shortid')
const path = require('path')
const spawn = require('child_process').spawn
const fse = require('fs-extra')
const { runningTasks, broadcastProcessing, broadcastDone } = require('../model/socket')

function runAsyncTask(payload) {
  const { projectId, taskId, type, bash, cwd } = payload
  const currentRunningTaskIndex = runningTasks.findIndex(_ => _.projecId === projectId)
  if (currentRunningTaskIndex !== -1) {
    return false
  }

  let childProcess = null
  if (type === 'start') {
    childProcess = spawn('sh', ['-c', `${bash}`], { cwd })
    childProcess.stdout.on('data', data => {
      broadcastProcessing(projectId, taskId, `${data}`)
    })
    childProcess.stderr.on('data', data => {
      broadcastProcessing(projectId, taskId, `${data}`)
    })
    childProcess.on('exit', code => {
      broadcastDone(projectId, taskId, code)
    })
    childProcess.on('error', (err) => {
      // TODO: error 要看看怎么处理
      console.log(err)
    })
  } else if (type === 'stop' && childProcess) {
    childProcess.kill('SIGHUP')
  }

  runningTasks.push({ projectId, taskId, worker: childProcess, msg: '', start: Date.now() })
  return true
}

module.exports = class extends Base {
  async __before() {
    if (this.ctx.url === '/api/login' || this.ctx.url === '/api/logout') {
      return true
    }

    const userInfo = await this.session('auth')
    // 获取用户的 session 信息，如果为空，返回 false 阻止后续的行为继续执行
    if (think.isEmpty(userInfo)) {
      this.fail(1001, 'no auth')
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
    const userInfo = await this.session('auth')
    return this.success(userInfo)
  }

  // 新建项目
  async createProjectAction() {
    const project = this.post()
    const exists = db.get('projects')
      .find({ name: project.name })
      .value()
    if (exists) {
      return this.fail('存在同名 project')
    }

    await fse.ensureDir(path.join(this.config('projectRoot'), project.name))

    const projectId = shortid.generate()
    db.get('projects')
      .push(Object.assign({}, project, { id: projectId }))
      .write()
    return this.success(projectId)
  }

  // 修改项目
  async updateProjectAction() {
    const project = this.post()
    db.get('projects')
      .find({ id: project.id })
      .assign(project)
      .write()
    return this.success()
  }

  // 列出项目
  async listProjectAction() {
    const projects = db.get('projects').value()
    return this.success(projects)
  }

  // 运行异步 Task
  async runTaskAction() {
    const projectId = this.post('projectId')
    const params = JSON.parse(this.post('params'))

    const taskId = shortid.generate()
    const project = db.get('projects')
      .find({ id: projectId })
      .value()
    let bash = project.shell

    // 将 bash 中的变量替换掉，嘻嘻
    params.forEach(({ key, value }) => {
      const re = new RegExp(`{${key}}`, 'g')
      bash = bash.replace(re, value)
    })

    const success = runAsyncTask({
      type: 'start',
      projectId,
      taskId,
      bash,
      cwd: path.join(this.config('projectRoot'), project.name)
    })
    if (success) {
      return this.success(taskId)
    } else {
      // TODO: 错误原因
      return this.fail('跑不了啊')
    }
  }

  // 终止 task 运行
  async stopTaskAction() {
    const projectId = this.post('projectId')
    const task = runningTasks.find(_ => _.projectId === projectId)
    if (task) {
      task.worker.kill('SIGHUP')
      runningTasks.splice(runningTasks.findIndex(_ => _.projectId === projectId), 1)
    }
    return this.success()
  }

  // 列出所有历史 Task，除去当前正在运行的 Task
  async historyTasksAction() {
    const projectId = this.get('projectId')
    const tasks = db.get('tasks').filter({ projectId }).value()
    return this.success(tasks.map(_ => ({
      taskId: _.taskId,
      doneFlag: _.doneFlag,
      duration: _.duration,
      createTime: _.createTime
    })).reverse())
  }

  // 返回对应 taskId 的执行 message
  async getTaskMessageAction() {
    const taskId = this.get('taskId')
    const task = db.get('tasks').filter({ taskId }).value()
    if (task.length === 0) {
      return this.fail('no task id')
    }
    return this.success(task[0].msg)
  }

  // 返回给定项目当前是否有任务正在运行
  async runningTaskAction() {
    const projectId = this.get('projectId')
    const task = runningTasks.find(_ => _.projectId === projectId)
    return this.success(task
      ? {
        projectId: task.projectId,
        taskId: task.taskId,
        msg: task.msg,
        start: task.start
      }
      : null)
  }
}
