/**
 * Prompts Library Component
 * 
 * Features:
 * - Quick access to common Lovable.dev prompts
 * - Focused on web development and UI tasks
 * - Searchable prompt templates with API integration
 */

window.PromptsModal = {
  create() {
    const modal = document.createElement('div');
    modal.id = 'lovify-prompts-modal';
    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-200 opacity-0 pointer-events-none';
    modal.innerHTML = `
      <div class="bg-zinc-900 rounded-lg border border-zinc-700 w-[350px] shadow-lg" role="dialog">
        <div class="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 class="text-base font-medium">Prompts Library</h2>
          <button class="hover:bg-zinc-800 rounded-md p-1.5" data-action="close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="p-3 border-b border-zinc-800">
          <div class="flex gap-2">
            <input type="text" 
              placeholder="Search prompts..." 
              class="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-md px-3 py-2 text-sm focus:outline-none"
            >
            <button class="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md flex items-center gap-2" data-action="search">
              <svg class="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span class="text-sm text-zinc-300">Search</span>
            </button>
            <div class="hidden" data-loading>
              <svg class="w-4 h-4 text-zinc-500 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10" />
              </svg>
            </div>
          </div>
        </div>

        <div class="min-h-[200px]">
          <!-- Default prompts list -->
          <div class="prompt-list" data-default-prompts>
            <!-- Original 5 prompts here -->
          </div>

          <!-- Search results -->
          <div class="prompt-list hidden" data-search-results>
          </div>

          <!-- No results message -->
          <div class="hidden h-[200px] flex-col items-center justify-center" data-no-results>
            <div class="text-sm text-zinc-400">No prompts found</div>
          </div>
        </div>

        <div class="p-3 flex justify-end border-t border-zinc-800">
          <button class="px-3 py-1.5 text-sm rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300" data-action="cancel">
            Cancel
          </button>
        </div>
      </div>
    `;

    // Add default prompts
    const defaultPromptsList = modal.querySelector('[data-default-prompts]');
    defaultPromptsList.innerHTML = this.getDefaultPromptsHTML();

    // Add event listeners
    modal.querySelector('[data-action="close"]').addEventListener('click', () => {
      modal.classList.remove('active');
      this.resetState(modal);
    });

    modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      modal.classList.remove('active');
      this.resetState(modal);
    });

    // Handle prompt selection for both default and search results
    const handlePromptClick = (button) => {
      const promptType = button.getAttribute('data-prompt');
      const promptContent = button.getAttribute('data-content');
      const textarea = document.querySelector('textarea');
      
      if (!textarea) return;

      let promptText = '';
      if (promptContent) {
        // For API search results
        promptText = promptContent;
      } else {
        // For default prompts
        promptText = this.getDefaultPromptText(promptType);
      }

      // Update textarea and trigger events
      textarea.value = promptText;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      textarea.dispatchEvent(new KeyboardEvent('keydown', { 
        key: 'Process',
        bubbles: true
      }));

      modal.classList.remove('active');
      this.resetState(modal);
      textarea.focus();
    };

    // Add click handlers for default prompts
    modal.querySelectorAll('[data-default-prompts] [data-prompt]').forEach(button => {
      button.addEventListener('click', () => handlePromptClick(button));
    });

    // Handle search functionality with API integration
    const searchInput = modal.querySelector('input[type="text"]');
    const searchButton = modal.querySelector('[data-action="search"]');
    const defaultPrompts = modal.querySelector('[data-default-prompts]');
    const searchResults = modal.querySelector('[data-search-results]');
    const noResults = modal.querySelector('[data-no-results]');
    const loadingIndicator = modal.querySelector('[data-loading]');
    
    const performSearch = async () => {
      const searchTerm = searchInput.value.trim();

      if (searchTerm === '') {
        // Show default prompts
        defaultPrompts.style.display = 'block';
        searchResults.style.display = 'none';
        noResults.style.display = 'none';
        loadingIndicator.style.display = 'none';
        return;
      }

      // Set loading state
      loadingIndicator.style.display = 'block';
      searchButton.style.display = 'none';
      defaultPrompts.style.display = 'none';
      searchResults.style.display = 'none';
      noResults.style.display = 'none';

      try {
        const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/prompt-library-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: searchTerm })
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        
        // Hide loading indicator and restore search button
        loadingIndicator.style.display = 'none';
        searchButton.style.display = 'flex';

        if (data.prompts && data.prompts.length > 0) {
          // Show search results
          searchResults.innerHTML = data.prompts.map((prompt, index) => `
            <button class="w-full flex items-start gap-3 p-3 hover:bg-zinc-800 text-left transition-colors ${index > 0 ? 'border-t border-zinc-800/50' : ''}" 
              data-prompt="search-${prompt.id}" 
              data-content="${prompt.prompt.replace(/"/g, '&quot;')}">
              <svg class="w-5 h-5 text-violet-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <div>
                <div class="font-medium text-sm">${prompt.name}</div>
                <div class="text-xs text-zinc-400 mt-0.5">${prompt.description}</div>
              </div>
            </button>
          `).join('');

          // Add click handlers for search results
          searchResults.querySelectorAll('[data-prompt]').forEach(button => {
            button.addEventListener('click', () => handlePromptClick(button));
          });

          searchResults.style.display = 'block';
          noResults.style.display = 'none';
        } else {
          // Show no results
          searchResults.style.display = 'none';
          noResults.style.display = 'flex';
        }
      } catch (error) {
        console.error('Search error:', error);
        loadingIndicator.style.display = 'none';
        searchButton.style.display = 'flex';
        searchResults.style.display = 'none';
        noResults.style.display = 'flex';
      }
    };

    // Handle search button click
    searchButton.addEventListener('click', performSearch);

    // Handle Enter key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        this.resetState(modal);
      }
    });

    return modal;
  },

  getDefaultPromptsHTML() {
    return `
      <button class="w-full flex items-start gap-3 p-3 hover:bg-zinc-800 text-left transition-colors" data-prompt="landing-page">
        <svg class="w-5 h-5 text-blue-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z"/>
          <path d="M4 13a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6z"/>
          <path d="M16 13a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6z"/>
        </svg>
        <div>
          <div class="font-medium text-sm">Landing Page</div>
          <div class="text-xs text-zinc-400 mt-0.5">Create a modern landing page with hero section and features</div>
        </div>
      </button>

      <button class="w-full flex items-start gap-3 p-3 hover:bg-zinc-800 text-left transition-colors border-t border-zinc-800/50" data-prompt="responsive">
        <svg class="w-5 h-5 text-green-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 18h6a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-6"/>
          <path d="M7 14v-4a2 2 0 0 1 2-2h3"/>
          <rect x="3" y="6" width="8" height="12" rx="1"/>
        </svg>
        <div>
          <div class="font-medium text-sm">Responsive Design</div>
          <div class="text-xs text-zinc-400 mt-0.5">Add responsive layouts and mobile-first design</div>
        </div>
      </button>

      <button class="w-full flex items-start gap-3 p-3 hover:bg-zinc-800 text-left transition-colors border-t border-zinc-800/50" data-prompt="animations">
        <svg class="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3a9 9 0 0 1 9 9a9 9 0 0 1-9 9a9 9 0 0 1-9-9a9 9 0 0 1 9-9z"/>
          <path d="M12 8v4l3 3"/>
        </svg>
        <div>
          <div class="font-medium text-sm">Animations & Transitions</div>
          <div class="text-xs text-zinc-400 mt-0.5">Add smooth animations and interactive transitions</div>
        </div>
      </button>

      <button class="w-full flex items-start gap-3 p-3 hover:bg-zinc-800 text-left transition-colors border-t border-zinc-800/50" data-prompt="components">
        <svg class="w-5 h-5 text-purple-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"/>
          <path d="M12 4v16"/>
          <path d="M4 12h16"/>
        </svg>
        <div>
          <div class="font-medium text-sm">UI Components</div>
          <div class="text-xs text-zinc-400 mt-0.5">Create reusable UI components and patterns</div>
        </div>
      </button>

      <button class="w-full flex items-start gap-3 p-3 hover:bg-zinc-800 text-left transition-colors border-t border-zinc-800/50" data-prompt="optimization">
        <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        <div>
          <div class="font-medium text-sm">Performance Optimization</div>
          <div class="text-xs text-zinc-400 mt-0.5">Optimize loading speed and performance</div>
        </div>
      </button>
    `;
  },

  getDefaultPromptText(promptType) {
    const prompts = {
      'landing-page': 'Create a modern landing page with:\n' +
        '- Hero section with compelling headline and CTA\n' +
        '- Feature grid showcasing key benefits\n' +
        '- Testimonials section\n' +
        '- Newsletter signup form\n' +
        '- Mobile-friendly design',
      'responsive': 'Make the current design responsive with:\n' +
        '- Mobile-first approach\n' +
        '- Flexible grid layouts\n' +
        '- Responsive images and media\n' +
        '- Touch-friendly navigation\n' +
        '- Breakpoint-specific styles',
      'animations': 'Add smooth animations and transitions:\n' +
        '- Scroll-triggered animations\n' +
        '- Hover effects and transitions\n' +
        '- Page load animations\n' +
        '- Micro-interactions\n' +
        '- Performance optimization',
      'components': 'Create reusable UI components for:\n' +
        '- Navigation and menus\n' +
        '- Cards and content blocks\n' +
        '- Forms and inputs\n' +
        '- Modals and overlays\n' +
        '- Loading states',
      'optimization': 'Optimize the website performance:\n' +
        '- Image optimization\n' +
        '- Code splitting and lazy loading\n' +
        '- Caching strategies\n' +
        '- Bundle size reduction\n' +
        '- Core Web Vitals improvements'
    };
    return prompts[promptType] || '';
  },

  addStyles() {
    if (!document.querySelector('#lovify-prompts-styles')) {
      const style = document.createElement('style');
      style.id = 'lovify-prompts-styles';
      style.textContent = `
        #lovify-prompts-modal.active {
          opacity: 1;
          pointer-events: auto;
        }
      `;
      document.head.appendChild(style);
    }
  },

  resetState(modal) {
    // Clear search input
    const searchInput = modal.querySelector('input[type="text"]');
    const defaultPrompts = modal.querySelector('[data-default-prompts]');
    const searchResults = modal.querySelector('[data-search-results]');
    const noResults = modal.querySelector('[data-no-results]');
    const loadingIndicator = modal.querySelector('[data-loading]');
    
    if (searchInput) {
      searchInput.value = '';
      // Reset visibility
      defaultPrompts.style.display = 'block';
      searchResults.style.display = 'none';
      noResults.style.display = 'none';
      loadingIndicator.style.display = 'none';
    }
  }
}; 