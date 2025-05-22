export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, apiKey, provider } = req.body;

  try {
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
      
      if (!response.ok) {
        const error = await response.text();
        console.error('OpenAI error:', error);
        throw new Error('OpenAI API error');
      }
      
      const data = await response.json();
      res.status(200).json(data);
      
    } else if (provider === 'claude') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          messages: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          })),
          max_tokens: 150
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error('Claude error:', error);
        throw new Error('Claude API error');
      }
      
      const data = await response.json();
      // Format Claude response to match OpenAI structure
      const formattedResponse = {
        choices: [{
          message: {
            content: data.content[0].text
          }
        }]
      };
      res.status(200).json(formattedResponse);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
}
