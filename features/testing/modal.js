// Testing Modal Module

// Create testing modal
function create() {
  const modal = document.createElement('div');
  modal.id = 'lovify-testing-modal';
  modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-200 opacity-0 pointer-events-none';
  modal.innerHTML = `
    <div class="bg-zinc-900 rounded-lg border border-zinc-700 w-[95vw] max-w-6xl shadow-lg relative" role="dialog">
      <!-- Coming Soon Overlay -->
      <div class="absolute inset-0 bg-zinc-900/95 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
        <div class="flex flex-col items-center gap-6 p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-violet-500">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-medium text-violet-500">Testing Mode - Coming Soon!</h3>
            <p class="text-zinc-400">We're working hard to bring you automated testing capabilities.</p>
          </div>
          <a href="https://lovify.featurebase.app/" 
             target="_blank" 
             rel="noopener noreferrer"
             class="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-md transition-colors">
            Vote on Feature
          </a>
        </div>
      </div>

      <!-- Original Modal Content (Greyed Out) -->
      <div class="p-8 space-y-6 w-full opacity-20 pointer-events-none">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Run Tests</h2>
          <button class="hover:bg-zinc-800 rounded-md p-1.5" data-action="close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="space-y-3 w-full">
          <label class="text-base text-zinc-300">What would you like to test?</label>
          <textarea class="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-md p-4 text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Describe what you want to test..."></textarea>
        </div>
        <div class="flex justify-end gap-3">
          <button class="px-5 py-2.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300" data-action="cancel">Cancel</button>
          <button class="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 rounded-md text-white font-medium" data-action="run">Run Test</button>
        </div>
      </div>
    </div>
  `;

  return modal;
}

