const fibo = (n) => {
  return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
};

process.on('message', (m) => {
  const num = fibo(m);
  process.send(num);
});

process.on('SIGHUP', () => {
  process.exit();
});
