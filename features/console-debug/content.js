// Console Debug Integration
let selectedText = '';

// Initialize the feature
function init() {
  // Check for preview sites or lovable.app domains
  if (!window.location.hostname.includes('lovable.app') && 
      !window.location.hostname.startsWith('preview--')) {
    return;
  }

  // Add context menu handler
  document.addEventListener('contextmenu', (e) => {
    // Get any selected text
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text) {
      selectedText = text;
    }
  });

  // Listen for the context menu item click
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'contextMenuClick' && selectedText) {
      // Send selected text to background script
      chrome.runtime.sendMessage({
        action: 'consoleDebug',
        text: selectedText
      });
      selectedText = '';
    }
  });
}

// Wait for devtools to be fully loaded
setTimeout(init, 1000); 