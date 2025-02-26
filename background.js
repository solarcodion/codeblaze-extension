// Initialize storage with default values
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    plans: []
  });

  // Create context menu item
  chrome.contextMenus.create({
    id: 'lovifyDebug',
    title: 'Add to Lovify Debug',
    contexts: ['selection'],
    documentUrlPatterns: ['*://*.lovable.app/*', '*://preview--*.lovable.app/*']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'lovifyDebug') {
    // Generate a debugging prompt from the selected text
    const debugPrompt = `I'm seeing this error/output in my console: \n\`\`\`\n${info.selectionText}\n\`\`\`\nCan you help me understand what might be causing this and how to fix it?`;
    
    // Send the prompt to the active tab
    chrome.tabs.sendMessage(tab.id, {
      action: 'enhancedPrompt',
      prompt: debugPrompt
    });
  }
});

// Message handler for various actions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'consoleDebug':
      // Generate a debugging prompt from the console text
      const debugPrompt = `I'm seeing this error/output in my console: \n\`\`\`\n${message.text}\n\`\`\`\nCan you help me understand what might be causing this and how to fix it?`;
      
      // Send the prompt to the active tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'enhancedPrompt',
          prompt: debugPrompt
        });
      });
      return true;

    case 'improvePrompt':
      improvePrompt(message.prompt).then(sendResponse);
      return true;

    case 'createPlan':
      createPlan().then(sendResponse);
      return true;

    case 'getPlans':
      getPlans().then(sendResponse);
      return true;

    case 'importRepo':
      importGitHubRepo(message.repoUrl).then(sendResponse);
      return true;

    case 'openTestTab':
      chrome.tabs.create({ 
        url: message.url,
        active: false // Keep the tab in background
      }).then(tab => {
        sendResponse(tab);
      });
      return true; // Keep the message channel open for async response

    case 'closeTestTab':
      chrome.tabs.remove(message.tabId).then(() => {
        sendResponse({ success: true });
      });
      return true; // Keep the message channel open for async response
  }
});

// Prompt improvement function
async function improvePrompt(prompt) {
  // TODO: Integrate with an AI service to improve the prompt
  const improvedPrompt = `Enhanced: ${prompt}`;
  return { improvedPrompt };
}

// Plan management functions
async function createPlan() {
  const plans = await getPlans();
  const newPlan = {
    id: Date.now(),
    title: `Plan ${plans.length + 1}`,
    tasks: [],
    status: 'active'
  };

  plans.push(newPlan);
  await chrome.storage.local.set({ plans });
  return { plans };
}

async function getPlans() {
  const data = await chrome.storage.local.get('plans');
  return data.plans || [];
}

// GitHub repository import function
async function importGitHubRepo(repoUrl) {
  // TODO: Implement GitHub repository import logic
  return { success: true, message: 'Repository imported successfully' };
}