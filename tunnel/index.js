const express = require('express');
const cors = require('cors');
const path = require('path');
const chalk = require('chalk');
const open = require('open');
const ngrok = require('@ngrok/ngrok');
const { configureViteForTunnel, extractHostFromUrl } = require('./configure-vite');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const config = {
  site: {
    port: 5173,
    name: 'Oxymore Site',
    path: '../apps/oxymore-site'
  },
  app: {
    port: 5174,
    name: 'Oxymore App',
    path: '../apps/oxymore-app'
  }
};

let currentTunnel = null;
let currentTarget = null;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/status', (req, res) => {
  res.json({
    tunnel: currentTunnel ? currentTunnel.url() : null,
    target: currentTarget,
    config
  });
});

app.post('/api/start-tunnel', async (req, res) => {
  const { target } = req.body;
  
  try {
    console.log(chalk.blue('🚀 Starting tunnel...'));
    
    if (currentTunnel) {
      await currentTunnel.close();
      currentTunnel = null;
    }

    const listener = await ngrok.forward({
      addr: config[target].port,
      authtoken: process.env.NGROK_AUTH_TOKEN,
    });

    currentTunnel = listener;
    currentTarget = target;
    const tunnelUrl = listener.url();
    const ngrokHost = extractHostFromUrl(tunnelUrl);

    if (ngrokHost) {
      console.log(chalk.blue('⚙️ Configuring Vite for tunnel...'));
      const projectPath = path.resolve(__dirname, config[target].path);
      configureViteForTunnel(projectPath, ngrokHost);
      console.log(chalk.yellow('📝 Please restart your Vite dev server for the changes to take effect!'));
    }

    console.log(chalk.green(`✅ Tunnel started for ${config[target].name}`));
    console.log(chalk.cyan(`🎯 Target: ${config[target].name}`));
    console.log(chalk.cyan(`🔗 URL: ${tunnelUrl}`));
    console.log(chalk.magenta(`🔧 Configured allowedHosts: ${ngrokHost}`));
    console.log(chalk.yellow(`\n⚠️  IMPORTANT: Restart your ${config[target].name} dev server!`));
    console.log(chalk.yellow(`Press Ctrl+C to stop the tunnel`));

    res.json({ 
      success: true, 
      tunnelUrl, 
      target,
      needsRestart: true,
      ngrokHost 
    });
  } catch (error) {
    console.error(chalk.red('❌ Error starting tunnel:'), error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/stop-tunnel', async (req, res) => {
  try {
    if (currentTunnel) {
      await currentTunnel.close();
      currentTunnel = null;
      currentTarget = null;
      console.log(chalk.yellow('🛑 Tunnel stopped'));
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/open-browser', async (req, res) => {
  const { target } = req.body;
  
  try {
    const url = target === 'site' 
      ? `http://localhost:${config.site.port}`
      : `http://localhost:${config.app.port}`;
    
    await open(url);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(chalk.green(`\n🎯 Oxymore Tunnel Server running on http://localhost:${PORT}`));
  console.log(chalk.cyan(`🌐 Open your browser to select your target!`));
  console.log(chalk.yellow(`📝 Make sure your site/app is running on the appropriate port`));
});

process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n🛑 Stopping tunnel...'));
  if (currentTunnel) {
    await currentTunnel.close();
  }
  process.exit(0);
}); 