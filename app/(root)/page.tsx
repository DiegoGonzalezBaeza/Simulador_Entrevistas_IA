import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";

const Page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Prepárate para entrevistas con simulaciones y comentarios automaticos impulsadas por IA</h2>
          <p className="text-lg">
          Practica con preguntas reales de entrevistas y recibe retroalimentación instantánea
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Comenzar Entrevista</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="robo-dude" width={400} height={400} className="max-sm:hidden"/>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Tus Entrevistas</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
            ))} 

          {/* <p>Aún no has realizado ninguna entrevista</p>  */}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Realizar una entrevista</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
            ))}      
        </div>
      </section>

    </>
  );
}
export default Page;