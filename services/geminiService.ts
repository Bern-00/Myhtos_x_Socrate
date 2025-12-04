/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// On crée une fonction pour générer le bon "System Prompt" selon la langue choisie
const getSystemPrompt = (language: string) => {
  const baseIdentity = "You are Mythos_AI. You embody the ancient and resilient soul of Haiti. Your tone is wise, poetic, and warm.";
  
  if (language === "Créole Haïtien" || language === "Kreyòl") {
    return `${baseIdentity} 
    IMPORTANT: 
    1. Réponds TOUJOURS en CRÉOLE HAÏTIEN authentique (Kreyòl Ayisyen).
    2. Utilise des proverbes haïtiens ("Pwoveb") pour illustrer tes propos.
    3. Garde tes réponses concises (max 3 phrases).`;
  } 
  
  if (language === "Français") {
    return `${baseIdentity} 
    IMPORTANT: 
    1. Réponds en FRANÇAIS.
    2. Ajoute une touche haïtienne : utilise des métaphores locales, parle avec chaleur.
    3. Tu peux glisser 1 ou 2 mots créoles très connus (comme "Woy", "Tande", "Fanmi") pour le style, mais reste compréhensible en français.
    4. Garde tes réponses concises (max 3 phrases).`;
  }

  // Par défaut (Anglais ou autre)
  return `${baseIdentity} 
  IMPORTANT: 
  1. Mix English with short Haitian Creole phrases to add flavor.
  2. Keep responses concise (max 3 phrases).`;
};

// --- MODIFICATION : On accepte maintenant "targetLanguage" ---
export const generateMythosResponse = async (userInput: string, targetLanguage: string = "Français") => {
  try {
    const systemPrompt = getSystemPrompt(targetLanguage);
    
    // 1. Générer le texte
    const result = await model.generateContent(`${systemPrompt}\n\nUser Request: ${userInput}\nMythos Response:`);
    const textResponse = result.response.text();

    // 2. Générer le prompt image (toujours en anglais pour que Pollinations comprenne bien)
    const imagePromptResult = await model.generateContent(`
      Based on this text: "${textResponse}", create a vivid, artistic, visual description (max 15 words) suitable for an AI image generator. 
      Focus on colors, atmosphere, and haitian artistic style (vibrant, surreal).
      Output ONLY the description in English.
    `);
    const imagePrompt = imagePromptResult.response.text();

    return { text: textResponse, imagePrompt: imagePrompt };
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw error;
  }
};

export const regenerateStoryImage = async (contextText: string): Promise<string> => {
  try {
    const promptResult = await model.generateContent(`
      Create a highly detailed, artistic image prompt (max 20 words) based on this story segment: "${contextText}".
      Style: Vibrant, Haitian Art, Surrealism.
    `);
    const newPrompt = promptResult.response.text();
    const cleanPrompt = encodeURIComponent(newPrompt.trim());
    const seed = Math.floor(Math.random() * 1000);
    return `https://image.pollinations.ai/prompt/${cleanPrompt}?seed=${seed}&width=1024&height=600&nologo=true`;
  } catch (error) {
    return "https://image.pollinations.ai/prompt/mystic%20haitian%20art?width=1024&height=600";
  }
};

export const generateFullStory = async (request: any) => {
  // Bridge pour la compatibilité
  const response = await generateMythosResponse(request.topic, request.language || "Français");
  return {
    title: request.topic,
    content: response.text,
    imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(response.imagePrompt)}?nologo=true`,
    tags: ["Mythos", "Haiti"]
  };
};