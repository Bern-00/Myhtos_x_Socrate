
import React from 'react';
import Button from './Button';

interface WelcomePageProps {
  userName: string;
  onStartCreate: () => void;
  onViewHistory: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ userName, onStartCreate, onViewHistory }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- HERO SECTION --- */}
      <div className="relative text-center space-y-6 py-10 lg:py-16">
        {/* Decorative Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-500/20 dark:bg-fuchsia-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-center">
          
          {/* BIG APP TITLE */}
          <h1 className="text-7xl md:text-9xl font-serif font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-indigo-600 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-indigo-400 animate-in fade-in zoom-in-50 duration-1000 pb-2 drop-shadow-sm">
            MythosAI
          </h1>

          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-slate-900 dark:text-white mt-8">
            Apprendre n'a jamais été <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600 dark:from-indigo-400 dark:to-fuchsia-400">aussi captivant.</span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mt-6">
            Bonjour <strong>{userName}</strong>. Transformez n'importe quel sujet en une expérience interactive : leçons, histoires, images et vidéos générées instantanément par l'IA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 w-full sm:w-auto">
            <Button 
              onClick={onStartCreate} 
              variant="secondary"
              className="!py-4 !px-10 text-lg shadow-xl shadow-fuchsia-500/20 w-full sm:w-auto transform hover:scale-105 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Créer une leçon
            </Button>
            <Button 
              onClick={onViewHistory} 
              variant="outline" 
              className="!py-4 !px-8 text-lg w-full sm:w-auto hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Voir mes créations
            </Button>
          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative px-4">
         {/* Connector Line (Desktop only) */}
         <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 dark:from-slate-800 dark:via-indigo-900 dark:to-slate-800 z-0"></div>

         {[
            { 
              icon: <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
              title: 'Choisissez un Sujet', 
              desc: 'Histoire, Sciences, ou Culture...' 
            },
            { 
              icon: <svg className="w-10 h-10 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
              title: 'Personnalisez', 
              desc: 'Niveau (Enfant/Adulte), Style, Format...' 
            },
            { 
              icon: <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              title: 'Découvrez', 
              desc: 'L\'IA génère le texte, l\'audio et la vidéo.' 
            }
         ].map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                    {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[200px]">{step.desc}</p>
            </div>
         ))}
      </div>

      {/* --- BENTO GRID FEATURES --- */}
      <div className="space-y-6 px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Fonctionnalités Clés</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
              
              {/* Card Large - Multimodal */}
              <div className="md:col-span-2 row-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:scale-150 duration-700"></div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                          <div className="inline-flex items-center gap-2 p-2 bg-white/20 rounded-lg backdrop-blur-md mb-4">
                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                          </div>
                          <h3 className="text-3xl font-bold mb-2">Génération Multimodale</h3>
                          <p className="text-indigo-100 max-w-md">Ne vous contentez pas de lire. MythosAI génère des illustrations artistiques, des narrations vocales humaines et même des vidéos explicatives.</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                         <span className="px-3 py-1 rounded-full bg-black/20 text-xs backdrop-blur-sm border border-white/10">Video IA</span>
                         <span className="px-3 py-1 rounded-full bg-black/20 text-xs backdrop-blur-sm border border-white/10">Audio Naturel</span>
                         <span className="px-3 py-1 rounded-full bg-black/20 text-xs backdrop-blur-sm border border-white/10">Image HD</span>
                      </div>
                  </div>
              </div>

              {/* Card - Adaptive */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pédagogie Adaptative</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                      L'IA ajuste le vocabulaire et le ton : ludique pour les enfants, précis pour les experts.
                  </p>
              </div>

              {/* Card - Culture (Ayiti) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all group md:col-span-1">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Contexte Local</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Apprenez avec des références culturelles, géographiques et historiques d'Haïti.
                  </p>
              </div>

               {/* Card - History */}
               <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer" onClick={onViewHistory}>
                  <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Reprenez là où vous étiez</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Votre bibliothèque de savoir est sauvegardée localement.</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};

export default WelcomePage;
