"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { toast } from "sonner"
import FormField from "@/components/FormField"
import { useRouter } from "next/navigation"
import { create } from "domain"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import {signUp, signIn} from "@/lib/actions/auth.actions"
import { auth } from "@/firebase/client"
import { sign } from "crypto"


 
const formSchema = z.object({
  username: z.string().min(2).max(50),
})

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  })
}

const AuthForm = ({type}: {type:FormType}) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const {name, email, password} = values

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,});

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Cuenta creada. Por favor inicie sesión...")
        router.push("/sign-in")
      } else {
        const {email, password} = values
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredentials.user.getIdToken();

        if(!idToken){
          toast.error("Error al iniciar sesión. Por favor intente de nuevo.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Inicio de sesión exitoso.")
        router.push("/")
      }
    }
    catch (error) {
      console.log(error);
      toast.error(`Error al iniciar sesión: ${error}`);
    }
  }

  const isSignIn = type === "sign-in"
  const isSignUp = type === "sign-up"

  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">

            <div className="flex flex-row gap-2 justify-center">
                <Image 
                    src="/logo.svg"
                    alt="Logo"
                    width={38}
                    height={32}
                />
                <h2 className="text-primary-100">SimuladorIA</h2>

            </div>
            <h3>Practica una entrevista laboral con AI</h3>
      
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
        {!isSignIn && (<FormField 
                          control={form.control}
                          name="name"
                          label="Nombre"
                          placeholder="Nombre de Usuario"/>)}
        <FormField 
                          control={form.control}
                          name="email"
                          label="Email"
                          placeholder="Correo Electrónico"
                          type="email"/>
        <FormField 
                          control={form.control}
                          name="password"
                          label="Contraseña"
                          placeholder="Contraseña - Minimo 6 caracteres"
                          type="password"/>
        <Button className="btn" type="submit">{isSignIn ? 'Iniciar sesión' : 'Crear una cuenta'}</Button>
      </form>
    </Form>
 
    <p className="text-center">
        {isSignIn ? '¿Aún no tienes una cuenta?':'¿Ya tienes una cuenta?'}
        <Link 
            href={!isSignIn ? '/sign-in' : '/sign-up'}
            className="font-bold text-user-primary ml-1"
        >
            {!isSignIn ? "Iniciar sesión" : "Crear una cuenta"}
        </Link>
    </p>
    <div className="flex justify-center">
        <h3>Iniciar sesión como invitado</h3>
        <h4>Email      : invitado@invitado.com</h4>
        <h4>Contraseña : Invitado159</h4>
    </div>    
    </div>
    </div>
  )
}

export default AuthForm
