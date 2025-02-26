/**
 * Rubber Duck Debug Button Component
 * 
 * Features:
 * - Adds a rubber duck debugging button to the textarea
 * - Cute duck icon with hover animation
 * - Opens rubber duck debugging session
 */

function createRubberDuckButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'Debug with rubber duck');
  button.setAttribute('data-lovify-rubber-duck', 'true');
  button.setAttribute('title', 'Rubber Duck Debug');
  button.className = 'whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1 px-1 py-0.5 h-fit focus-visible:ring-0 group relative';
  
  button.innerHTML = `
    <img src="chrome-extension://${chrome.runtime.id}/assets/duck.svg" width="20" height="20" class="text-yellow-500" />
  `;

  // Add click handler to open the rubber duck modal
  button.addEventListener('click', () => {
    // Create modal if it doesn't exist
    let modal = document.querySelector('#lovify-rubber-duck-modal');
    if (!modal) {
      modal = window.RubberDuckModal.create();
      document.body.appendChild(modal);
    }
    modal.classList.add('active');
  });

  return button;
}

window.RubberDuckButton = {
  createButton: createRubberDuckButton
}; 