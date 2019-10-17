const websockets = []

exports.websockets = websockets

exports.taskRunningMap = {}

exports.broadcastProcessing = (msg) => {
  websockets.forEach(socket => {
    socket.emit('task:msg', msg)
  })
}

exports.broadcastDone = () => {
  websockets.forEach(socket => {
    socket.emit('task:done')
  })
}
