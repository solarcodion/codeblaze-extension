// First Prompt Module
window.FirstPrompt = (() => {
  async function generateFirstPrompt(prompt, prd, actionPlan) {
    try {
      console.log('Generating first prompt with:', {
        originalPrompt: prompt,
        prd: prd,
        actionPlan: actionPlan
      });

      const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/prompt-chain-first-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, prd, action_plan: actionPlan })
      });

      console.log('First prompt API response status:', response.status);
      console.log('First prompt API response status text:', response.statusText);

      const responseText = await response.text();
      console.log('First prompt raw response:', responseText);

      if (!response.ok) {
        console.error('First prompt API error:', {
          status: response.status,
          statusText: response.statusText,
          response: responseText
        });
        throw new Error(`Failed to generate first prompt: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed first prompt response:', data);

        // Extract the raw_response from the nested structure
        const rawResponse = data.first_prompt?.raw_response;
        if (!rawResponse) {
          throw new Error('Invalid response format - missing raw_response');
        }

        // Parse the raw response into structured data
        const lines = rawResponse.split('\n');
        const parsedData = {
          phase: lines.find(line => line.startsWith('Phase:'))?.replace('Phase:', '').trim(),
          feature: lines.find(line => line.startsWith('Feature:'))?.replace('Feature:', '').trim(),
          task: lines.find(line => line.startsWith('Task:'))?.replace('Task:', '').trim(),
          prompt: lines.find(line => line.startsWith('Prompt:'))?.replace('Prompt:', '').trim()
        };

        console.log('Parsed prompt data:', parsedData);

        // Validate phase and feature
        if (!parsedData.phase || !parsedData.feature) {
          console.error('Missing required fields in parsed data:', parsedData);
          throw new Error('Invalid response format - missing required fields');
        }

        // If task is missing but prompt exists, use first line of prompt as task
        if (!parsedData.task && parsedData.prompt) {
          const promptLines = parsedData.prompt.split('\n');
          parsedData.task = promptLines[0].trim();
          console.log('Using first line of prompt as task:', parsedData);
        }

        // If prompt is missing but task exists, use task as prompt
        if (!parsedData.prompt && parsedData.task) {
          parsedData.prompt = parsedData.task;
          console.log('Using task as prompt:', parsedData);
        }

        // Final validation to ensure we have all required fields
        if (!parsedData.task || !parsedData.prompt) {
          console.error('Missing task or prompt in parsed data:', parsedData);
          throw new Error('Invalid response format - missing task or prompt');
        }

        return parsedData;
      } catch (parseError) {
        console.error('Error parsing first prompt response:', {
          error: parseError,
          responseText: responseText
        });
        throw new Error('Invalid JSON response from first prompt API');
      }
    } catch (error) {
      console.error('Error in generateFirstPrompt:', error);
      throw error;
    }
  }

  function insertPromptIntoTextarea(promptData) {
    try {
      console.log('Inserting prompt data into textarea:', promptData);

      // Find the prompt textarea - use more general selector
      const textarea = document.querySelector('textarea');
      console.log('Found textarea:', textarea);

      if (!textarea) {
        console.error('Could not find prompt textarea');
        throw new Error('Prompt textarea not found');
      }

      // Format the prompt with the phase, feature, and task information
      const formattedPrompt = `Phase: ${promptData.phase}
Feature: ${promptData.feature}
Task: ${promptData.task}

${promptData.prompt}`;

      console.log('Formatted prompt to insert:', formattedPrompt);

      // Insert the prompt and trigger input event
      textarea.value = formattedPrompt;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Force textarea to update
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Ensure textarea is focused
      textarea.focus();

      console.log('Successfully inserted prompt into textarea');
    } catch (error) {
      console.error('Error inserting prompt:', error);
      throw error;
    }
  }

  async function savePromptToDatabase(promptData, taskId = null) {
    try {
      const projectId = localStorage.getItem('currentProjectId');
      if (!projectId) {
        throw new Error('No project ID found');
      }

      const response = await fetch('https://bxfndlpaxudrlrxsqmik.supabase.co/functions/v1/save-project-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Zm5kbHBheHVkcmxyeHNxbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDExNDUsImV4cCI6MjA1MTY3NzE0NX0.DCxziRVYTIIk6w07YbUa0AZJqIp5K9mR68iGVom9Qy0'
        },
        body: JSON.stringify({
          project_id: projectId,
          task_id: taskId,
          prompt: promptData.prompt,
          phase: promptData.phase,
          feature: promptData.feature,
          task: promptData.task
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save prompt to database');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving prompt to database:', error);
      throw error;
    }
  }

  // Public API
  return {
    generateAndInsert: async (prompt, prd, actionPlan, taskId = null) => {
      console.log('Starting generateAndInsert process');
      
      try {
        const promptData = await generateFirstPrompt(prompt, prd, actionPlan);
        
        // Save prompt to database before inserting into textarea
        try {
          await savePromptToDatabase(promptData, taskId);
        } catch (saveError) {
          console.error('Failed to save prompt to database:', saveError);
          // Continue with insertion even if save fails
        }

        insertPromptIntoTextarea(promptData);
        console.log('Successfully completed generateAndInsert process');
      } catch (error) {
        console.error('Failed to generate and insert prompt:', error);
        throw error;
      }
    }
  };
})(); 