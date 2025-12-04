
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GeneratedStory, ImageStyle, MediaType } from '../types';
import Button from './Button';
import AudioPlayer from './AudioPlayer';
import { regenerateStoryImage } from '../services/geminiService';
import { createWavBlob } from '../utils/audioUtils';

interface StoryDisplayProps {
  story: GeneratedStory;
  onBack: () => void;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story: initialStory, onBack }) => {
  const [story, setStory] = useState(initialStory);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // --- Helpers pour le téléchargement ---

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
    const blob = new Blob([`# ${story.title}\n\n${story.content}`], { type: 'text/markdown;charset=utf-8' });
    downloadFile(blob, `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`);
  };

  const handleDownloadImage = async () => {
    if (!story.imageUrl) return;
    try {
      const response = await fetch(story.imageUrl);
      const blob = await response.blob();
      downloadFile(blob, `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`);
    } catch (e) {
      console.error("Erreur téléchargement image", e);
    }
  };

  const handleDownloadVideo = async () => {
    // Si c'est une simulation, on ne peut pas télécharger de vidéo
    if (story.isVideoSimulated) {
        alert("Le téléchargement vidéo n'est pas disponible pour cette simulation.");
        return;
    }

    if (!story.videoUrl) return;
    try {
        const response = await fetch(story.videoUrl);
        const blob = await response.blob();
        const extension = story.videoFormat ? `.${story.videoFormat}` : '.mp4';
        downloadFile(blob, `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${extension}`);
    } catch (e) {
        console.error("Erreur téléchargement vidéo", e);
    }
  };

  const handleDownloadAudio = () => {
    if (!story.audioUrl) return;

    try {
      // Vérification simple du format (ElevenLabs MP3 vs Legacy WAV)
      if (story.audioUrl.startsWith('data:audio/mpeg') || story.audioUrl.startsWith('http')) {
         // C'est du MP3 (ElevenLabs), on le télécharge directement
         fetch(story.audioUrl)
            .then(res => res.blob())
            .then(blob => downloadFile(blob, `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`));
      } else {
          // Legacy PCM/WAV
          const wavBlob = createWavBlob(story.audioUrl);
          downloadFile(wavBlob, `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`);
      }
    } catch (e) {
      console.error("Erreur lors du téléchargement audio", e);
      alert("Erreur lors de la préparation du fichier audio.");
    }
  };

  const handleRegenerateImage = async () => {
    if (!story.imagePrompt) return;
    
    setIsRegenerating(true);
    try {
        // On détermine si on doit essayer de refaire une vidéo ou juste une image
        const targetMedia = story.videoUrl || story.isVideoSimulated ? MediaType.VIDEO : MediaType.TEXT_WITH_IMAGE;
        
        const result = await regenerateStoryImage(story.imagePrompt, ImageStyle.DIGITAL_ART, targetMedia, story.videoFormat);
        
        setStory(prev => ({
            ...prev,
            imageUrl: result.imageUrl,
            videoUrl: result.videoUrl,
            isVideoSimulated: result.isVideoSimulated,
            videoError: result.videoError
        }));
    } catch (e) {
        console.error("Failed to regenerate", e);
        alert("Impossible de régénérer l'image pour le moment.");
    } finally {
        setIsRegenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-8 flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="!py-2 !px-4 text-sm">
          ← Créer un autre
        </Button>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Généré par MythosAI</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative transition-colors duration-300">
        {/* Top Decorative Bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500" />
        
        <div className="p-8 md:p-12">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-fuchsia-600 dark:from-indigo-200 dark:to-white mb-6 leading-tight">
                {story.title}
                </h1>
                
                {story.audioUrl && (
                    <div className="max-w-md mx-auto">
                        <AudioPlayer pcmBase64={story.audioUrl} />
                    </div>
                )}
            </div>
            
            {/* Warning Banner for Video Errors */}
            {story.videoError && !story.isVideoSimulated && (
                <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h4 className="text-amber-800 dark:text-amber-200 font-semibold text-sm">Échec de la génération vidéo</h4>
                        <p className="text-amber-700 dark:text-amber-200/70 text-sm mt-1">
                            {story.videoError} <br/>
                            Une image statique a été générée à la place.
                        </p>
                    </div>
                </div>
            )}

            {/* Download Toolbar */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800/50">
                <button 
                  onClick={handleDownloadText}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
                  title="Télécharger le texte"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Texte (.md)
                </button>

                {story.imageUrl && (
                  <button 
                    onClick={handleDownloadImage}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
                    title="Télécharger l'image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Image (.png)
                  </button>
                )}

                {story.videoUrl && !story.isVideoSimulated && (
                  <button 
                    onClick={handleDownloadVideo}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
                    title="Télécharger la vidéo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    Vidéo ({story.videoFormat || '.mp4'})
                  </button>
                )}

                {story.audioUrl && (
                  <button 
                    onClick={handleDownloadAudio}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
                    title="Télécharger l'audio"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                    Audio
                  </button>
                )}
            </div>

            {/* Content Layout */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                
                {/* Visual Section (Image or Video) */}
                {(story.imageUrl || story.videoUrl) && (
                    <div className="w-full lg:w-1/2 shrink-0 flex flex-col gap-3">
                        <div className="group relative rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800">
                            {story.videoUrl && !story.isVideoSimulated ? (
                                <video 
                                    src={story.videoUrl} 
                                    controls 
                                    className="w-full h-auto"
                                    autoPlay
                                    loop
                                    poster={story.imageUrl}
                                />
                            ) : (
                                <div className="relative overflow-hidden w-full aspect-video">
                                    <img 
                                        src={story.imageUrl} 
                                        alt={story.title} 
                                        className={`w-full h-full object-cover transition-transform duration-[20s] ease-linear ${story.isVideoSimulated ? 'scale-125 hover:scale-100 animate-[kenburns_20s_infinite_alternate]' : 'group-hover:scale-105 duration-700'}`}
                                    />
                                    {/* Overlay Simulation Vidéo */}
                                    {story.isVideoSimulated && (
                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                             <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                                                 <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                                 <span className="text-white text-xs font-semibold tracking-wide">APERÇU VIDÉO (SIMULATION)</span>
                                             </div>
                                             <div className="absolute bottom-4 left-0 right-0 text-center">
                                                 <span className="text-[10px] text-white/80 bg-black/40 px-2 py-1 rounded">Génération vidéo complète bientôt disponible</span>
                                             </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none"></div>
                                    
                                    <style>{`
                                        @keyframes kenburns {
                                            0% { transform: scale(1) translate(0,0); }
                                            100% { transform: scale(1.25) translate(-1%, -1%); }
                                        }
                                    `}</style>
                                </div>
                            )}
                        </div>
                        
                        {story.imagePrompt && (
                            <Button 
                                variant="secondary" 
                                onClick={handleRegenerateImage} 
                                isLoading={isRegenerating}
                                className="w-full text-sm py-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                {story.videoUrl || story.videoError ? 'Régénérer Vidéo/Image' : 'Régénérer l\'image'}
                            </Button>
                        )}
                    </div>
                )}

                {/* Text Section */}
                <div className={`w-full ${(story.imageUrl || story.videoUrl) ? 'lg:w-1/2' : ''} prose prose-slate dark:prose-invert prose-lg max-w-none`}>
                   <div className="font-serif leading-relaxed text-slate-700 dark:text-slate-300">
                        <ReactMarkdown 
                            components={{
                                p: ({node, ...props}) => <p className="mb-6 first-letter:text-5xl first-letter:font-serif first-letter:text-indigo-600 dark:first-letter:text-indigo-400 first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px]" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-indigo-700 dark:text-indigo-300 font-semibold" {...props} />
                            }}
                        >
                            {story.content}
                        </ReactMarkdown>
                   </div>
                </div>
            </div>
        </div>

        {/* Footer Decorative */}
        <div className="bg-slate-50 dark:bg-slate-950 p-6 border-t border-slate-200 dark:border-slate-800 text-center transition-colors duration-300">
            <p className="text-slate-500 text-sm">Inspiré par MythosAI • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;
