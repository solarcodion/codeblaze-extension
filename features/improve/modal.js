// Improve Modal Module
window.ImproveModal = (() => {
  let modalInstance = null;

  const loadingMessages = [
    "Brewing a cup of code coffee...",
    "Teaching rubber ducks to code...",
    "Consulting with AI elders...",
    "Untangling spaghetti code...",
    "Debugging the debugger...",
    "Converting caffeine to code...",
    "Reticulating splines...",
    "Gathering wisdom from Stack Overflow...",
    "Summoning the coding wizards...",
    "Feeding the binary hamsters..."
  ];

  function createModal() {
    const content = `
      <div id="improve-modal-root" class="flex flex-col h-full">
        <div id="improve-modal-header" class="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 class="text-lg font-medium text-white">Improve Your Prompt</h2>
          <button id="close-enhance-modal" class="text-zinc-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div id="enhance-loading" class="flex-1 flex items-center justify-center opacity-0 transition-opacity duration-300 min-h-[300px]">
          <div id="improve-loading-content" class="text-center">
            <video class="w-32 h-32 mx-auto mb-6" autoplay loop muted playsinline>
              <source src="${chrome.runtime.getURL('assets/loading.webm')}" type="video/webm">
            </video>
            <p class="text-lg font-medium text-white mb-2" id="loading-message">Generating improvement plan...</p>
            <p class="text-zinc-400 text-sm">This might take a few seconds</p>
          </div>
        </div>

        <div id="enhance-error" class="hidden flex-1 flex items-center justify-center min-h-[300px]">
          <div id="improve-error-content" class="text-center">
            <div class="text-red-400 mb-4">
              <svg class="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <p class="text-lg font-medium text-white mb-2">Something went wrong</p>
            <p class="text-zinc-400 text-sm mb-4">Please try again</p>
            <button id="retry-button" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm text-white transition-colors">
              Try Again
            </button>
          </div>
        </div>

        <div id="enhance-content" class="hidden opacity-0 transition-opacity duration-300 flex-1 overflow-y-auto">
          <!-- Content will be populated here -->
        </div>

        <div id="improve-modal-footer" class="flex gap-3 justify-end p-4 border-t border-zinc-800">
          <button id="cancel-enhance" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm text-white transition-colors">
            Cancel
          </button>
          <div id="improve-modal-actions" class="flex items-center gap-3">
            <button id="generate-new" class="hidden items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm text-white transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generate New
            </button>
            <button id="accept-plan" class="hidden items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm text-white font-medium transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Accept PRD
            </button>
          </div>
        </div>
      </div>
    `;

    return window.ModalContainer.createContainer(content);
  }

  async function generatePRD(prompt) {
    try {
      console.log('Sending prompt to API:', prompt);

      const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/prompt-chain-prd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PRD');
      }

      const data = await response.json();
      console.log('Raw API response:', data);

      // Parse the response text directly
      const parsedPRD = parseResponse(data.text || data);
      console.log('Parsed PRD:', parsedPRD);

      return { prd: parsedPRD };

    } catch (error) {
      console.error('Error generating PRD:', error);
      throw error;
    }
  }

  function parseResponse(responseText) {
    try {
      console.log('Raw response text:', responseText);

      // Step 1: Get the raw_response string
      const rawResponse = typeof responseText === 'string' 
        ? responseText 
        : responseText.raw_response;
      console.log('Raw response string:', rawResponse);

      // Step 2: Clean up the string to get just the JSON
      const jsonStr = rawResponse
        .replace(/<think>[\s\S]*?<\/think>/g, '')  // Remove think blocks
        .replace(/^[\s\S]*?```json\n/, '')         // Remove everything up to ```json
        .replace(/\n```[\s\S]*$/, '')              // Remove everything after ```
        .trim();
      console.log('Extracted JSON string:', jsonStr);

      // Step 3: Parse the JSON
      const data = JSON.parse(jsonStr);
      console.log('Parsed JSON data:', data);
      
      if (!data.product_plan) {
        throw new Error('Invalid response format - missing product_plan');
      }

      return data.product_plan;
    } catch (error) {
      console.error('Error parsing response:', error);
      throw error;
    }
  }

  function populatePRD(prd) {
    const modal = modalInstance;
    if (!modal) return;

    const content = modal.querySelector('#enhance-content');
    content.innerHTML = `
      <div class="p-6">
        <div class="space-y-6">
          ${createSection('Overview', prd.overview)}

          <!-- Goals -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium text-white">Goals</h3>
            </div>
            <div class="grid grid-cols-1 gap-4">
              ${createGoalSection('Technical Goals', prd.goals.technical, 'blue')}
              ${createGoalSection('Features', prd.goals.features, 'green')}
              ${createGoalSection('Constraints', prd.goals.constraints, 'yellow')}
            </div>
          </div>

          ${createSection('User Stories', prd.user_stories.map(story => 
            `<div class="flex items-start gap-2 mb-2">
              <span class="text-blue-400 mt-0.5">👤</span>
              <span class="text-gray-300 text-sm">${story}</span>
            </div>`
          ).join(''))}

          ${createSection('Functional Requirements', 
            `<div class="space-y-3">
              ${prd.functional_requirements.map(req => 
                `<div class="flex items-start gap-2 bg-zinc-800/30 rounded-lg p-3">
                  <div class="shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                    req.priority === 'High' ? 'bg-pink-500/20 text-pink-300' :
                    req.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-blue-500/20 text-blue-300'
                  }">${req.priority}</div>
                  <p class="text-gray-300 text-sm flex-1">${req.description}</p>
                </div>`
              ).join('')}
            </div>`
          )}

          ${createSection('User Experience', prd.user_experience)}
          ${createSection('Technical Considerations', prd.technical_considerations)}
          ${prd.integrations ? createSection('Integrations', prd.integrations.map(integration => `<li class="mb-2 text-sm">${integration}</li>`).join('')) : ''}
          ${prd.pages ? createSection('Pages', prd.pages.map(page => `<li class="mb-2 text-sm">${page}</li>`).join('')) : ''}
          ${prd.narrative ? createSection('Development Narrative', prd.narrative) : ''}
        </div>
      </div>
    `;
  }

  function createSection(title, content) {
    return `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-medium text-white">${title}</h3>
        </div>
        <div class="bg-zinc-800/30 rounded-lg p-4">
          <div class="text-gray-300 text-sm">
            ${Array.isArray(content) ? `<ul class="list-disc pl-4 space-y-1">${content}</ul>` : content}
          </div>
        </div>
      </div>
    `;
  }

  function createGoalSection(title, goals, color) {
    return `
      <div class="bg-zinc-800/50 rounded-lg p-4">
        <h4 class="text-${color}-400 font-medium mb-3 text-sm">${title}</h4>
        <ul class="list-disc pl-4 text-gray-300 text-sm space-y-2">
          ${goals.map(goal => `<li>${goal}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  let currentPRD = null;

  function cycleLoadingMessages() {
    let currentIndex = 0;
    const messageElement = modalInstance?.querySelector('#loading-message');
    if (!messageElement) return;

    const interval = setInterval(() => {
      if (!modalInstance || !messageElement) {
        clearInterval(interval);
        return;
      }
      messageElement.textContent = loadingMessages[currentIndex];
      currentIndex = (currentIndex + 1) % loadingMessages.length;
    }, 2000); // Change message every 2 seconds

    return interval;
  }

  function showError() {
    const modal = modalInstance;
    if (!modal) return;

    const loading = modal.querySelector('#enhance-loading');
    const error = modal.querySelector('#enhance-error');
    const content = modal.querySelector('#enhance-content');
    const acceptButton = modal.querySelector('#accept-plan');
    const generateNewButton = modal.querySelector('#generate-new');

    loading.classList.add('opacity-0');
    content.classList.add('opacity-0');
    acceptButton.classList.add('hidden');
    generateNewButton.classList.add('hidden');

    setTimeout(() => {
      loading.classList.add('hidden');
      content.classList.add('hidden');
      error.classList.remove('hidden');
    }, 300);

    // Set up retry button
    const retryButton = modal.querySelector('#retry-button');
    retryButton.addEventListener('click', () => {
      error.classList.add('hidden');
      loading.classList.remove('hidden', 'opacity-0');
      const prompt = document.querySelector('textarea')?.value.trim();
      if (prompt) {
        const messageInterval = cycleLoadingMessages();
        generatePRD(prompt)
          .then(data => {
            clearInterval(messageInterval);
            currentPRD = data.prd;
            populatePRD(data.prd);
            loading.classList.add('opacity-0');
            setTimeout(() => {
              loading.classList.add('hidden');
              content.classList.remove('hidden');
              acceptButton.classList.remove('hidden');
              generateNewButton.classList.remove('hidden');
              setTimeout(() => {
                content.classList.remove('opacity-0');
                acceptButton.classList.add('flex');
                generateNewButton.classList.add('flex');
              }, 50);
            }, 300);
          })
          .catch(() => {
            clearInterval(messageInterval);
            showError();
          });
      }
    });
  }

  function getUserFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('firebaseLocalStorageDb');
      
      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['firebaseLocalStorage'], 'readonly');
        const objectStore = transaction.objectStore('firebaseLocalStorage');
        
        // Get all records since we need to find the one with firebase auth
        const getAllRequest = objectStore.getAll();
        
        getAllRequest.onerror = () => reject(new Error('Failed to read from IndexedDB'));
        
        getAllRequest.onsuccess = () => {
          const records = getAllRequest.result;
          // Find the auth user record
          const userRecord = records.find(record => {
            try {
              return record.value && record.value.email;
            } catch (e) {
              return false;
            }
          });
          
          if (!userRecord) {
            reject(new Error('User not found in IndexedDB'));
            return;
          }
          
          resolve(userRecord.value);
        };
      };
    });
  }

  function setupModal() {
    const closeModal = () => {
      if (!modalInstance) return;

      const modalContent = modalInstance.querySelector('div');
      modalInstance.classList.add('opacity-0');
      modalContent.classList.remove('scale-100', 'opacity-100');
      modalContent.classList.add('scale-95', 'opacity-0');
      
      // Remove modal after animation
      setTimeout(() => {
        if (modalInstance && modalInstance.parentElement) {
          modalInstance.parentElement.removeChild(modalInstance);
        }
        modalInstance = null;
      }, 300);
    };

    const openModal = async () => {
      // Get the current prompt from textarea
      const textarea = document.querySelector('textarea');
      if (!textarea) return;
      
      const prompt = textarea.value.trim();
      if (!prompt) return;

      // Create new modal instance
      modalInstance = createModal();
      document.body.appendChild(modalInstance);
      
      // Set up event listeners
      modalInstance.addEventListener('click', (e) => {
        if (e.target === modalInstance) {
          closeModal();
        }
      });

      modalInstance.querySelector('#close-enhance-modal').addEventListener('click', closeModal);
      modalInstance.querySelector('#cancel-enhance').addEventListener('click', closeModal);

      // Accept plan button handler
      const acceptButton = modalInstance.querySelector('#accept-plan');
      acceptButton.addEventListener('click', async () => {
        const prompt = document.querySelector('textarea')?.value.trim();
        if (!prompt || !currentPRD) return;

        try {
          // Get user data from IndexedDB
          const userData = await getUserFromIndexedDB();
          const userEmail = userData.email;

          if (!userEmail) {
            throw new Error('User email not found');
          }

          // Create project via API
          const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/create-project', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: prompt.substring(0, 100), // Use first 100 chars of prompt as title
              user_email: userEmail,
              prd: currentPRD
            })
          });

          if (!response.ok) {
            throw new Error('Failed to create project');
          }

          const projectData = await response.json();
          
          // Save project ID to local storage
          localStorage.setItem('currentProjectId', projectData.id);

          // Only open action plan after successful save
          window.ActionPlan.openModal(prompt, currentPRD);
          closeModal();
        } catch (error) {
          console.error('Error in project creation:', error);
          // Show error state
          showError();
        }
      });

      // Add handler for Generate New button
      modalInstance.querySelector('#generate-new').addEventListener('click', () => {
        const loading = modalInstance.querySelector('#enhance-loading');
        const content = modalInstance.querySelector('#enhance-content');
        const acceptButton = modalInstance.querySelector('#accept-plan');

        content.classList.add('opacity-0');
        setTimeout(() => {
          content.classList.add('hidden');
          loading.classList.remove('hidden', 'opacity-0');
          
          const prompt = document.querySelector('textarea')?.value.trim();
          if (prompt) {
            const messageInterval = cycleLoadingMessages();
            generatePRD(prompt)
              .then(data => {
                clearInterval(messageInterval);
                currentPRD = data.prd;
                populatePRD(data.prd);
                loading.classList.add('opacity-0');
                setTimeout(() => {
                  loading.classList.add('hidden');
                  content.classList.remove('hidden');
                  acceptButton.classList.remove('hidden');
                  setTimeout(() => {
                    content.classList.remove('opacity-0');
                    acceptButton.classList.add('flex');
                  }, 50);
                }, 300);
              })
              .catch(() => {
                clearInterval(messageInterval);
                showError();
              });
          }
        }, 300);
      });

      // Trigger animation after a brief delay
      requestAnimationFrame(() => {
        modalInstance.classList.remove('opacity-0');
        const modalContent = modalInstance.querySelector('div');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');

        // Show initial loading state
        const loading = modalInstance.querySelector('#enhance-loading');
        loading.classList.remove('opacity-0');
        
        // Start cycling loading messages
        const messageInterval = cycleLoadingMessages();
        
        // Generate initial PRD
        generatePRD(prompt)
          .then(data => {
            clearInterval(messageInterval);
            currentPRD = data.prd;
            populatePRD(data.prd);
            loading.classList.add('opacity-0');
            setTimeout(() => {
              loading.classList.add('hidden');
              const content = modalInstance.querySelector('#enhance-content');
              content.classList.remove('hidden');
              acceptButton.classList.remove('hidden');
              setTimeout(() => {
                content.classList.remove('opacity-0');
                acceptButton.classList.add('flex');
              }, 50);
            }, 300);
          })
          .catch(error => {
            clearInterval(messageInterval);
            console.error('Error generating initial PRD:', error);
            showError();
          });
      });
    };

    return { openModal, closeModal };
  }

  return { setupModal };
})(); 