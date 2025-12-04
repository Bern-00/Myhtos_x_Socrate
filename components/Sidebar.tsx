
import React from 'react';
import { APP_NAME } from '../constants';

type ViewType = 'welcome' | 'create' | 'history' | 'images' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  onLogout: () => void;
  userInitial: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavItem = ({ view, currentView, onChangeView, icon, label }: { view: ViewType; currentView: ViewType; onChangeView: (v: ViewType) => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={() => onChangeView(view)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      currentView === view 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`}
  >
    <div className={`${currentView === view ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  onLogout, 
  userInitial,
  theme,
  toggleTheme,
  isOpen,
  onClose
}) => {
  return (
    <>
        {/* Mobile Backdrop Overlay */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />
        )}

        <div className={`h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30 shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <span className="font-serif font-bold text-xl text-slate-900 dark:text-white tracking-tight">{APP_NAME}</span>
            </div>
            {/* Close button for mobile */}
            <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
            <NavItem 
            view="welcome" 
            currentView={currentView}
            onChangeView={onChangeView}
            label="Accueil"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
            />
            <NavItem 
            view="create" 
            currentView={currentView}
            onChangeView={onChangeView}
            label="Créer une leçon"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>}
            />
            <NavItem 
            view="history" 
            currentView={currentView}
            onChangeView={onChangeView}
            label="Historique"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <NavItem 
            view="images" 
            currentView={currentView}
            onChangeView={onChangeView}
            label="Images générées"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
            <NavItem 
            view="settings" 
            currentView={currentView}
            onChangeView={onChangeView}
            label="Paramètres"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            
            {/* Theme Toggle */}
            <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-start gap-3 px-4 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
            {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
            <span className="text-sm font-medium">Mode {theme === 'dark' ? 'Clair' : 'Sombre'}</span>
            </button>

            {/* User Profile / Logout */}
            <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                {userInitial}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">Mon Compte</p>
                    <button onClick={onLogout} className="text-xs text-red-500 hover:text-red-600 font-medium">Se déconnecter</button>
                </div>
            </div>
        </div>
        </div>
    </>
  );
};

export default Sidebar;
