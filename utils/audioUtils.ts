// utils/audioUtils.ts

// --- 1. FONCTION ELEVENLABS (Celle qu'on utilise pour Mythos) ---
export const generateAudio = async (text: string): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

  if (!apiKey) {
    console.error("ERREUR : Clé API ElevenLabs manquante.");
    return null;
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2", 
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) throw new Error(`Erreur ElevenLabs: ${response.status}`);

    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Erreur Audio Générale:", error);
    return null;
  }
};

// --- 2. FONCTION LEGACY (Pour corriger l'erreur de build) ---
// Cette fonction ne sert pas pour Mythos, mais elle empêche AudioPlayer.tsx de planter.
export const createWavBlob = (audioData: Float32Array, sampleRate: number = 44100): Blob => {
  // Simple placeholder pour satisfaire le compilateur
  console.log("createWavBlob appelé (fonction legacy)");
  return new Blob([], { type: 'audio/wav' });
};