document.addEventListener('DOMContentLoaded', function() {
    // Seletores principais do menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    // Cria e adiciona overlay que escurece o fundo ao abrir o menu
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Fecha o menu mobile
    const closeMobileMenu = () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.innerHTML = '☰';
        document.body.style.overflow = 'auto';
    };

    // Abre o menu mobile
    const openMobileMenu = () => {
        nav.classList.add('active');
        overlay.classList.add('active');
        menuToggle.innerHTML = '✕';
        document.body.style.overflow = 'hidden';
    };

    // Alterna entre abrir e fechar o menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
    });

    // Fecha o menu ao clicar em qualquer link da navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Fecha o menu ao clicar fora (no overlay)
    overlay.addEventListener('click', closeMobileMenu);

    // Fecha o menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Fecha o menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Aplica efeito de fundo ao header após rolar a página
    window.addEventListener('scroll', function() {
        document.querySelector('header')
            .classList.toggle('scrolled', window.scrollY > 20);
    });

    // Rolagem suave até a seção Nuvve Collection
    const scrollToSection = (selector) => {
        const target = document.querySelector(selector);
        if (target) {
            window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        }
    };

    // Botão "NUVVE"
    document.querySelector('.nuvve-cta-button')?.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToSection('.nuvve-collection-section');
    });

    // Links para a coleção
    document.querySelectorAll('a[href="#colecao"], a[href="#nuvve-collection"]')
        .forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToSection('.nuvve-collection-section');
            });
        });

    // Links para a seção de contato
    document.querySelectorAll('a[href="#contato"]')
        .forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToSection('.contact-section');
            });
        });

    // Observa elementos para aplicar efeito de aparição suave
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.contact-method, .highlight-content')
        .forEach(el => observer.observe(el));

    // Inicia carrossel horizontal com imagens vindas do servidor
    function iniciarCarrosselNode() {
        fetch('/api/carrossel')
            .then(res => res.json())
            .then(imagens => {
                const slider = document.getElementById('slider');
                if (!slider) return;

                slider.innerHTML = '';
                const imagensDuplicadas = [...imagens, ...imagens];

                imagensDuplicadas.forEach(src => {
                    const div = document.createElement('div');
                    div.className = 'slider-item';
                    const img = document.createElement('img');
                    img.src = src;
                    div.appendChild(img);
                    slider.appendChild(div);
                });

                let itemWidth = slider.querySelector('.slider-item')?.offsetWidth + 32 || 0;
                let animationFrame;

                const animateSlider = () => {
                    itemWidth = slider.querySelector('.slider-item')?.offsetWidth + 32 || 0;
                    slider.style.transition = 'none';
                    let start = null;

                    function step(timestamp) {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const pos = (progress * 0.08) % (itemWidth * imagens.length);
                        slider.style.transform = `translateX(-${pos}px)`;
                        animationFrame = requestAnimationFrame(step);
                    }

                    animationFrame = requestAnimationFrame(step);
                };

                animateSlider();

                window.addEventListener('resize', () => {
                    slider.style.transform = 'none';
                    setTimeout(animateSlider, 300);
                });
            });
    }

    iniciarCarrosselNode();

    // Carrega galeria de imagens e aplica navegação por clique e acessibilidade
    fetch('/api/galerias')
        .then(res => res.json())
        .then(pastas => {
            const container = document.getElementById('galeriasCards');
            if (!container) return;

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

                        // Abre galeria em modal ao clicar
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

                        // Acessibilidade: ativa galeria com Enter ou Espaço
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

// Oculta tela de loading ao finalizar carregamento da página
window.addEventListener('load', function() {
    const loading = document.getElementById('loading-screen');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.style.display = 'none', 600);
    }
});
