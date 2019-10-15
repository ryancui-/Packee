process.on('message', payload => {
  // const { repoCwd, branch, buildCmd } = payload;
  // 拉取最新的 remote 数据

  // 设置 git config user.name/user.email

  // 切换到 branch 分支

  // TODO: 链接 node_modules

  // 打包

  // 提交并推送到远程
});

process.on('SIGHUP', () => {
  process.exit();
});
