const db = require('./index')

const websockets = []
const runningTasks = []

exports.websockets = websockets

exports.runningTasks = runningTasks

exports.broadcastProcessing = (projectId, taskId, msg) => {
  // 广播 message
  websockets.forEach(socket => {
    socket.emit('task:msg', { projectId, msg })
  })
  // 添加到当前的 runningTask 中
  const task = runningTasks.find(_ => _.projectId === projectId && _.taskId === taskId)
  if (!task) {
    console.log('Ooz...Something must be wrong here.')
    return
  }
  task.msg += msg
}

exports.broadcastDone = (projectId, taskId, doneFlag) => {
  // 广播 task 结束
  websockets.forEach(socket => {
    socket.emit('task:done')
  })
  // 持久化 task 到 db
  const taskIndex = runningTasks.findIndex(_ => _.projectId === projectId && _.taskId === taskId)
  db.get('tasks').push({ projectId, taskId, msg: runningTasks[taskIndex].msg, doneFlag }).write()
  runningTasks.splice(taskIndex, 1)
}
