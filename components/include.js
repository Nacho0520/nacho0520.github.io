// include.js - Carga dinámica de header y footer, y marca enlace activo

(function() {
    // Función para cargar un componente HTML
    async function loadComponent(url, targetId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error cargando ${url}:`, error);
        }
    }

    // Función para marcar el enlace activo
    function markActiveLink() {
        const currentPath = window.location.pathname;
        
        // Seleccionar todos los enlaces del nav
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remover clase active de todos los enlaces
            link.classList.remove('active');
            
            // Caso 1: Coincidencia exacta de ruta
            // Por ejemplo: /index.html coincide con href="/index.html"
            if (currentPath === href || currentPath === '/' + href) {
                link.classList.add('active');
            }
            // Caso 2: Si estamos en la raíz "/" o "/index.html", marcar "Inicio" como activo
            else if ((currentPath === '/' || currentPath === '/index.html') && 
                     (href === '/index.html' || href === 'index.html')) {
                link.classList.add('active');
            }
            // Caso 3: Coincidencia por carpeta (para futuras subcarpetas como /blog/)
            // Si la ruta actual empieza con el href (sin .html), marcar como activo
            else if (href.endsWith('/') && currentPath.startsWith(href)) {
                link.classList.add('active');
            }
            // Caso 4: Para subcarpetas, si estamos en /blog/algo.html y el enlace es /blog/
            else if (!href.endsWith('.html') && href.endsWith('/')) {
                const folderPath = href.replace(/\/$/, '');
                if (currentPath.startsWith(folderPath + '/')) {
                    link.classList.add('active');
                }
            }
        });
    }

    // Cargar componentes cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async function() {
            await loadComponent('/components/header.html', 'site-header');
            await loadComponent('/components/footer.html', 'site-footer');
            // Marcar enlace activo después de cargar el header
            markActiveLink();
        });
    } else {
        // DOM ya está cargado
        (async function() {
            await loadComponent('/components/header.html', 'site-header');
            await loadComponent('/components/footer.html', 'site-footer');
            markActiveLink();
        })();
    }
})();
