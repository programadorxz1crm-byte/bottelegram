module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'backend/index.js',
      watch: true,
    },
    {
      name: 'frontend',
      cwd: 'frontend',
      script: 'npm',
      args: 'run dev',
      watch: true,
    },
    {
      name: 'tunnel-backend',
      script: 'npx cloudflared tunnel --url http://localhost:3000',
      interpreter: 'powershell',
      watch: false,
      autorestart: true,
    },
    {
      name: 'tunnel-frontend',
      script: 'npx cloudflared tunnel --url http://localhost:5173',
      interpreter: 'powershell',
      watch: false,
      autorestart: true,
    },
  ],
};