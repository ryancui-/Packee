const spawn = require('child_process').spawn

process.on('message', ({ bash, cwd }) => {
  const child = spawn('sh', [
    '-c',
    `${bash}`
  ], { cwd })
  child.stdout.on('data', data => {
    process.send({ type: 'processing', data: `${data}` })
  })
  child.stderr.on('data', data => {
    process.send({ type: 'error', data: `${data}` })
  })
  child.on('close', code => {
    process.send({ type: 'done', data: code })
  })
})

process.on('SIGHUP', () => {
  process.exit()
})
