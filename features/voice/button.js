/**
 * Voice Input Button Component
 * 
 * Features:
 * - Microphone button with animation
 * - Recording state management
 * - Speech recognition integration
 */

// Voice button functionality for Lovify extension

function createMicButton() {
  const micButton = document.createElement('button');
  micButton.setAttribute('type', 'button');
  micButton.setAttribute('aria-label', 'Toggle voice input');
  micButton.setAttribute('aria-pressed', 'false');
  micButton.setAttribute('data-lovify-mic', 'true');
  micButton.className = 'whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1 px-1 py-0.5 h-fit focus-visible:ring-0 group';
  micButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-200">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 10v2a7 7 0 0 1-14 0v-2M12 18.5V23"/>
      <circle cx="12" cy="19" r="0" class="recording-indicator opacity-0 transition-all duration-200" fill="currentColor">
        <animate attributeName="r" values="0;3;0" dur="1s" repeatCount="indefinite" begin="indefinite"/>
        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="indefinite"/>
      </circle>
    </svg>
  `;

  // Add styles for recording state if not already present
  if (!document.querySelector('#lovify-mic-styles')) {
    const style = document.createElement('style');
    style.id = 'lovify-mic-styles';
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      .recording svg {
        color: #ef4444;
        animation: pulse 1.5s ease-in-out infinite;
      }
      .recording .recording-indicator animate {
        begin: 0s;
      }
    `;
    document.head.appendChild(style);
  }

  return micButton;
}

window.VoiceButton = {
  createMicButton
}; 