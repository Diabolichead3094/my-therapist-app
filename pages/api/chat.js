export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, apiKey, provider } = req.body;
    
    console.log('Received request:', { provider, hasKey: !!apiKey, messageCount: messages?.length });

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.7,
          max_tokens: 150
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('OpenAI error:', data);
        return res.status(response.status).json({ error: data.error?.message || 'OpenAI API error' });
      }
      
      return res.status(200).json(data);
      
    } else if (provider === 'claude') {
      // For Claude, we need to format messages differently
      const claudeMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          messages: claudeMessages,
          max_tokens: 150
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Claude error:', data);
        return res.status(response.status).json({ error: data.error?.message || 'Claude API error' });
      }
      
      // Format Claude response to match OpenAI structure
      return res.status(200).json({
        choices: [{
          message: {
            content: data.content[0].text
          }
        }]
      });
    } else {
      return res.status(400).json({ error: 'Invalid provider' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
