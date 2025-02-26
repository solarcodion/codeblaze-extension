// Initialize Plan Tab
(async function initializePlanTab() {
  // Wait for DOM content to be loaded
  if (document.readyState !== 'complete') {
    await new Promise(resolve => {
      window.addEventListener('load', resolve);
    });
  }

  try {
    // Only initialize on project pages
    if (!window.location.pathname.includes('/projects/')) {
      return;
    }

    console.log('[PlanTab] Starting initialization');

    // Wait for Supabase client to be available
    let retries = 0;
    const maxRetries = 10;
    const retryInterval = 500; // 500ms

    while (!window.SupabaseClient && retries < maxRetries) {
      console.log(`[PlanTab] Waiting for Supabase client (attempt ${retries + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
      retries++;
    }

    if (!window.SupabaseClient) {
      console.error('[PlanTab] Failed to find Supabase client after retries');
      return;
    }

    // Initialize Supabase client
    console.log('[PlanTab] Initializing Supabase client');
    try {
      await window.SupabaseClient.initialize();
      console.log('[PlanTab] Supabase client initialized successfully');
    } catch (error) {
      console.error('[PlanTab] Failed to initialize Supabase client:', error);
      return;
    }

    // Wait for Plan Tab module to be available
    retries = 0;
    while (!window.PlanTab && retries < maxRetries) {
      console.log(`[PlanTab] Waiting for Plan Tab module (attempt ${retries + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
      retries++;
    }

    if (!window.PlanTab) {
      console.error('[PlanTab] Failed to find Plan Tab module after retries');
      return;
    }

    // Check if we're on a project page with an ID
    const projectId = window.location.pathname.split('/').pop();
    if (!projectId) {
      console.log('[PlanTab] No project ID in URL, skipping injection');
      return;
    }

    // Inject Plan Tab
    console.log('[PlanTab] Starting injection');
    window.PlanTab.injectPlanTab();
    console.log('[PlanTab] Injection complete');
  } catch (error) {
    console.error('[PlanTab] Initialization failed:', error);
  }
})(); 
