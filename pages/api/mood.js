javascript
import { db } from '../../lib/db'
import { getUserFromRequest } from '../../lib/auth'

export default async function handler(req, res) {
  try {
    // For now, work without authentication
    if (req.method === 'GET') {
      // Return empty array for now
      return res.status(200).json([])
    }

    if (req.method === 'POST') {
      const { moodScore, notes } = req.body
      
      // For demo, just return success
      return res.status(201).json({ 
        success: true,
        moodScore,
        notes,
        date: new Date().toISOString()
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Mood API error:', error)
    res.status(500).json({ error: 'Failed to process mood data' })
  }
}
```

---

## FILE: pages/api/goals.js
```javascript
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Return sample goals for demo
      return res.status(200).json([
        { id: 1, title: 'Practice mindfulness daily', progress: 60, completed: false },
        { id: 2, title: 'Journal before bed', progress: 40, completed: false }
      ])
    }

    if (req.method === 'POST') {
      const { title, description } = req.body
      return res.status(201).json({ 
        id: Date.now(),
        title,
        description,
        progress: 0,
        completed: false
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Goals API error:', error)
    res.status(500).json({ error: 'Failed to process goals' })
  }
}
