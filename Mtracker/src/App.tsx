import { useState } from 'react'
import { Button } from "@/components/ui/button"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        {count}
      </div>
      <Button onClick={() => setCount(count + 1)}>This is the button</Button>
    </>
  )
}

export default App
