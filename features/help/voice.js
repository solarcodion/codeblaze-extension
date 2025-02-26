// Voice mode functionality for the help modal
window.HelpVoice = {
  setupVoiceMode(modal) {
    // Voice mode is disabled for now
    console.log('Voice mode is coming soon!');
    
    /* Voice mode implementation - commented out until ready
    modal.querySelector('[data-action="enable-voice"]').addEventListener('click', () => {
      const modalContainer = modal.querySelector('.bg-zinc-900.rounded-lg');
      const button = modal.querySelector('[data-action="enable-voice"]');
      
      if (!modalContainer || !button) {
        console.error('Could not find modal container or button');
        return;
      }

      if (button.textContent.trim() === 'Enable Voice') {
        console.log('Enabling voice mode');
        modalContainer.innerHTML = `
          <div class="flex flex-col items-center justify-center min-h-[400px] p-12 space-y-8 relative">
            <!-- Header controls - moved outside main content and positioned absolutely -->
            <div class="absolute top-0 right-0 p-6 flex items-center gap-3">
              <button class="hover:bg-zinc-800 rounded-md p-1.5 transition-colors text-zinc-400 hover:text-zinc-200" data-action="minimize" title="Minimize">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
              </button>
              <button class="hover:bg-zinc-800 rounded-md p-1.5 transition-colors text-zinc-400 hover:text-zinc-200" data-action="disable-voice" title="Disable voice mode">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Main content -->
            <div class="flex flex-col items-center justify-center space-y-8 pt-8">
              <!-- Voice indicator -->
              <div class="relative">
                <div class="w-40 h-40 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 animate-pulse flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="voice-ripple"></div>
                    <div class="voice-ripple" style="animation-delay: 0.3s"></div>
                    <div class="voice-ripple" style="animation-delay: 0.6s"></div>
                  </div>
                  <span class="text-white font-medium text-xl z-10 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm">Listening</span>
                </div>
              </div>

              <!-- Status text -->
              <div class="text-center space-y-3">
                <h3 class="text-xl font-medium bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Voice Mode Active</h3>
                <p class="text-sm text-zinc-400">Just start talking to interact</p>
              </div>

              <!-- Action buttons -->
              <div class="flex gap-4 mt-8">
                <button class="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors border border-zinc-700/50 shadow-lg shadow-black/20 backdrop-blur-sm group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-violet-400 group-hover:text-violet-300 transition-colors">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span class="font-medium">Chat</span>
                </button>

                <button class="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors border border-zinc-700/50 shadow-lg shadow-black/20 backdrop-blur-sm group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  <span class="font-medium">Share Screen</span>
                </button>

                <button class="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors border border-zinc-700/50 shadow-lg shadow-black/20 backdrop-blur-sm group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span class="font-medium">Upload</span>
                </button>
              </div>
            </div>
          </div>
        `;

        // Re-attach minimize handler for voice mode
        modalContainer.querySelector('[data-action="minimize"]').addEventListener('click', () => {
          modal.classList.add('minimized');
          // Add a floating indicator that voice mode is still active
          const minimizedBtn = modal.querySelector('[data-minimized-button]');
          minimizedBtn.innerHTML = `
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              <div class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
            </div>
          `;
        });

        // Add handler to return to regular help mode
        modalContainer.querySelector('[data-action="disable-voice"]').addEventListener('click', () => {
          modal.remove();
          const newModal = window.HelpCreate.create();
          document.body.appendChild(newModal);
          window.HelpStyles.addStyles();
          newModal.classList.add('active');
        });

      } else {
        console.log('Disabling voice mode');
        // Switch back to normal mode
        modal.remove();
        const newModal = window.HelpCreate.create();
        document.body.appendChild(newModal);
        window.HelpStyles.addStyles();
        newModal.classList.add('active');
      }
    });
    */
  }
};