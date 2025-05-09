import {ReactNode} from "react";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.actions";

const RootLayout = async ({children}: {children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if(!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <nav  className="flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={38}
            height={32}
          />
          <h2 className="text-primary-100">SimuladorIA</h2>
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-lg">Hola, {user.name}</span>
          )}
           <form action={signOut}>
            <Button type="submit" className="btn-primary">
              Cerrar sesión
            </Button>
          </form>


        </div>
      </nav>
      {children}
    </div>
  );
}
export default RootLayout;