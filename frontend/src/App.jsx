import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '4rem' }}>
      <h1>React corriendo en Docker</h1>
      <button onClick={() => setCount(count + 1)}>Clicks: {count}</button>
    </main>
  )
}

export default App
