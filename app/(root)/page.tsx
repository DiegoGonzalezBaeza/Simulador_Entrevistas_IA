import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { getInterviewsByUserId, getLatestInterviews, getFeedbacksByUserId } from "@/lib/actions/general.actions";
// import FeedbackCard from "@/components/FeedbackCard";

const Page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id!}),
    // await getFeedbacksByUserId(user?.id!),
  ]);

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;
  // const hasFeedbacks = userFeedbacks?.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Prepárate para entrevistas con simulaciones y comentarios automaticos impulsadas por IA</h2>
          <p className="text-lg">
          Practica con preguntas reales de entrevistas y recibe retroalimentación instantánea
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Crear Entrevista</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="robo-dude" width={400} height={400} className="max-sm:hidden"/>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Tus Entrevistas</h2>
        <div className="interviews-section">
          { 
            hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />        
            ))): (
              <p>Aún no has realizado una entrevista</p>
            )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Realizar una entrevista</h2>
        <div className="interviews-section">
        { 
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />        
            ))): (
              <p>No hay entrevistas disponibles</p>
            )}     
        </div>
      </section>

      {/* <section className="flex flex-col gap-6 mt-8">
        <h2>Tus Feedbacks</h2>
        <div className="interviews-section">
          { 
            hasFeedbacks ? (
              userFeedbacks?.map((feedback) => (
                <FeedbackCard {...feedback} key={feedback.id} />        
            ))): (
              <p>Aún no has realizado una entrevista</p>
            )}
        </div>
      </section> */}

    </>
  );
}
export default Page;