// CSS styles for the help modal
window.HelpStyles = {
  addStyles() {
    if (!document.querySelector('#lovify-help-styles')) {
      const style = document.createElement('style');
      style.id = 'lovify-help-styles';
      style.textContent = `
        #lovify-help-modal.active {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        
        #lovify-help-modal.minimized {
          background: transparent;
        }
        
        #lovify-help-modal.minimized [data-modal-container] {
          display: none;
        }
        
        #lovify-help-modal.minimized [data-minimized-button] {
          display: flex;
          cursor: move;
        }
        
        [data-minimized-button] {
          touch-action: none;
          user-select: none;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        [data-action="enable-voice"] {
          animation: pulse 2s infinite;
        }

        .voice-ripple {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.15);
          animation: ripple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes ripple {
          0% {
            transform: scale(0.65);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }

        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        /* Add styles for minimized voice mode indicator */
        #lovify-help-modal.minimized [data-minimized-button] .voice-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgb(139, 92, 246);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Update minimized button styles for voice mode */
        #lovify-help-modal.minimized [data-minimized-button] {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(8px);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }

        #lovify-help-modal.minimized [data-minimized-button]:hover {
          background: rgba(30, 30, 30, 0.8);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        .prose {
          color: rgb(214, 211, 209);
        }

        .prose h1, .prose h2, .prose h3 {
          color: rgb(244, 244, 245);
          margin-top: 1.5em;
          margin-bottom: 0.75em;
        }

        .prose p {
          margin-top: 1em;
          margin-bottom: 1em;
          line-height: 1.6;
        }

        .prose ul, .prose ol {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          padding-left: 1.5em;
        }

        .prose li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }

        .prose code {
          color: rgb(216, 180, 254);
          background: rgba(124, 58, 237, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.9em;
        }

        .prose pre {
          background: rgba(0, 0, 0, 0.2);
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
          margin: 1em 0;
        }

        .prose strong {
          color: rgb(244, 244, 245);
          font-weight: 600;
        }

        .prose em {
          color: rgb(216, 180, 254);
          font-style: italic;
        }

        @keyframes heart-ripple {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .heart-ripple {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid rgb(139, 92, 246);
          border-radius: 50%;
          animation: heart-ripple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1) rotate(3deg);
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }
}; 