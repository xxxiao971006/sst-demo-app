import { Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { createRootRouteWithContext } from "@tanstack/react-router";
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export const Route = createRootRouteWithContext()({
  component: Component,
});

function Component() {
  const { isAuthenticated } = useKindeAuth();
  return (
    <>
      <div className="p-2 flex gap-4 items-center bg-black text-white ">
            <Link to="/" className="[&.active]:font-bold">
                Home
            </Link>

            {isAuthenticated ? (
                <Link to="/new-animal" className="[&.active]:font-bold">
                    New Animal
                </Link>
            ) 
            :
            <Link to="/authenticated" className="">
                New Animal
            </Link>
            }       

            {isAuthenticated ? (
                <Link to="/profile" className="[&.active]:font-bold">
                    Profile
                </Link>
            ) 
            :
            <Link to="/authenticated" className="">
                Profile
            </Link>
            }
        
            </div>
            <hr />
            <Outlet />
            <TanStackRouterDevtools />
    </>
  );
}