// Add styles for the testing modal
function addStyles() {
  if (!document.querySelector('#lovify-testing-styles')) {
    const style = document.createElement('style');
    style.id = 'lovify-testing-styles';
    style.textContent = `
      #lovify-testing-modal.active {
        opacity: 1;
        pointer-events: auto;
      }
      
      [data-lovify-testing][data-state="running"] svg {
        animation: spin 1s linear infinite;
      }
      [data-lovify-testing][data-state="complete"] svg {
        color: #22c55e;
      }
      [data-lovify-testing][data-state="error"] svg {
        color: #ef4444;
      }
      [data-lovify-testing][data-state="error"]:hover::after {
        content: 'Test failed. Click to try again.';
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #ef4444;
        color: white;
        padding: 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        white-space: nowrap;
        margin-bottom: 0.5rem;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Handle test errors in UI
function handleTestError(modal, error) {
  modal.querySelector('h2').textContent = 'Test Error';
  modal.querySelector('.space-y-3').innerHTML = `
    <div class="space-y-4">
      <div class="p-4 rounded-md bg-red-500/10 text-red-500">
        <p class="text-base font-medium">Error running tests</p>
        <p class="text-sm mt-1">${error.message}</p>
      </div>
      <p class="text-base text-zinc-300">Please try again or check the console for more details.</p>
    </div>
  `;
  modal.querySelector('[data-action="run"]').style.display = 'none';
  modal.querySelector('[data-action="cancel"]').textContent = 'Close';
  modal.classList.add('active');
}

// Show test results in modal
function showResults(modal, testResults) {
  if (!testResults) return;

  modal.querySelector('h2').textContent = 'Test Results';
  modal.querySelector('.space-y-3').innerHTML = `
    <div class="flex justify-between items-center w-full mb-6">
      <span class="text-base">Total Tests: ${testResults.total}</span>
      <span class="text-base">Duration: ${testResults.duration}</span>
    </div>
    <div class="flex gap-6 w-full mb-6">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="text-base">Passed: ${testResults.passed}</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <span class="text-base">Failed: ${testResults.failed}</span>
      </div>
    </div>
    <div class="w-full space-y-3">
      ${testResults.tests.map(test => `
        <div class="flex items-center justify-between w-full p-4 rounded-md ${test.status === 'passed' ? 'bg-green-500/10' : 'bg-red-500/10'}">
          <span class="text-base">${test.name}</span>
          <span class="text-base font-medium ${test.status === 'passed' ? 'text-green-500' : 'text-red-500'}">${test.status}</span>
        </div>
      `).join('')}
    </div>
  `;
  modal.querySelector('[data-action="run"]').style.display = 'none';
  modal.querySelector('[data-action="cancel"]').textContent = 'Close';
  
  // Add New Test button
  const actionButtons = modal.querySelector('.flex.justify-end.gap-3');
  if (!actionButtons.querySelector('[data-action="new-test"]')) {
    const newTestButton = document.createElement('button');
    newTestButton.className = 'px-5 py-2.5 bg-violet-600 hover:bg-violet-700 rounded-md text-white font-medium';
    newTestButton.setAttribute('data-action', 'new-test');
    newTestButton.textContent = 'New Test';
    actionButtons.appendChild(newTestButton);
  }
}

// Reset modal to initial state
function resetModal(modal) {
  modal.querySelector('h2').textContent = 'Run Tests';
  modal.querySelector('.space-y-3').innerHTML = `
    <label class="text-base text-zinc-300">What would you like to test?</label>
    <textarea class="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-md p-4 text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Describe what you want to test..."></textarea>
  `;
  modal.querySelector('[data-action="run"]').style.display = '';
  modal.querySelector('[data-action="cancel"]').textContent = 'Cancel';
  const newTestButton = modal.querySelector('[data-action="new-test"]');
  if (newTestButton) {
    newTestButton.remove();
  }
}

// Run tests
async function runTests(testDescription, button) {
  button.setAttribute('data-state', 'running');
  
  try {
    // Find the preview button and get the URL
    const previewLink = document.querySelector('a[href^="https://preview--"][target="_blank"]');
    if (!previewLink) {
      throw new Error('Preview button not found');
    }

    // Get the preview URL directly from the link
    const previewUrl = previewLink.href;
    
    // Open tab and get reference
    const testTab = await chrome.runtime.sendMessage({ 
      action: 'openTestTab', 
      url: previewUrl
    });

    // Wait for tab to load and run tests
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for page load
  
    // Simulate test results (this would be replaced with actual test running)
    const testResults = {
      passed: 3,
      failed: 1,
      total: 4,
      duration: '2.5s',
      tests: [
        { name: 'Component renders correctly', status: 'passed' },
        { name: 'Handles user input', status: 'passed' },
        { name: 'Validates form data', status: 'failed', error: 'Expected validation to fail for invalid input' },
        { name: 'Updates UI on state change', status: 'passed' }
      ]
    };
      
    // Close the test tab
    await chrome.runtime.sendMessage({ 
      action: 'closeTestTab', 
      tabId: testTab.id 
    });
  
    button.setAttribute('data-state', 'complete');
    return testResults;
  } catch (error) {
    console.error('Test execution error:', error);
    button.setAttribute('data-state', 'error');
    throw error;
  }
}

// Initialize testing button
function initializeButton(button, modal) {
  // Handle button click
  button.addEventListener('click', () => {
    if (button.getAttribute('data-state') === 'complete') {
      modal.classList.add('active');
    } else {
      resetModal(modal);
      modal.classList.add('active');
    }
  });

  // Handle modal actions
  modal.querySelector('[data-action="close"]').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.querySelector('[data-action="run"]').addEventListener('click', async () => {
    const testDescription = modal.querySelector('textarea').value;
    if (!testDescription.trim()) return;

    modal.classList.remove('active');
    try {
      const results = await runTests(testDescription, button);
      showResults(modal, results);
      modal.classList.add('active');
    } catch (error) {
      handleTestError(modal, error);
    }
  });
      
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Handle new test button clicks
  modal.addEventListener('click', (e) => {
    if (e.target.getAttribute('data-action') === 'new-test') {
      resetModal(modal);
    }
  });
}

// Create testing button
function createButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('data-lovify-testing', 'true');
  button.className = 'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 h-7 rounded-md px-2 py-1 gap-1.5 relative group text-zinc-300';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" class="shrink-0 h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
    <span class="hidden md:flex">Test</span>
    <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full transition-colors duration-200 opacity-0 scale-0 group-data-[state=complete]:opacity-100 group-data-[state=complete]:scale-100 bg-green-500"></div>
  `;

  return button;
}

// Export the module
window.TestingModal = {
  create,
  addStyles,
  createButton,
  initializeButton,
  handleTestError,
  showResults,
  resetModal,
  runTests
};
