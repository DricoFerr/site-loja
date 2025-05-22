const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const IMAGES_DIR = path.join(__dirname, 'assets', 'images');

// 1) Sirva tudo em /assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 2) Rotas dinâmicas
app.get('/api/carrossel', (req, res) => {
  const carrosselDir = path.join(IMAGES_DIR, 'Carrossel');
  fs.readdir(carrosselDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Não foi possível ler o carrossel' });
    // embaralha
    const shuffled = files.sort(() => Math.random() - 0.5);
    const urls = shuffled.map(img => `/assets/images/Carrossel/${img}`);
    res.json(urls);
  });
});

app.get('/api/galerias', (req, res) => {
  fs.readdir(IMAGES_DIR, { withFileTypes: true }, (err, entries) => {
    if (err) return res.status(500).json({ error: 'Não foi possível ler as galerias' });
    const pastas = entries
      .filter(dirent => dirent.isDirectory() && dirent.name !== 'Carrossel')
      .map(dirent => dirent.name);
    res.json(pastas);
  });
});

app.get('/api/galeria/:pasta', (req, res) => {
  const { pasta } = req.params;
  const pastaDir = path.join(IMAGES_DIR, pasta);
  fs.readdir(pastaDir, (err, files) => {
    if (err) return res.status(404).json({ error: 'Galeria não encontrada' });
    const urls = files.map(img => `/assets/images/${pasta}/${img}`);
    res.json(urls);
  });
});

// 3) Fallback para SPA (se necessário)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});