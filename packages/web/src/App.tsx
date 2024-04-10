// import { useEffect, useState } from 'react'
// import {useKindeAuth} from '@kinde-oss/kinde-auth-react';
// import './App.css'


// type Expense = {
//   id: string,
//   userId: string,
//   title: string,
//   amount: number,
//   date: string,
// }

// function App() {
//   const [expenses, setExpenses] = useState<Expense[]>([])
//   const [totalExpenses, setTotalExpenses] = useState(0)
//   // const [userId, setUserId] = useState('')
//   const [title, setTitle] = useState('')
//   const [amount, setAmount] = useState(0)
//   const [date, setDate] = useState('')
//   const { login, register, logout } = useKindeAuth();
//   const { isAuthenticated, user } = useKindeAuth();
//   const { getToken } = useKindeAuth();

//   const getExpenses = async () => {
//       const token = await getToken()
//       if (!token) {
//         throw new Error('Failed to get token')
//       }
    
//     const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/expenses`, {
//       headers: {
//           Authorization: token,
//         },
//     })
//     if (!res.ok) {
//       throw new Error('Failed to fetch expenses')
//     }
//     const data = await res.json()
//     return data.expenses as Expense[]
//   }

//   useEffect(() => {
//     async function fetchExpenses() {
//     const allExpenses = await getExpenses()
//     setExpenses(allExpenses)
//   }
//   fetchExpenses()
//   }, [])

//   const getTotalExpenses = async () => {
//     const token = await getToken()
//     if (!token) {
//       throw new Error('Failed to get token')
//     }
    
//     const res = await fetch(
//       `${import.meta.env.VITE_APP_API_URL}/expenses/total-amount`, {
//         headers: {
//           Authorization: token,
//         },
//       }
//       )
//     if (!res.ok) {
//       throw new Error('Failed to fetch total expenses')
//     }
//     const data = await res.json()
//     setTotalExpenses(data.result.total)
//     return data.result.total
//   }

//   useEffect(() => {
//     async function fetchExpenses() {
//     const totalExpenses = await getTotalExpenses()
//     setTotalExpenses(totalExpenses)
//   }
//   fetchExpenses()
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const token = await getToken()
//     if (!token) {
//       throw new Error('Failed to get token')
//     }
//     const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/expenses`, {
//       method: 'POST',
//       headers: {
//         Authorization: token,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         expense: {
//           // userId, 
//           title,
//           amount,
//           date,
//         },
//       }),
//     })
//     const data = await res.json()
//     setExpenses(data.expenses)
//     // setUserId('')
//     setTitle('')
//     setAmount(0)
//     setDate('')
//   }

//   return (
//     <div className="App">
//       <div>
//         <button onClick={() => register()} type="button">Sign up</button>
//         <button onClick={() => login()} type="button">Sign In</button>
//         <button onClick={() => logout()} type="button">Sign Out</button>
//       </div>
      
//       {isAuthenticated && (
//         <>
//           <h2>Welcome, {user?.family_name}</h2>
//           <h2>Total Expenses</h2>
//           <div className="card">
//             <div>${totalExpenses}</div>
//           </div>
//         </>
//       )
//       }

//       <h2>Expenses</h2>
//       <div className="card">
//         {expenses.map((expense) => (
//           <div key={expense.id}>
//             {/* <div>{expense.userId}</div> */}
//             <div>{expense.title}</div>
//             <div>${expense.amount}</div>
//             <div>{expense.date}</div>
//           </div>
//         ))}
//       </div>

//       <h2>Add Expense</h2>
//       <form onSubmit={handleSubmit} >
//         {/* <input
//           type="text"
//           placeholder="User ID"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//         /> */}
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(parseFloat(e.target.value))}
//         />
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//         <button type="submit">Add Expense</button>
//       </form>
//     </div>
//   );
// }

// export default App
