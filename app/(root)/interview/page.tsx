import Agent from '@/components/Agent'
import React from 'react'
import { getCurrentUser } from '@/lib/actions/auth.actions'

const page = async () => {
    const user = await getCurrentUser();

  return (
    <>
      <h3>Generación de Entrevista</h3>
      <Agent userName={user?.name!} userId={user?.id} type="generate"/>
    </>
  )
}

export default page
