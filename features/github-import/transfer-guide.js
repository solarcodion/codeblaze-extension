// GitHub Transfer Guide Module
window.GitHubTransferGuide = (() => {
  let modalInstance = null;
  let currentStep = 0;

  function createModal() {
    //console.log('Creating transfer guide modal');
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center pointer-events-none';
    modal.innerHTML = `
      <div class="absolute inset-0 pointer-events-none"></div>
      <div class="relative bg-[#1C1C1C] border border-[#383838] shadow-lg rounded-xl w-[600px] pointer-events-auto">
        <div class="flex items-center justify-between p-6 border-b border-[#383838] bg-red-500/10">
          <div>
            <h3 class="text-xl font-semibold text-red-400">Import GitHub Repository</h3>
            <p class="text-sm text-[#888888] mt-1">Follow these steps to complete the repository import</p>
          </div>
        </div>
        <div class="guide-content">
          <div class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="flex items-start gap-3 p-4 rounded-lg bg-[#242424] border border-[#383838]">
                <div class="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-base font-medium text-red-400 shrink-0 mt-0.5">1</div>
                <div>
                  <p class="text-sm font-medium text-red-400">Click "Edit code" button</p>
                  <p class="text-sm text-[#888888] mt-1">Look for the button in the top-right corner of the screen</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 rounded-lg bg-[#242424] border border-[#383838]">
                <div class="w-8 h-8 rounded-full bg-[#383838] flex items-center justify-center text-base font-medium text-white shrink-0 mt-0.5">2</div>
                <div>
                  <p class="text-sm font-medium text-white">Click "Transfer repository"</p>
                  <p class="text-sm text-[#888888] mt-1">Look for the GitHub icon in the dropdown menu</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 rounded-lg bg-[#242424] border border-[#383838]">
                <div class="w-8 h-8 rounded-full bg-[#383838] flex items-center justify-center text-base font-medium text-white shrink-0 mt-0.5">3</div>
                <div>
                  <p class="text-sm font-medium text-white">Copy and paste the new repository URL</p>
                  <p class="text-sm text-[#888888] mt-1">The URL will be displayed after clicking Transfer repository</p>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-sm font-medium text-white block">
                Paste the new repository URL here
              </label>
              <input 
                type="text" 
                id="new-repo-url" 
                placeholder="https://github.com/username/repo" 
                class="flex h-10 w-full rounded-md border border-[#383838] bg-[#242424] px-3 py-2 text-sm text-white placeholder:text-[#888888] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#383838]"
              >
              <div id="loading-animation" class="hidden">
                <div class="flex items-center justify-center space-x-2 py-2">
                  <div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  <span class="text-sm text-[#888888]">Transferring repository...</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-2 border-t border-[#383838] p-6">
            <p class="text-sm text-[#888888]">You can continue using the editor while keeping this modal open</p>
            <button 
              id="transfer-button"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              disabled
            >
              Start Transfer
            </button>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  function highlightButton(selector, text) {
    const button = Array.from(document.querySelectorAll('button')).find(
      btn => btn.textContent.includes(text)
    );
    
    if (button) {
      button.style.position = 'relative';
      button.style.zIndex = '48';
      button.classList.add('ring-2', 'ring-red-400', 'ring-offset-2', 'ring-offset-[#1C1C1C]');
      
      // Remove highlight when clicked
      button.addEventListener('click', () => {
        button.classList.remove('ring-2', 'ring-red-400', 'ring-offset-2', 'ring-offset-[#1C1C1C]');
      }, { once: true });
    }
  }

  async function handleTransfer(sourceUrl, targetUrl) {
   // console.log('Starting repository transfer:', { sourceUrl, targetUrl });
    const loadingAnimation = modalInstance.querySelector('#loading-animation');
    const transferButton = modalInstance.querySelector('#transfer-button');
    
    try {
      loadingAnimation.classList.remove('hidden');
      transferButton.disabled = true;

      const token = localStorage.getItem('github_token');
      const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/github-transfer-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sourceRepo: sourceUrl,
          targetRepo: targetUrl,
          githubToken: token
        })
      });

      if (!response.ok) {
        throw new Error('Transfer failed');
      }

      //console.log('Transfer successful, cleaning up storage');
      localStorage.removeItem('github_token');
      localStorage.removeItem('github_import_repo');

      // Update loading message
      const loadingText = modalInstance.querySelector('#loading-animation span');
      if (loadingText) {
        loadingText.textContent = 'Transfer complete! Finalizing changes...';
      }

      // Wait for 5 seconds before refreshing
      await new Promise(resolve => setTimeout(resolve, 7500));
      window.location.reload();
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('Failed to transfer repository. Please try again.');
      loadingAnimation.classList.add('hidden');
      transferButton.disabled = false;
    }
  }

  function setupModal() {
    if (modalInstance) {
      modalInstance.remove();
    }

    modalInstance = createModal();
    document.body.appendChild(modalInstance);

    // Make background click-through except for the modal itself
    modalInstance.addEventListener('click', (e) => {
      if (e.target === modalInstance) {
        // Don't close on background click
        e.preventDefault();
      }
    });

    // Highlight the Edit code button initially
    highlightButton('button', 'Edit code');

    const urlInput = modalInstance.querySelector('#new-repo-url');
    const transferButton = modalInstance.querySelector('#transfer-button');
    
    // Enable transfer button when URL is entered
    urlInput.addEventListener('input', () => {
      transferButton.disabled = !urlInput.value.trim();
    });

    modalInstance.querySelector('#transfer-button').addEventListener('click', () => {
      const newRepoUrl = urlInput.value.trim();
      const sourceUrl = localStorage.getItem('github_import_repo');

      if (!newRepoUrl) {
        alert('Please paste the new repository URL');
        return;
      }

      if (!newRepoUrl.match(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+(?:\.git)?$/)) {
        alert('Please enter a valid GitHub repository URL');
        return;
      }

      handleTransfer(sourceUrl, newRepoUrl);
    });
  }

  function init() {
   // console.log('Initializing GitHub Transfer Guide');
    if (!window.location.pathname.match(/^\/projects\/[^/]+$/)) {
      //console.log('Not on a project page, skipping guide');
      return;
    }

    const token = localStorage.getItem('github_token');
    const repoUrl = localStorage.getItem('github_import_repo');
    
    if (!token || !repoUrl) {
      //console.log('Missing required storage items:', { hasToken: !!token, hasRepoUrl: !!repoUrl });
      return;
    }

    //console.log('Found required storage items, showing transfer modal');
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(setupModal, 1000));
    } else {
      setTimeout(setupModal, 1000);
    }
  }

  init();

  return { setupModal };
})(); 