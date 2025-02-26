// Cook Modal Module

// Function to set up image preview for reference sets
function setupImagePreview(container) {
  //console.log('Setting up image preview for container:', container);
  const fileInput = container.querySelector('input[type="file"]');
  const previewContainer = container.querySelector('.aspect-video');
  const defaultContent = previewContainer.innerHTML;

  fileInput.addEventListener('change', (e) => {
    //console.log('File input changed');
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
     // console.log('Image loaded, updating preview');
      previewContainer.innerHTML = `
        <img src="${event.target.result}" class="w-full h-full object-contain" />
        <button class="absolute top-2 right-2 p-1 rounded-md bg-zinc-800/90 hover:bg-zinc-700/90 text-zinc-400 hover:text-zinc-300 border border-zinc-700" data-action="remove-image">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      `;

      // Add click handler for remove button
      const removeButton = previewContainer.querySelector('[data-action="remove-image"]');
      removeButton.addEventListener('click', (e) => {
        // console.log('Remove image button clicked');
        e.preventDefault();
        e.stopPropagation();
        previewContainer.innerHTML = defaultContent;
        fileInput.value = '';
      });
    };
    reader.readAsDataURL(file);
  });
}

// Function to create a new reference set
function createReferenceSet() {
  //console.log('Creating new reference set');
  const newSet = document.createElement('div');
  newSet.className = 'grid grid-cols-2 gap-4 p-4 border border-zinc-700 rounded-lg';
  newSet.style.position = 'relative';
  newSet.innerHTML = `
    <div class="space-y-3">
      <div class="font-medium text-sm text-zinc-300">Reference Image</div>
      <div class="relative group">
        <div class="aspect-video rounded-lg border-2 border-dashed border-zinc-700 hover:border-zinc-500 transition-colors flex items-center justify-center bg-zinc-800/50">
          <div class="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mx-auto mb-2 text-zinc-400">
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
              <line x1="16" y1="5" x2="22" y2="5"/>
              <line x1="19" y1="2" x2="19" y2="8"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <span class="text-sm text-zinc-400">Upload reference</span>
          </div>
          <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*">
        </div>
      </div>
    </div>
    
    <div class="space-y-3">
      <div class="font-medium text-sm text-zinc-300">Elements to Build</div>
      <textarea class="w-full h-[140px] bg-zinc-800 border border-zinc-700 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Describe which elements from this reference image you want to recreate..."></textarea>
    </div>
  `;

  // Add remove button
  const removeButton = document.createElement('button');
  removeButton.className = 'absolute -top-3 -right-3 bg-zinc-800 hover:bg-zinc-700 rounded-full p-1 border border-zinc-700 text-zinc-400 hover:text-zinc-300';
  removeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  `;
  removeButton.addEventListener('click', () => {
   // console.log('Remove set button clicked');
    newSet.remove();
  });
  newSet.appendChild(removeButton);

  // Setup image preview for the new set
 // console.log('Setting up image preview for new set');
  setupImagePreview(newSet);

  return newSet;
}

// Function to create loading overlay
function createLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center';
  
  const cookingMessages = [
    "Preheating the editor...",
    "Gathering the ingredients...",
    "Mixing the components...",
    "Adding a pinch of AI magic...",
    "Stirring the code...",
    "Letting the ideas simmer...",
    "Spicing up the design...",
    "Taste testing the layout...",
    "Almost ready to serve!"
  ];
  
  overlay.innerHTML = `
    <div class="text-center space-y-4">
      <div class="cooking-loader w-48 h-48 relative">
        <video
          src="${chrome.runtime.getURL('assets/cook.webm')}"
          class="w-full h-full object-contain"
          autoplay
          loop
          muted
          playsinline
        ></video>
      </div>
      <div class="cooking-status text-orange-500 font-medium"></div>
    </div>
  `;

  let messageIndex = 0;
  const statusElement = overlay.querySelector('.cooking-status');
  
  function updateMessage() {
    statusElement.textContent = cookingMessages[messageIndex];
    messageIndex = (messageIndex + 1) % cookingMessages.length;
  }
  
  updateMessage();
  const messageInterval = setInterval(updateMessage, 2000);
  
  overlay.stopLoading = () => {
    clearInterval(messageInterval);
    overlay.remove();
  };
  
  return overlay;
}

// Helper function to update textarea value
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

// Add styles for the cook modal
function addStyles() {
  if (!document.querySelector('#lovify-cook-styles')) {
    const style = document.createElement('style');
    style.id = 'lovify-cook-styles';
    style.textContent = `
      #lovify-cook-modal.active {
        opacity: 1;
        pointer-events: auto;
      }
      
      .cooking-status {
        animation: fade 3s infinite;
      }
      
      @keyframes fade {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }

      .cooking-loader {
        margin: 0 auto;
      }
    `;
    document.head.appendChild(style);
  }
}

// Main function to create cook modal
function create() {
 // console.log('Creating cook modal');
  const modal = document.createElement('div');
  modal.id = 'lovify-cook-modal';
  modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-200 opacity-0 pointer-events-none';
  modal.innerHTML = `
    <div class="bg-zinc-900 rounded-lg border border-zinc-700 w-[95vw] max-w-4xl max-h-[90vh] shadow-lg flex flex-col" role="dialog">
      <div class="p-8 space-y-6 flex-1 overflow-hidden flex flex-col">
        <div class="flex justify-between items-center flex-shrink-0">
          <h2 class="text-xl font-semibold">Cook Mode</h2>
          <button class="hover:bg-zinc-800 rounded-md p-1.5" data-action="close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex-shrink-0">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-yellow-500 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div class="space-y-1">
              <h3 class="font-medium text-yellow-500">Automatic Mode Warning</h3>
              <p class="text-sm text-zinc-300">Cook mode takes control of your editor and will automatically make changes to achieve the desired result. You can stop it at any time, but it will make edits on your behalf.</p>
            </div>
          </div>
        </div>

        <div class="space-y-4 flex-1 overflow-hidden flex flex-col min-h-0">
          <div class="flex-shrink-0">
            <label class="text-base font-medium block mb-2">What would you like to build?</label>
            <textarea class="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-md p-4 text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Describe your app idea in detail..."></textarea>
          </div>

          <div class="space-y-2 flex-1 overflow-hidden flex flex-col min-h-0">
            <div class="flex-shrink-0">
              <label class="text-base font-medium block">Reference Images</label>
              <p class="text-sm text-zinc-400 mb-3">Upload reference images and describe what you want to build</p>
            </div>
            
            <div class="space-y-4 overflow-y-auto flex-1 pr-2">
              <!-- Reference Set 1 -->
              <div class="grid grid-cols-2 gap-4 p-4 border border-zinc-700 rounded-lg">
                <div class="space-y-3">
                  <div class="font-medium text-sm text-zinc-300">Reference Image</div>
                  <div class="relative group">
                    <div class="aspect-video rounded-lg border-2 border-dashed border-zinc-700 hover:border-zinc-500 transition-colors flex items-center justify-center bg-zinc-800/50">
                      <div class="text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mx-auto mb-2 text-zinc-400">
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                          <line x1="16" y1="5" x2="22" y2="5"/>
                          <line x1="19" y1="2" x2="19" y2="8"/>
                          <circle cx="9" cy="9" r="2"/>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                        <span class="text-sm text-zinc-400">Upload reference</span>
                      </div>
                      <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*">
                    </div>
                  </div>
                </div>
                
                <div class="space-y-3">
                  <div class="font-medium text-sm text-zinc-300">Elements to Build</div>
                  <textarea class="w-full h-[140px] bg-zinc-800 border border-zinc-700 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Describe which elements from this reference image you want to recreate..."></textarea>
                </div>
              </div>

              <!-- Add Set Button -->
              <button class="w-full py-3 border-2 border-dashed border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300" data-action="add-reference-set">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add Another Reference Set
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-zinc-700 flex-shrink-0">
          <button class="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300" data-action="cancel">Cancel</button>
          <button class="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-md text-white font-medium inline-flex items-center gap-2" data-action="start">
            <span>Start Cooking</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12h20"/>
              <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2v-3a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v3h6v-3a3 3 0 0 0-3-3z"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Initialize image preview for the first reference set
  const firstSet = modal.querySelector('.grid.grid-cols-2');
  if (firstSet) {
    setupImagePreview(firstSet);
  }

  // Add reference set button click handler
  const addSetButton = modal.querySelector('[data-action="add-reference-set"]');
  if (addSetButton) {
    addSetButton.addEventListener('click', () => {
      const referenceContainer = addSetButton.parentElement;
      const newSet = createReferenceSet();
      referenceContainer.insertBefore(newSet, addSetButton);
    });
  }

  // Add event listeners
  modal.querySelector('[data-action="close"]').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Add start cooking handler
  modal.querySelector('[data-action="start"]').addEventListener('click', async () => {
    const mainDescription = modal.querySelector('textarea:first-of-type').value;
    if (!mainDescription.trim()) return;

    // Get reference images and their descriptions
    const referenceSets = Array.from(modal.querySelectorAll('.grid.grid-cols-2')).map(set => {
      const img = set.querySelector('img');
      const description = set.querySelector('textarea').value;
      return {
        image: img ? img.src : null,
        description: description.trim()
      };
    }).filter(set => set.description); // Only filter by description, image is optional

    if (referenceSets.length === 0) return;

    // Hide the modal
    modal.classList.remove('active');

    // Show loading overlay
    const loadingOverlay = createLoadingOverlay();
    document.body.appendChild(loadingOverlay);

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Create the prompt
    const firstReference = referenceSets[0];
    const prompt = `I want to build a UI that looks like the reference${firstReference.image ? ' image' : ''}. Here's what I want to create specifically:

${firstReference.description}

Let's start by building this step by step, focusing on getting the layout and styling right.

Main Description:
${mainDescription}`;

    // Find the textarea
    const textarea = document.querySelector('textarea');
    if (textarea) {
      updateTextareaValue(textarea, prompt);
    }

    // Remove loading overlay
    loadingOverlay.stopLoading();
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  return modal;
}

// Export the module
window.CookModal = {
  create,
  addStyles,
  createLoadingOverlay,
  updateTextareaValue
};
