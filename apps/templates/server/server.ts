import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname, '../email')));

app.get('/', async (req, res) => {
  const templatesDir = path.join(__dirname, '../email');
  const files = await fs.readdir(templatesDir);
  const templates = files.filter(f => f.endsWith('.html'));

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Templates Preview</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        h1 { color: #333; }
        .templates { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
        .template-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .template-card a { color: #007bff; text-decoration: none; font-weight: bold; }
        .template-card a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Email Templates Preview</h1>
      <div class="templates">
  `;

  templates.forEach(template => {
    const name = template.replace('.html', '');
    html += `
      <div class="template-card">
        <h3>${name}</h3>
        <a href="/preview/${name}">Preview</a>
      </div>
    `;
  });

  html += `
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

app.get('/preview/:template', async (req, res) => {
  const templateName = req.params.template;
  const templatePath = path.join(__dirname, '../email', `${templateName}.html`);

  try {
    let html = await fs.readFile(templatePath, 'utf-8');
    
        const testData: Record<string, string> = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          message: templateName === 'contact-confirmation' 
            ? 'Ceci est un message de test pour prévisualiser le template de confirmation email.'
            : 'Ceci est un message de test pour prévisualiser le template email.',
        };

    Object.keys(testData).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, testData[key]);
    });

    res.send(html);
  } catch (error) {
    res.status(404).send(`Template not found: ${templateName}`);
  }
});

app.listen(PORT, () => {
  console.log(`Email templates server running on http://localhost:${PORT}`);
});