
import React from 'react';
import { HistoryItem } from '../types';

interface ImageGalleryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onBack: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ history, onSelect, onBack }) => {
  // Filter history to keep only items with images or videos
  const mediaHistory = history.filter(item => item.imageUrl || item.videoUrl);

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 animate-in fade-in zoom-in-95 duration-700">
      
      <div className="flex items-center justify-between mb-8">
        <div>
            <button 
                onClick={onBack}
                className="mb-4 inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Retour à l'accueil
            </button>
            <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Galerie Multimédia</h2>
            <p className="text-slate-500 dark:text-slate-400">Vos créations visuelles récentes.</p>
        </div>
      </div>

      {mediaHistory.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center">
             <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </div>
             <p className="text-xl text-slate-500 dark:text-slate-400">Aucune image générée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaHistory.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => onSelect(item)}
                    className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
                >
                    <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold text-lg leading-tight truncate">{item.title}</h3>
                        <p className="text-white/70 text-xs mt-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                    </div>

                    {/* Badge Video */}
                    {item.videoUrl && (
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-full p-2 text-white border border-white/20">
                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    )}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
