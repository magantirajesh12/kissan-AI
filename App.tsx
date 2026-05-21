
import React, { useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS, MENU_ITEMS } from './constants';
import { Language, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import DiseaseScanner from './components/DiseaseScanner';
import MarketHub from './components/MarketHub';
import SustainableTips from './components/SustainableTips';
import SpeechToSpeech from './components/SpeechToSpeech';
import MultiLanguageVoiceSearch from './components/MultiLanguageVoiceSearch';
import FarmLedger from './components/FarmLedger';
import SchemeFinder from './components/SchemeFinder';
import VoiceResponsePipeline from './components/VoiceResponsePipeline';
import SoilCropRecommender from './components/SoilCropRecommender';
import Login from './components/Login';
import { Menu, X, Settings, Globe, Database, Smartphone, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.ENGLISH);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLowData, setIsLowData] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const [showMultiLanguageSearch, setShowMultiLanguageSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; farmerId?: string; role?: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Ramesh',
    location: 'Andhra Pradesh',
    primaryCrop: 'Rice',
    language: Language.ENGLISH,
    emergencyContacts: ['+91 9704648619']
  });

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kissan_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Error loading saved user:', err);
      }
    }
  }, []);

  const t = (key: string) => (TRANSLATIONS[lang] as any)[key] || key;

  const handleVoiceSearchResult = (query: string) => {
    setPendingQuery(query);
    setActiveTab('chat');
  };

  const updateContacts = (newContacts: string[]) => {
    setUserProfile(prev => ({ ...prev, emergencyContacts: newContacts }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard
          lang={lang}
          user={userProfile}
          lowData={isLowData}
          onVoiceSearch={handleVoiceSearchResult}
          onUpdateContacts={updateContacts}
        />;
      case 'chat':
        return <ChatInterface
          lang={lang}
          lowData={isLowData}
          initialQuery={pendingQuery}
          onQueryProcessed={() => setPendingQuery(null)}
        />;
      case 'doctor': return <DiseaseScanner lang={lang} />;
      case 'soil': return <SoilCropRecommender lang={lang} />;
      case 'market': return <MarketHub lang={lang} user={userProfile} />;
      case 'tips': return <SustainableTips lang={lang} />;
      case 'speech': return <SpeechToSpeech lang={lang} />;
      case 'voice': return <VoiceResponsePipeline lang={lang} />;
      case 'ledger': return <FarmLedger lang={lang} />;
      case 'schemes': return <SchemeFinder lang={lang} />;
      default: return <Dashboard lang={lang} user={userProfile} lowData={isLowData} onVoiceSearch={handleVoiceSearchResult} onUpdateContacts={updateContacts} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kissan_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleLoginSuccess = (userData: { email: string; farmerId?: string; role?: string }) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login lang={lang} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pb-20 md:pb-0 md:pl-64">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-emerald-800 text-white p-6 shadow-xl z-30 animate-slide-in-left">
        <div className="flex items-center gap-3 mb-10 animate-fade-in-down">
          <div className="bg-white p-2 rounded-xl text-emerald-800 animate-bounce-smooth">
            <Database size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t('appTitle')}</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {MENU_ITEMS.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all animate-fade-in-up ${activeTab === item.id ? 'bg-emerald-700 shadow-inner scale-105' : 'hover:bg-emerald-700/50 hover:scale-102'
                }`}
            >
              <span className={activeTab === item.id ? 'animate-bounce' : 'icon-bounce'}>
                {item.icon}
              </span>
              <span className="font-medium">{t(item.labelKey)}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-emerald-700 space-y-4">
          {/* User Info */}
          <div className="bg-emerald-700/50 rounded-xl p-3">
            <p className="text-xs opacity-75">{t('userEmail') || 'Email'}</p>
            <p className="text-sm font-semibold truncate">{currentUser?.email}</p>
            <p className="text-xs opacity-60 mt-1">{currentUser?.role === 'guest' ? 'Guest Access' : 'Farmer'}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">{t('lowDataMode')}</span>
            <button
              onClick={() => setIsLowData(!isLowData)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isLowData ? 'bg-amber-400' : 'bg-emerald-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isLowData ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(Language).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`py-1 text-[10px] rounded border ${lang === l ? 'bg-white text-emerald-800 font-bold' : 'border-emerald-700 opacity-60'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all hover:shadow-lg"
          >
            <LogOut size={18} />
            {lang === 'en' ? 'Logout' : lang === 'te' ? 'లాగౌట్' : 'लॉगआउट'}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 bg-emerald-800 text-white p-4 flex items-center justify-between z-40 shadow-md">
        <div className="flex items-center gap-2">
          <Database size={24} />
          <h1 className="text-xl font-bold">{t('appTitle')}</h1>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Settings size={28} />}
        </button>
      </header>

      {/* Mobile Settings Modal */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-emerald-900/95 z-50 p-8 text-white flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
          </div>
          <div className="space-y-8">
            <section>
              <h3 className="text-emerald-300 mb-4 uppercase text-xs font-bold tracking-widest">{t('language')}</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(Language).map(l => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setIsMenuOpen(false); }}
                    className={`py-3 rounded-xl border ${lang === l ? 'bg-white text-emerald-800 font-bold' : 'border-emerald-700'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </section>
            <section className="flex items-center justify-between p-4 bg-emerald-800 rounded-xl">
              <span>{t('lowDataMode')}</span>
              <button
                onClick={() => setIsLowData(!isLowData)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isLowData ? 'bg-amber-400' : 'bg-emerald-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isLowData ? 'left-7' : 'left-1'}`} />
              </button>
            </section>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {renderContent()}
      </main>

      {/* Multi-Language Voice Search Modal */}
      {showMultiLanguageSearch && (
        <MultiLanguageVoiceSearch
          lang={lang}
          onSearch={(query) => {
            setPendingQuery(query);
            setActiveTab('chat');
            setShowMultiLanguageSearch(false);
          }}
          onClose={() => setShowMultiLanguageSearch(false)}
        />
      )}

      {/* Floating Search Button */}
      <button
        onClick={() => setShowMultiLanguageSearch(true)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 animate-bounce-smooth btn-hover-scale animate-glow"
        title="Multi-language voice search"
      >
        <Globe size={24} className="animate-spin-slow" />
      </button>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        {MENU_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === item.id ? 'text-emerald-700' : 'text-stone-400'
              }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-tighter">{t(item.labelKey).split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
