/**
 * Rubber Duck Debug Modal
 * 
 * Features:
 * - Animated rubber duck character
 * - Voice-based debugging steps
 * - Real-time transcription
 * - Prompt generation
 */

function createModal() {
  const modal = document.createElement('div');
  modal.id = 'lovify-rubber-duck-modal';
  modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-200 opacity-0 pointer-events-none';
  
  modal.innerHTML = `
    <div class="bg-zinc-900 rounded-lg border border-zinc-700 w-[600px] shadow-lg overflow-hidden" role="dialog" style="width: 600px; min-width: 600px; max-width: 600px;">
      <div id="rubber-duck-container" class="p-8" style="width: 584px;">
        <div class="flex justify-between items-center mb-6" style="width: 536px;">
          <div class="flex items-center gap-2 overflow-hidden">
            <img src="chrome-extension://${chrome.runtime.id}/assets/duck.svg" width="24" height="24" class="text-yellow-500 flex-shrink-0" />
            <h2 class="text-xl font-semibold truncate">Rubber Duck Debug</h2>
          </div>
          <button class="hover:bg-zinc-800 rounded-md p-1.5 flex-shrink-0" data-action="close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto modal-content" style="width: 536px;">
          <!-- Duck Animation Container -->
          <div class="relative h-32 flex items-center justify-center">
            <div class="duck-container w-32 h-32 relative">
               <img src="chrome-extension://${chrome.runtime.id}/assets/duck.gif" width="128" height="128" class="text-yellow-500" />
            </div>
          </div>

          <!-- Step Progress -->
          <div class="flex justify-center gap-2">
            <div class="w-3 h-3 rounded-full bg-yellow-500" data-step="1"></div>
            <div class="w-3 h-3 rounded-full bg-zinc-600" data-step="2"></div>
          </div>

          <!-- Current Step Display -->
          <div class="text-center space-y-2">
            <div id="rubber-duck-prompt" class="text-2xl font-medium prompt text-yellow-500">What is the problem you're having?</div>
            <div id="rubber-duck-subtext" class="text-sm text-zinc-400">Type your response or use voice input</div>
          </div>

          <!-- Input Controls -->
          <div class="flex flex-col items-center gap-4">
            <!-- Text Input -->
            <div class="w-full">
              <textarea 
                id="rubber-duck-textarea"
                class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
                placeholder="Type your thoughts here or use voice input..."
                rows="4"
              ></textarea>
            </div>
            
            <!-- Voice Input Option -->
            <div class="flex items-center gap-4">
              <button class="record-button w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center group relative" aria-label="Record" aria-pressed="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-zinc-400 group-hover:text-zinc-300">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </button>
              <div class="text-xs text-zinc-500">Click to start/stop voice recording</div>
            </div>
          </div>
        </div>

        <div class="flex justify-between gap-3 pt-4 border-t border-zinc-700" style="width: 536px;">
          <button class="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300" data-action="cancel">Cancel</button>
          <div class="flex gap-2">
            <button class="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300" data-action="back" disabled>Back</button>
            <button class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white font-medium" data-action="next">Next Step</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add styles
  if (!document.querySelector('#lovify-rubber-duck-styles')) {
    const style = document.createElement('style');
    style.id = 'lovify-rubber-duck-styles';
    style.textContent = `
      #lovify-rubber-duck-modal.active {
        opacity: 1;
        pointer-events: auto;
      }

      .modal-content {
        scrollbar-width: thin;
        scrollbar-color: rgb(82 82 91) transparent;
      }

      .modal-content::-webkit-scrollbar {
        width: 6px;
      }

      .modal-content::-webkit-scrollbar-track {
        background: transparent;
      }

      .modal-content::-webkit-scrollbar-thumb {
        background-color: rgb(82 82 91);
        border-radius: 3px;
      }

      @keyframes duckBob {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(2deg); }
      }

      @keyframes duckListen {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
      }

      .duck-svg {
        animation: duckBob 3s ease-in-out infinite;
        transform-origin: center;
      }

      .recording .duck-svg {
        animation: duckListen 1s ease-in-out infinite;
      }

      .record-button.recording {
        background-color: rgb(239 68 68);
      }

      .record-button.recording svg {
        color: white;
      }

      .transcript-placeholder {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        padding: 1rem;
      }

      .transcript:not(:empty) + .transcript-placeholder {
        display: none;
      }

      .prompt {
        font-size: 1.5rem;
        font-weight: 600;
        color: rgb(234 179 8);
      }
    `;
    document.head.appendChild(style);
  }

  let voiceHandler = null;

  function initializeVoiceHandler() {
    const container = modal.querySelector('.space-y-6');
    voiceHandler = new window.RubberDuckVoice(container);
    
    const recordButton = modal.querySelector('.record-button');
    const duckContainer = modal.querySelector('.duck-container');
    const textInput = modal.querySelector('textarea');
    
    // Handle text input
    textInput.addEventListener('input', (e) => {
      if (voiceHandler) {
        voiceHandler.transcripts[voiceHandler.currentStep] = e.target.value;
      }
    });

    // Function to start recording
    const startRecording = () => {
      voiceHandler.startListening();
      duckContainer.classList.add('recording');
      recordButton.classList.add('recording');
      recordButton.setAttribute('aria-pressed', 'true');
    };

    // Function to stop recording
    const stopRecording = () => {
      if (voiceHandler.isListening) {
        voiceHandler.stopListening();
        duckContainer.classList.remove('recording');
        recordButton.classList.remove('recording');
        recordButton.setAttribute('aria-pressed', 'false');
      }
    };
    
    // Handle record button interactions - toggle behavior
    recordButton.addEventListener('click', () => {
      if (voiceHandler.isListening) {
        stopRecording();
      } else {
        startRecording();
      }
    });

    // Handle modal close to ensure recording stops
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        stopRecording();
      }
    });

    // Handle navigation buttons
    const nextButton = modal.querySelector('[data-action="next"]');
    const backButton = modal.querySelector('[data-action="back"]');
    
    nextButton.addEventListener('click', () => {
      // Only show preview if we're on the last step and moving forward
      if (voiceHandler.currentStep === voiceHandler.steps.length - 1) {
        showPromptPreview();
      } else {
        voiceHandler.nextStep();
      }
    });

    backButton.addEventListener('click', () => {
      if (voiceHandler.currentStep > 0) {
        voiceHandler.previousStep();
        nextButton.textContent = 'Next Step';
      }
    });
  }

  function showPromptPreview() {
    const container = modal.querySelector('.space-y-6');
    const prompt = voiceHandler.generatePrompt();
    
    container.innerHTML = `
      <div class="space-y-6">
        <div class="font-medium text-lg text-center">Time to reflect 🤔</div>
        <div class="bg-zinc-800/50 rounded-lg p-6 space-y-6">
          <div class="space-y-4">
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-yellow-500">The problem you described:</h3>
              <p class="text-sm text-zinc-300">${voiceHandler.transcripts[0] || 'Not specified'}</p>
            </div>
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-yellow-500">Your expected behavior:</h3>
              <p class="text-sm text-zinc-300">${voiceHandler.transcripts[1] || 'Not specified'}</p>
            </div>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-sm font-medium text-yellow-500">Rubber Duck Says:</h3>
            <div class="space-y-2 text-sm text-zinc-300">
              <p>Now that you've explained it out loud, take a moment to:</p>
              <ul class="list-disc pl-4 space-y-1">
                <li>Review your explanation step by step</li>
                <li>Consider any assumptions you've made</li>
                <li>Think about edge cases</li>
                <li>Look for any missing requirements</li>
                <li>Question if your expected behavior matches your actual needs</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button class="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 font-medium" data-action="start-over">
            Start Over
          </button>
          <button class="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white font-medium flex items-center justify-center gap-2" data-action="send">
            <span>Continue to Chat</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Hide the default navigation buttons
    const navigationButtons = modal.querySelector('.flex.justify-between.gap-3.pt-4.border-t.border-zinc-700');
    if (navigationButtons) {
      navigationButtons.style.display = 'none';
    }

    // Handle start over button
    container.querySelector('[data-action="start-over"]').addEventListener('click', () => {
      // Reset the container to its initial state
      container.innerHTML = `
        <!-- Duck Animation Container -->
        <div class="relative h-32 flex items-center justify-center">
          <div class="duck-container w-32 h-32 relative">
             <img src="chrome-extension://${chrome.runtime.id}/assets/duck.gif" width="128" height="128" class="text-yellow-500" />
          </div>
        </div>

        <!-- Step Progress -->
        <div class="flex justify-center gap-2">
          <div class="w-3 h-3 rounded-full bg-yellow-500" data-step="1"></div>
          <div class="w-3 h-3 rounded-full bg-zinc-600" data-step="2"></div>
        </div>

        <!-- Current Step Display -->
        <div class="text-center space-y-2">
          <div id="rubber-duck-prompt" class="text-2xl font-medium prompt text-yellow-500">What is the problem you're having?</div>
          <div id="rubber-duck-subtext" class="text-sm text-zinc-400">Type your response or use voice input</div>
        </div>

        <!-- Input Controls -->
        <div class="flex flex-col items-center gap-4">
          <!-- Text Input -->
          <div class="w-full">
            <textarea 
              id="rubber-duck-textarea"
              class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
              placeholder="Type your thoughts here or use voice input..."
              rows="4"
            ></textarea>
          </div>
          
          <!-- Voice Input Option -->
          <div class="flex items-center gap-4">
            <button class="record-button w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center group relative" aria-label="Record" aria-pressed="false">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-zinc-400 group-hover:text-zinc-300">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </button>
            <div class="text-xs text-zinc-500">Click to start/stop voice recording</div>
          </div>
        </div>
      `;

      // Show the navigation buttons again
      const navigationButtons = modal.querySelector('.flex.justify-between.gap-3.pt-4.border-t.border-zinc-700');
      if (navigationButtons) {
        navigationButtons.style.display = 'flex';
      }

      // Reset the voice handler state
      voiceHandler.currentStep = 0;
      voiceHandler.transcripts = [];
      
      // Reinitialize the voice handler with the fresh content
      initializeVoiceHandler();
    });

    // Handle send button click
    container.querySelector('[data-action="send"]').addEventListener('click', () => {
      // Find textarea and insert prompt
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.value = prompt;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      // Reset modal state
      voiceHandler.cleanup();
      voiceHandler = null;
      modal.classList.remove('active');
    });
  }

  // Initialize voice handler when modal opens
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  modal.querySelector('[data-action="close"]').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Initialize when modal is first opened
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        if (modal.classList.contains('active') && !voiceHandler) {
          initializeVoiceHandler();
        }
      }
    });
  });

  observer.observe(modal, { attributes: true });

  return modal;
}

window.RubberDuckModal = {
  create: createModal
}; 