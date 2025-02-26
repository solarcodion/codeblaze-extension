// Slash Commands Popup Module
window.SlashCommandsPopup = (() => {
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

  function setupSlashCommands(textarea) {
    if (!textarea || textarea.hasAttribute('data-slash-commands')) return;
    textarea.setAttribute('data-slash-commands', 'true');

    // Create slash command popup
    const popup = document.createElement('div');
    popup.className = 'fixed bg-zinc-900 rounded-lg border border-zinc-700 shadow-lg p-2 hidden z-50';
    popup.innerHTML = `
      <div class="text-sm text-zinc-400 px-2 py-1">Commands</div>
      <div class="space-y-1">
        <button class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-800 text-left" data-command="docs">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-violet-500">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
          <div>
            <div class="font-medium text-sm">/docs</div>
            <div class="text-xs text-zinc-500">Add documentation link</div>
          </div>
        </button>
        <button class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-800 text-left" data-command="auth">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500">
            <path d="M12 3a5 5 0 0 1 5 5v3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2v-3a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v3h6v-3a3 3 0 0 0-3-3z"/>
          </svg>
          <div>
            <div class="font-medium text-sm">/auth</div>
            <div class="text-xs text-zinc-500">Authentication templates</div>
          </div>
        </button>
      
        <button class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-800 text-left" data-command="prompt">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-500">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <div>
            <div class="font-medium text-sm">/prompt</div>
            <div class="text-xs text-zinc-500">Insert saved prompts</div>
          </div>
        </button>
        <button class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-800 text-left" data-command="integrations">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-500">
            <path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12"/>
            <path d="M12 16v4"/>
            <path d="M8 20h8"/>
            <path d="m7 7 10 10"/>
            <path d="M17 7 7 17"/>
          </svg>
          <div>
            <div class="font-medium text-sm">/integrations</div>
            <div class="text-xs text-zinc-500">Add API integrations</div>
          </div>
        </button>
        <button class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-800 text-left" data-command="seo">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500">
            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
          </svg>
          <div>
            <div class="font-medium text-sm">/seo</div>
            <div class="text-xs text-zinc-500">Configure SEO settings</div>
          </div>
        </button>
        <button class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-800 text-left" data-command="cleanup">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-yellow-500">
            <path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM8 14l3-3m0 0l3 3m-3-3v6m8-9H5"/>
          </svg>
          <div>
            <div class="font-medium text-sm">/cleanup</div>
            <div class="text-xs text-zinc-500">Analyze and clean up code</div>
          </div>
        </button>
      </div>
    `;
    document.body.appendChild(popup);

    // Create modals
    let docsModal = null;
    let promptsModal = null;
    let authModal = null;
    let integrationsModal = null;
    let seoModal = null;
    let currentCommand = '';

    // Add input handler for showing/filtering commands
    textarea.addEventListener('input', (e) => {
      const value = e.target.value;
      const lastLine = value.split('\n').pop();
      
      if (lastLine.startsWith('/')) {
        currentCommand = lastLine;
        const rect = textarea.getBoundingClientRect();
        
        // Position popup above the textarea
        popup.style.left = `${rect.left}px`;
        popup.style.bottom = `${window.innerHeight - rect.top + 8}px`; // 8px gap
        popup.style.top = 'auto'; // Remove top positioning
        popup.style.display = 'block';

        // Filter commands based on input
        const searchTerm = lastLine.slice(1).toLowerCase(); // Remove the / and lowercase
        const buttons = popup.querySelectorAll('[data-command]');
        let hasVisibleButtons = false;
        let firstVisibleButton = null;

        buttons.forEach(button => {
          const command = button.getAttribute('data-command');
          if (command.toLowerCase().startsWith(searchTerm)) {
            button.style.display = 'flex';
            hasVisibleButtons = true;
            if (!firstVisibleButton) {
              firstVisibleButton = button;
            }
          } else {
            button.style.display = 'none';
          }
        });

        // Store reference to first visible button for Enter key handling
        popup.dataset.firstVisibleButton = firstVisibleButton ? firstVisibleButton.getAttribute('data-command') : '';

        // Hide popup if no matching commands
        if (!hasVisibleButtons) {
          popup.style.display = 'none';
        }
      } else {
        popup.style.display = 'none';
        currentCommand = '';
        popup.dataset.firstVisibleButton = '';
      }
    });

    // Add keydown handler for Enter key
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const lastLine = textarea.value.split('\n').pop();
        
        // Only prevent default if we have an active slash command without a space
        if (lastLine.startsWith('/') && !lastLine.includes(' ')) {
          e.preventDefault();
          e.stopPropagation();
          
          // If we have exactly one visible command, trigger it
          const firstVisibleCommand = popup.dataset.firstVisibleButton;
          if (firstVisibleCommand) {
            const button = popup.querySelector(`[data-command="${firstVisibleCommand}"]`);
            if (button) {
              button.click();
            }
          }
        }
      }
    });
    
    popup.querySelectorAll('[data-command]').forEach(button => {
      button.addEventListener('click', () => {
        const command = button.getAttribute('data-command');
        const text = textarea.value;
        
        // Remove the command from textarea
        updateTextareaValue(textarea, text.replace(currentCommand, ''));
        
        switch (command) {
          case 'docs':
            if (!docsModal) {
              docsModal = window.DocsModal.create();
              document.body.appendChild(docsModal);
              window.DocsModal.addStyles();
            }
            docsModal.classList.add('active');
            break;
            
          case 'auth':
            if (!authModal) {
              authModal = window.AuthModal.create();
              document.body.appendChild(authModal);
              window.AuthModal.addStyles();
            }
            authModal.classList.add('active');
            break;
            
          /*case 'test':
            // Create testing modal if it doesn't exist
            let testingModal = document.querySelector('#lovify-testing-modal');
            if (!testingModal) {
              testingModal = window.TestingModal.create();
              document.body.appendChild(testingModal);
              window.TestingModal.addStyles();
            }
            testingModal.classList.add('active');
            break;*/
            
          case 'prompt':
            if (!promptsModal) {
              promptsModal = window.PromptsModal.create();
              document.body.appendChild(promptsModal);
              window.PromptsModal.addStyles();
            }
            promptsModal.classList.add('active');
            break;
          
          case 'integrations':
            if (!integrationsModal) {
              integrationsModal = window.IntegrationsModal.create();
              document.body.appendChild(integrationsModal);
              window.IntegrationsModal.addStyles();
            }
            integrationsModal.classList.add('active');
            break;

          case 'seo':
            if (!seoModal) {
              seoModal = window.SEOModal.create();
              document.body.appendChild(seoModal);
              window.SEOModal.addStyles();
            }
            seoModal.classList.add('active');
            break;

          case 'cleanup':
            const cleanupPrompt = `# Universal Code Cleanup Analysis Prompt

You are a code analysis assistant. Your task is to help identify and clean up unused and duplicate code in any project. Follow these steps:

## 1. Project Analysis

First, analyze the project structure:
- What programming languages are used?
- What frameworks/libraries are present?
- What build tools are being used?
- What is the project's file structure?

## 2. Code Analysis Categories

A. UNUSED CODE
Look for:
- Unused files
- Unused functions/methods
- Unused imports
- Unused variables/constants
- Unused styles/assets
- Unused dependencies in package manager files
- Dead code paths (unreachable code)

B. DUPLICATE CODE
Look for:
- Similar function implementations
- Repeated logic blocks
- Similar component/class structures
- Duplicate utility functions
- Repeated configuration blocks
- Similar styling patterns

C. COMPLEXITY ISSUES
Look for:
- Overly complex functions
- Deeply nested conditions
- Redundant calculations
- Unnecessary abstractions
- Complex inheritance chains

## 3. Analysis Process

For each file in the project:
1. List all dependencies and imports
2. Check usage of each imported item
3. Identify similar code patterns
4. Check for unreachable code
5. Look for redundant operations

## 4. Cleanup Guidelines

For each issue found, provide:
1. Location: Where is the issue?
2. Type: What kind of issue? (unused/duplicate/complexity)
3. Impact: What's the impact of fixing it?
4. Risk: What could break if removed?
5. Solution: How to fix it safely?

## 5. Safety Checklist

Before removing any code, verify:
- No runtime dependencies on the code
- No dynamic references to the code
- No build process dependencies
- No test dependencies
- No documentation references

## 6. Implementation Steps

1. Initial Scan
   - Run static analysis tools if available
   - Document current state
   - Create backup/branch

2. Iterative Cleanup
   - Start with zero-risk changes
   - Test after each change
   - Document changes made
   - Update relevant documentation

3. Verification
   - Run all tests
   - Check build process
   - Verify main functionality
   - Compare before/after metrics

## 7. Report Format

For each cleanup item:
LOCATION: [file path or area in codebase]

ISSUE: [describe the issue]

IMPACT:
- Size impact
- Performance impact
- Maintenance impact

SOLUTION: [step-by-step fix]

VERIFICATION: [how to verify nothing broke]

## 8. Metrics to Track

Before and after:
- Project size
- Build size
- Number of files
- Number of dependencies
- Build time
- Test coverage`;
            
            // Insert the cleanup prompt
            const newText = textarea.value.replace(currentCommand, cleanupPrompt);
            updateTextareaValue(textarea, newText);
            break;
        }
        
        popup.style.display = 'none';
        textarea.focus();
      });
    });

    // Hide popup when clicking outside
    document.addEventListener('click', (e) => {
      if (!popup.contains(e.target) && e.target !== textarea) {
        popup.style.display = 'none';
      }
    });
  }

  return { setupSlashCommands };
})();
