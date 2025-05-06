import {generateText} from 'ai';
import { google } from '@ai-sdk/google';
import { getRandomInterviewCover } from '@/lib/utils';
import { create } from 'domain';
import { db } from '@/firebase/admin';

export async function GET() {
    return Response.json({ success: true, data: 'GRACIAS!'}, {status:200});
}

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid } = await request.json();
    
    try{
        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepara preguntas para una entrevista de trabajo.  
            El puesto de trabajo es ${role}.  
            El nivel de experiencia requerido es ${level}.  
            El stack tecnológico utilizado en el trabajo es: ${techstack}.  
            El enfoque entre preguntas conductuales y técnicas debe inclinarse hacia: ${type}.  
            La cantidad de preguntas requeridas es: ${amount}.  
            Por favor, entrega solo las preguntas, sin ningún texto adicional.  
            Las preguntas serán leídas por un asistente de voz, así que no uses "/" ni "*" ni ningún otro carácter especial que pueda afectar al asistente de voz.  
            Devuelve las preguntas con el siguiente formato:  
            ["Pregunta 1", "Pregunta 2", "Pregunta 3"]  
            
            ¡Gracias! <3 `,
        });

        const interview = {
            role, type, level,
            techstack: techstack.split(","),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        }

        await db.collection("interviews").add(interview);

        return Response.json({ success: true }, {status:200});

    } catch (error) {
        console.error( error);
        return Response.json({ success: false, error }, {status:500});
    }
}
