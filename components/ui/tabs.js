// Tabs Component
window.Tabs = (() => {
  function createTabs() {
    const container = document.createElement('div');
    container.className = 'flex flex-col h-full max-h-full w-full pl-2';
    
    const tabList = document.createElement('div');
    tabList.className = 'pb-1 pr-2 md:pr-0';
    tabList.innerHTML = `
      <div role="tablist" aria-orientation="horizontal" class="items-center justify-center rounded-lg grid w-full border-border border h-auto bg-zinc-700 p-0.5 shadow-sm text-neutral-50 grid-cols-3" tabindex="0" data-orientation="horizontal" style="outline: none;">
        <button type="button" role="tab" aria-selected="true" data-tab="chat" class="justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:shadow flex items-center gap-2 relative data-[state=active]:bg-transparent">
          <span class="truncate inline z-20 relative text-neutral-50">Chat</span>
          <span class="absolute inset-0 z-10 bg-zinc-600 rounded-md shadow-lg hidden"></span>
        </button>
        <button type="button" role="tab" aria-selected="false" data-tab="history" class="justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:shadow flex items-center gap-2 relative data-[state=active]:bg-transparent">
          <span class="truncate inline z-20 relative text-neutral-50">History</span>
          <span class="absolute inset-0 z-10 bg-zinc-600 rounded-md shadow-lg hidden"></span>
        </button>
        <button type="button" role="tab" aria-selected="false" data-tab="plan" class="justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:shadow flex items-center gap-2 relative data-[state=active]:bg-transparent">
          <span class="truncate inline z-20 relative text-neutral-50">Plan</span>
          <span class="absolute inset-0 z-10 bg-zinc-600 rounded-md shadow-lg hidden"></span>
        </button>
      </div>
    `;

    const contentContainer = document.createElement('div');
    contentContainer.className = 'flex-grow overflow-y-auto';

    container.appendChild(tabList);
    container.appendChild(contentContainer);

    // Set up tab switching
    const tabs = tabList.querySelectorAll('[role="tab"]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update selected state
        tabs.forEach(t => {
          t.setAttribute('aria-selected', 'false');
          t.querySelector('.absolute').classList.add('hidden');
        });
        tab.setAttribute('aria-selected', 'true');
        tab.querySelector('.absolute').classList.remove('hidden');

        // Update content
        const tabName = tab.getAttribute('data-tab');
        updateContent(contentContainer, tabName);
      });
    });

    // Initialize with Chat tab
    updateContent(contentContainer, 'chat');
    return container;
  }

  function updateContent(container, tabName) {
    container.innerHTML = '';
    
    switch (tabName) {
      case 'chat':
        // Chat content
        container.innerHTML = `
          <div class="p-4">
            <p class="text-muted-foreground">Chat content goes here...</p>
          </div>
        `;
        break;
      
      case 'history':
        // History content
        container.innerHTML = `
          <div class="p-4">
            <p class="text-muted-foreground">History content goes here...</p>
          </div>
        `;
        break;
      
      case 'plan':
        // Plan content
        const planTab = window.PlanTab.setupTab();
        container.appendChild(planTab);
        break;
    }
  }

  return { createTabs };
})(); 