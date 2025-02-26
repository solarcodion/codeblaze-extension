// Supabase Client Module
window.SupabaseClient = (() => {
  const SUPABASE_URL = 'https://bxfndlpaxudrlrxsqmik.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Zm5kbHBheHVkcmxyeHNxbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDExNDUsImV4cCI6MjA1MTY3NzE0NX0.DCxziRVYTIIk6w07YbUa0AZJqIp5K9mR68iGVom9Qy0';

  // Add initialization flag and promise
  let isInitialized = false;
  let initializationPromise = null;

  // Helper function for Supabase REST calls
  async function supabaseFetch(path, options = {}) {
    // Ensure client is initialized before making any request
    if (!isInitialized) {
      await ensureInitialized();
    }

    const url = `${SUPABASE_URL}${path}`;
    const finalUrl = options.params ? `${url}?${options.params}` : url;
    
    console.log(`[Supabase] Making request to: ${path}`, {
      method: options.method,
      params: options.params,
      body: options.body
    });

    try {
      const headers = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        ...options.headers
      };

      const response = await fetch(finalUrl, {
        ...options,
        headers
      });

      const responseData = await response.json().catch(() => null);
      console.log(`[Supabase] Response from ${path}:`, {
        status: response.status,
        ok: response.ok,
        data: responseData
      });

      if (!response.ok) {
        throw new Error(`Supabase API error: ${response.status} ${response.statusText}\nResponse: ${JSON.stringify(responseData)}`);
      }

      return responseData;
    } catch (error) {
      console.error(`[Supabase] Error in request to ${path}:`, error);
      throw error;
    }
  }

  // Initialize function to ensure client is ready
  async function initialize() {
    try {
      console.log('[Supabase] Starting initialization');
      
      // Test connection with a simple request to the projects table
      const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?limit=0`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to initialize Supabase client: ${error}`);
      }
      
      isInitialized = true;
      console.log('[Supabase] Client initialized successfully');
    } catch (error) {
      console.error('[Supabase] Initialization failed:', error);
      isInitialized = false;
      initializationPromise = null;
      throw error;
    }
  }

  // Ensure initialization happens only once
  async function ensureInitialized() {
    if (isInitialized) return;
    
    if (!initializationPromise) {
      initializationPromise = initialize();
    }
    
    await initializationPromise;
  }

  async function getProjectByLovableId(lovableProjectId) {
    console.log('[Supabase] Getting project by lovable ID:', lovableProjectId);
    return supabaseFetch('/rest/v1/projects', {
      method: 'GET',
      headers: {
        'Range': '0-0',
        'Prefer': 'count=exact'
      },
      params: new URLSearchParams({
        'lovable_project_id': `eq.${lovableProjectId}`,
        'select': '*'
      }).toString()
    });
  }

  async function getProjectById(projectId) {
    console.log('[Supabase] Getting project by ID:', projectId);
    return supabaseFetch('/rest/v1/projects', {
      method: 'GET',
      headers: {
        'Range': '0-0',
        'Prefer': 'count=exact'
      },
      params: new URLSearchParams({
        'id': `eq.${projectId}`,
        'select': '*'
      }).toString()
    });
  }

  async function updateProject(projectId, updates) {
    console.log('[Supabase] Updating project:', { projectId, updates });
    return supabaseFetch(`/rest/v1/projects`, {
      method: 'PATCH',
      headers: {
        'Prefer': 'return=minimal'
      },
      params: new URLSearchParams({
        'id': `eq.${projectId}`
      }).toString(),
      body: JSON.stringify(updates)
    });
  }

  async function getProjectTasks(projectId) {
    console.log('[Supabase] Getting tasks for project:', projectId);
    
    // Get the current lovable project ID from URL
    const lovableProjectId = window.location.pathname.split('/').pop();
    
    return supabaseFetch('/rest/v1/project_tasks', {
      method: 'GET',
      params: new URLSearchParams({
        'project_id': `eq.${projectId}`,
        'select': '*,project:project_id(id,lovable_project_id)',
        'project.lovable_project_id': `eq.${lovableProjectId}`,
        'order': 'order_index.asc'
      }).toString()
    });
  }

  async function updateProjectTask(taskId, updates) {
    console.log('[Supabase] Updating task:', { taskId, updates });
    return supabaseFetch('/functions/v1/update-project-task', {
      method: 'POST',
      body: JSON.stringify({
        task_id: taskId,
        ...updates
      })
    });
  }

  async function getTaskPrompt(taskId) {
    console.log('[Supabase] Getting prompt for task:', taskId);
    return supabaseFetch('/rest/v1/project_prompts', {
      method: 'GET',
      headers: {
        'Range': '0-0',
        'Prefer': 'count=exact'
      },
      params: new URLSearchParams({
        'task_id': `eq.${taskId}`,
        'select': '*'
      }).toString()
    });
  }

  async function getTaskContext(taskId) {
    console.log('[Supabase] Getting complete context for task:', taskId);
    
    // Get the current lovable project ID from URL
    const lovableProjectId = window.location.pathname.split('/').pop();
    
    return supabaseFetch('/rest/v1/project_tasks', {
      method: 'GET',
      params: new URLSearchParams({
        'id': `eq.${taskId}`,
        'select': 'id,description,phase,feature,project_id,project:project_id!inner(id,prd,action_plan,lovable_project_id)',
        'project.lovable_project_id': `eq.${lovableProjectId}`
      }).toString()
    });
  }

  async function generateTaskPrompt(taskId) {
    console.log('[Supabase] Generating prompt for task:', taskId);
    
    // First get the complete task context
    const taskContexts = await getTaskContext(taskId);
    if (!taskContexts || taskContexts.length === 0) {
      throw new Error('Task not found');
    }
    
    const taskContext = taskContexts[0];
    if (!taskContext.project) {
      throw new Error('Project not found for task');
    }

    // Prepare the complete request body
    const requestBody = {
      task_id: taskId,
      prd: taskContext.project.prd,
      action_plan: taskContext.project.action_plan,
      phase: taskContext.phase,
      feature: taskContext.feature,
      task: taskContext.description
    };

    return supabaseFetch('/functions/v1/generate-task-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
  }

  async function saveTaskPrompt(taskId, prompt) {
    console.log('[Supabase] Saving prompt for task:', { taskId, prompt });
    return supabaseFetch('/rest/v1/project_prompts', {
      method: 'POST',
      headers: {
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        task_id: taskId,
        prompt: prompt
      })
    });
  }

  function createTaskHash(task) {
    // Create a unique hash based on task content
    return `${task.phase || ''}-${task.feature || ''}-${task.description || ''}`.toLowerCase().trim();
  }

  async function deleteProjectTask(taskId) {
    console.log('[Supabase] Deleting task:', taskId);
    return supabaseFetch('/rest/v1/project_tasks', {
      method: 'DELETE',
      headers: {
        'Prefer': 'return=minimal'
      },
      params: new URLSearchParams({
        'id': `eq.${taskId}`
      }).toString()
    });
  }

  async function deduplicateProjectTasks(projectId) {
    console.log('[Supabase] Starting task deduplication for project:', projectId);
    
    // Get all tasks for the project
    const tasks = await getProjectTasks(projectId);
    console.log('[Supabase] Found tasks:', tasks.length);
    
    // Group tasks by their content hash
    const tasksByHash = tasks.reduce((acc, task) => {
      const hash = createTaskHash(task);
      if (!acc[hash]) {
        acc[hash] = [];
      }
      acc[hash].push(task);
      return acc;
    }, {});

    // Track duplicates found
    let duplicatesRemoved = 0;

    // For each group of duplicate tasks, keep the first one and delete the rest
    for (const [hash, duplicates] of Object.entries(tasksByHash)) {
      if (duplicates.length > 1) {
        console.log(`[Supabase] Found ${duplicates.length} duplicates for hash: ${hash}`);
        // Keep the first task (preferably a completed one if it exists)
        const sortedDuplicates = duplicates.sort((a, b) => {
          // Prioritize completed tasks
          if (a.status === 'completed' && b.status !== 'completed') return -1;
          if (b.status === 'completed' && a.status !== 'completed') return 1;
          // Then prioritize tasks with more metadata (prompts, etc.)
          return 0;
        });
        
        const [keep, ...remove] = sortedDuplicates;
        
        // Delete duplicate tasks
        for (const task of remove) {
          try {
            await deleteProjectTask(task.id);
            duplicatesRemoved++;
          } catch (error) {
            console.error(`[Supabase] Error deleting duplicate task ${task.id}:`, error);
          }
        }
      }
    }

    console.log(`[Supabase] Deduplication complete. Removed ${duplicatesRemoved} duplicate tasks`);
    return duplicatesRemoved;
  }

  return {
    initialize: ensureInitialized,
    getProjectByLovableId,
    getProjectById,
    updateProject,
    getProjectTasks,
    updateProjectTask,
    getTaskPrompt,
    generateTaskPrompt,
    saveTaskPrompt,
    getTaskContext,
    createTaskHash,
    deleteProjectTask,
    deduplicateProjectTasks
  };
})(); 