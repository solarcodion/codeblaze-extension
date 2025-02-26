// GitHub Import Modal Module
window.GitHubImportModal = (() => {
  let modalInstance = null;

  function createModal() {
    const modal = document.createElement('div');
    modal.id = 'github-import-modal';
    modal.className = 'fixed inset-0 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="relative bg-[#1C1C1C] border border-[#383838] shadow-lg rounded-xl max-w-[400px] scale-95 opacity-0 transition-all duration-200">
        <div class="flex flex-col space-y-1.5 p-6 pb-4">
          <h3 class="text-lg font-semibold leading-none tracking-tight text-white">Import from GitHub</h3>
          <p class="text-sm text-[#888888]">Enter repository details to import</p>
        </div>
        <div class="px-6 space-y-4">
          <!-- Token Instructions -->
          <div class="rounded-lg border border-[#383838] bg-[#242424] overflow-hidden">
            <div class="flex cursor-pointer items-center justify-between p-4" id="token-instructions-header">
              <h4 class="text-sm font-medium text-white">How to Generate a GitHub Token</h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transform transition-transform text-[#888888]">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
            <div class="hidden border-t border-[#383838]" id="token-instructions-content">
              <div class="p-4 text-[#888888]">
                <ol class="list-decimal ml-4 text-sm space-y-2">
                  <li>Go to <a href="https://github.com/settings/tokens" target="_blank" class="text-blue-400 hover:underline">GitHub Token Settings</a></li>
                  <li>Click "Generate new token" → "Generate new token (classic)"</li>
                  <li>Set a note (e.g., "Lovify Import")</li>
                  <li>Select expiration (recommended: 30 days)</li>
                  <li>Select scopes:
                    <ul class="list-disc ml-4 mt-1">
                      <li>✓ repo (Full control)</li>
                    </ul>
                  </li>
                  <li>Click "Generate Token"</li>
                  <li>Copy the token (you won't see it again!)</li>
                </ol>
              </div>
            </div>
          </div>

          <!-- Input Fields -->
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-white" for="github-url">
                GitHub Repository URL
              </label>
              <input 
                type="text" 
                id="github-url" 
                placeholder="https://github.com/username/repo" 
                class="flex h-10 w-full rounded-md border border-[#383838] bg-[#242424] px-3 py-2 text-sm text-white placeholder:text-[#888888] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#383838]"
              >
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-white" for="github-token">
                GitHub Personal Access Token
              </label>
              <input 
                type="password" 
                id="github-token" 
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                class="flex h-10 w-full rounded-md border border-[#383838] bg-[#242424] px-3 py-2 text-sm text-white placeholder:text-[#888888] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#383838]"
              >
            </div>
          </div>

          <div id="loading-animation" class="hidden py-2">
            <div class="flex items-center justify-center space-x-2">
              <div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
              <span class="text-sm text-[#888888]">Processing import...</span>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end space-x-2 border-t border-[#383838] p-4 mt-6">
          <button 
            id="close-modal"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 border border-[#383838] bg-[#242424] text-white hover:bg-[#2A2A2A] transition-colors"
          >
            Cancel
          </button>
          <button 
            id="import-button"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors"
          >
            Import Repository
          </button>
        </div>
      </div>
    `;
    return modal;
  }

  function setupModal() {
    const closeModal = () => {
      if (!modalInstance) return;
      
      const modalContent = modalInstance.querySelector('div');
      modalInstance.classList.add('data-[state=closed]:fade-out-0');
      modalContent.classList.remove('scale-100', 'opacity-100');
      modalContent.classList.add('scale-95', 'opacity-0');
      
      setTimeout(() => {
        if (modalInstance && modalInstance.parentElement) {
          modalInstance.parentElement.removeChild(modalInstance);
        }
        modalInstance = null;
      }, 200);
    };

    const openModal = () => {
      modalInstance = createModal();
      document.body.appendChild(modalInstance);
      
      // Setup token instructions accordion
      const header = modalInstance.querySelector('#token-instructions-header');
      const content = modalInstance.querySelector('#token-instructions-content');
      const arrow = header.querySelector('svg');
      
      header.addEventListener('click', () => {
        content.classList.toggle('hidden');
        arrow.style.transform = content.classList.contains('hidden') ? '' : 'rotate(180deg)';
      });

      // Setup event listeners
      modalInstance.addEventListener('click', (e) => {
        if (e.target === modalInstance) {
          closeModal();
        }
      });

      modalInstance.querySelector('#close-modal').addEventListener('click', closeModal);

      modalInstance.querySelector('#import-button').addEventListener('click', async () => {
        const urlInput = modalInstance.querySelector('#github-url');
        const tokenInput = modalInstance.querySelector('#github-token');
        const loadingAnimation = modalInstance.querySelector('#loading-animation');
        const importButton = modalInstance.querySelector('#import-button');

        const repoUrl = urlInput.value.trim();
        const token = tokenInput.value.trim();

        if (!repoUrl || !token) {
          alert('Please enter both repository URL and GitHub token');
          return;
        }

        // Validate GitHub URL format - allow .git at the end
        if (!repoUrl.match(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+(?:\.git)?$/)) {
          alert('Please enter a valid GitHub repository URL');
          return;
        }

        // Show loading animation
        loadingAnimation.classList.remove('hidden');
        importButton.disabled = true;

        try {
        //  console.log('Starting repository validation for:', repoUrl);
          // Validate if it's a Vite project
          const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/github-validate-repo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              repoUrl: repoUrl,
              githubToken: token
            })
          });

        //  console.log('Validation response status:', response.status);
          const responseText = await response.text();
        //  console.log('Raw response:', responseText);

          if (!response.ok) {
           console.error('Validation failed with status:', response.status);
           console.error('Response text:', responseText);
            throw new Error(`Failed to validate repository (Status ${response.status}). This repository must be a Vite project.`);
          }

          let data;
          try {
            data = JSON.parse(responseText);
           // console.log('Parsed validation response:', data);
          } catch (e) {
            console.error('Failed to parse validation response:', e);
            throw new Error('Invalid response from validation service');
          }
          
          if (!data.isVite) {
          //  console.log('Repository validation failed: Not a Vite project');
            alert('This repository must be a Vite project. Please make sure you\'re importing a Vite-based React project.');
            loadingAnimation.classList.add('hidden');
            importButton.disabled = false;
            return;
          }

         // console.log('Repository validation successful, proceeding with import');

          // Save to local storage
          localStorage.setItem('github_import_repo', repoUrl);
          localStorage.setItem('github_token', token);

          // Update textarea with initial prompt
          const textarea = document.querySelector('textarea');
          if (textarea) {
            textarea.value = 'We are importing a repo from github';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));

            // Find and click the submit button
            const submitButton = document.querySelector('#chatinput-send-message-button');
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.click();
            }

            // Start observing for project creation
            const observer = new MutationObserver((mutations, obs) => {
              const editButton = document.querySelector('button:has(span:contains("Edit code"))');
              if (editButton) {
                obs.disconnect();
                window.GitHubTransferGuide.startGuide();
              }
            });
            
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
          }

          closeModal();
        } catch (error) {
          console.error('Validation failed:', error);
          alert('Failed to validate repository. Please make sure the repository exists, is a Vite project, and the token has correct permissions.');
          loadingAnimation.classList.add('hidden');
          importButton.disabled = false;
        }
      });

      requestAnimationFrame(() => {
        modalInstance.classList.add('data-[state=open]:fade-in-0');
        const modalContent = modalInstance.querySelector('div');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
      });
    };

    return { openModal, closeModal };
  }

  return { setupModal };
})(); 