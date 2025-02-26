/**
 * Sparkles Button Component
 * 
 * Features:
 * - Adds a sparkles button next to the microphone button
 * - Transforms into a loading spinner when clicked
 * - Simulates API call and inserts text into textarea
 * - Triggers confetti explosion effect
 */

function createSparklesButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'Add sparkles');
  button.setAttribute('data-lovify-sparkles', 'true');
  button.className = 'whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1 px-1 py-0.5 h-fit focus-visible:ring-0 group';
  
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-white">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  `;

  // Add click handler
  button.addEventListener('click', async () => {
    // Show loading state
    const textarea = document.querySelector('textarea');
    if (!textarea || !textarea.value.trim()) {
      console.log('❌ No prompt text found');
      alert('Please enter a prompt first');
      return;
    }

    console.log('🎯 Starting prompt improvement...');
    console.log('📝 Original prompt:', textarea.value);

    // Show loading state
    const originalContent = button.innerHTML;
    button.innerHTML = `
      <svg class="animate-spin text-white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v2m0 8v2m-6-6h2m8 0h2m-5 0a1 1 0 110-2 1 1 0 010 2z"/>
      </svg>
    `;
    button.disabled = true;

    try {
      console.log('🔄 Calling Supabase edge function...');
      
      // Call Supabase edge function
      const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/prompt-improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Zm5kbHBheHVkcmxyeHNxbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDExNDUsImV4cCI6MjA1MTY3NzE0NX0.DCxziRVYTIIk6w07YbUa0AZJqIp5K9mR68iGVom9Qy0',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Zm5kbHBheHVkcmxyeHNxbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDExNDUsImV4cCI6MjA1MTY3NzE0NX0.DCxziRVYTIIk6w07YbUa0AZJqIp5K9mR68iGVom9Qy0'
        },
        body: JSON.stringify({
          prompt: textarea.value
        })
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✨ Improved prompt received:', data);
      
      // Validate response data
      if (!data || !data.improved_prompt) {
        throw new Error('Invalid response format from server');
      }
      
      // Extract just the improved prompt text
      const improvedPrompt = data.improved_prompt;
      
      // Insert improved prompt
      textarea.value = improvedPrompt;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('✅ Prompt updated successfully:', improvedPrompt);

      // Create confetti effect
      createConfetti();
      
    } catch (error) {
      console.error('❌ Error improving prompt:', error);
      alert('Failed to improve prompt. Please try again.');
    } finally {
      // Reset button state
      button.innerHTML = originalContent;
      button.disabled = false;
      console.log('🔄 Button reset to original state');
    }
  });

  return button;
}

// Create confetti effect
function createConfetti() {
  const colors = ['#FF69B4', '#9B59B6', '#3498DB', '#2ECC71', '#F1C40F'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'absolute pointer-events-none';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = -10 + 'px';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.zIndex = '9999';
    document.body.appendChild(confetti);

    const animation = confetti.animate([
      { 
        transform: `translate(0, 0) rotate(${Math.random() * 360}deg)`,
        opacity: 1
      },
      {
        transform: `translate(${Math.random() * 200 - 100}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`,
        opacity: 0
      }
    ], {
      duration: 1500 + Math.random() * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => confetti.remove();
  }
}

window.SparklesButton = {
  createSparklesButton
}; 