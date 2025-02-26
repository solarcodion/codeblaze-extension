// Help button component for Lovify extension
window.HelpButton = {
  createButton() {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-lovify-help', 'true');
    button.className = 'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 h-7 rounded-md px-2 py-1 gap-1.5 relative group text-zinc-300';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span class="hidden md:flex">Help</span>
    `;

    // Add click handler directly to the button
    button.addEventListener('click', () => {
      // Remove any existing help modal first
      const existingModal = document.querySelector('#lovify-help-modal');
      if (existingModal) {
        existingModal.remove();
      }

      // Find the preview panel
      const previewPanel = document.querySelector('[data-panel-id="preview-panel"]');
      if (!previewPanel) {
        console.error('Preview panel not found');
        return;
      }

      // Create and append new modal to the preview panel
      const modal = window.HelpModal.create();
      
      // Update modal styles to be relative to preview panel
      modal.style.position = 'absolute';
      modal.style.height = '100%';
      modal.style.width = '100%';
      modal.style.zIndex = '100';
      
      // Add the modal to the preview panel instead of body
      previewPanel.appendChild(modal);
      
      // Add active class after a brief delay to ensure smooth animation
      requestAnimationFrame(() => {
        modal.classList.add('active');
      });
    });

    return button;
  },

  inject() {
    // Check if button already exists
    if (document.querySelector('[data-lovify-help]')) {
      return;
    }

    // Find the target container
    const targetContainer = document.querySelector('.flex.items-center.gap-2, .flex.items-center.gap-1.5');
    if (!targetContainer) {
      return;
    }

    // Create and inject the button
    const button = this.createButton();
    targetContainer.appendChild(button);
  }
}; 

// Initialize the button immediately
window.HelpButton.inject(); 