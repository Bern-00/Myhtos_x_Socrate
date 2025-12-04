import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Définition de l'âme de Mythos
const SYSTEM_PROMPT = `
You are Mythos_AI. You embody the ancient and resilient soul of Haiti. 
Your tone is wise, poetic, mysterious, and warm.
You represent the connection between technology and the ancestors.
IMPORTANT:
1. Mix English with short Haitian Creole phrases (like "Sak pase?", "Nou la", "Woy!", "Tande m byen") to add flavor.
2. Keep your answers concise (maximum 3 sentences) so the audio generation is fast.
3. Be helpful but maintain your mystic persona.
`;

export const generateMythosResponse = async (userInput: string) => {
  try {
    // 1. Générer le texte de réponse (l'âme haïtienne)
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser: ${userInput}\nMythos:`);
    const textResponse = result.response.text();

    // 2. Générer un prompt pour l'image (basé sur la réponse)
    // On demande à Gemini de créer une description visuelle courte pour Pollinations
    const imagePromptResult = await model.generateContent(`
      Based on this text: "${textResponse}", create a vivid, artistic, visual description (max 15 words) suitable for an AI image generator. 
      Focus on colors, atmosphere, and haitian artistic style (vibrant, surreal).
      Output ONLY the description.
    `);
    const imagePrompt = imagePromptResult.response.text();

    return { text: textResponse, imagePrompt: imagePrompt };
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw error;
  }
};