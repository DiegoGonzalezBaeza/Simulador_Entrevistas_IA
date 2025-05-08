// import React from 'react'
// import dayjs from 'dayjs'
// import Image from "next/image"
// import { getRandomInterviewCover } from '../lib/utils'
// import { Button } from "@/components/ui/button";
// import { getFeedbackByInterviewId } from '@/lib/actions/general.actions'
// import Link from "next/link";
// import DisplayTechicons from './DisplayTechicons';

// const FeedbackCard = async ({id, userId,totalScore,
//     categoryScores,
//     strengths,
//     areasForImprovement,
//     finalAssessment,
//     createdAt}: FeedbackCardProps) => {
//   const feedback = userId && id ? await getFeedbackByInterviewId({interviewId: id, userId}): null;
 
//   const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("DD/MM/YYYY");

//     return (
//     <div className='card-border w-[360px] max-sm:w-full min-h-96'>
//       <div className='card-interview'>
//         <div>
//             <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
 
//             </div>

//             <Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className='rounded-full object-fit size-[90px]'/>
        
//             <h3 className='mt-5 capitalize'>
//                  - Feedback -
//             </h3>
//             <div className='flex flex-row gap-5 mt-3'>
//                 <div className='flex flex-row gap-2'>
//                     <Image src="calendar.svg" alt="calendar" width={22} height={22} />
//                     <p>{formattedDate}</p>
//                 </div>

//                 <div className='flex flex-row gap-2 items-center'>
//                     <Image src="/star.svg" alt="star" width={22} height={22} />
//                     <p>{feedback?.totalScore || '---'}/100</p>
//                 </div>
//             </div>
//                 <p className='line-clamp-2 mt-5'>{feedback?.finalAssessment || 
//                 "Aún no has realizado la entrevista. Hazla ahora para mejorar tus habilidades."}
//                 </p>        
//         </div>
//             <div className='flex flex-row justify-between'>
                
//                 <Button className='btn-primary'>
//                     <Link href={feedback 
//                         ? `/interview/${id}/feedback`
//                         : `/interview/${id}`
//                         }>
//                             {feedback ? "Ver Feedback" : "Realizar Entrevista"}
//                     </Link>
//                 </Button>
//             </div>
//       </div>
//     </div>
//   )
// }

// export default FeedbackCard