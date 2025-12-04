
import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import { APP_NAME } from '../constants';

interface LoginPageProps {
  onLogin: (email: string, name: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulation d'un délai réseau pour l'effet réaliste
    setTimeout(() => {
      if (!email || !password || (isRegistering && !name)) {
        setError("Veuillez remplir tous les champs obligatoires.");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        setIsLoading(false);
        return;
      }

      // Simulation de succès
      // Si c'est un login simple, on extrait un nom fictif de l'email si pas fourni
      const displayName = name || email.split('@')[0];
      const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      
      onLogin(email, formattedName);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-slate-950 dark:to-black transition-colors duration-500">
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header Décoratif */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500" />
        
        <div className="p-8">
          <div className="text-center mb-10">
            <div className="inline-block p-3 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30 mb-4 transform hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">{APP_NAME}</h1>
            <p className="text-slate-500 dark:text-slate-400">
              {isRegistering ? "Rejoignez l'aventure éducative" : "Connectez-vous pour continuer"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <Input
                  label="Nom complet"
                  type="text"
                  placeholder="Jean-Jacques Dessalines"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <Input
              label="Adresse Email"
              type="email"
              placeholder="exemple@ecole.ht"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full !py-3.5 text-lg shadow-xl shadow-indigo-500/20"
              isLoading={isLoading}
            >
              {isRegistering ? "Créer un compte" : "Se connecter"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isRegistering ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}
              <button
                type="button"
                onClick={() => {
                   setIsRegistering(!isRegistering);
                   setError(null);
                }}
                className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
              >
                {isRegistering ? "Se connecter" : "S'inscrire"}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-center w-full text-slate-400 dark:text-slate-600 text-xs">
        &copy; 2025 Ayiti AI Hackathon. Tous droits réservés.
      </div>
    </div>
  );
};

export default LoginPage;
