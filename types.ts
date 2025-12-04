
export enum StoryGenre {
  EDUCATIONAL = 'Éducatif / Cours',
  FANTASY = 'Fantaisie',
  SCI_FI = 'Science-Fiction',
  FOLKTALE = 'Conte / Légende',
  MYSTERY = 'Mystère',
  ADVENTURE = 'Aventure'
}

export enum AgeGroup {
  CHILD = 'Enfants (5-10 ans)',
  TEEN = 'Adolescents (11-17 ans)',
  ADULT = 'Adultes (18+ ans)'
}

export enum ImageStyle {
  DIGITAL_ART = 'Art Numérique (Défaut)',
  REALISTIC = 'Photo Réaliste',
  CARTOON = 'Dessin Animé / Pixar',
  WATERCOLOR = 'Aquarelle',
  OIL_PAINTING = 'Peinture à l\'huile',
  SKETCH = 'Esquisse Crayon',
  RETRO = 'Rétro / Vintage'
}

export enum MediaType {
  TEXT_WITH_IMAGE = 'Texte + Image',
  TEXT_ONLY = 'Texte Seul',
  VIDEO = 'Vidéo Explicative (Veo)'
}

export enum VideoFormat {
  MP4 = 'mp4',
  MOV = 'mov'
}

export interface StoryRequest {
  topic: string;
  genre: StoryGenre;
  ageGroup: AgeGroup;
  imageStyle: ImageStyle;
  includeHaitianCulture: boolean;
  language: string;
  mediaType: MediaType;
  videoFormat?: VideoFormat;
}

export interface GeneratedStory {
  title: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  imagePrompt?: string;
  videoError?: string; // Message d'erreur spécifique si la génération vidéo échoue
  videoFormat?: VideoFormat;
  isVideoSimulated?: boolean; // Indique si la vidéo est une simulation (image animée) faute d'API
}

export interface HistoryItem extends GeneratedStory {
  id: string;
  timestamp: number;
  originalTopic: string;
  mediaType: MediaType;
  genre: StoryGenre;
}

export interface GeminiError {
  message: string;
}
