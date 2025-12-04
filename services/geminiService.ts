/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";

// Récupération sécurisée de la clé API
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// Initialisation de Gemini
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

// --- FONCTION PRINCIPALE (Utilisée par App.tsx) ---
export const generateMythosResponse = async (userInput: string) => {
  try {
    // 1. Générer le texte de réponse (l'âme haïtienne)
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser: ${userInput}\nMythos:`);
    const textResponse = result.response.text();

    // 2. Générer un prompt pour l'image
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

// --- FONCTION DE RÉPARATION (Utilisée par StoryDisplay.tsx) ---
// Cette fonction permet de régénérer une image si l'utilisateur clique sur le bouton dans l'interface
export const regenerateStoryImage = async (contextText: string): Promise<string> => {
  try {
    // 1. Demander à Gemini un prompt optimisé
    const promptResult = await model.generateContent(`
      Create a highly detailed, artistic image prompt (max 20 words) based on this story segment: "${contextText}".
      Style: Vibrant, Haitian Art, Surrealism.
    `);
    const newPrompt = promptResult.response.text();

    // 2. Générer l'URL Pollinations
    const cleanPrompt = encodeURIComponent(newPrompt.trim());
    const seed = Math.floor(Math.random() * 1000);
    return `https://image.pollinations.ai/prompt/${cleanPrompt}?seed=${seed}&width=1024&height=600&nologo=true`;

  } catch (error) {
    console.error("Erreur régénération image:", error);
    // Image de secours en cas d'erreur
    return "https://image.pollinations.ai/prompt/mystic%20haitian%20art?width=1024&height=600";
  }
};

// --- FONCTION LEGACY (Au cas où d'autres composants l'appellent) ---
// On redirige simplement vers la nouvelle logique ou on renvoie une erreur propre
export const generateFullStory = async (request: any) => {
  console.warn("generateFullStory is deprecated. Using Mythos logic.");
  const response = await generateMythosResponse(request.topic || "Haitian Story");
  
  // On adapte le format pour que l'ancien code ne plante pas
  return {
    title: request.topic,
    content: response.text,
    imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(response.imagePrompt)}?nologo=true`,
    tags: ["Mythos", "Haiti"]
  };
};