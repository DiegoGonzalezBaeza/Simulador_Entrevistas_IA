'use server';

import { db } from "@/firebase/admin";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "@/constants";

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
    
        const interviews = await db
            .collection("interviews")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

          return interviews.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Interview[];
}    

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;

    const interviews = await db
        .collection("interviews")
        .orderBy("createdAt", "desc")
        .where("finalized", "==", true)
        .where("userId", "!=", userId)
        .limit(limit)
        .get();

      return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interview[];
}  

export async function getInterviewById(id: string): Promise<Interview | null> {
    
    const interviews = await db
        .collection("interviews")
        .doc(id)
        .get();

      return interviews.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        Eres un entrevistador con IA que está analizando una entrevista simulada. Tu tarea es evaluar al candidato en base a categorías estructuradas. Sé minucioso y detallado en tu análisis. No seas indulgente con el candidato. Si hay errores o áreas de mejora, señálalos. No olvides que debes dar tus respuestas en español.
        Transcripción:
        ${formattedTranscript}

        Por favor, califica al candidato del 0 al 100 en las siguientes áreas. No agregues categorías distintas a las proporcionadas:
        - **Habilidades de comunicación**: Claridad, articulación y respuestas estructuradas.
        - **Conocimientos técnicos**:  Comprensión de los conceptos clave para el puesto.
        - **Resolución de problemas**: Capacidad para analizar problemas y proponer soluciones.
        - **Compatibilidad con la cultura organizacional**: Alineación con los valores de la empresa y el puesto.
        - **Claridad y seguridad comunicativa**: Confianza en las respuestas, nivel de participación y claridad.
        `,
      system:
        "Eres un entrevistador profesional que está analizando una entrevista simulada. Tu tarea es evaluar al candidato en base a categorías estructuradas.",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error guardando feedback:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
  ): Promise<Feedback | null> {
    const { interviewId, userId } = params;
  
    const querySnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();
  
    if (querySnapshot.empty) return null;
  
    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  }

//   export async function getFeedbacksByUserId(userId: string): Promise<Feedback[] | null> {
    
//     const feedback = await db
//         .collection("feedback")
//         .where("userId", "==", userId)
//         .orderBy("createdAt", "desc")
//         .get();

//       return feedback.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Feedback[];
// } 