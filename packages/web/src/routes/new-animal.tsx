import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {useKindeAuth} from '@kinde-oss/kinde-auth-react';




function NewAnimal() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  // set an image file
  const [image, setImage] = useState<File | undefined>(undefined)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | undefined>(undefined)

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  const { user, getToken } = useKindeAuth();
  const navigate = useNavigate()

  const ifUserExists = async () => {
    // console.log(user)
    const token = await getToken()
    if (!token) {
      throw new Error('Failed to get token')
    }
    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/new-user`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          email: user?.email,
          kindeUserId: user?.id,
          givenName: user?.given_name,
          familyName: user?.family_name,
        },
      }),
    })
    if (!res.ok) {
      throw new Error('Failed to fetch user')
    }
    const data = await res.json()
    return data.newUser ? data.newUser : data.user
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const token = await getToken()
    if (!token) {
      throw new Error('Failed to get token')
    }

    let imageUrl = ''
    if(image) {
      const signedUrlResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/signed-url`, { 
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType: image.type,
          contentLength: image.size,
          checksum: await computeSHA256(image),
        }),
      })
      if(!signedUrlResponse.ok) {
        throw new Error('Failed to get signed URL')
      }
      const { url } = await signedUrlResponse.json() as { url: string }

      await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': image.type,
        },
        body: image,
      })
      imageUrl = url.split('?')[0]
      console.log(imageUrl)
    }
    

    const user = await ifUserExists()
    console.log(user)
    if (!user) {
      throw new Error('Failed to fetch user')
    }
    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/pets`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        animal: {
          name,
          species,
          userId: user.id,
          imageUrl: imageUrl,
        },
      }),
    })
    const data = await res.json()
    console.log(data)
    setName('')
    setSpecies('')
    setLoading(false)

    navigate({
      to: '/',
    })
    
  }

  return (
    <div className="flex flex-col items-center bg-black text-black h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 m-4">
        <input type="text" required placeholder="Name" className="border" value={name} onChange={(e) => setName(e.target.value) }/>
        <input type="text" required placeholder="Species" className="border" value={species} onChange={(e) => setSpecies(e.target.value)} />
        <input type="file" className="border text-white" accept='image/*' onChange={(e) => {
          const file = e.target.files?.[0]
          if (filePreviewUrl) {
            URL.revokeObjectURL(filePreviewUrl)
          }
          if (file) {
            const url = URL.createObjectURL(file)
            setFilePreviewUrl(url)
          } else {
            setFilePreviewUrl(undefined)
          }
          setImage(e.target.files?.[0])
          
        }} />
        {filePreviewUrl && <img src={filePreviewUrl} alt="preview" className='max-w-60' />}
        <button type="submit" className="border text-white">
          {loading ? 'Submitting' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export const Route = createFileRoute('/new-animal')({
  component: NewAnimal,
})