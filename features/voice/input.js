/**
 * Voice Input Handler
 * 
 * Features:
 * - Speech recognition setup
 * - Continuous listening mode
 * - Error handling
 * - Results processing
 */

// Voice input functionality for Lovify extension

function setupVoiceInput(textarea, micButton) {
  let recognition = null;
  let isListening = false;

  try {
    // Initialize speech recognition
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new window.SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
  } catch (e) {
    console.error('Speech recognition not supported:', e);
    micButton.style.display = 'none';
    return;
  }

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
    
    textarea.value = transcript;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    stopListening();
  };

  const startListening = () => {
    recognition.start();
    isListening = true;
    micButton.classList.add('recording');
    micButton.setAttribute('aria-pressed', 'true');
  };

  const stopListening = () => {
    recognition.stop();
    isListening = false;
    micButton.classList.remove('recording');
    micButton.setAttribute('aria-pressed', 'false');
  };

  micButton.addEventListener('click', () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  });
}

window.VoiceInput = {
  setupVoiceInput
}; 