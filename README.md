# Loja Maia Ferraz

Bem-vindo ao repositório da **Loja Maia Ferraz**!  
Este projeto é uma vitrine digital moderna para coleções de moda fitness, com carrossel dinâmico, galerias de fotos, layout responsivo e backend Node.js para gerenciamento de imagens.

---

## ✨ Funcionalidades

- **Tela de loading animada** com alternância de logos.
- **Carrossel de imagens** aleatórias, fluido e infinito, alimentado por Node.js.
- **Galerias dinâmicas**: cards de pastas (exceto Carrossel), cada um mostrando uma thumb aleatória.
- **Modal de galeria**: ao clicar no card, abre todas as fotos da pasta em grid responsivo.
- **Visualização ampliada**: clique em qualquer foto da galeria para vê-la em tela cheia, com botão de fechar.
- **Design responsivo** e acessível.
- **Backend Node.js** para servir imagens e APIs.

---

## 🚀 Como rodar localmente

1. **Clone o repositório**
    ```bash
    git clone https://github.com/seu-usuario/LojaMaiaFerraz.git
    cd LojaMaiaFerraz
    ```

2. **Instale as dependências**
    ```bash
    npm install
    ```

3. **Coloque suas imagens**
    - Adicione suas imagens em `assets/images/Carrossel/` para o carrossel.
    - Crie outras pastas dentro de `assets/images/` (ex: `assets/images/Verão2025/`) para as galerias.
    - Coloque os arquivos `logo1.png` e `logo2.png` em `assets/images/`.

4. **Inicie o servidor**
    ```bash
    npm start
    ```
    O site estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploy

- O projeto está pronto para deploy em plataformas como **Vercel**, **Render**, **Railway**, **Cyclic**, **Heroku** etc.
- Basta importar o repositório e garantir que o comando de start seja `npm start`.

---

## 📁 Estrutura de Pastas

```
LojaMaiaFerraz/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── logo1.png
│   │   ├── logo2.png
│   │   ├── Carrossel/
│   │   ├── Pasta1/
│   │   └── Pasta2/
│   └── js/
│       └── script.js
├── index.html
├── server.js
├── package.json
└── README.md
```

---

## 🖼️ Como funciona o backend de imagens

- **Carrossel:**  
  O backend (`server.js`) retorna imagens aleatórias da pasta `assets/images/Carrossel/` via `/api/carrossel`.

- **Galerias:**  
  O backend lista todas as pastas em `assets/images/` (exceto `Carrossel`) via `/api/galerias`.  
  Cada pasta é um card. Ao clicar, as imagens da pasta são exibidas em grid.

- **Visualização:**  
  Clique em qualquer imagem da galeria para vê-la ampliada em tela cheia.

---

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Backend:** Node.js, Express
- **Responsividade:** CSS Grid, Flexbox, Media Queries

---

## 📋 Observações

- Para adicionar novas galerias, basta criar novas pastas em `assets/images/` e colocar imagens dentro.
- O site é totalmente estático no frontend, mas depende do Node.js para servir as imagens dinamicamente.
- O fundo da página é rosa pastel (`#fff5f7`), e o design é pensado para moda fitness feminina.

---

## 📄 Licença

Este projeto é livre para uso pessoal e educacional. Para uso comercial, consulte o autor.

---

## ✉️ Contato

Dúvidas ou sugestões?  
Abra uma issue ou envie um e-mail para [adrianoferrazguimaraes@gmail.com]

---
