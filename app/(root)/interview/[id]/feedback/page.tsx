import { getCurrentUser } from '@/lib/actions/auth.actions'
import { getInterviewById, getFeedbackByInterviewId } from '@/lib/actions/general.actions'
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Link from "next/link";


const Page = async ({params}: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <section className="section-feedback">
    <div className="flex flex-row justify-center">
      <h1 className="text-4xl font-semibold">
      Retroalimentación de la Entrevista -{" "}
        <span className="capitalize">{interview.role}</span> Entrevista
      </h1>
    </div>

    <div className="flex flex-row justify-center ">
      <div className="flex flex-row gap-5">
        {/* Overall Impression */}
        <div className="flex flex-row gap-2 items-center">
          <Image src="/star.svg" width={22} height={22} alt="star" />
          <p>
          Percepción general del candidato:{" "}
            <span className="text-primary-200 font-bold">
              {feedback?.totalScore}
            </span>
            /100
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-row gap-2">
          <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
          <p>
            {feedback?.createdAt
              ? dayjs(feedback.createdAt).format("DD/MM/YYYY h:mm A")
              : "N/A"}
          </p>
        </div>
      </div>
    </div>

    <hr />

    <p>{feedback?.finalAssessment}</p>

    {/* Interview Breakdown */}
    <div className="flex flex-col gap-4">
      <h2>Análisis de la entrevista:</h2>
      {feedback?.categoryScores?.map((category, index) => (
        <div key={index}>
          <p className="font-bold">
            {index + 1}. {category.name} ({category.score}/100)
          </p>
          <p>{category.comment}</p>
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-3">
      <h3>Fortalezas</h3>
      <ul>
        {feedback?.strengths?.map((strength, index) => (
          <li key={index}>{strength}</li>
        ))}
      </ul>
    </div>

    <div className="flex flex-col gap-3">
      <h3>Oportunidades de mejora</h3>
      <ul>
        {feedback?.areasForImprovement?.map((area, index) => (
          <li key={index}>{area}</li>
        ))}
      </ul>
    </div>

    <div className="buttons">
      <Button className="btn-secondary flex-1">
        <Link href="/" className="flex w-full justify-center">
          <p className="text-sm font-semibold text-primary-200 text-center">
          Volver al panel
          </p>
        </Link>
      </Button>

      <Button className="btn-primary flex-1">
        <Link
          href={`/interview/${id}`}
          className="flex w-full justify-center"
        >
          <p className="text-sm font-semibold text-black text-center">
            Repetir entrevista
          </p>
        </Link>
      </Button>
    </div>
  </section>
  )
}

export default Page
