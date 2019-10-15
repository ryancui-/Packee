const spawn = require('child_process').spawn

process.on('message', payload => {
  const { repoRoot, repoUrl } = payload
  const child = spawn('sh', [
    '-c',
    `git clone ${repoUrl} ${repoRoot}`
  ])
  child.stdout.on('data', data => {
    process.send({ type: 'processing', data })
  })
  child.stderr.on('data', data => {
    process.send({ type: 'error', data })
  })
  child.on('close', code => {
    process.send({ type: 'finish', data: code })
  })
})

process.on('SIGHUP', () => {
  process.exit()
})
