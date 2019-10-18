const Base = require('./base.js')
const db = require('../model')
const shortid = require('shortid')
const path = require('path')
const fork = require('child_process').fork
const { runningTasks, broadcastProcessing, broadcastDone } = require('../model/socket')

function runAsyncTask(payload) {
  const projectId = payload.projectId
  const taskId = payload.taskId
  const currentRunningTaskIndex = runningTasks.findIndex(_ => _.projectId === projectId)
  if (currentRunningTaskIndex !== -1) {
    return false
  }

  const worker = fork(path.join(__dirname, '../task/async-worker.js'))
  worker.on('message', ({ type, data }) => {
    switch (type) {
      case 'processing':
        broadcastProcessing(projectId, taskId, data)
        break
      case 'error':
        // TODO: error 要看看怎么处理
        break
      case 'done':
        broadcastDone(projectId, taskId, data)
        break
    }
  })

  worker.send(payload)
  runningTasks.push({ projectId, taskId, worker, msg: '', start: Date.now() })

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
    const taskId = shortid.generate()
    const project = db.get('projects')
      .find({ id: projectId })
      .value()
    const bash = project.shell
    const success = runAsyncTask({
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

  // 列出所有历史 Task，除去当前正在运行的 Task
  async historyTasksAction() {
    const projectId = this.get('projectId')
    const tasks = db.get('tasks').filter({ projectId }).value()
    return this.success(tasks)
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
