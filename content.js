// Content script for Lovify extension
console.log('Content script loaded');


// Inject custom buttons into the form
function injectCustomButtons() {
  console.log('🔍 Starting button injection...');
  
  // Only inject on projects page
  if (!window.location.pathname.includes('/projects')) {
    console.log('📝 Not on projects page, skipping button injection');
    return;
  }

  const forms = Array.from(document.querySelectorAll('form'));
  console.log('📝 Found forms:', forms.length);
  
  const form = forms.find(form => form.querySelector('textarea'));
  console.log('📝 Found form with textarea:', !!form);
  if (!form) return;

  // Check if buttons are already injected
  const existingButtons = form.querySelector('[data-lovify-mic]');
  console.log('🔄 Checking for existing buttons:', !!existingButtons);
  if (existingButtons) return;

  // Look for the button container - try multiple possible selectors
  const buttonContainer = form.querySelector('.flex.gap-1') || form.querySelector('.flex:has(button)') || form.querySelector('.flex');
  console.log('🎯 Found button container:', !!buttonContainer);
  if (!buttonContainer) return;

  // Set up slash commands for the textarea
  const textarea = form.querySelector('textarea');
  if (textarea) {
    window.SlashCommandsPopup.setupSlashCommands(textarea);
  }

  // Create and add microphone button
  const micButton = window.VoiceButton.createMicButton();

  // Create and add sparkles button
  const sparklesButton = window.SparklesButton.createSparklesButton();

  // Create and add rubber duck button
  const rubberDuckButton = window.RubberDuckButton.createButton();

  // Find the send button (up arrow)
  const sendButton = buttonContainer.querySelector('#chatinput-send-message-button');
  if (sendButton) {
    // Insert rubber duck button before the send button
    buttonContainer.insertBefore(rubberDuckButton, sendButton);
    // Insert sparkles button before the rubber duck button
    buttonContainer.insertBefore(sparklesButton, rubberDuckButton);
    // Insert microphone button before the sparkles button
    buttonContainer.insertBefore(micButton, sparklesButton);
  } else {
    // Fallback: insert at the end of the button container
    buttonContainer.appendChild(micButton);
    buttonContainer.appendChild(sparklesButton);
    buttonContainer.appendChild(rubberDuckButton);
  }

  // Set up voice input for the textarea
  if (textarea) {
    window.VoiceInput.setupVoiceInput(textarea, micButton);
  }

  // Find the default Import button (it should be after Attach)
  const defaultImportButton = Array.from(buttonContainer.querySelectorAll('button')).find(btn => 
    btn.textContent.includes('Import') && !btn.hasAttribute('data-lovify-button')
  );
  console.log('🔑 Found default Import button:', !!defaultImportButton);
  if (!defaultImportButton) return;

  console.log('✨ Creating GitHub import button...');
  console.log('🔍 Checking window.GitHubImportButton:', !!window.GitHubImportButton);
  
  // Add GitHub import button right after the default Import button
  const githubButton = window.GitHubImportButton?.createButton();
  console.log('✅ GitHub button created:', !!githubButton);
  if (githubButton) {
    githubButton.setAttribute('data-lovify-button', 'github');
    defaultImportButton.parentNode.insertBefore(githubButton, defaultImportButton.nextSibling);
  }

  console.log('✨ Creating Improve button...');
  console.log('🔍 Checking window.ImproveButton:', !!window.ImproveButton);
  
  // Add improve button after the GitHub import button
  const improveButton = window.ImproveButton?.createButton();
  console.log('✅ Improve button created:', !!improveButton);
  if (improveButton && githubButton) {
    improveButton.setAttribute('data-lovify-button', 'improve');
    githubButton.parentNode.insertBefore(improveButton, githubButton.nextSibling);
  }

  // Add cook button after the improve button
  const cookButton = document.createElement('button');
  cookButton.setAttribute('type', 'button');
  cookButton.setAttribute('data-lovify-cook', 'true');
  cookButton.className = 'whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1 px-1 py-0.5 h-fit focus-visible:ring-0 group';
  cookButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-orange-500">
      <path d="M2 12h20"/>
      <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/>
      <path d="m4 8 16-4"/>
      <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/>
    </svg>
    <span>Cook</span>
  `;

  improveButton.parentNode.insertBefore(cookButton, improveButton.nextSibling);

  // Create and append cook modal
  const cookModal = window.CookModal.create();
  window.CookModal.addStyles();
  document.body.appendChild(cookModal);

  // Add click handler for cook button
  cookButton.addEventListener('click', () => {
    cookModal.classList.add('active');
  });

  // Add prompts button after the cook button
  const promptsButton = window.PromptsButton.createButton();
  cookButton.parentNode.insertBefore(promptsButton, cookButton.nextSibling);

  // Create and append prompts modal
  const promptsModal = window.PromptsModal.create();
  window.PromptsModal.addStyles();
  document.body.appendChild(promptsModal);

  // Add click handler for prompts button
  promptsButton.addEventListener('click', () => {
    promptsModal.classList.add('active');
  });
}

// Add testing button to the navigation
function injectTestingButton() {
  // Find the settings (cog) button and Supabase button container
  const cogButton = document.querySelector('button[aria-haspopup="dialog"]');
  const supabaseButton = document.querySelector('#supabase-dropdown-menu-button');
  
  if (!cogButton || !supabaseButton || document.querySelector('[data-lovify-testing]')) return;

  // Find the container that holds the buttons
  const buttonContainer = supabaseButton.parentElement;
  if (!buttonContainer) return;

  // Create help button using the window object
  const helpButton = window.HelpButton.createButton();
  
  // Create testing button
  const testingButton = window.TestingModal.createButton();

  // Create and append modal
  const modal = window.TestingModal.create();
  document.body.appendChild(modal);
  window.TestingModal.addStyles();

  // Initialize button and modal
  window.TestingModal.initializeButton(testingButton, modal);

  // Insert both buttons before the Supabase button
  buttonContainer.insertBefore(testingButton, supabaseButton);
  buttonContainer.insertBefore(helpButton, testingButton);

  // Add click handler for help button
  helpButton.addEventListener('click', () => {
    console.log('Help button clicked from content.js injectTestingButton function');
    let modal = document.getElementById('lovify-help-modal');
    
    if (!modal) {
      modal = window.HelpModal.create();
      document.body.appendChild(modal);
      window.HelpModal.addStyles();
    }
    
    modal.classList.add('active');
  });
}

let injectionTimeout = null;

// Debounced injection function
function debouncedInject() {
  if (injectionTimeout) {
    clearTimeout(injectionTimeout);
  }

  injectionTimeout = setTimeout(() => {
    try {
      if (document.querySelector('form:has(textarea)')) {
        injectProjectButtons();
        injectHomepageButtons();
        window.PlanTab.injectPlanTab();
        injectTestingButton();
      }
    } catch (error) {
      console.error('Injection error:', error);
    }
  }, 500);
}

// Initialize content script
function init() {
  console.log('Initializing content script');
  
  // Initialize feedback feature
  import('./features/feedback/button.js')
    .then(module => {
      module.initFeedbackButton();
    })
    .catch(error => {
      console.error('Failed to initialize feedback feature:', error);
    });
  
  // Create a mutation observer for the entire body
  const observer = new MutationObserver((mutations) => {
    // Only process if we find relevant changes
    const hasRelevantChanges = mutations.some(mutation => {
      // Check if the mutation affects our target elements
      const targetElement = mutation.target;
      const hasForm = Array.from(document.querySelectorAll('form')).some(form => form.querySelector('textarea'));
      return (
        targetElement.matches('form') ||
        targetElement.matches('[role="tablist"]') ||
        targetElement.querySelector('form') ||
        targetElement.querySelector('[role="tablist"]') ||
        hasForm
      );
    });

    if (hasRelevantChanges) {
      debouncedInject();
    }
  });

  // Start observing with a more focused configuration
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });

  // Initial injection attempt
  debouncedInject();
}

// Call init when the content script loads
init();

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  if (message.action === 'enhancedPrompt') {
    const textarea = document.querySelector('textarea');
    if (textarea && message.prompt) {
      textarea.value = message.prompt;
      console.log('Prompt updated');
    }
  }
  return true;
});

// Create prompts modal
// ... removing old createPromptsModal function and related code ...

// Add styles for the prompts modal
if (!document.querySelector('#lovify-prompts-styles')) {
  const style = document.createElement('style');
  style.id = 'lovify-prompts-styles';
  style.textContent = `
    #lovify-prompts-modal.active {
      opacity: 1;
      pointer-events: auto;
    }
  `;
  document.head.appendChild(style);
}

// Helper function to update textarea value and trigger necessary events
function updateTextareaValue(textarea, value) {
  // Store current selection
  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  
  // Update value and trigger events
  textarea.value = value;
  
  // Restore selection
  textarea.selectionStart = selectionStart;
  textarea.selectionEnd = selectionEnd;
  
  // Trigger input event
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  
  // Trigger change event
  textarea.dispatchEvent(new Event('change', { bubbles: true }));
  
  // Force React to update by triggering a keydown event
  textarea.dispatchEvent(new KeyboardEvent('keydown', { 
    key: 'Process',
    bubbles: true
  }));
}

// Inject buttons that should only appear on the projects page (mic, sparkles, duck)
function injectProjectButtons() {
//  console.log('🔍 Starting project button injection...');
  
  // Only inject on projects page
  if (!window.location.pathname.includes('/projects')) {
  //  console.log('📝 Not on projects page, skipping project button injection');
    return;
  }

  const forms = Array.from(document.querySelectorAll('form'));
//  console.log('📝 Found forms:', forms.length);
  
  const form = forms.find(form => form.querySelector('textarea'));
//  console.log('📝 Found form with textarea:', !!form);
  if (!form) return;

  // Check if ANY of our project buttons already exist
  const existingButtons = form.querySelector('[data-lovify-mic], [data-lovify-sparkles], [data-lovify-duck]');
//  console.log('🔄 Checking for existing project buttons:', !!existingButtons);
  if (existingButtons) return;

  // Look for the button container - try multiple possible selectors
  const buttonContainer = form.querySelector('.flex.gap-1') || form.querySelector('.flex:has(button)') || form.querySelector('.flex');
//  console.log('🎯 Found button container:', !!buttonContainer);
  if (!buttonContainer) return;

  // Set up slash commands for the textarea
  const textarea = form.querySelector('textarea');
  if (textarea) {
    window.SlashCommandsPopup.setupSlashCommands(textarea);
  }

  // Create and add microphone button
  const micButton = window.VoiceButton.createMicButton();
  micButton.setAttribute('data-lovify-mic', 'true');

  // Create and add sparkles button
  const sparklesButton = window.SparklesButton.createSparklesButton();
  sparklesButton.setAttribute('data-lovify-sparkles', 'true');

  // Create and add rubber duck button
  const rubberDuckButton = window.RubberDuckButton.createButton();
  rubberDuckButton.setAttribute('data-lovify-duck', 'true');

  // Find the send button (up arrow)
  const sendButton = buttonContainer.querySelector('#chatinput-send-message-button');
  if (sendButton) {
    // Insert rubber duck button before the send button
    buttonContainer.insertBefore(rubberDuckButton, sendButton);
    // Insert sparkles button before the rubber duck button
    buttonContainer.insertBefore(sparklesButton, rubberDuckButton);
    // Insert microphone button before the sparkles button
    buttonContainer.insertBefore(micButton, sparklesButton);
  } else {
    // Fallback: insert at the end of the button container
    buttonContainer.appendChild(micButton);
    buttonContainer.appendChild(sparklesButton);
    buttonContainer.appendChild(rubberDuckButton);
  }

  // Set up voice input for the textarea
  if (textarea) {
    window.VoiceInput.setupVoiceInput(textarea, micButton);
  }
}

// Inject buttons that should only appear on the homepage (import, improve, cook)
function injectHomepageButtons() {
//  console.log('🔍 Starting homepage button injection...');
  
  // Only inject on homepage
  if (window.location.pathname.includes('/projects')) {
    console.log('📝 Not on homepage, skipping homepage button injection');
    return;
  }

  const forms = Array.from(document.querySelectorAll('form'));
 // console.log('📝 Found forms:', forms.length);
  
  const form = forms.find(form => form.querySelector('textarea'));
 // console.log('📝 Found form with textarea:', !!form);
  if (!form) return;

  // Check if ANY of our homepage buttons already exist
  const existingButtons = form.querySelector('[data-lovify-github], [data-lovify-improve], [data-lovify-cook]');
 // console.log('🔄 Checking for existing homepage buttons:', !!existingButtons);
  if (existingButtons) return;

  // Look for the button container - try multiple possible selectors
  const buttonContainer = form.querySelector('.flex.gap-1') || form.querySelector('.flex:has(button)') || form.querySelector('.flex');
 // console.log('🎯 Found button container:', !!buttonContainer);
  if (!buttonContainer) return;

  // Find the default Import button (it should be after Attach)
  const defaultImportButton = Array.from(buttonContainer.querySelectorAll('button')).find(btn => 
    btn.textContent.includes('Import') && !btn.hasAttribute('data-lovify-button')
  );
 // console.log('🔑 Found default Import button:', !!defaultImportButton);
  if (!defaultImportButton) return;

 // console.log('✨ Creating GitHub import button...');
 // console.log('🔍 Checking window.GitHubImportButton:', !!window.GitHubImportButton);
  
  // Add GitHub import button right after the default Import button
  const githubButton = window.GitHubImportButton?.createButton();
 // console.log('✅ GitHub button created:', !!githubButton);
  if (githubButton) {
    githubButton.setAttribute('data-lovify-github', 'true');
    defaultImportButton.parentNode.insertBefore(githubButton, defaultImportButton.nextSibling);
  }

 // console.log('✨ Creating Improve button...');
 // console.log('🔍 Checking window.ImproveButton:', !!window.ImproveButton);
  
  // Add improve button after the GitHub import button
  const improveButton = window.ImproveButton?.createButton();
 // console.log('✅ Improve button created:', !!improveButton);
  if (improveButton && githubButton) {
    improveButton.setAttribute('data-lovify-improve', 'true');
    githubButton.parentNode.insertBefore(improveButton, githubButton.nextSibling);
  }

  //Add cook button after the improve button
  // const cookButton = document.createElement('button');
  // cookButton.setAttribute('type', 'button');
  // cookButton.setAttribute('data-lovify-cook', 'true');
  // cookButton.className = 'whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1 px-1 py-0.5 h-fit focus-visible:ring-0 group';
  // cookButton.innerHTML = `
  //   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-orange-500">
  //     <path d="M2 12h20"/>
  //     <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/>
  //     <path d="m4 8 16-4"/>
  //     <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/>
  //   </svg>
  //   <span>Cook</span>
  // `;

  improveButton.parentNode.insertBefore(cookButton, improveButton.nextSibling);

  // Create and append cook modal
  const cookModal = window.CookModal.create();
  window.CookModal.addStyles();
  document.body.appendChild(cookModal);

  // Add click handler for cook button
  cookButton.addEventListener('click', () => {
    cookModal.classList.add('active');
  });
}

