// Action Plan Module
window.ActionPlan = (() => {
  let modalInstance = null;
  let currentActionPlan = null;

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
    "Feeding the binary hamsters...",
    "Breaking down tasks...",
    "Organizing implementation steps...",
    "Crafting the perfect prompt...",
    "Preparing your development path...",
    "Setting up the context..."
  ];

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

  function createModal() {
    const content = `
      <div id="action-plan-root" class="flex flex-col h-full">
        <div id="action-plan-header" class="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 class="text-lg font-medium text-white">Action Plan</h2>
          <button id="close-action-modal" class="text-zinc-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Loading State -->
        <div id="action-loading" class="flex-1 flex items-center justify-center min-h-[300px] opacity-0 transition-opacity duration-300">
          <div id="action-loading-content" class="text-center">
            <video class="w-32 h-32 mx-auto mb-6" autoplay loop muted playsinline>
              <source src="${chrome.runtime.getURL('assets/loading.webm')}" type="video/webm">
            </video>
            <p id="loading-message" class="text-lg font-medium text-white mb-2">Generating action plan...</p>
            <p class="text-zinc-400 text-sm">This might take a few seconds</p>
          </div>
        </div>

        <!-- Error State -->
        <div id="action-error" class="hidden flex-1 flex items-center justify-center min-h-[300px]">
          <div id="action-error-content" class="text-center">
            <div class="text-red-400 mb-4">
              <svg class="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <p class="text-lg font-medium text-white mb-2">Something went wrong</p>
            <p class="text-zinc-400 text-sm mb-4">Failed to generate action plan</p>
            <button id="retry-button" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm text-white transition-colors">
              Try Again
            </button>
          </div>
        </div>

        <!-- Content -->
        <div id="action-content" class="flex-1 overflow-auto opacity-0 transition-opacity duration-300 hidden"></div>

        <!-- Footer -->
        <div id="action-plan-footer" class="flex justify-end gap-3 p-4 border-t border-zinc-800">
          <button id="cancel-action" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 font-medium transition-colors">
            Cancel
          </button>
          <button id="start-implementation" class="hidden px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-md text-white font-medium transition-colors">
            Start Implementation
          </button>
        </div>
      </div>
    `;

    return window.ModalContainer.createContainer(content);
  }

  async function generateActionPlan(prompt, prd) {
    try {
      console.log('Sending to action plan API:', { prompt, prd });

      const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/prompt-chain-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, prd })
      });

      console.log('API Response Status:', response.status);
      console.log('API Response Status Text:', response.statusText);
      
      const responseText = await response.text();
      console.log('Raw Response Text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to generate action plan: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.log('Invalid JSON response:', responseText);
        throw new Error('Invalid JSON response from API');
      }

      console.log('Raw action plan API response:', data);

      // Parse the response text
      const parsedPlan = parseResponse(data.text || data);
      console.log('Parsed action plan:', parsedPlan);

      return { plan: parsedPlan };

    } catch (error) {
      console.error('Detailed error in generateActionPlan:', {
        error: error.toString(),
        stack: error.stack,
        message: error.message
      });
      throw error;
    }
  }

  function parseResponse(responseText) {
    try {
      console.log('Raw response text:', responseText);

      // If responseText is already an object (from JSON.parse in generateActionPlan)
      if (typeof responseText === 'object' && responseText !== null) {
        // If it has action_plan property, return that
        if (responseText.action_plan) {
          return responseText.action_plan;
        }
        // Otherwise return the object itself
        return responseText;
      }

      // If it's a string, try to parse it
      const data = JSON.parse(responseText);
      return data.action_plan || data;
    } catch (error) {
      console.error('Error parsing response:', error);
      throw error;
    }
  }

  function populateActionPlan(plan) {
    const modal = modalInstance;
    if (!modal) return;

    const content = modal.querySelector('#action-content');
    content.innerHTML = `
      <div class="p-6 space-y-6">
        ${plan.phases.map(phase => `
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-white">${phase.name}</h3>
            ${phase.features.map(feature => `
              <div class="bg-zinc-800/50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-white mb-3">${feature.name}</h4>
                <div class="space-y-2">
                  ${feature.tasks.map(task => `
                    <div class="flex items-start gap-3">
                      <div class="flex-shrink-0 w-2 h-2 mt-2 rounded-full ${getPriorityColor(task.priority)}"></div>
                      <div class="flex-1">
                        <p class="text-sm text-zinc-300">${task.description}</p>
                        <span class="text-xs text-zinc-500">${task.priority} Priority</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  function getPriorityColor(priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-zinc-500';
    }
  }

  function createSection(title, content) {
    return `
      <div>
        <h3 class="text-lg font-medium text-white mb-3">${title}</h3>
        <div class="bg-zinc-800/50 rounded-lg p-4 text-sm text-zinc-300">
          ${Array.isArray(content) ? content : content}
        </div>
      </div>
    `;
  }

  function showError() {
    const modal = modalInstance;
    if (!modal) return;

    const loading = modal.querySelector('#action-loading');
    const errorElement = modal.querySelector('#action-error');
    const content = modal.querySelector('#action-content');
    const startButton = modal.querySelector('#start-implementation');

    loading.classList.add('opacity-0');
    content.classList.add('opacity-0');
    startButton.classList.add('hidden');

    setTimeout(() => {
      loading.classList.add('hidden');
      content.classList.add('hidden');
      errorElement.classList.remove('hidden');
    }, 300);
  }

  function setupStartImplementation(prompt, prd, plan) {
    const modal = modalInstance;
    if (!modal) return;

    const startButton = modal.querySelector('#start-implementation');
    if (!startButton) return;

    console.log('Setting up start implementation button with:', {
      prompt,
      prd,
      plan
    });

    async function updateProjectPlan(projectId, actionPlan) {
      const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/update-project-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Zm5kbHBheHVkcmxyeHNxbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDExNDUsImV4cCI6MjA1MTY3NzE0NX0.DCxziRVYTIIk6w07YbUa0AZJqIp5K9mR68iGVom9Qy0'
        },
        body: JSON.stringify({
          project_id: projectId,
          action_plan: actionPlan
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update project plan');
      }

      return await response.json();
    }

    async function createProjectTask(projectId, phase, feature, task) {
      console.log('[ActionPlan] Creating task:', { projectId, phase, feature, task });
      
      // Check for existing tasks with the same content
      const existingTasks = await window.SupabaseClient.getProjectTasks(projectId);
      const taskHash = window.SupabaseClient.createTaskHash({ phase, feature, description: task.description });
      
      const duplicate = existingTasks.find(t => window.SupabaseClient.createTaskHash(t) === taskHash);
      if (duplicate) {
        console.log('[ActionPlan] Task already exists:', duplicate);
        return duplicate;
      }

      const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/create-project-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Zm5kbHBheHVkcmxyeHNxbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDExNDUsImV4cCI6MjA1MTY3NzE0NX0.DCxziRVYTIIk6w07YbUa0AZJqIp5K9mR68iGVom9Qy0'
        },
        body: JSON.stringify({
          project_id: projectId,
          phase: phase,
          feature: feature,
          description: task.description,
          priority: task.priority
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create task: ${task.description}`);
      }

      return await response.json();
    }

    async function createAllProjectTasks(projectId, actionPlan) {
      console.log('[ActionPlan] Starting task creation for project:', projectId);
      const tasks = [];
      let taskCount = 0;
      const totalTasks = actionPlan.phases.reduce((count, phase) => 
        count + phase.features.reduce((featureCount, feature) => 
          featureCount + feature.tasks.length, 0), 0);

      // First, deduplicate any existing tasks
      try {
        const removedCount = await window.SupabaseClient.deduplicateProjectTasks(projectId);
        console.log(`[ActionPlan] Removed ${removedCount} duplicate tasks before creating new ones`);
      } catch (error) {
        console.error('[ActionPlan] Error deduplicating tasks:', error);
        // Continue with task creation even if deduplication fails
      }

      for (const phase of actionPlan.phases) {
        for (const feature of phase.features) {
          for (const task of feature.tasks) {
            taskCount++;
            updateLoadingMessage(`Creating task ${taskCount} of ${totalTasks}...`);
            try {
              const createdTask = await createProjectTask(projectId, phase.name, feature.name, task);
              tasks.push(createdTask);
            } catch (error) {
              console.error(`[ActionPlan] Error creating task:`, error);
              // Continue with other tasks even if one fails
            }
          }
        }
      }

      console.log('[ActionPlan] Task creation complete. Created tasks:', tasks.length);
      return tasks;
    }

    function updateLoadingMessage(message) {
      const loadingMessage = modal.querySelector('#loading-message');
      if (loadingMessage) {
        loadingMessage.textContent = message;
      }
    }

    function showLoadingState() {
      const startButton = modal.querySelector('#start-implementation');
      const content = modal.querySelector('#action-content');
      const loading = modal.querySelector('#action-loading');

      // Disable the start button
      if (startButton) {
        startButton.disabled = true;
      }

      // Hide content and show loading
      if (content) content.classList.add('hidden');
      if (loading) {
        loading.classList.remove('hidden');
        loading.classList.remove('opacity-0');
      }

      // Start cycling loading messages
      return cycleLoadingMessages();
    }

    startButton.addEventListener('click', async () => {
      try {
        // Show loading state and start cycling messages
        const messageInterval = showLoadingState();
        
        // Get project ID from localStorage
        const projectId = localStorage.getItem('currentProjectId');
        if (!projectId) {
          throw new Error('No project ID found');
        }

        // Update project plan
        updateLoadingMessage('Updating project plan...');
        await updateProjectPlan(projectId, plan);

        // Create all tasks
        updateLoadingMessage('Creating project tasks...');
        const createdTasks = await createAllProjectTasks(projectId, plan);

        // Generate and insert the first prompt
        updateLoadingMessage('Generating first prompt...');
        // Get first task ID (first task of first feature of first phase)
        const firstTask = createdTasks[0];
        
        try {
          await window.FirstPrompt.generateAndInsert(prompt, prd, plan, firstTask?.id);
          // Only close the modal after successful prompt generation
          clearInterval(messageInterval);
          closeModal();
        } catch (error) {
          console.error('Error generating first prompt:', error);
          clearInterval(messageInterval);
          throw error; // Re-throw to be caught by outer catch block
        }
      } catch (error) {
        console.error('Error in start implementation:', error);
        
        // Show error state in the modal
        const loading = modalInstance.querySelector('#action-loading');
        const errorElement = modalInstance.querySelector('#action-error');
        const content = modalInstance.querySelector('#action-content');
        
        loading.classList.add('opacity-0');
        content.classList.add('opacity-0');
        
        setTimeout(() => {
          loading.classList.add('hidden');
          content.classList.add('hidden');
          errorElement.classList.remove('hidden');
        }, 300);

        // Enable retry via the retry button
        const retryButton = modalInstance.querySelector('#retry-button');
        if (retryButton) {
          retryButton.addEventListener('click', () => {
            errorElement.classList.add('hidden');
            content.classList.remove('hidden', 'opacity-0');
            startButton.disabled = false;
          });
        }
      }
    });
  }

  async function openModal(prompt, prd) {
    try {
      // Create new modal instance
      modalInstance = createModal();
      document.body.appendChild(modalInstance);
      
      // Set up event listeners
      modalInstance.addEventListener('click', (e) => {
        if (e.target === modalInstance) {
          closeModal();
        }
      });

      modalInstance.querySelector('#close-action-modal').addEventListener('click', closeModal);
      modalInstance.querySelector('#cancel-action').addEventListener('click', closeModal);

      // Trigger animation after a brief delay
      requestAnimationFrame(() => {
        modalInstance.classList.remove('opacity-0');
        const modalContent = modalInstance.querySelector('div');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');

        // Show initial loading state
        const loading = modalInstance.querySelector('#action-loading');
        loading.classList.remove('opacity-0');
        
        // Start cycling loading messages
        const messageInterval = cycleLoadingMessages();
        
        // Generate action plan
        generateActionPlan(prompt, prd)
          .then(data => {
            clearInterval(messageInterval);
            currentActionPlan = data.plan;
            populateActionPlan(data.plan);
            loading.classList.add('opacity-0');
            setTimeout(() => {
              loading.classList.add('hidden');
              const content = modalInstance.querySelector('#action-content');
              content.classList.remove('hidden');
              const startButton = modalInstance.querySelector('#start-implementation');
              startButton.classList.remove('hidden');
              setTimeout(() => {
                content.classList.remove('opacity-0');
                startButton.classList.add('flex');
              }, 50);
            }, 300);
            setupStartImplementation(prompt, prd, data.plan);
          })
          .catch(error => {
            clearInterval(messageInterval);
            console.error('Error generating action plan:', error);
            showError();
          });
      });
    } catch (error) {
      console.error('Error generating action plan:', error);
      showError();
    }
  }

  function closeModal() {
    if (!modalInstance) return;
    
    modalInstance.classList.add('opacity-0');
    const modalContent = modalInstance.querySelector('div');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
      document.body.removeChild(modalInstance);
      modalInstance = null;
      currentActionPlan = null;
    }, 300);
  }

  return {
    openModal
  };
})(); 