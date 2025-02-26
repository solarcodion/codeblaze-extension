/**
 * Rubber Duck Voice Handler
 * 
 * Features:
 * - Voice recording and transcription
 * - Real-time visualization
 * - Step-by-step voice guidance
 */

class RubberDuckVoice {
  constructor(container) {
    this.container = container;
    this.recognition = null;
    this.isListening = false;
    this.currentStep = 0;
    this.transcripts = [];
    this.visualizer = null;
    
    this.steps = [
      {
        prompt: "What is the problem you're having?",
        key: "problem"
      },
      {
        prompt: "How should it work?",
        key: "expected"
      }
    ];

    this.setupSpeechRecognition();
    this.setupVisualizer();
  }

  setupSpeechRecognition() {
    try {
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new window.SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        this.updateTranscript(transcript);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.stopListening();
      };

    } catch (e) {
      console.error('Speech recognition not supported:', e);
      this.container.innerHTML = `
        <div class="p-4 rounded-md bg-red-500/10 text-red-500">
          <p class="font-medium">Speech recognition not supported</p>
          <p class="text-sm mt-1">Please use a modern browser with speech recognition support.</p>
        </div>
      `;
    }
  }

  setupVisualizer() {
    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-16';
    this.container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        source.connect(analyser);
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const draw = () => {
          if (!this.isListening) return;
          
          requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          
          ctx.fillStyle = 'rgb(23, 23, 23)';
          ctx.fillRect(0, 0, width, height);
          
          const barWidth = (width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;
          
          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            
            ctx.fillStyle = `rgb(253, 224, 71)`;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
          }
        };
        
        this.visualizer = { draw, stream };
      })
      .catch(err => console.error('Error accessing microphone:', err));
  }

  startListening() {
    if (!this.recognition || this.isListening) return;
    
    this.isListening = true;
    this.recognition.start();
    
    if (this.visualizer) {
      this.visualizer.draw();
    }
    
    this.updateUI();
  }

  stopListening() {
    if (!this.recognition || !this.isListening) return;
    
    this.isListening = false;
    this.recognition.stop();
    this.updateUI();
  }

  updateTranscript(transcript) {
    const textarea = this.container.querySelector('#rubber-duck-textarea');
    if (textarea) {
      textarea.value = transcript;
      this.transcripts[this.currentStep] = transcript;
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      const textarea = this.container.querySelector('#rubber-duck-textarea');
      if (textarea) {
        textarea.value = ''; // Clear textarea for next step
      }
      
      // Update step indicators
      const steps = this.container.querySelectorAll('[data-step]');
      steps.forEach((step, index) => {
        step.classList.toggle('bg-yellow-500', index === this.currentStep);
        step.classList.toggle('bg-zinc-600', index !== this.currentStep);
      });
      
      this.updateUI();
      // Return false only if we're at the last step
      return this.currentStep < this.steps.length - 1;
    }
    return false;
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      const textarea = this.container.querySelector('#rubber-duck-textarea');
      if (textarea) {
        // Restore previous text
        textarea.value = this.transcripts[this.currentStep] || '';
      }
      
      // Update step indicators
      const steps = this.container.querySelectorAll('[data-step]');
      steps.forEach((step, index) => {
        step.classList.toggle('bg-yellow-500', index === this.currentStep);
        step.classList.toggle('bg-zinc-600', index !== this.currentStep);
      });
      
      this.updateUI();
      return true;
    }
    return false;
  }

  updateUI() {
    const step = this.steps[this.currentStep];
    const promptEl = this.container.querySelector('.prompt');
    if (promptEl) {
      promptEl.textContent = step.prompt;
    }

    const recordButton = this.container.querySelector('.record-button');
    if (recordButton) {
      recordButton.setAttribute('aria-pressed', this.isListening.toString());
      recordButton.classList.toggle('recording', this.isListening);
    }

    // Update back button state
    const backButton = this.container.querySelector('[data-action="back"]');
    if (backButton) {
      backButton.disabled = this.currentStep === 0;
    }

    // Update textarea with current step's text
    const textarea = this.container.querySelector('#rubber-duck-textarea');
    if (textarea) {
      textarea.value = this.transcripts[this.currentStep] || '';
    }
  }

  generatePrompt() {
    return `🦆 Rubber Duck Debugging Session:

1️⃣ The problem I'm facing:
${this.transcripts[0] || 'Not specified'}

2️⃣ How I expect it to work:
${this.transcripts[1] || 'Not specified'}

3️⃣ Rubber Duck Yourself:
Now that you've explained the problem and your expectations, take a moment to:
- Review your explanation step by step
- Consider any assumptions you've made
- Think about edge cases
- Look for any missing requirements
- Question if your expected behavior matches your actual needs

What insights can you gain from this self-reflection?`;
  }

  cleanup() {
    if (this.recognition) {
      this.stopListening();
    }
    if (this.visualizer?.stream) {
      this.visualizer.stream.getTracks().forEach(track => track.stop());
    }
  }
}

window.RubberDuckVoice = RubberDuckVoice; 