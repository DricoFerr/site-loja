const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const IMAGES_DIR = path.join(__dirname, 'assets/images');

app.use(express.static(__dirname)); // Serve arquivos estáticos

// Rota para imagens aleatórias do carrossel
app.get('/api/carrossel', (req, res) => {
    const carrosselDir = path.join(IMAGES_DIR, 'Carrossel');
    fs.readdir(carrosselDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Erro ao ler imagens' });
        const imagens = files.filter(f => /\.(jpe?g|png|gif|webp|png)$/i.test(f));
        imagens.sort(() => Math.random() - 0.5);
        res.json(imagens.map(img => `/assets/images/Carrossel/${img}`));
    });
});

// Rota para listar pastas (exceto Carrossel)
app.get('/api/galerias', (req, res) => {
    fs.readdir(IMAGES_DIR, { withFileTypes: true }, (err, files) => {
        if (err) return res.status(500).json({ error: 'Erro ao ler pastas' });
        const pastas = files
            .filter(f => f.isDirectory() && f.name !== 'Carrossel')
            .map(f => f.name);
        res.json(pastas);
    });
});

// Rota para listar imagens de uma pasta específica
app.get('/api/galeria/:pasta', (req, res) => {
    const pasta = req.params.pasta;
    const galeriaDir = path.join(IMAGES_DIR, pasta);
    fs.readdir(galeriaDir, (err, files) => {
        if (err) return res.status(404).json({ error: 'Pasta não encontrada' });
        const imagens = files.filter(f => /\.(jpe?g|png|gif|webp|png)$/i.test(f));
        res.json(imagens.map(img => `/assets/images/${pasta}/${img}`));
    });
});

// Fallback para SPA (index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));