
import React, { useEffect, useState } from 'react';

const LoadingBot: React.FC = () => {
  const [message, setMessage] = useState("J'analyse votre demande...");

  // Cycle de messages pour faire patienter l'utilisateur
  useEffect(() => {
    const messages = [
      "J'analyse votre demande...",
      "Je connecte les neurones...",
      "Rédaction de l'histoire en cours...",
      "Génération de l'illustration...",
      "Synthèse de la voix humaine...",
      "Finalisation de la leçon..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setMessage(messages[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Container 3D CSS du Robot */}
      <div className="relative w-32 h-32 mb-8 animate-bounce-slow">
        {/* Halo de lumière */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Tête du Robot (Style 2.5D CSS) */}
        <div className="relative w-full h-full">
            {/* Visage */}
            <div className="absolute inset-0 bg-slate-900 rounded-[2rem] border-4 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center overflow-hidden">
                {/* Reflet écran */}
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-white/10 to-transparent rounded-tr-[1.5rem] pointer-events-none"></div>
                
                {/* Yeux */}
                <div className="flex gap-4 items-center">
                    <div className="w-6 h-8 bg-cyan-400 rounded-full animate-blink shadow-[0_0_15px_#22d3ee]"></div>
                    <div className="w-6 h-8 bg-cyan-400 rounded-full animate-blink shadow-[0_0_15px_#22d3ee]"></div>
                </div>

                {/* Bouche (Onde sonore) */}
                <div className="absolute bottom-6 flex gap-1 items-end h-4">
                     <div className="w-1 bg-indigo-400 rounded-full animate-wave" style={{ animationDelay: '0ms' }}></div>
                     <div className="w-1 bg-indigo-400 rounded-full animate-wave" style={{ animationDelay: '100ms' }}></div>
                     <div className="w-1 bg-indigo-400 rounded-full animate-wave" style={{ animationDelay: '200ms' }}></div>
                     <div className="w-1 bg-indigo-400 rounded-full animate-wave" style={{ animationDelay: '100ms' }}></div>
                     <div className="w-1 bg-indigo-400 rounded-full animate-wave" style={{ animationDelay: '0ms' }}></div>
                </div>
            </div>

            {/* Oreilles / Antennes */}
            <div className="absolute top-1/2 -left-3 w-3 h-8 -translate-y-1/2 bg-indigo-600 rounded-l-lg border-l border-indigo-400"></div>
            <div className="absolute top-1/2 -right-3 w-3 h-8 -translate-y-1/2 bg-indigo-600 rounded-r-lg border-r border-indigo-400"></div>
            
            {/* Antenne Haut */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-6 bg-slate-700"></div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-red-300"></div>
        </div>
      </div>

      <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-white mb-2 tracking-wide">
        Mythos réfléchit...
      </h3>
      <p className="text-indigo-600 dark:text-indigo-400 font-mono text-sm animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingBot;
