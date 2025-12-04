// utils/audioUtils.ts

export const generateAudio = async (text: string): Promise<string | null> => {
  // Récupération des variables d'environnement
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

  // Petite sécurité pour vérifier si la clé est présente
  if (!apiKey) {
    console.error("ERREUR : La clé API ElevenLabs (VITE_ELEVENLABS_API_KEY) est manquante dans .env.local");
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
        // CHANGEMENT IMPORTANT ICI :
        // "eleven_multilingual_v2" gère beaucoup mieux les accents et le Créole que "monolingual"
        model_id: "eleven_multilingual_v2", 
        voice_settings: {
          stability: 0.5,       // 0.5 permet un peu d'émotion
          similarity_boost: 0.75, // Garde la voix cohérente
        },
      }),
    });

    if (!response.ok) {
      // On essaye de lire le message d'erreur précis de ElevenLabs pour t'aider à débugger
      const errorData = await response.json().catch(() => ({}));
      console.error("Erreur ElevenLabs API:", errorData);
      throw new Error(`Erreur ElevenLabs: ${response.status}`);
    }

    // Transformation de la réponse audio en URL jouable par le navigateur
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Erreur Audio Générale:", error);
    return null;
  }
};