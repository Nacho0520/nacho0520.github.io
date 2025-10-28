(async function() {
    try {
        // Fetch header and footer components
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('/components/header.html'),
            fetch('/components/footer.html')
        ]);

        if (!headerResponse.ok || !footerResponse.ok) {
            throw new Error('Failed to load components');
        }

        const [headerHTML, footerHTML] = await Promise.all([
            headerResponse.text(),
            footerResponse.text()
        ]);

        // Inject header and footer
        const headerContainer = document.getElementById('site-header');
        const footerContainer = document.getElementById('site-footer');

        if (headerContainer) {
            headerContainer.innerHTML = headerHTML;
        }

        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
        }

        // Mark active link
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('data-page');
            
            // Exact match for root path
            if (currentPath === '/' && linkPath === '/') {
                link.classList.add('active');
            }
            // Exact match for index.html
            else if (currentPath === '/index.html' && linkPath === '/') {
                link.classList.add('active');
            }
            // Exact match for other pages
            else if (currentPath === linkPath) {
                link.classList.add('active');
            }
            // Match for directory paths (e.g., /blog/)
            else if (linkPath.endsWith('/') && currentPath.startsWith(linkPath)) {
                link.classList.add('active');
            }
        });

    } catch (error) {
        console.error('Error loading header/footer components:', error);
    }
})();
