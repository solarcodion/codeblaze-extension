// Prompts Button Module
window.PromptsButton = {
  createButton() {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-lovify-button', 'prompts');
    button.className = 'whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1 px-1 py-0.5 h-fit focus-visible:ring-0 group';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-500">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>Prompts</span>
    `;
    return button;
  }
}; 