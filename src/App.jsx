import { useState } from 'react'
import './App.css'
import QuestionCard from './components/question-card';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="card-container">
      <QuestionCard />
    </div>
  )
}

export default App
