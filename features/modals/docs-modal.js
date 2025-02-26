/**
 * Documentation Modal Component
 * 
 * Features:
 * - Allows users to add documentation links
 * - Processes documentation using Supabase edge function
 * - Generates context-aware prompts
 */

window.DocsModal = {
  create() {
    const modal = document.createElement('div');
    modal.id = 'lovify-docs-modal';
    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-200 opacity-0 pointer-events-none';
    modal.innerHTML = `
      <div class="bg-zinc-900 rounded-lg border border-zinc-700 w-[95vw] max-w-lg shadow-lg" role="dialog">
        <div class="p-6 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Add Documentation</h2>
            <button class="hover:bg-zinc-800 rounded-md p-1.5" data-action="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Documentation URL</label>
              <input type="url" placeholder="https://docs.example.com" class="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">What do you want to learn from this documentation?</label>
              <textarea placeholder="E.g., How to implement authentication? What are the available API endpoints?" class="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
            </div>
          </div>

          <!-- Loading State -->
          <div class="hidden items-center justify-center py-4 gap-3" data-loading>
            <svg class="animate-spin h-5 w-5 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm text-violet-500">Processing documentation...</span>
          </div>

          <!-- Error State -->
          <div class="hidden" data-error>
            <div class="p-4 rounded-md bg-red-500/10 text-red-500">
              <p class="text-sm font-medium">Failed to process documentation</p>
              <p class="text-xs mt-1" data-error-message></p>
            </div>
          </div>

          <!-- Success State -->
          <div class="hidden space-y-4" data-success>
            <div class="p-4 rounded-md bg-green-500/10 border border-green-500/20">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <p class="text-sm font-medium text-green-500">Documentation processed successfully</p>
              </div>
              <div class="mt-2 space-y-1">
                <p class="text-xs text-zinc-400" data-doc-title></p>
                <p class="text-xs text-zinc-400" data-doc-description></p>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button class="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300" data-action="cancel">Cancel</button>
            <button class="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-md text-white font-medium inline-flex items-center gap-2" data-action="add">
              <span>Process Documentation</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    modal.querySelector('[data-action="close"]').addEventListener('click', () => {
      modal.classList.remove('active');
      this.resetState(modal);
    });

    modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      modal.classList.remove('active');
      this.resetState(modal);
    });

    modal.querySelector('[data-action="add"]').addEventListener('click', async () => {
      const url = modal.querySelector('input[type="url"]').value;
      const prompt = modal.querySelector('textarea').value;
      
      if (!url || !prompt) {
        this.showError(modal, 'Please provide both a URL and a question');
        return;
      }

      // Show loading state
      this.showLoading(modal, true);
      this.hideError(modal);
      this.hideSuccess(modal);

      try {
        const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/process-documentation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Zm5kbHBheHVkcmxyeHNxbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDExNDUsImV4cCI6MjA1MTY3NzE0NX0.DCxziRVYTIIk6w07YbUa0AZJqIp5K9mR68iGVom9Qy0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Zm5kbHBheHVkcmxyeHNxbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDExNDUsImV4cCI6MjA1MTY3NzE0NX0.DCxziRVYTIIk6w07YbUa0AZJqIp5K9mR68iGVom9Qy0'
          },
          body: JSON.stringify({ url, prompt })
        });

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Documentation processed:', data);

        // Update textarea with processed content
        const textarea = document.querySelector('textarea');
        if (textarea) {
          const enhancedPrompt = `Based on the documentation from ${data.metadata.title}:\n\n${prompt}\n\nContext from docs:\n${data.context}`;
          textarea.value = enhancedPrompt;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Show success state
        this.showSuccess(modal, data.metadata);
        
        // Close modal after a delay
        setTimeout(() => {
          modal.classList.remove('active');
          this.resetState(modal);
        }, 2000);

      } catch (error) {
        console.error('Error processing documentation:', error);
        this.showError(modal, error.message);
      } finally {
        this.showLoading(modal, false);
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

  addStyles() {
    if (!document.querySelector('#lovify-docs-styles')) {
      const style = document.createElement('style');
      style.id = 'lovify-docs-styles';
      style.textContent = `
        #lovify-docs-modal.active {
          opacity: 1;
          pointer-events: auto;
        }
      `;
      document.head.appendChild(style);
    }
  },

  showLoading(modal, show) {
    const loading = modal.querySelector('[data-loading]');
    const addButton = modal.querySelector('[data-action="add"]');
    if (show) {
      loading.classList.remove('hidden');
      loading.classList.add('flex');
      addButton.disabled = true;
    } else {
      loading.classList.add('hidden');
      loading.classList.remove('flex');
      addButton.disabled = false;
    }
  },

  showError(modal, message) {
    const error = modal.querySelector('[data-error]');
    const errorMessage = modal.querySelector('[data-error-message]');
    error.classList.remove('hidden');
    errorMessage.textContent = message;
  },

  hideError(modal) {
    const error = modal.querySelector('[data-error]');
    error.classList.add('hidden');
  },

  showSuccess(modal, metadata) {
    const success = modal.querySelector('[data-success]');
    const title = modal.querySelector('[data-doc-title]');
    const description = modal.querySelector('[data-doc-description]');
    success.classList.remove('hidden');
    title.textContent = metadata.title;
    description.textContent = metadata.description;
  },

  hideSuccess(modal) {
    const success = modal.querySelector('[data-success]');
    success.classList.add('hidden');
  },

  resetState(modal) {
    // Clear inputs
    modal.querySelector('input[type="url"]').value = '';
    modal.querySelector('textarea').value = '';

    // Reset states
    this.hideError(modal);
    this.hideSuccess(modal);
    this.showLoading(modal, false);
  }
}; 
