
import React from 'react';
import Button from './Button';

interface SettingsPageProps {
  onBack: () => void;
  onClearHistory: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: { name: string; email: string } | null;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onClearHistory, theme, toggleTheme, user }) => {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
        <button 
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Retour à l'accueil
        </button>

        <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-8">Paramètres</h2>

        <div className="space-y-8">
            {/* Section Compte */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Mon Compte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom d'utilisateur</label>
                        <p className="text-lg text-slate-900 dark:text-white">{user?.name}</p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                        <p className="text-lg text-slate-900 dark:text-white">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Section Apparence */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                    Apparence
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">Thème de l'interface</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Basculez entre le mode clair et sombre.</p>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Section Données */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Gestion des données
                </h3>
                <div>
                    <p className="font-medium text-slate-900 dark:text-white mb-2">Effacer l'historique</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Supprime toutes les leçons, images et audios enregistrés localement sur cet appareil.</p>
                    <Button variant="outline" onClick={() => {
                        if(confirm("Êtes-vous sûr de vouloir tout effacer ?")) {
                            onClearHistory();
                        }
                    }} className="!py-2 text-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20">
                        Supprimer l'historique
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsPage;
