javascript
import '../styles/globals.css'
import { useState, useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      setUser({ token })
    }
  }, [])

  return <Component {...pageProps} user={user} setUser={setUser} />
}
