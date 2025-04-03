const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Ruta para descargar el archivo zip
app.get('/download', (req, res) => {
  const filePath = '/tmp/ciberheddeploy/CiberhedProposalTracker.zip';
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'CiberhedProposalTracker.zip');
  } else {
    res.status(404).send('Archivo no encontrado');
  }
});

// Página de inicio con enlace de descarga
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Descargar CiberhedProposalTracker</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f5f5f5;
        }
        .container {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
        }
        h1 {
          color: #2563eb;
          margin-bottom: 1rem;
        }
        p {
          color: #4b5563;
          margin-bottom: 2rem;
        }
        .download-btn {
          background-color: #2563eb;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          display: inline-block;
          transition: background-color 0.3s ease;
        }
        .download-btn:hover {
          background-color: #1d4ed8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>CiberhedProposalTracker</h1>
        <p>Haga clic en el botón a continuación para descargar el código completo de la aplicación CiberhedProposalTracker.</p>
        <a href="/download" class="download-btn">Descargar .ZIP</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de descarga ejecutándose en http://0.0.0.0:${PORT}`);
});