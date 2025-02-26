

// Auth Modal Module
window.AuthModal = (() => {
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
    modal.id = 'lovify-auth-modal';
    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-200 opacity-0 pointer-events-none';
    modal.innerHTML = `
      <div class="bg-zinc-900 rounded-lg border border-zinc-700 w-[95vw] max-w-lg shadow-lg" role="dialog">
        <div class="p-6 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Configure Authentication</h2>
            <button class="hover:bg-zinc-800 rounded-md p-1.5" data-action="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Select Authentication Methods</label>
              <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center gap-2 p-3 rounded-md border border-zinc-700 hover:bg-zinc-800 cursor-pointer group">
                  <input type="checkbox" class="form-checkbox rounded border-zinc-600 text-violet-600 focus:ring-violet-600" value="email">
                  <div>
                    <div class="font-medium">Email/Password</div>
                    <div class="text-sm text-zinc-400">Traditional login</div>
                  </div>
                </label>
                <label class="flex items-center gap-2 p-3 rounded-md border border-zinc-700 hover:bg-zinc-800 cursor-pointer group">
                  <input type="checkbox" class="form-checkbox rounded border-zinc-600 text-violet-600 focus:ring-violet-600" value="magic">
                  <div>
                    <div class="font-medium">Magic Link</div>
                    <div class="text-sm text-zinc-400">Passwordless email</div>
                  </div>
                </label>
                <label class="flex items-center gap-2 p-3 rounded-md border border-zinc-700 hover:bg-zinc-800 cursor-pointer group">
                  <input type="checkbox" class="form-checkbox rounded border-zinc-600 text-violet-600 focus:ring-violet-600" value="google">
                  <div>
                    <div class="font-medium">Google</div>
                    <div class="text-sm text-zinc-400">OAuth 2.0</div>
                  </div>
                </label>
                <label class="flex items-center gap-2 p-3 rounded-md border border-zinc-700 hover:bg-zinc-800 cursor-pointer group">
                  <input type="checkbox" class="form-checkbox rounded border-zinc-600 text-violet-600 focus:ring-violet-600" value="facebook">
                  <div>
                    <div class="font-medium">Facebook</div>
                    <div class="text-sm text-zinc-400">OAuth 2.0</div>
                  </div>
                </label>
                <label class="flex items-center gap-2 p-3 rounded-md border border-zinc-700 hover:bg-zinc-800 cursor-pointer group">
                  <input type="checkbox" class="form-checkbox rounded border-zinc-600 text-violet-600 focus:ring-violet-600" value="github">
                  <div>
                    <div class="font-medium">GitHub</div>
                    <div class="text-sm text-zinc-400">OAuth 2.0</div>
                  </div>
                </label>
                <label class="flex items-center gap-2 p-3 rounded-md border border-zinc-700 hover:bg-zinc-800 cursor-pointer group">
                  <input type="checkbox" class="form-checkbox rounded border-zinc-600 text-violet-600 focus:ring-violet-600" value="apple">
                  <div>
                    <div class="font-medium">Apple</div>
                    <div class="text-sm text-zinc-400">Sign in with Apple</div>
                  </div>
                </label>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Additional Features</label>
              <div class="space-y-2">
                <label class="flex items-center gap-2">
                  <input type="checkbox" class="form-checkbox rounded border-zinc-600 text-violet-600 focus:ring-violet-600" value="mfa">
                  <span>Multi-factor Authentication (MFA)</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" class="form-checkbox rounded border-zinc-600 text-violet-600 focus:ring-violet-600" value="roles">
                  <span>Role-based Access Control</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" class="form-checkbox rounded border-zinc-600 text-violet-600 focus:ring-violet-600" value="session">
                  <span>Session Management</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" class="form-checkbox rounded border-zinc-600 text-violet-600 focus:ring-violet-600" value="password-reset">
                  <span>Password Reset Flow</span>
                </label>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2 border-t border-zinc-700">
            <button class="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300" data-action="cancel">Cancel</button>
            <button class="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-md text-white font-medium" data-action="generate">Generate Prompt</button>
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

    modal.querySelector('[data-action="generate"]').addEventListener('click', () => {
      const textarea = document.querySelector('textarea');
      if (!textarea) return;

      // Get selected auth methods
      const authMethods = Array.from(modal.querySelectorAll('input[type="checkbox"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      if (authMethods.length === 0) {
        // Show error or alert
        return;
      }

      // Generate the prompt
      let prompt = 'Implement authentication with the following configuration:\n\n';
      
      // Add auth methods
      const methodNames = {
        email: 'Email/Password authentication',
        magic: 'Magic Link (passwordless) authentication',
        google: 'Google OAuth integration',
        facebook: 'Facebook OAuth integration',
        github: 'GitHub OAuth integration',
        apple: 'Sign in with Apple',
        mfa: 'Multi-factor Authentication',
        roles: 'Role-based Access Control',
        session: 'Session Management',
        'password-reset': 'Password Reset Flow'
      };

      // Group methods by type
      const providers = authMethods.filter(m => ['email', 'magic', 'google', 'facebook', 'github', 'apple'].includes(m));
      const features = authMethods.filter(m => ['mfa', 'roles', 'session', 'password-reset'].includes(m));

      if (providers.length > 0) {
        prompt += 'Authentication Providers:\n';
        providers.forEach(method => {
          prompt += `- ${methodNames[method]}\n`;
        });
        prompt += '\n';
      }

      if (features.length > 0) {
        prompt += 'Additional Features:\n';
        features.forEach(feature => {
          prompt += `- ${methodNames[feature]}\n`;
        });
        prompt += '\n';
      }

      prompt += 'Please include:\n';
      prompt += '- Secure implementation following best practices\n';
      prompt += '- Error handling and validation\n';
      prompt += '- Clear user flows and UI components\n';
      prompt += '- Documentation for setup and configuration';

      updateTextareaValue(textarea, prompt);
      textarea.focus();
      modal.classList.remove('active');
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
    if (!document.querySelector('#lovify-auth-styles')) {
      const style = document.createElement('style');
      style.id = 'lovify-auth-styles';
      style.textContent = `
        #lovify-auth-modal.active {
          opacity: 1;
          pointer-events: auto;
        }
      `;
      document.head.appendChild(style);
    }
  }

  return { create, addStyles };
})(); 