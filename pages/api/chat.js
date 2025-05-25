javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, provider, apiKey } = req.body

    // Check if API key is provided
    if (!apiKey) {
      return res.status(200).json({
        choices: [{
          message: {
            content: "Please set your API key in the settings to start chatting. I'm here to help once you've configured your AI provider."
          }
        }]
      })
    }

    let response
    if (provider === 'openai') {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a compassionate AI therapist. Be empathetic, supportive, and help users explore their feelings. 
              Never provide medical diagnosis or medication advice. Encourage professional help for serious issues.
              Keep responses concise but warm and supportive.`
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('OpenAI error:', error)
        throw new Error('OpenAI API error')
      }

      const data = await response.json()
      return res.status(200).json(data)
      
    } else if (provider === 'claude') {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          system: `You are a compassionate AI therapist. Be empathetic, supportive, and help users explore their feelings. 
          Never provide medical diagnosis or medication advice. Encourage professional help for serious issues.
          Keep responses concise but warm and supportive.`,
          messages: messages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          })),
          max_tokens: 200
        })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Claude error:', error)
        throw new Error('Claude API error')
      }

      const data = await response.json()
      
      // Format Claude response to match OpenAI structure
      return res.status(200).json({
        choices: [{
          message: {
            content: data.content[0].text
          }
        }]
      })
    }

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Return a helpful error message
    return res.status(200).json({
      choices: [{
        message: {
          content: "I'm having trouble connecting right now. Please check your API key and make sure you have credits available. If the problem persists, try again in a moment."
        }
      }]
    })
  }
}
