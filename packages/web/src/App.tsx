import { useEffect, useState } from 'react'
import './App.css'

type Expense = {
  id: string,
  description: string,
  amount: number,
  date: string,
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState('')

  useEffect(() => {
    async function fetchExpenses() {
    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/expenses`)
    const data = await res.json()
    setExpenses(data.expenses)
  }
  fetchExpenses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expense: {
          description: title,
          amount: amount,
          date: date,
        },
      }),
    })
    const data = await res.json()
    setExpenses(data.expenses)
    setTitle('')
    setAmount(0)
    setDate('')
  }

  return (
    <div className="App">
      <h2>Total Expenses</h2>
      <div className="card">
        <div>${expenses.reduce((acc, expense) => acc + expense.amount, 0)}</div>
      </div>

      <h2>Expenses</h2>
      <div className="card">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense">
            <div>{expense.description}</div>
            <div>${expense.amount}</div>
            <div>{expense.date}</div>
          </div>
        ))}
      </div>

      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit} >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default App
