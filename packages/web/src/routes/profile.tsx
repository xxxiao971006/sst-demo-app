import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/profile")({
  component: Profile,
})

function Profile() {
  const { logout, user } = useKindeAuth();
  return (
    <div className="flex flex-col gap-y-4 items-center bg-black text-white h-screen">
      <h1 className="text-4xl font-bold mt-4">Hi, {user?.given_name} 🦊</h1>
      <div className="text-2xl font-bold">{user?.email}</div>
      <button onClick={() => logout()} className='border'>Logout</button>
    </div>
  );
}