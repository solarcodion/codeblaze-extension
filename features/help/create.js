// Modal creation functionality
window.HelpCreate = {
  create() {
    const modal = document.createElement('div');
    modal.id = 'lovify-help-modal';
    modal.className = 'absolute inset-0 bg-black/80 flex items-center justify-center transition-opacity duration-200 opacity-0 pointer-events-none';
    modal.innerHTML = `
      <div class="bg-zinc-900 rounded-lg border border-zinc-700 w-[90%] max-w-2xl shadow-lg p-6 relative" data-modal-container>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Lovify Help</h2>
          <div class="flex gap-2">
            <button class="hover:bg-zinc-800 rounded-md p-1.5 transition-colors" data-action="minimize" title="Minimize">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </svg>
            </button>
            <button class="hover:bg-zinc-800 rounded-md p-1.5 transition-colors" data-action="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Voice Mode Banner -->
        <div class="mb-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent"></div>
          <div class="relative flex items-center gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-violet-500">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <div class="flex-grow">
              <h3 class="text-lg font-medium text-violet-500 mb-1">Voice Mode - Coming Soon!</h3>
              <p class="text-sm text-zinc-300">We're working hard to bring you voice command capabilities.</p>
            </div>
            <a href="https://lovify.featurebase.app/" 
               target="_blank" 
               rel="noopener noreferrer"
               class="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-md transition-colors">
              Vote on Feature
            </a>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-6">
          <input type="text" 
                 placeholder="Ask a question..." 
                 class="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                 data-search-input>
          <button class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors"
                  data-search-button>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        <!-- Loading Animation (Hidden by default) -->
        <div class="hidden flex-col items-center justify-center py-12 space-y-6" data-loading-animation>
          <div class="relative">
            <svg class="w-12 h-12 text-violet-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="heart-ripple"></div>
              <div class="heart-ripple" style="animation-delay: 0.3s"></div>
              <div class="heart-ripple" style="animation-delay: 0.6s"></div>
            </div>
          </div>
          <div class="text-center space-y-2">
            <p class="text-violet-300 font-medium text-loading-message" data-loading-message>Searching for answers with love...</p>
            <p class="text-sm text-zinc-400">This might take a moment</p>
          </div>
        </div>

        <!-- Search Results (Hidden by default) -->
        <div class="hidden space-y-4" data-search-results>
          <div class="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 max-h-[400px] overflow-y-auto custom-scrollbar">
            <div class="prose prose-invert prose-sm max-w-none" data-answer-text>
            </div>
          </div>
          <div class="flex items-center justify-between gap-4 mt-4">
            <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 rounded-md transition-colors border border-zinc-700/50" data-action="back-to-menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Menu
            </button>
            <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-300 hover:text-violet-200 bg-violet-500/10 hover:bg-violet-500/20 rounded-md transition-colors border border-violet-500/20" data-action="new-question">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Question
            </button>
          </div>
        </div>

        <!-- Default Content -->
        <div class="grid grid-cols-2 gap-6" data-default-content>
          <!-- Quick Resources -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-zinc-400">Quick Resources</h3>
            <div class="space-y-2">
              <a href="https://lovable.dev/support" target="_blank" rel="noopener noreferrer" 
                 class="w-full flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors group">
                <div class="flex-shrink-0 w-8 h-8 rounded-md bg-green-500/10 text-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium group-hover:text-green-500 transition-colors">Support</div>
                  <div class="text-sm text-zinc-400">Get help with your issues</div>
                </div>
              </a>

              <a href="https://lovable.dev/blog" target="_blank" rel="noopener noreferrer" 
                 class="w-full flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors group">
                <div class="flex-shrink-0 w-8 h-8 rounded-md bg-pink-500/10 text-pink-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium group-hover:text-pink-500 transition-colors">Blog</div>
                  <div class="text-sm text-zinc-400">Read latest updates & guides</div>
                </div>
              </a>

              <a href="https://feedback.lovable.dev" target="_blank" rel="noopener noreferrer" 
                 class="w-full flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors group">
                <div class="flex-shrink-0 w-8 h-8 rounded-md bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium group-hover:text-yellow-500 transition-colors">Feedback</div>
                  <div class="text-sm text-zinc-400">Share your suggestions</div>
                </div>
              </a>
            </div>
          </div>

          <!-- Additional Quick Resources -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-zinc-400"></h3>
            <div class="space-y-2">
              <a href="https://docs.lovable.dev/introduction" target="_blank" rel="noopener noreferrer" 
                 class="w-full flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors group">
                <div class="flex-shrink-0 w-8 h-8 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium group-hover:text-blue-500 transition-colors">Documentation</div>
                  <div class="text-sm text-zinc-400">Read guides & API docs</div>
                </div>
              </a>

              <a href="https://www.youtube.com/@lovable-labs" target="_blank" rel="noopener noreferrer" 
                 class="w-full flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors group">
                <div class="flex-shrink-0 w-8 h-8 rounded-md bg-red-500/10 text-red-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium group-hover:text-red-500 transition-colors">Video Tutorials</div>
                  <div class="text-sm text-zinc-400">Watch step-by-step guides</div>
                </div>
              </a>

              <a href="https://discord.gg/MCwNMUDQd2" target="_blank" rel="noopener noreferrer" 
                 class="w-full flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 text-left transition-colors group">
                <div class="flex-shrink-0 w-8 h-8 rounded-md bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium group-hover:text-indigo-500 transition-colors">Discord Community</div>
                  <div class="text-sm text-zinc-400">Join the discussion</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Minimized floating button -->
      <button class="fixed bottom-4 right-4 bg-zinc-900 border border-zinc-700 rounded-full p-3 shadow-lg hidden items-center justify-center hover:bg-zinc-800 transition-colors" data-minimized-button>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </button>
    `;

    return modal;
  }
}; 