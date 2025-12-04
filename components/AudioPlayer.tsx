
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createWavBlob } from '../utils/audioUtils';

interface AudioPlayerProps {
  pcmBase64: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ pcmBase64 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Formatage du temps (mm:ss)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialisation de l'audio
  useEffect(() => {
    // Nettoyage précédent
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
    }
    
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);

    try {
        let url = '';
        // Détection format: Si c'est déjà une URL ou une DataURI MP3 (ElevenLabs)
        if (pcmBase64.startsWith('http') || pcmBase64.startsWith('data:audio/mpeg')) {
            url = pcmBase64;
        } 
        // Sinon, on assume que c'est du PCM/WAV brut (Legacy/Gemini TTS) -> Conversion Blob
        else {
            const blob = createWavBlob(pcmBase64);
            url = URL.createObjectURL(blob);
        }
        
        setAudioUrl(url);

        const audio = new Audio(url);
        
        // Listeners natifs pour synchroniser l'état
        audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration);
        });
        
        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setCurrentTime(0);
        });

        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('pause', () => setIsPlaying(false));
        
        audio.onerror = (e) => {
            console.error("Erreur lecture audio", e);
            setHasError(true);
            setIsPlaying(false);
        };

        audioRef.current = audio;
    } catch (e) {
        console.error("Erreur création audio", e);
        setHasError(true);
    }

    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (audioUrl && !pcmBase64.startsWith('http') && !pcmBase64.startsWith('data:')) {
            URL.revokeObjectURL(audioUrl);
        }
    };
  }, [pcmBase64]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
        audioRef.current.pause();
    } else {
        audioRef.current.play().catch(e => {
            console.error("Erreur play", e);
            setHasError(true);
        });
    }
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!audioRef.current) return;
      const time = parseFloat(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
  };

  const handleReplay = () => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
  };

  if (hasError) return <div className="text-red-500 dark:text-red-400 text-sm px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">Audio indisponible</div>;

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-sm w-full max-w-md mx-auto">
      
      {/* Titre et Status */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
                {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-indigo-500' : 'bg-slate-400'}`}></span>
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Narration IA</span>
        </div>
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full mb-4 overflow-hidden group">
         <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
         />
         <input 
            type="range" 
            min="0" 
            max={duration || 0} 
            value={currentTime} 
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
         />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        
        {/* Replay Button */}
        <button 
            onClick={handleReplay}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2"
            title="Rejouer depuis le début"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>

        {/* Play/Pause Main Button */}
        <button
            onClick={togglePlay}
            className={`flex items-center justify-center w-14 h-14 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
            isPlaying 
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600' 
                : 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-indigo-500/30'
            }`}
        >
            {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
            </svg>
            ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            )}
        </button>

         {/* Volume / Option Placeholder (Future) */}
         <div className="w-9 h-9 opacity-0"></div> 
      </div>
    </div>
  );
};

export default AudioPlayer;
