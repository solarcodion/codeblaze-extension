// Prompts Modal Module
window.PromptsModal = (() => {
  // Helper function to update textarea value and trigger necessary events
  function updateTextareaValue(textarea, value) {
    // Store current selection
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    
    // Update value and trigger events
    textarea.value = value;
    
    // Restore selection
    textarea.selectionStart = selectionStart;
    textarea.selectionEnd = selectionEnd;
    
    // Trigger input event
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Trigger change event
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Force React to update by triggering a keydown event
    textarea.dispatchEvent(new KeyboardEvent('keydown', { 
      key: 'Process',
      bubbles: true
    }));
  }

  function create() {
    const modal = document.createElement('div');
    modal.id = 'lovify-prompts-modal';
    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-200 opacity-0 pointer-events-none';
    modal.innerHTML = `
      <div class="bg-zinc-900 rounded-lg border border-zinc-700 w-[95vw] max-w-lg shadow-lg" role="dialog">
        <div class="p-6 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Saved Prompts</h2>
            <button class="hover:bg-zinc-800 rounded-md p-1.5" data-action="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div class="relative">
              <input type="text" placeholder="Search prompts..." class="w-full bg-zinc-800 border border-zinc-700 rounded-md pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary">
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <div class="space-y-2 max-h-[400px] overflow-y-auto">
              <button class="w-full flex items-start gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors" data-prompt="react-component">
                <svg class="w-5 h-5 text-blue-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                <div>
                  <div class="font-medium">React Component</div>
                  <div class="text-sm text-zinc-400 mt-1">Create a new React component with TypeScript and styling</div>
                </div>
              </button>
              <button class="w-full flex items-start gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors" data-prompt="api-endpoint">
                <svg class="w-5 h-5 text-green-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 4v8m-4-4h8M4 8v8m-4-4h8m4 8v-8m-4 4h8"/>
                </svg>
                <div>
                  <div class="font-medium">API Endpoint</div>
                  <div class="text-sm text-zinc-400 mt-1">Generate a new API endpoint with error handling</div>
                </div>
              </button>
              <button class="w-full flex items-start gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors" data-prompt="database-model">
                <svg class="w-5 h-5 text-yellow-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
                </svg>
                <div>
                  <div class="font-medium">Database Model</div>
                  <div class="text-sm text-zinc-400 mt-1">Create a new database model with relationships</div>
                </div>
              </button>
              <button class="w-full flex items-start gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors" data-prompt="test-suite">
                <svg class="w-5 h-5 text-purple-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                <div>
                  <div class="font-medium">Test Suite</div>
                  <div class="text-sm text-zinc-400 mt-1">Generate comprehensive test suite with mocks and fixtures</div>
                </div>
              </button>
              <button class="w-full flex items-start gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors" data-prompt="crud-operations">
                <svg class="w-5 h-5 text-red-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                </svg>
                <div>
                  <div class="font-medium">CRUD Operations</div>
                  <div class="text-sm text-zinc-400 mt-1">Set up complete CRUD operations with validation</div>
                </div>
              </button>
              <button class="w-full flex items-start gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors" data-prompt="authentication">
                <svg class="w-5 h-5 text-orange-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <div>
                  <div class="font-medium">Authentication Flow</div>
                  <div class="text-sm text-zinc-400 mt-1">Implement secure authentication with multiple providers</div>
                </div>
              </button>
            </div>
          </div>
          <div class="flex justify-between gap-3 pt-2 border-t border-zinc-700">
            <button class="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-md text-white font-medium" data-action="new">
              New Prompt
            </button>
            <button class="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300" data-action="cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    modal.querySelector('[data-action="close"]').addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Handle search functionality
    const searchInput = modal.querySelector('input[type="text"]');
    const promptButtons = modal.querySelectorAll('[data-prompt]');

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      promptButtons.forEach(button => {
        const title = button.querySelector('.font-medium').textContent.toLowerCase();
        const description = button.querySelector('.text-zinc-400').textContent.toLowerCase();
        const matches = title.includes(searchTerm) || description.includes(searchTerm);
        button.style.display = matches ? 'flex' : 'none';
      });
    });

    // Handle prompt selection
    promptButtons.forEach(button => {
      button.addEventListener('click', () => {
        const promptType = button.getAttribute('data-prompt');
        const textarea = document.querySelector('textarea');
        
        if (!textarea) return;

        // Add the selected prompt template
        let promptText = '';
        switch (promptType) {
          case 'react-component':
            promptText = 'Create a React component with:\n' +
              '- TypeScript support\n' +
              '- Styled components\n' +
              '- Props interface\n' +
              '- Error handling\n' +
              '- Accessibility features\n' +
              '- Unit tests';
            break;
          case 'api-endpoint':
            promptText = 'Create an API endpoint that:\n' +
              '- Handles authentication\n' +
              '- Validates input\n' +
              '- Returns proper status codes\n' +
              '- Includes error handling\n' +
              '- Implements rate limiting\n' +
              '- Has comprehensive documentation';
            break;
          case 'database-model':
            promptText = 'Create a database model with:\n' +
              '- Required fields and types\n' +
              '- Relationships and foreign keys\n' +
              '- Indexes for performance\n' +
              '- Validation rules\n' +
              '- Migration scripts\n' +
              '- Seed data for testing';
            break;
          case 'test-suite':
            promptText = 'Generate a test suite including:\n' +
              '- Unit tests for core functionality\n' +
              '- Integration tests for API endpoints\n' +
              '- Mock data and fixtures\n' +
              '- Edge case coverage\n' +
              '- Performance tests\n' +
              '- CI/CD configuration';
            break;
          case 'crud-operations':
            promptText = 'Implement CRUD operations with:\n' +
              '- Create endpoint with validation\n' +
              '- Read endpoint with filtering and pagination\n' +
              '- Update endpoint with partial updates\n' +
              '- Delete endpoint with soft delete\n' +
              '- Proper error handling\n' +
              '- API documentation';
            break;
          case 'authentication':
            promptText = 'Set up authentication system with:\n' +
              '- Multiple auth providers (OAuth, Email)\n' +
              '- JWT token handling\n' +
              '- Password reset flow\n' +
              '- Role-based access control\n' +
              '- Session management\n' +
              '- Security best practices';
            break;
        }

        updateTextareaValue(textarea, promptText);
        modal.classList.remove('active');
        textarea.focus();
      });
    });

    // Handle new prompt creation
    modal.querySelector('[data-action="new"]').addEventListener('click', () => {
      // TODO: Implement new prompt creation
      console.log('New prompt creation clicked');
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    return modal;
  }

  function addStyles() {
    if (!document.querySelector('#lovify-prompts-styles')) {
      const style = document.createElement('style');
      style.id = 'lovify-prompts-styles';
      style.textContent = `
        #lovify-prompts-modal.active {
          opacity: 1;
          pointer-events: auto;
        }

        #lovify-prompts-modal .max-h-[400px] {
          scrollbar-width: thin;
          scrollbar-color: #636575 transparent;
        }

        #lovify-prompts-modal .max-h-[400px]::-webkit-scrollbar {
          width: 6px;
        }

        #lovify-prompts-modal .max-h-[400px]::-webkit-scrollbar-track {
          background: transparent;
        }

        #lovify-prompts-modal .max-h-[400px]::-webkit-scrollbar-thumb {
          background-color: #636575;
          border-radius: 3px;
        }
      `;
      document.head.appendChild(style);
    }
  }

  return { create, addStyles };
})(); 