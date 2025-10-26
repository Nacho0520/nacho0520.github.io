// Global variables
let allProjects = [];
let upcomingProjects = [];
let currentTab = 'ia';
let searchTerm = '';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
    setupEventListeners();
    displayProjects();
});

// Load projects from JSON files
async function loadProjects() {
    try {
        const [projectsResponse, upcomingResponse] = await Promise.all([
            fetch('projects.json'),
            fetch('upcoming.json')
        ]);

        if (!projectsResponse.ok || !upcomingResponse.ok) {
            throw new Error('Error loading projects');
        }

        allProjects = await projectsResponse.json();
        upcomingProjects = await upcomingResponse.json();
    } catch (error) {
        console.error('Error loading projects:', error);
        showError('Error al cargar los proyectos. Por favor, intenta de nuevo más tarde.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update current tab and display projects
            currentTab = button.getAttribute('data-tab');
            displayProjects();
        });
    });

    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        displayProjects();
    });
}

// Display projects based on current tab and search term
function displayProjects() {
    const container = document.getElementById('projectsContainer');
    
    // Get projects for current tab
    let projects = currentTab === 'proximos' ? upcomingProjects : allProjects;
    
    // Filter by tab category (except for upcoming)
    if (currentTab !== 'proximos') {
        projects = projects.filter(project => project.category === currentTab);
    }
    
    // Filter by search term (intelligent search)
    if (searchTerm) {
        projects = projects.filter(project => {
            const searchableText = [
                project.title,
                project.description,
                ...project.tags
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchTerm);
        });
    }
    
    // Display projects or no results message
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No se encontraron proyectos</h3>
                <p>Intenta con otros términos de búsqueda o cambia de categoría.</p>
            </div>
        `;
    } else {
        container.innerHTML = projects.map(project => createProjectCard(project)).join('');
    }
}

// Create HTML for a project card
function createProjectCard(project) {
    const tags = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    const demoLink = project.demo 
        ? `<a href="${project.demo}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Demo</a>`
        : '<button class="btn btn-primary" disabled>Demo</button>';
    
    const repoLink = project.repo
        ? `<a href="${project.repo}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Código</a>`
        : '<button class="btn btn-secondary" disabled>Código</button>';
    
    return `
        <div class="project-card">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="tags">
                ${tags}
            </div>
            <div class="project-links">
                ${demoLink}
                ${repoLink}
            </div>
        </div>
    `;
}

// Show error message
function showError(message) {
    const container = document.getElementById('projectsContainer');
    container.innerHTML = `
        <div class="no-results">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}
