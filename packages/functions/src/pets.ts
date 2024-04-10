import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { pets as petsTable, users as usersTable } from '@my-sst-app/core/db/schema/pets'
import { db } from '@my-sst-app/core/db'
import { eq, desc } from 'drizzle-orm'
import { authMiddleware } from '@my-sst-app/core/auth'

const app = new Hono()

app.get('/pets', async (c) => {
    const pets = await db.select()
        .from(petsTable)
        .fullJoin(usersTable, eq(petsTable.userId, usersTable.id))
    console.log(pets) 
    return c.json({ pets})
})

app.post('/pets', authMiddleware, async (c) => {
    const userId = c.var.userId
    const body = await c.req.json()
    const animal = {
        ...body.animal,
        // userId,
    }
    const newAnimal = await db.insert(petsTable).values(animal).returning()
    return c.json({ newAnimal })
})

app.post('/new-user', async (c) => {
    const body = await c.req.json()
    const userData  = {
        ...body.user,
    }
    // check if user exists in user table, if user exists, return user
    // if user does not exist, create user
    const users = await db.select().from(usersTable).where(eq(usersTable.email, userData.email)).execute();

    const userExists = users.length > 0;
    if (!userExists) {
        const newUser = await db.insert(usersTable).values(userData).returning();
        return c.json({ newUser: newUser[0]});
    } 
    else {    
        return c.json({ user: users[0] });
    }      
})

// delete a pet from the pets table
app.delete('/pets/:id', authMiddleware, async (c) => {
    const userId = c.var.userId
    const id = c.req.param('id')
    // full join the pets table with the users table
    const pet = await db.select()
        .from(petsTable)
        .fullJoin(usersTable, eq(petsTable.userId, usersTable.id))
        .where(eq(petsTable.id, Number(id)))
        .execute();
        
    if (pet.length === 0) {
        return c.json({ error: 'Pet not found' }, 404);
    }
    if (pet[0].users?.kindeUserId !== userId) {
        return c.json({ error: 'Unauthorized' }, 403);
    }
    await db.delete(petsTable).where(eq(petsTable.id, Number(id))).execute();
    return c.json({ success: true });
})

export const handler = handle(app)