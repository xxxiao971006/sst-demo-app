import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

const fakeExpenses = [
    { id: '1', description: 'Coffee', amount: 3.50, date: '2021-09-01' },
    { id: '2', description: 'Lunch', amount: 12.00, date: '2021-09-01' },
    { id: '3', description: 'Dinner', amount: 25.00, date: '2021-09-02' },
]

app.get('/expenses/total-amount', (c) => {
    const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0)
    return c.json({ total })
    }
)

app.get('/expenses', (c) => {
  return c.json({ expenses: fakeExpenses })
})

app.post('/expenses', async (c) => {
    const body = await c.req.json()
    const expense = body.expense
    fakeExpenses.push({
        id: (fakeExpenses.length + 1).toString(),
        ...expense
    })
  return c.json({ expenses: fakeExpenses })
})

export const handler = handle(app)