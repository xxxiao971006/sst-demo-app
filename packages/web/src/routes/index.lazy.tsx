import { useState, useEffect } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import {useKindeAuth} from '@kinde-oss/kinde-auth-react';


type El = {
  pets: {
    id: string,
    name: string,
    species: string,
    imageUrl: string | undefined,
  },
  users: {
    givenName: string,
    familyName: string,
  }
}

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { getToken } = useKindeAuth();
  const [loading, setLoading] = useState(false)
  const [deleteKey, setDeleteKey] = useState('')
  const [pets, setPets] = useState<El[]>([])

  const getPets = async () => {
    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/pets`)
    if (!res.ok) {
      throw new Error('Failed to fetch pets')
    }
    const data = await res.json()
    console.log(data) 
    return data.pets as El[]
  }


  const handleDelete = async (petId: number, petImgKey: string | undefined) => {
    setLoading(true)
    const token = await getToken()
    if (!token) {
      throw new Error('Failed to get token')
    }

    // delete the pet from the pets table
    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/pets/${petId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) {
      throw new Error('Failed to delete pet')
    }
    const data = await res.json()
    console.log(data)

    // delete the pet image_url from the s3 bucket
    if(petImgKey !== undefined) {
      const delRes = await fetch(`${import.meta.env.VITE_APP_API_URL}/delete-object/${petImgKey}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      if (!delRes.ok) {
        throw new Error('Failed to delete pet image')
      }
      const delData = await delRes.json()
      console.log(delData)
    }

    // refresh the page
    const allPets = await getPets()
    setPets(allPets)
    setLoading(false)
  }

  useEffect(() => {
    async function fetchPets() {
      const allPets = await getPets()
      setPets(allPets)
    }
    fetchPets()
  }, [])

  return (
    <div className="flex flex-col items-center bg-black text-white w-full min-h-screen h-full">
      <h3 className='text-blue-300 text-4xl font-bold '>Welcome to .NET Animal Cafe!</h3>
      <p className='text-blue-300 text-2xl font-bold my-4'>Our beloved animal employees:</p>
      <div className='grid grid-cols-3 gap-4 bg-black m-4'>
        {pets.map((el) => ( 
          el.pets !== null &&
          <div key={el.pets.id} className='flex-col border rounded-lg border-white inline-flex gap-4 p-4 h-full'>
            <img src={el.pets?.imageUrl} alt={el.pets.name} className='w-64' />
            <p>Name: {el.pets.name}</p>
            <p>Species: {el.pets.species}</p>
            <p>Adopted by: {el.users.givenName} {el.users.familyName}</p>
            {/* delete button  */}
            <button className='border border-red-500 text-red-500 rounded-lg p-2' onClick={() => {
              handleDelete(Number(el.pets.id), el.pets?.imageUrl ? el.pets.imageUrl.split('/').pop() : undefined)
              setDeleteKey(el.pets.id)
            }}>
              {loading && deleteKey === el.pets.id ? 'Deleting...' : 'Delete'}
            </button>
            
          </div>
        ))} 
      </div>
    </div>
  )
}