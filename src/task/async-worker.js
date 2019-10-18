const spawn = require('child_process').spawn

let child = null
process.on('message', ({ type, bash, cwd }) => {
  if (type === 'start') {
    child = spawn('sh', [
      '-c',
      `${bash}`
    ], { cwd })
    child.stdout.on('data', data => {
      process.send({ type: 'processing', data: `${data}` })
    })
    child.stderr.on('data', data => {
      process.send({ type: 'processing', data: `${data}` })
    })
    child.on('close', code => {
      process.send({ type: 'done', data: code })
    })
    child.on('error', (err) => {
      process.send({ type: 'error', data: err })
    })
  } else if (type === 'stop' && child) {
    child.kill('SIGHUP')
  }
})

process.on('SIGHUP', () => {
  process.exit()
})
