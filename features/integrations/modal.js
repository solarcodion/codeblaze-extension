// Integrations Modal Module
window.IntegrationsModal = (() => {
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
    modal.id = 'lovify-integrations-modal';
    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-200 opacity-0 pointer-events-none';
    modal.innerHTML = `
      <div class="bg-zinc-900 rounded-lg border border-zinc-700 w-[95vw] max-w-4xl shadow-lg" role="dialog">
        <div class="p-8 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Integrations</h2>
            <button class="hover:bg-zinc-800 rounded-md p-1.5" data-action="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <p class="text-zinc-400">We have optimized Lovable to work seamlessly with these integrations. All other callable APIs can still be integrated but will often require more context and more instructions.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Runware -->
            <button class="group p-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-violet-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 7v10c0 3-3 3-6 3H9c-3 0-6 0-6-3V7c0-3 3-3 6-3h6c3 0 6 0 6 3Z"/>
                    <path d="M12 8v8"/>
                    <path d="m15 11-3-3-3 3"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Runware</div>
                  <div class="text-sm text-zinc-400">Verified</div>
                </div>
              </div>
              <p class="text-sm text-zinc-400">Make your app generate images from text prompts.</p>
            </button>

            <!-- OpenAI -->
            <button class="group p-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M3 12h3m12 0h3M12 3v3m0 12v3"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">OpenAI</div>
                  <div class="text-sm text-zinc-400">Verified</div>
                </div>
              </div>
              <p class="text-sm text-zinc-400">Add AI capabilities using OpenAI's powerful language models.</p>
            </button>

            <!-- Anthropic -->
            <button class="group p-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/>
                    <path d="M12 8v8"/>
                    <path d="M8 12h8"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Anthropic</div>
                  <div class="text-sm text-zinc-400">Verified</div>
                </div>
              </div>
              <p class="text-sm text-zinc-400">Add powerful AI capabilities using Anthropic's Claude models.</p>
            </button>

            <!-- Stripe -->
            <button class="group p-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-indigo-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12h20M2 12a10 10 0 0 1 20 0M2 12a10 10 0 0 0 20 0"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Stripe</div>
                  <div class="text-sm text-zinc-400">Verified</div>
                </div>
              </div>
              <p class="text-sm text-zinc-400">Add payment processing capabilities to your app using Stripe.</p>
            </button>

            <!-- Three.js -->
            <button class="group p-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 3v18M3 12h18M4.6 4.6l14.8 14.8M19.4 4.6 4.6 19.4"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Three.js</div>
                  <div class="text-sm text-zinc-400">Verified</div>
                </div>
              </div>
              <p class="text-sm text-zinc-400">Add interactive 3D graphics to your app using Three.js.</p>
            </button>

            <!-- Resend -->
            <button class="group p-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-pink-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m22 2-7 20-4-9-9-4Z"/>
                    <path d="M22 2 11 13"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Resend</div>
                  <div class="text-sm text-zinc-400">Verified</div>
                </div>
              </div>
              <p class="text-sm text-zinc-400">Add email capabilities to your app using Resend's modern email API.</p>
            </button>

            <!-- D3.js -->
            <button class="group p-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-yellow-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">D3.js</div>
                  <div class="text-sm text-zinc-400">Verified</div>
                </div>
              </div>
              <p class="text-sm text-zinc-400">Create dynamic, interactive data visualizations using D3.js.</p>
            </button>

            <!-- Highcharts -->
            <button class="group p-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-cyan-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3v18h18"/>
                    <path d="m19 9-5 5-4-4-3 3"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Highcharts</div>
                  <div class="text-sm text-zinc-400">Verified</div>
                </div>
              </div>
              <p class="text-sm text-zinc-400">Create professional, interactive charts and visualizations using Highcharts.</p>
            </button>

            <!-- p5.js -->
            <button class="group p-4 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-red-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">p5.js</div>
                  <div class="text-sm text-zinc-400">Verified</div>
                </div>
              </div>
              <p class="text-sm text-zinc-400">Create creative coding projects and interactive graphics using p5.js.</p>
            </button>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-zinc-700">
            <button class="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300" data-action="cancel">Cancel</button>
            <button class="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-md text-white font-medium" data-action="add">Add Integration</button>
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

    // Handle integration selection
    const integrationButtons = modal.querySelectorAll('.grid button');
    integrationButtons.forEach(button => {
      button.addEventListener('click', () => {
        const integrationName = button.querySelector('.font-medium').textContent;
        const textarea = document.querySelector('textarea');
        if (textarea) {
          // Official Lovable prompts for each integration
          const prompts = {
            'Runware': 'Help me deploy my AI model using Runware',
            'OpenAI': 'Help me create a chat interface using OpenAI',
            'Anthropic': 'Help me create a chat interface using Anthropic\'s Claude',
            'Stripe': 'Help me add Stripe payments to my app',
            'Three.js': 'Build something cool with Three.js',
            'Resend': 'Help me add email capabilities using Resend',
            'D3.js': 'Build something with D3.js',
            'Highcharts': 'Make a chart with Highcharts',
            'p5.js': 'Make something with p5.js'
          };
          
          const prompt = prompts[integrationName] || `Add ${integrationName} integration to my app`;
          updateTextareaValue(textarea, prompt);
          modal.classList.remove('active');
        }
      });
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
    if (!document.querySelector('#lovify-integrations-styles')) {
      const style = document.createElement('style');
      style.id = 'lovify-integrations-styles';
      style.textContent = `
        #lovify-integrations-modal.active {
          opacity: 1;
          pointer-events: auto;
        }
      `;
      document.head.appendChild(style);
    }
  }

  return { create, addStyles };
})();
