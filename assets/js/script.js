document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    // Criar overlay dinamicamente
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Função para fechar o menu
    const closeMobileMenu = () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.innerHTML = '☰';
        document.body.style.overflow = 'auto'; // Libera o scroll da página
    };

    // Função para abrir o menu
    const openMobileMenu = () => {
        nav.classList.add('active');
        overlay.classList.add('active');
        menuToggle.innerHTML = '✕';
        document.body.style.overflow = 'hidden'; // Bloqueia o scroll da página
    };

    // Alternar menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (nav.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Fechar ao clicar em links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Fechar ao clicar no overlay
    overlay.addEventListener('click', closeMobileMenu);

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Fechar ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Efeito de blur no header ao scrollar
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Rolagem suave para a seção Nuvve Collection ao clicar no botão NUVVE
    document.querySelector('.nuvve-cta-button').addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector('.nuvve-collection-section');
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 0,
                behavior: 'smooth'
            });
        }
    });

    // Rolagem suave para Nuvve Collection ao clicar em "Catálogo"
    document.querySelectorAll('a[href="#colecao"], a[href="#nuvve-collection"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('.nuvve-collection-section');
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Rolagem suave para Contato ao clicar em "Contato"
    document.querySelectorAll('a[href="#contato"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('.contact-section');
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efeitos de aparecimento suave
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {threshold: 0.1});

    document.querySelectorAll('.contact-method, .highlight-content').forEach(el => {
        observer.observe(el);
    });

    // Slider aleatório com loop infinito real via Node.js
    function iniciarCarrosselNode() {
        fetch('/api/carrossel')
            .then(res => res.json())
            .then(imagensAleatorias => {
                const slider = document.getElementById('slider');
                slider.innerHTML = '';
                // Duplicar para loop infinito
                const allImages = [...imagensAleatorias, ...imagensAleatorias];
                allImages.forEach(src => {
                    const div = document.createElement('div');
                    div.className = 'slider-item';
                    const img = document.createElement('img');
                    img.src = src;
                    div.appendChild(img);
                    slider.appendChild(div);
                });

                let sliderWidth = slider.querySelector('.slider-item').offsetWidth + 32;
                let animationFrame;
                function animateSlider() {
                    sliderWidth = slider.querySelector('.slider-item').offsetWidth + 32;
                    slider.style.transition = 'none';
                    let start = null;
                    let pos = 0;
                    function step(timestamp) {
                        if (!start) start = timestamp;
                        let progress = timestamp - start;
                        pos = (progress * 0.08) % (sliderWidth * imagensAleatorias.length);
                        slider.style.transform = `translateX(-${pos}px)`;
                        animationFrame = requestAnimationFrame(step);
                    }
                    animationFrame = requestAnimationFrame(step);
                }
                animateSlider();
                window.addEventListener('resize', () => {
                    slider.style.transform = 'none';
                    setTimeout(animateSlider, 300);
                });
            });
    }
    iniciarCarrosselNode();

    // Carregar galerias (cards clicáveis, sem botão extra)
    fetch('/api/galerias')
        .then(res => res.json())
        .then(pastas => {
            const container = document.getElementById('galeriasCards');
            container.innerHTML = '';
            pastas.slice(0, 5).forEach(pasta => {
                fetch(`/api/galeria/${pasta}`)
                    .then(res => res.json())
                    .then(imagens => {
                        const thumb = imagens.length ? imagens[Math.floor(Math.random() * imagens.length)] : '';
                        const card = document.createElement('div');
                        card.className = 'galeria-card';
                        card.tabIndex = 0;
                        card.setAttribute('role', 'button');
                        card.setAttribute('aria-label', `Abrir galeria ${pasta}`);
                        card.innerHTML = `
                            <div class="galeria-thumb"${thumb ? ` style="background-image:url('${thumb}');"` : ''}></div>
                            <h3>${pasta}</h3>
                        `;
                        container.appendChild(card);

                        // Card inteiro abre a galeria
                        card.onclick = () => {
                            const modal = document.createElement('div');
                            modal.className = 'modal-galeria';
                            modal.innerHTML = `
                                <div class="modal-content">
                                    <button class="close-modal" aria-label="Fechar galeria">×</button>
                                    <div class="galeria-grid">
                                        ${imagens.map(img => `<img src="${img}" alt="" tabindex="0" />`).join('')}
                                    </div>
                                </div>
                            `;
                            document.body.appendChild(modal);
                            modal.querySelector('.close-modal').onclick = () => modal.remove();

                            // Clique na imagem abre modal ampliado (foto ocupa tela)
                            modal.querySelectorAll('.galeria-grid img').forEach(imgEl => {
                                imgEl.onclick = (e) => {
                                    e.stopPropagation();
                                    const imgModal = document.createElement('div');
                                    imgModal.className = 'modal-img-viewer';
                                    imgModal.innerHTML = `
                                        <div class="img-content">
                                            <button class="close-img-modal" aria-label="Fechar imagem">×</button>
                                            <img src="${imgEl.src}" alt="" />
                                        </div>
                                    `;
                                    document.body.appendChild(imgModal);
                                    imgModal.querySelector('.close-img-modal').onclick = () => imgModal.remove();
                                    imgModal.onclick = ev => { if (ev.target === imgModal) imgModal.remove(); };
                                };
                            });
                        };

                        // Acessibilidade: Enter/Barra de espaço também abre galeria
                        card.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                card.click();
                            }
                        });
                    });
            });
        });
});

// Esconde a tela de loading após o carregamento completo
window.addEventListener('load', function() {
    const loading = document.getElementById('loading-screen');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.style.display = 'none', 600);
    }
});
