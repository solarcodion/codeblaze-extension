// Plan Tab Module
window.PlanTab = (() => {
  let currentProject = null;
  let currentTasks = [];

  // Task status constants
  const TaskStatus = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    BLOCKED: 'blocked'
  };

  function createLoadingState() {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center py-8';
    container.innerHTML = `
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
      <p class="text-zinc-400">Loading project data...</p>
    `;
    return container;
  }

  function createErrorState(error) {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center py-8 text-center';
    container.innerHTML = `
      <svg class="w-12 h-12 text-red-500 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <h3 class="font-medium text-red-500 mb-2">Failed to load project data</h3>
      <p class="text-sm text-zinc-400 mb-4">${error.message}</p>
      <button class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white text-sm transition-colors" onclick="window.PlanTab.retryLoad()">
        Try Again
      </button>
    `;
    return container;
  }

  async function initializeProject() {
    try {
      console.log('[PlanTab] Starting project initialization');
      
      // Check if SupabaseClient is available
      if (!window.SupabaseClient) {
        throw new Error('Supabase client is not initialized');
      }
      
      // Get lovable project ID from URL
      const lovableProjectId = window.location.pathname.split('/').pop();
      console.log('[PlanTab] Extracted lovable project ID:', lovableProjectId);
      
      if (!lovableProjectId) {
        console.log('[PlanTab] No lovable project ID found in URL');
        return null;
      }

      // Try to find project by lovable ID
      console.log('[PlanTab] Searching for existing project with lovable ID');
      const existingProject = await window.SupabaseClient.getProjectByLovableId(lovableProjectId);
      
      if (existingProject && existingProject.length > 0) {
        console.log('[PlanTab] Found existing project:', existingProject[0]);
        // Project already associated, get tasks
        currentProject = existingProject[0];
        
        // Clean up any duplicate tasks before loading
        try {
          const removedCount = await window.SupabaseClient.deduplicateProjectTasks(currentProject.id);
          console.log('[PlanTab] Removed', removedCount, 'duplicate tasks during initialization');
        } catch (error) {
          console.error('[PlanTab] Error deduplicating tasks:', error);
          // Continue loading even if deduplication fails
        }
        
        const tasks = await window.SupabaseClient.getProjectTasks(currentProject.id);
        console.log('[PlanTab] Loaded tasks:', tasks);
        console.log('[PlanTab] Task IDs:', tasks.map(t => t.id));
        
        // Double-check for any duplicates in memory
        const uniqueTasks = Array.from(new Map(tasks.map(task => [
          window.SupabaseClient.createTaskHash(task),
          task
        ])).values());
        
        if (uniqueTasks.length !== tasks.length) {
          console.warn('[PlanTab] Found duplicate tasks after loading. Original:', tasks.length, 'Unique:', uniqueTasks.length);
        }
        currentTasks = uniqueTasks;
        
        // Clean up local storage since we have an associated project
        localStorage.removeItem('currentProjectId');
        
        return currentProject;
      }

      // Check local storage for recent project
      const localProjectId = localStorage.getItem('currentProjectId');
      console.log('[PlanTab] Checking localStorage for project ID:', localProjectId);
      
      if (!localProjectId) {
        console.log('[PlanTab] No project ID found in localStorage');
        return null;
      }

      // Get project from local storage ID
      console.log('[PlanTab] Getting project details from localStorage ID');
      const localProject = await window.SupabaseClient.getProjectById(localProjectId);
      
      if (!localProject || localProject.length === 0) {
        console.log('[PlanTab] No project found for localStorage ID');
        localStorage.removeItem('currentProjectId');
        return null;
      }

      // Check if the local project already has a different lovable ID
      if (localProject[0].lovable_project_id && localProject[0].lovable_project_id !== lovableProjectId) {
        console.log('[PlanTab] Project already associated with different lovable ID');
        localStorage.removeItem('currentProjectId');
        return null;
      }

      // Update project with lovable ID
      console.log('[PlanTab] Updating project with lovable ID');
      await window.SupabaseClient.updateProject(localProjectId, {
        lovable_project_id: lovableProjectId
      });

      // Get updated project and tasks
      currentProject = localProject[0];
      console.log('[PlanTab] Project updated:', currentProject);
      
      currentTasks = await window.SupabaseClient.getProjectTasks(currentProject.id);
      console.log('[PlanTab] Loaded tasks:', currentTasks);
      
      // Clean up local storage after successful association
      localStorage.removeItem('currentProjectId');
      
      return currentProject;
    } catch (error) {
      console.error('[PlanTab] Error in project initialization:', error);
      throw error;
    }
  }

  function getPriorityEmoji(priority) {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '🔥'; // Fire for high priority
      case 'medium':
        return '⚡️'; // Lightning for medium priority
      case 'low':
        return '🌱'; // Seedling for low priority
      default:
        return '⭐️'; // Star for unknown priority
    }
  }

  function getStatusStyles(status) {
    switch (status?.toLowerCase()) {
      case TaskStatus.COMPLETED:
        return 'line-through text-zinc-500';
      case TaskStatus.BLOCKED:
        return 'text-red-400';
      case TaskStatus.IN_PROGRESS:
        return 'text-violet-400';
      default:
        return 'text-zinc-300';
    }
  }

  async function handleTaskStatusChange(taskId, checkbox) {
    try {
      const newStatus = checkbox.checked ? TaskStatus.COMPLETED : TaskStatus.PENDING;
      console.log('[PlanTab] Updating task status:', { taskId, newStatus });
      
      // Update task in database
      const updatedTask = await window.SupabaseClient.updateProjectTask(taskId, {
        status: newStatus
      });
      
      // Update task in local state
      currentTasks = currentTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      
      // Update UI styles
      const taskElement = checkbox.closest('.task-item');
      if (taskElement) {
        const description = taskElement.querySelector('.task-description');
        description.className = `task-description text-sm ${getStatusStyles(newStatus)}`;
      }
      
      console.log('[PlanTab] Task updated successfully:', updatedTask);
    } catch (error) {
      console.error('[PlanTab] Failed to update task status:', error);
      // Revert checkbox state
      checkbox.checked = !checkbox.checked;
      // Show error toast or notification (if you have a notification system)
    }
  }

  function createTooltip(message, type = 'default') {
    const tooltip = document.createElement('div');
    tooltip.className = `
      absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs 
      rounded shadow-lg whitespace-nowrap z-50 transition-all duration-200
      ${type === 'success' ? 'bg-green-900 text-green-100' : 
        type === 'error' ? 'bg-red-900 text-red-100' : 
        'bg-zinc-900 text-zinc-100'}
    `;
    tooltip.textContent = message;
    return tooltip;
  }

  async function handlePromptCopy(taskId, button) {
    const originalButtonContent = button.innerHTML;
    
    try {
      // Remove any existing tooltips
      const existingTooltip = button.querySelector('.tooltip');
      if (existingTooltip) {
        existingTooltip.remove();
      }

      // Show loading state
      button.innerHTML = `
        <div class="flex items-center justify-center">
          <svg class="animate-spin w-4 h-4 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      `;
      button.disabled = true;

      // Add loading tooltip
      const loadingTooltip = createTooltip('Checking for existing prompt...');
      loadingTooltip.classList.add('tooltip');
      button.appendChild(loadingTooltip);

      // Try to get existing prompt
      const existingPrompts = await window.SupabaseClient.getTaskPrompt(taskId);
      let prompt;

      if (existingPrompts && existingPrompts.length > 0) {
        // Use existing prompt
        prompt = existingPrompts[0].prompt;
        console.log('[PlanTab] Using existing prompt:', prompt);
        loadingTooltip.textContent = 'Copying existing prompt...';
      } else {
        // Generate new prompt
        console.log('[PlanTab] Generating new prompt for task:', taskId);
        loadingTooltip.textContent = 'Gathering task context...';
        
        try {
          const generated = await window.SupabaseClient.generateTaskPrompt(taskId);
          console.log('[PlanTab] Generate prompt response:', generated);
          
          // Check for the response structure we expect
          if (!generated || !generated.task_prompt?.raw_response) {
            console.error('[PlanTab] Invalid prompt response structure:', generated);
            throw new Error('Failed to generate prompt: Invalid response');
          }
          
          // Parse the raw response into structured data
          const rawResponse = generated.task_prompt.raw_response;
          const lines = rawResponse.split('\n');
          const promptLine = lines.find(line => line.startsWith('Prompt:'));
          
          if (!promptLine) {
            console.error('[PlanTab] No prompt found in response:', rawResponse);
            throw new Error('Failed to generate prompt: No prompt in response');
          }
          
          // Extract just the prompt text
          prompt = promptLine.replace('Prompt:', '').trim();
          console.log('[PlanTab] Extracted prompt:', prompt);

          // Save the generated prompt with just the required fields
          loadingTooltip.textContent = 'Saving prompt...';
          await window.SupabaseClient.saveTaskPrompt(taskId, prompt);
          console.log('[PlanTab] Saved new prompt:', prompt);
        } catch (genError) {
          console.error('[PlanTab] Error generating prompt:', genError);
          
          // Show specific error messages based on the error
          let errorMessage = 'Failed to generate prompt';
          if (genError.message.includes('Task not found')) {
            errorMessage = 'Task information not found';
          } else if (genError.message.includes('Project not found')) {
            errorMessage = 'Project information not found';
          } else if (genError.message.includes('Invalid response')) {
            errorMessage = 'Invalid response from prompt generator';
          }
          
          throw new Error(errorMessage);
        }
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(prompt);

      // Show success state
      button.innerHTML = `
        <div class="flex items-center justify-center text-green-400">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      `;

      // Update tooltip to success
      loadingTooltip.remove();
      const successTooltip = createTooltip('Prompt copied!', 'success');
      successTooltip.classList.add('tooltip');
      button.appendChild(successTooltip);

      // Reset button after delay
      setTimeout(() => {
        button.innerHTML = originalButtonContent;
        button.disabled = false;
        // Add default tooltip
        // const defaultTooltip = createTooltip('Copy task prompt');
        defaultTooltip.classList.add('tooltip');
        button.appendChild(defaultTooltip);
      }, 2000);

    } catch (error) {
      console.error('[PlanTab] Error handling prompt:', error);
      
      // Show error state
      button.innerHTML = `
        <div class="flex items-center justify-center text-red-400">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      `;

      // Update tooltip to error with specific message
      const errorMessage = error.message.includes('does not exist') ? 
        'System is being updated. Please try again.' : 
        error.message || 'Failed to generate prompt';
      
      const errorTooltip = createTooltip(errorMessage, 'error');
      errorTooltip.classList.add('tooltip');
      button.appendChild(errorTooltip);

      // Reset button after delay
      setTimeout(() => {
        button.innerHTML = originalButtonContent;
        button.disabled = false;
        // Add default tooltip
        // const defaultTooltip = createTooltip('Copy task prompt');
        defaultTooltip.classList.add('tooltip');
        button.appendChild(defaultTooltip);
      }, 2000);
    }
  }

  function createPlanList(tasks = []) {
    console.log('[PlanTab] Creating plan list with tasks:', tasks);
    const container = document.createElement('div');
    container.className = 'flex flex-col gap-3 p-2';

    // If no tasks, show empty state
    if (tasks.length === 0) {
      console.log('[PlanTab] No tasks found, showing empty state');
      const emptyState = document.createElement('div');
      emptyState.className = 'flex flex-col items-center justify-center py-8 text-center';
      emptyState.innerHTML = `
        <svg class="w-12 h-12 text-muted-foreground mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3 class="font-medium text-muted-foreground">No tasks yet</h3>
        <p class="text-sm text-muted-foreground">Improve a prompt to generate tasks</p>
      `;
      container.appendChild(emptyState);
      return container;
    }

    // Create a Set to track unique task IDs
    const processedTaskIds = new Set();

    // Group tasks by phase and feature
    console.log('[PlanTab] Starting task grouping');
    const groupedTasks = tasks.reduce((acc, task) => {
      // Skip if we've already processed this task ID
      if (processedTaskIds.has(task.id)) {
        console.log('[PlanTab] Skipping duplicate task:', task.id);
        return acc;
      }

      const phase = task.phase || 'Uncategorized';
      const feature = task.feature || 'General';
      
      console.log(`[PlanTab] Processing task: ${task.id} for phase: ${phase}, feature: ${feature}`);
      
      if (!acc[phase]) {
        acc[phase] = {};
      }
      if (!acc[phase][feature]) {
        acc[phase][feature] = [];
      }

      // Add task and mark as processed
      acc[phase][feature].push(task);
      processedTaskIds.add(task.id);
      
      return acc;
    }, {});

    console.log('[PlanTab] Grouped tasks:', groupedTasks);

    // Create task cards
    Object.entries(groupedTasks).forEach(([phase, features]) => {
      console.log(`[PlanTab] Creating section for phase: ${phase}`);
      const phaseSection = document.createElement('div');
      phaseSection.className = 'mb-6';
      phaseSection.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-white">${phase}</h3>
          <span class="text-xs text-zinc-500 px-2 py-1 bg-zinc-800/50 rounded-full">
            ${Object.values(features).flat().length} tasks
          </span>
        </div>
      `;

      Object.entries(features).forEach(([feature, tasks]) => {
        console.log(`[PlanTab] Creating card for feature: ${feature} with ${tasks.length} tasks`);
        const featureCard = document.createElement('div');
        featureCard.className = 'bg-zinc-900/50 backdrop-blur-sm text-card-foreground rounded-lg border border-zinc-800/50 p-4 shadow-sm transition-all hover:shadow-md mb-4';
        
        featureCard.innerHTML = `
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-medium text-white flex items-center gap-2">
              ${feature}
              <span class="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded-full">
                ${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </h4>
          </div>
          <div class="space-y-3">
            ${tasks.map(task => `
              <div class="task-item flex items-start gap-3 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                <div class="flex-shrink-0 mt-1">
                  <input type="checkbox" 
                    class="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-violet-500 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer"
                    data-task-id="${task.id || ''}"
                    ${task.status === TaskStatus.COMPLETED ? 'checked' : ''}
                  >
                </div>

                <div class="flex-1 flex items-start gap-2">
                  <span class="flex-shrink-0 text-base leading-none mt-1" title="${task.priority} Priority">
                    ${getPriorityEmoji(task.priority)}
                  </span>
                  <div class="flex-1">
                    <p class="task-description text-sm ${getStatusStyles(task.status)}">${task.description}</p>
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                      <span class="text-xs px-2 py-0.5 bg-zinc-800 rounded-full ${task.priority.toLowerCase() === 'high' ? 'text-red-400' : 
                        task.priority.toLowerCase() === 'medium' ? 'text-yellow-400' : 'text-green-400'}">${task.priority} Priority</span>
                      ${task.status === TaskStatus.BLOCKED ?
                        `<span class="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Blocked</span>` : 
                        task.status === TaskStatus.IN_PROGRESS ?
                        `<span class="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">In Progress</span>` : 
                        task.status === TaskStatus.COMPLETED ?
                        `<span class="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Completed</span>` :
                        ''}
                    </div>
                  </div>
                </div>

                <button class="flex-shrink-0 transition-colors p-2 hover:bg-zinc-700/80 rounded-md relative"
                  title="Copy prompt for this task"
                  data-task-id="${task.id || ''}"
                  onclick="event.preventDefault(); event.stopPropagation();"
                >
                  <svg class="w-4 h-4 text-zinc-400 hover:text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/>
                    <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"/>
                    <path d="M15 2v5h5"/>
                  </svg>
                </button>
              </div>
            `).join('')}
          </div>
        `;

        // Add event listeners for checkboxes
        featureCard.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
          checkbox.addEventListener('change', (e) => {
            const taskId = e.target.dataset.taskId;
            if (taskId) {
              handleTaskStatusChange(taskId, e.target);
            }
          });
        });

        // Add event listeners for copy buttons
        featureCard.querySelectorAll('button[data-task-id]').forEach(button => {
          button.addEventListener('click', (e) => {
            const taskId = e.currentTarget.dataset.taskId;
            if (taskId) {
              handlePromptCopy(taskId, e.currentTarget);
            }
          });
        });

        phaseSection.appendChild(featureCard);
      });

      container.appendChild(phaseSection);
    });

    return container;
  }

  function createEmptyState() {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center py-8 text-center';
    container.innerHTML = `
      <svg class="w-12 h-12 text-zinc-500 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h3 class="font-medium text-zinc-300 mb-2">No Plan Available</h3>
      <p class="text-sm text-zinc-500 mb-4">Generate a plan to start organizing your tasks</p>
      <button id="generate-plan-btn" class="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-md text-white text-sm transition-colors">
        Generate Plan
      </button>
    `;

    // Add event listener programmatically
    const generateButton = container.querySelector('#generate-plan-btn');
    if (generateButton) {
      generateButton.addEventListener('click', () => {
        window.PlanTab.createNewPlan();
      });
    }

    return container;
  }

  function createNewPlanModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 opacity-0 transition-opacity duration-300';
    modal.innerHTML = `
      <div class="relative bg-zinc-900 rounded-lg shadow-xl w-full max-w-lg transform scale-95 opacity-0 transition-all duration-300">
        <div class="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 class="text-lg font-medium text-white">Create New Plan</h2>
          <button id="close-plan-modal" class="text-zinc-400 hover:text-zinc-300 transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="p-4">
          <div class="mb-4">
            <label for="project-description" class="block text-sm font-medium text-zinc-300 mb-2">
              What are you trying to build?
            </label>
            <textarea
              id="project-description"
              class="w-full h-32 px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
              placeholder="Describe your project or feature in detail. The more specific you are, the better the plan will be."
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
          <button id="cancel-plan" class="px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
            Cancel
          </button>
          <button id="start-plan" class="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-md text-white text-sm transition-colors">
            Start Planning
          </button>
        </div>
      </div>
    `;
    return modal;
  }

  function createNewPlan() {
    // Create and append modal
    const modal = createNewPlanModal();
    document.body.appendChild(modal);

    // Set up event listeners
    const closeModal = () => {
      modal.classList.add('opacity-0');
      const modalContent = modal.querySelector('div');
      modalContent.classList.add('scale-95', 'opacity-0');
      setTimeout(() => modal.remove(), 300);
    };

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on button clicks
    modal.querySelector('#close-plan-modal').addEventListener('click', closeModal);
    modal.querySelector('#cancel-plan').addEventListener('click', closeModal);

    // Handle start planning
    modal.querySelector('#start-plan').addEventListener('click', () => {
      const textarea = modal.querySelector('#project-description');
      const description = textarea?.value?.trim();

      if (!description) {
        textarea.classList.add('ring-2', 'ring-red-500');
        return;
      }

      // Remove modal and start improve flow
      closeModal();
      
      // Wait for modal closing animation to complete before opening improve modal
      setTimeout(() => {
        // Find or create the main textarea
        let mainTextarea = document.querySelector('textarea');
        if (!mainTextarea) {
          mainTextarea = document.createElement('textarea');
          document.body.appendChild(mainTextarea);
        }

        // Set the description and trigger the improve flow
        mainTextarea.value = description;
        mainTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        window.ImproveModal.setupModal().openModal();
      }, 300);
    });

    // Show modal with animation
    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0');
      const modalContent = modal.querySelector('div');
      modalContent.classList.remove('scale-95', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');
    });
  }

  async function setupTab() {
    console.log('[PlanTab] Setting up plan tab');
    const container = document.createElement('div');
    container.className = 'flex flex-col gap-3 p-2';

    try {
      // Show loading state
      container.appendChild(createLoadingState());

      // Initialize project and get tasks
      const project = await initializeProject();
      
      // Clear loading state
      container.innerHTML = '';
      
      if (!project) {
        // Show empty state with button to create plan
        container.appendChild(createEmptyState());
      } else {
        // Show plan list
        const planList = createPlanList(currentTasks);
        container.appendChild(planList);
      }
    } catch (error) {
      console.error('[PlanTab] Error setting up tab:', error);
      // Clear container and show error state
      container.innerHTML = '';
      container.appendChild(createErrorState(error));
    }

    return container;
  }

  async function retryLoad() {
    console.log('[PlanTab] Retrying load');
    const container = document.querySelector('#lovify-plan-content');
    if (!container) return;

    try {
      // Show loading state
      container.innerHTML = '';
      container.appendChild(createLoadingState());

      // Retry initialization
      await initializeProject();
      
      // Show plan list
      container.innerHTML = '';
      const planList = createPlanList(currentTasks);
      container.appendChild(planList);
    } catch (error) {
      console.error('[PlanTab] Error in retry:', error);
      // Show error state
      container.innerHTML = '';
      container.appendChild(createErrorState(error));
    }
  }

  function injectPlanTab() {
    // Only inject on projects page
    if (!window.location.pathname.includes('/projects')) {
      return;
    }

    // Find the existing tab list and grid container
    const tabList = document.querySelector('[role="tablist"]');
    if (!tabList || tabList.querySelector('[data-lovify-tab]')) return;

    // Update the grid columns class
    tabList.classList.remove('grid-cols-2');
    tabList.classList.add('grid-cols-3');

    // Create and add the Plan tab button
    const planTab = document.createElement('button');
    planTab.setAttribute('type', 'button');
    planTab.setAttribute('role', 'tab');
    planTab.setAttribute('data-lovify-tab', 'plan');
    planTab.setAttribute('data-state', 'inactive');
    planTab.setAttribute('aria-selected', 'false');
    planTab.setAttribute('data-orientation', 'horizontal');
    planTab.setAttribute('tabindex', '-1');
    planTab.setAttribute('aria-controls', 'lovify-plan-content');
    planTab.setAttribute('id', 'lovify-plan-tab');
    planTab.className = 'justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:shadow flex items-center gap-2 relative data-[state=active]:bg-transparent';
    planTab.innerHTML = `
      <span class="truncate inline z-20 relative text-neutral-50">Plan</span>
      <span class="absolute inset-0 z-10 bg-zinc-600 rounded-md shadow-lg hidden"></span>
    `;

    // Add the Plan tab button to the tab list
    tabList.appendChild(planTab);

    // Create the Plan tab content container
    const contentContainer = document.createElement('div');
    contentContainer.id = 'lovify-plan-content';
    contentContainer.setAttribute('role', 'tabpanel');
    contentContainer.setAttribute('data-lovify-content', 'plan');
    contentContainer.setAttribute('tabindex', '0');
    contentContainer.setAttribute('aria-labelledby', 'lovify-plan-tab');
    contentContainer.className = 'w-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#636575] overflow-y-auto hidden';

    // Show initial loading state
    contentContainer.appendChild(createLoadingState());

    // Setup tab content asynchronously
    setupTab().then(content => {
      contentContainer.innerHTML = '';
      if (content instanceof Node) {
        contentContainer.appendChild(content);
      } else {
        console.error('[PlanTab] Invalid content returned from setupTab');
        contentContainer.appendChild(createErrorState(new Error('Failed to load tab content')));
      }
    }).catch(error => {
      console.error('[PlanTab] Error setting up tab:', error);
      contentContainer.innerHTML = '';
      contentContainer.appendChild(createErrorState(error));
    });

    // Find the parent container for tab content
    const mainContainer = document.querySelector('.flex.flex-col.h-full.max-h-full.w-full');
    if (!mainContainer) return;

    // Find the content container that holds the chat and history panels
    const contentParent = mainContainer.querySelector('.w-full.scrollbar-thin');
    if (!contentParent) return;

    // Find the tablist container and insert our content right after it
    const tabListContainer = mainContainer.querySelector('[dir="ltr"][data-orientation="horizontal"]');
    if (tabListContainer) {
      mainContainer.insertBefore(contentContainer, tabListContainer.nextSibling);
    } else {
      mainContainer.insertBefore(contentContainer, contentParent);
    }

    // Find the form for hiding/showing
    const form = mainContainer.querySelector('form');

    // Set up tab switching
    function switchToTab(tab, isActive) {
      // Update tab state
      tab.setAttribute('aria-selected', isActive.toString());
      tab.setAttribute('data-state', isActive ? 'active' : 'inactive');
      const bg = tab.querySelector('.absolute');
      if (bg) {
        bg.classList.toggle('hidden', !isActive);
      }

      // Update panel visibility
      const panelId = tab.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.toggle('hidden', !isActive);
      }

      // Show/hide other panels
      const otherPanels = mainContainer.querySelectorAll('[role="tabpanel"], .w-full.scrollbar-thin:not([role="tabpanel"])');
      otherPanels.forEach(p => {
        if (p.id !== panelId) {
          p.classList.toggle('hidden', isActive);
        }
      });

      // Show/hide the form
      if (form) {
        form.classList.toggle('hidden', isActive);
      }
    }

    // Handle Plan tab click
    planTab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isActive = planTab.getAttribute('aria-selected') === 'true';
      if (!isActive) {
        // Update all tabs
        const allTabs = tabList.querySelectorAll('[role="tab"]');
        allTabs.forEach(t => {
          switchToTab(t, t === planTab);
        });
      }
    });

    // Handle clicks on other tabs
    const otherTabs = Array.from(tabList.querySelectorAll('[role="tab"]:not([data-lovify-tab])'));
    otherTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Hide plan content and update plan tab
        switchToTab(planTab, false);
      });
    });
  }

  return {
    setupTab,
    injectPlanTab,
    retryLoad,
    createNewPlan
  };
})(); 