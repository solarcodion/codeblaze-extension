// Event handlers for the help modal
window.HelpHandlers = {
  setupHelpModalHandlers(modal) {
    // Add close handlers
    modal.querySelector('[data-action="close"]').addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Search functionality
    const searchInput = modal.querySelector('[data-search-input]');
    const searchButton = modal.querySelector('[data-search-button]');
    const defaultContent = modal.querySelector('[data-default-content]');
    const loadingAnimation = modal.querySelector('[data-loading-animation]');
    const searchResults = modal.querySelector('[data-search-results]');
    const answerText = modal.querySelector('[data-answer-text]');

    // Add handlers for navigation buttons
    const backToMenuButton = modal.querySelector('[data-action="back-to-menu"]');
    const newQuestionButton = modal.querySelector('[data-action="new-question"]');

    const resetSearch = () => {
      searchInput.value = '';
      searchResults.classList.add('hidden');
      defaultContent.classList.remove('hidden');
    };

    const prepareNewQuestion = () => {
      searchInput.value = '';
      searchInput.focus();
    };

    backToMenuButton.addEventListener('click', resetSearch);
    newQuestionButton.addEventListener('click', prepareNewQuestion);

    const handleSearch = async () => {
      const query = searchInput.value.trim();
      if (!query) return;

      // Hide default content and show loading
      defaultContent.classList.add('hidden');
      searchResults.classList.add('hidden');
      loadingAnimation.classList.remove('hidden');
      loadingAnimation.classList.add('flex');

      // Setup rotating loading messages
      const loadingMessage = modal.querySelector('[data-loading-message]');
      const messages = [
        "Searching for answers with love...",
        "Spreading some coding magic...",
        "Crafting the perfect response...",
        "Adding a sprinkle of developer joy...",
        "Brewing up some helpful tips...",
        "Making development delightful...",
        "Finding the best solutions...",
        "Wrapping answers with care..."
      ];
      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        loadingMessage.textContent = messages[messageIndex];
      }, 2000);

      try {
        const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/rag-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query })
        });

        const data = await response.json();
        
        // Clear message interval and hide loading
        clearInterval(messageInterval);
        loadingAnimation.classList.remove('flex');
        loadingAnimation.classList.add('hidden');
        searchResults.classList.remove('hidden');

        // Format and display the answer with typing effect
        answerText.textContent = '';
        const answer = data.answer;
        
        // Convert markdown-style formatting
        const formattedAnswer = answer
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>')
          .split(/(<[^>]+>)/g);

        let i = 0;
        const typeInterval = setInterval(() => {
          if (i < formattedAnswer.length) {
            const fragment = formattedAnswer[i];
            if (fragment.startsWith('<')) {
              // If it's an HTML tag, add it immediately
              answerText.innerHTML += fragment;
            } else {
              // If it's text content, type it out
              const textNode = document.createTextNode(fragment);
              answerText.appendChild(textNode);
            }
            i++;
          } else {
            clearInterval(typeInterval);
          }
        }, 20);

      } catch (error) {
        console.error('Search error:', error);
        answerText.innerHTML = '<p class="text-red-400">Sorry, there was an error processing your request. Please try again.</p>';
        loadingAnimation.classList.remove('flex');
        loadingAnimation.classList.add('hidden');
        searchResults.classList.remove('hidden');
      }
    };

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });

    // Add minimize/maximize handlers
    const minimizeBtn = modal.querySelector('[data-action="minimize"]');
    const maximizeBtn = modal.querySelector('[data-minimized-button]');
    
    minimizeBtn.addEventListener('click', () => {
      modal.classList.add('minimized');
    });
    
    // Only maximize if it was a clean click (not a drag)
    maximizeBtn.addEventListener('click', (e) => {
      if (!this.wasDragged) {
        modal.classList.remove('minimized');
      }
    });

    // Track dragging state
    this.wasDragged = false;

    this.setupDragHandlers(maximizeBtn, {
      isDragging: false,
      currentX: 0,
      currentY: 0,
      initialX: 0,
      initialY: 0,
      xOffset: 0,
      yOffset: 0
    });
  },

  setupDragHandlers(element, state) {
    const dragStart = (e) => {
      if (e.type === "touchstart") {
        state.initialX = e.touches[0].clientX - state.xOffset;
        state.initialY = e.touches[0].clientY - state.yOffset;
      } else {
        state.initialX = e.clientX - state.xOffset;
        state.initialY = e.clientY - state.yOffset;
      }

      if (element.closest('#lovify-help-modal').classList.contains('minimized')) {
        state.isDragging = true;
        this.wasDragged = false; // Reset drag state on start
      }
    };

    const dragEnd = () => {
      state.isDragging = false;
      // Set a small timeout to prevent the click event from firing after drag
      setTimeout(() => {
        this.wasDragged = false;
      }, 100);
    };

    const drag = (e) => {
      if (state.isDragging) {
        e.preventDefault();
        this.wasDragged = true; // Mark as dragged when movement occurs

        if (e.type === "touchmove") {
          state.currentX = e.touches[0].clientX - state.initialX;
          state.currentY = e.touches[0].clientY - state.initialY;
        } else {
          state.currentX = e.clientX - state.initialX;
          state.currentY = e.clientY - state.initialY;
        }

        state.xOffset = state.currentX;
        state.yOffset = state.currentY;

        this.setTranslate(state.currentX, state.currentY, element);
      }
    };

    element.addEventListener("touchstart", dragStart, false);
    element.addEventListener("touchend", dragEnd, false);
    element.addEventListener("touchmove", drag, false);

    element.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mousemove", drag, false);
    document.addEventListener("mouseup", dragEnd, false);
  },

  setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
}; 