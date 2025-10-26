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

// Load projects from JSON files (en la raíz del repo)
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
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentTab = (button.getAttribute('data-tab') || 'ia').toLowerCase();
      displayProjects();
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase();
      displayProjects();
    });
  }
}

// Display projects based on current tab and search term
function displayProjects() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  let projects = currentTab === 'proximos' ? upcomingProjects : allProjects;

  if (currentTab !== 'proximos') {
    projects = projects.filter(p => (p.category || '').toLowerCase() === currentTab);
  }

  if (searchTerm) {
    projects = projects.filter(project => {
      const tags = Array.isArray(project.tags) ? project.tags : [];
      const searchableText = [project.title, project.description, ...tags]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(searchTerm);
    });
  }

  if (!projects.length) {
    container.innerHTML = `
      <div class="no-results">
        <h3>No se encontraron proyectos</h3>
        <p>Intenta con otros términos de búsqueda o cambia de categoría.</p>
      </div>`;
  } else {
    container.innerHTML = projects.map(project => createProjectCard(project)).join('');
  }
}

// Create HTML for a project card
function createProjectCard(project) {
  const tags = (Array.isArray(project.tags) ? project.tags : []).map(
    tag => `<span class="tag">${tag}</span>`
  ).join('');

  const hasDemo = !!project.demo;
  const hasRepo = !!project.repo;
  const isPlaceholder = !hasDemo && !hasRepo;

  const demoLink = hasDemo
    ? `<a href="${project.demo}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Demo</a>`
    : '<button class="btn btn-primary" disabled>Demo</button>';

  const repoLink = hasRepo
    ? `<a href="${project.repo}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Código</a>`
    : '<button class="btn btn-secondary" disabled>Código</button>';

  const badge = isPlaceholder
    ? `<span class="badge placeholder">Plantilla</span>`
    : '';

  return `
    <div class="project-card">
      <div class="project-card__head">
        <h3>${project.title}</h3>
        ${badge}
      </div>
      <p>${project.description || ''}</p>
      <div class="tags">${tags}</div>
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
  if (!container) return;
  container.innerHTML = `
    <div class="no-results">
      <h3>⚠️ Error</h3>
      <p>${message}</p>
    </div>
  `;
}
