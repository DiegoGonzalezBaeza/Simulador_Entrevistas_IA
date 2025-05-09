'use server';

import { db, auth } from "@/firebase/admin";
import {cookies} from "next/headers";
import { redirect } from "next/navigation";

const ONE_WEEK = 60 * 60 * 24 * 7;


export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;
  
  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "El usuario ya existe."
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email
    });

    return{
        success:true,
        message: "Cuenta creada correctamente. Por favor inicie sesión.",
    }

} catch (e: any) {
    console.error("Error creando usuario", e);

    if(e.code === "auth/email-already-exists") {
        return {
            sucess: false,
            message: "El correo ya está en uso."
        }
      }
      return {
        sucess: false,
        message:"Fallo en la creación de la cuenta."
      }
    }
 }

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
        return {
            success: false,
            message: "El usuario no existe."
        };
        }
        await setSessionCookie(idToken);

    } catch (e: any) {
        console.log("Error iniciando sesión", e);
        return {
        success: false,
        message: "Error al iniciar sesión."
        };
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: ONE_WEEK *1000});

    cookieStore.set("session", sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path:'/',
        sameSite: "lax",
    })

} 

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value || null;
    
    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

        if (!userRecord.exists) {
            return null;
        }

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch (e) {
        console.log("Error verifying session cookie", e);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/sign-in");
  }