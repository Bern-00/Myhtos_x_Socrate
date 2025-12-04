import React, { useState, useEffect } from 'react';
import { STORY_GENRES, AGE_GROUPS, IMAGE_STYLES, LANGUAGES, MEDIA_TYPES, VIDEO_FORMATS } from './constants';
import { StoryRequest, GeneratedStory, StoryGenre, AgeGroup, ImageStyle, MediaType, HistoryItem, VideoFormat } from './types';
// --- IMPORTS DES SERVICES ---
import { generateMythosResponse } from './services/geminiService';
import { generateAudio } from './utils/audioUtils';
// ----------------------------
import Button from './components/Button';
import Input from './components/Input';
import Select from './components/Select';
import StoryDisplay from './components/StoryDisplay';
import HistoryList from './components/HistoryList';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import Sidebar from './components/Sidebar';
import ImageGallery from './components/ImageGallery';
import SettingsPage from './components/SettingsPage';
import LoadingBot from './components/LoadingBot';

// Interface pour User
interface UserSession {
  email: string;
  name: string;
}

type ViewType = 'welcome' | 'create' | 'history' | 'images' | 'settings';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<UserSession | null>(null);

  // App State
  const [currentView, setCurrentView] = useState<ViewType>('welcome');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [lastRequest, setLastRequest] = useState<StoryRequest | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return (savedTheme as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load user & history
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('mythos_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedHistory = localStorage.getItem('mythos_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error("Erreur chargement données locales", e);
      localStorage.removeItem('mythos_history');
    }
  }, []);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (email: string, name: string) => {
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem('mythos_user', JSON.stringify(newUser));
    setCurrentView('welcome');
  };

  const handleLogout = () => {
    setUser(null);
    setStory(null);
    setTopic('');
    setLastRequest(null);
    localStorage.removeItem('mythos_user');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Form State
  const [topic, setTopic] = useState('');
  const [genre, setGenre] = useState<StoryGenre>(StoryGenre.EDUCATIONAL);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(AgeGroup.CHILD);
  const [imageStyle, setImageStyle] = useState<ImageStyle>(ImageStyle.CARTOON);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.TEXT_WITH_IMAGE);
  const [videoFormat, setVideoFormat] = useState<VideoFormat>(VideoFormat.MP4);
  const [language, setLanguage] = useState<string>('Français');
  const [haitianCulture, setHaitianCulture] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveToHistory = (newStory: GeneratedStory, request: StoryRequest) => {
    const newItem: HistoryItem = {
      ...newStory,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      originalTopic: request.topic,
      mediaType: request.mediaType,
      genre: request.genre
    };

    const updatedHistory = [newItem, ...history].slice(0, 5);
    
    try {
      localStorage.setItem('mythos_history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        // Version allégée si localStorage est plein
        const lightItem = { ...newItem, audioUrl: undefined }; 
        const lighterHistory = [lightItem, ...history].slice(0, 5);
        try {
            localStorage.setItem('mythos_history', JSON.stringify(lighterHistory));
            setHistory(lighterHistory);
        } catch (e2) { console.error("Impossible de sauvegarder", e2); }
      }
    }
  };

  // --- FONCTION PRINCIPALE DE GENERATION ---
  const handleGenerate = async (forcedRequest?: StoryRequest) => {
    const request = forcedRequest || {
        topic,
        genre,
        ageGroup,
        imageStyle,
        includeHaitianCulture: haitianCulture,
        language,
        mediaType,
        videoFormat: mediaType === MediaType.VIDEO ? videoFormat : undefined
    };

    if (!request.topic) {
        setError("Veuillez entrer un sujet ou un concept.");
        return;
    }

    setError(null);
    setLoading(true);
    setLastRequest(request);

    try {
      // 1. API 1 : GEMINI (Texte + Prompt Image)
      const promptText = `
        Sujet: ${request.topic}. 
        Style: ${request.genre}. 
        Public: ${request.ageGroup}.
        ${request.includeHaitianCulture ? "IMPORTANT: Intègre des références culturelles Haïtiennes." : ""}
      `;
      
      // IMPORTANT : On passe la langue choisie à la fonction
      const { text, imagePrompt } = await generateMythosResponse(promptText, request.language);

      // 2. API 2 : POLLINATIONS AI (Image)
      const cleanPrompt = encodeURIComponent(imagePrompt + " " + request.imageStyle);
      const seed = Math.floor(Math.random() * 1000);
      const generatedImageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?seed=${seed}&width=1024&height=600&nologo=true`;

      // 3. API 3 : ELEVENLABS (Audio)
      let audioUrl = null;
      if (request.mediaType !== MediaType.TEXT_ONLY) {
         audioUrl = await generateAudio(text);
      }

      // 4. Construction de l'objet Story final
      const result: GeneratedStory = {
          title: request.topic,
          content: text,
          imageUrl: generatedImageUrl,
          audioUrl: audioUrl || undefined,
          tags: [request.genre, request.ageGroup]
      };

      setStory(result);
      saveToHistory(result, request);

    } catch (e: any) {
      console.error(e);
      setError(e.message || "Une erreur est survenue lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('mythos_history');
  };

  const handleResetStory = () => {
    setStory(null);
  };

  const selectHistoryItem = (item: HistoryItem) => {
      setStory(item);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-white transition-colors duration-300 flex flex-col relative overflow-x-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-500"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-300 dark:bg-indigo-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-fuchsia-300 dark:bg-fuchsia-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-300 dark:bg-blue-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5 mix-blend-overlay"></div>
      </div>

      {/* LOADING BOT */}
      {loading && <LoadingBot />}

      {/* SIDEBAR */}
      <Sidebar 
        currentView={currentView}
        onChangeView={(view) => {
            setCurrentView(view as ViewType);
            setStory(null);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
        userInitial={user.name.charAt(0)}
        theme={theme}
        toggleTheme={toggleTheme}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'pl-0'} flex flex-col min-h-screen relative z-10`}>
        
        {/* Mobile Sidebar Toggle */}
        <div className="sticky top-0 z-40 p-4 pointer-events-none lg:hidden">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="pointer-events-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isSidebarOpen ? (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    ) : (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>
        </div>

        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-20 w-full">
            
            {story ? (
                <StoryDisplay story={story} onBack={handleResetStory} />
            ) : (
                <>
                    {currentView === 'welcome' && (
                        <WelcomePage 
                            userName={user.name.split(' ')[0]} 
                            onStartCreate={() => setCurrentView('create')}
                            onViewHistory={() => setCurrentView('history')}
                        />
                    )}

                    {currentView === 'create' && (
                        <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                            <button 
                                onClick={() => setCurrentView('welcome')}
                                className="mb-6 inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                ← Retour
                            </button>

                            <div className="bg-white/60 dark:bg-slate-900/60 p-8 rounded-3xl border border-white/50 dark:border-slate-800/50 shadow-2xl backdrop-blur-xl">
                                <div className="space-y-6">
                                    <div className="space-y-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
                                        <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Créer une Leçon Mythos</h2>
                                        <p className="text-slate-500 dark:text-slate-400">L'âme d'Haïti génère votre contenu.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <Input 
                                            label="Sujet, Concept ou Titre" 
                                            placeholder="ex: La Citadelle Laferrière, La Liberté..."
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            className="!text-xl !py-4"
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Select label="Type de contenu" options={STORY_GENRES} value={genre} onChange={(e) => setGenre(e.target.value as StoryGenre)} />
                                            <Select label="Niveau" options={AGE_GROUPS} value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as AgeGroup)} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Select label="Format du Support" options={MEDIA_TYPES} value={mediaType} onChange={(e) => setMediaType(e.target.value as MediaType)} />
                                            <Select 
                                                label="Style Visuel" 
                                                options={IMAGE_STYLES} 
                                                value={imageStyle} 
                                                onChange={(e) => setImageStyle(e.target.value as ImageStyle)} 
                                                disabled={mediaType === MediaType.TEXT_ONLY}
                                            />
                                        </div>
                                        
                                        <Select label="Langue" options={LANGUAGES} value={language} onChange={(e) => setLanguage(e.target.value)} />

                                        {/* Cultural Toggle */}
                                        <div 
                                            className={`border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors ${haitianCulture ? 'bg-indigo-900/20 border-indigo-500' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                                            onClick={() => setHaitianCulture(!haitianCulture)}
                                        >
                                            <div className={`w-12 h-6 rounded-full relative transition-colors ${haitianCulture ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${haitianCulture ? 'left-7' : 'left-1'}`} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 dark:text-white">Mode "Haitian Soul" 🇭🇹</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Ajoute proverbes, ambiance locale et sagesse des ancêtres.</p>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">{error}</div>
                                        )}
                                        
                                        <Button 
                                            className="w-full !py-4 text-lg mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                                            onClick={() => handleGenerate()}
                                            isLoading={loading}
                                        >
                                            Invoquer Mythos ✨
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'history' && (
                        <HistoryList history={history} onSelect={selectHistoryItem} onClear={handleClearHistory} onBack={() => setCurrentView('welcome')} />
                    )}

                    {currentView === 'images' && (
                        <ImageGallery history={history} onSelect={selectHistoryItem} onBack={() => setCurrentView('welcome')} />
                    )}

                    {currentView === 'settings' && (
                         <SettingsPage onBack={() => setCurrentView('welcome')} onClearHistory={handleClearHistory} theme={theme} toggleTheme={toggleTheme} user={user} />
                    )}
                </>
            )}
        </div>

        <footer className="w-full p-6 text-center text-slate-400 text-sm bg-white/30 dark:bg-black/20 backdrop-blur-md">
            <p className="font-medium">Mythos_AI © 2025 - Powered by Haitian Soul</p>
        </footer>
      </main>
    </div>
  );
};

export default App;