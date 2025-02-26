// Improve Button Module
window.ImproveButton = (() => {
  function createButton() {
    const button = document.createElement('button');
    button.type = 'button'; // Prevent form submission
    button.className = 'whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1 px-1 py-0.5 h-fit focus-visible:ring-0';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
           width="16"
           height="16"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           stroke-width="2"
           stroke-linecap="round"
           stroke-linejoin="round"
           class="lucide lucide-clipboard-check">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <path d="m9 14 2 2 4-4"></path>
      </svg>
      Plan
    `;

    const { openModal } = window.ImproveModal.setupModal();
    
    button.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent form submission
      e.stopPropagation(); // Stop event bubbling
      const textarea = document.querySelector('textarea');
      if (textarea && textarea.value.trim()) {
        openModal();
      } else {
        alert('Please enter a prompt first');
      }
    });

    return button;
  }

  return { createButton };
})(); 