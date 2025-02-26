let selectedRating = 0;

// Heart rating functionality
const heartButtons = document.querySelectorAll('.heart-btn');
heartButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedRating = parseInt(btn.dataset.rating);
    updateHearts();
  });
  
  btn.addEventListener('mouseover', () => {
    const rating = parseInt(btn.dataset.rating);
    updateHearts(rating);
  });
  
  btn.addEventListener('mouseout', () => {
    updateHearts();
  });
});

function updateHearts(tempRating = null) {
  const rating = tempRating || selectedRating;
  heartButtons.forEach((btn, index) => {
    const buttonRating = index + 1;
    btn.classList.toggle('filled', buttonRating <= rating);
  });
}

function showError(message, details = '') {
  const errorElement = document.getElementById('error-message');
  errorElement.innerHTML = `
    <div><strong>${message}</strong></div>
    ${details ? `<div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">${details}</div>` : ''}
  `;
  errorElement.style.display = 'block';
}

// Submit functionality
document.getElementById('submit-btn').addEventListener('click', async () => {
  const submitButton = document.getElementById('submit-btn');
  const comment = document.getElementById('comment').value;
  const email = document.getElementById('email').value;
  
  if (!selectedRating) {
    showError('Please select a rating before submitting');
    return;
  }

  // Disable submit button and show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';
  
  // Prepare the request payload
  const payload = {
    rating: selectedRating.toString()
  };
  if (comment) payload.comment = comment;
  if (email) payload.email = email;
  
  try {
    const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/submit-feedback', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Zm5kbHBheHVkcmxyeHNxbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDExNDUsImV4cCI6MjA1MTY3NzE0NX0.DCxziRVYTIIk6w07YbUa0AZJqIp5K9mR68iGVom9Qy0',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const responseData = await response.text();

    if (response.ok) {
      // Hide the feedback form
      document.getElementById('feedback-form').style.display = 'none';
      // Show thank you message
      document.getElementById('thanks-message').style.display = 'block';
    } else {
      throw new Error(`Server responded with status ${response.status}. ${responseData}`);
    }
  } catch (error) {
    let errorMessage = 'Failed to submit feedback';
    let errorDetails = '';

    if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error occurred';
      errorDetails = 'Please check your internet connection and try again.';
    } else {
      errorDetails = `Error details: ${error.message}`;
    }

    showError(errorMessage, errorDetails);
  } finally {
    // Re-enable submit button and restore text
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Feedback';
  }
});

// Handle link clicks
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: link.href });
  });
}); 
