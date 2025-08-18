module.exports = {
  apps: [
    {
      name: 'tomonikanaderu-radio',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/user/webapp/Tomonikanaderu-Radio',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '1G'
    }
  ]
}