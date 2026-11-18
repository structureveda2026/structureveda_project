import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import CosmicBackground from './components/CosmicBackground';
import HeroSection from './components/HeroSection';
import QuestionInput from './components/QuestionInput';
import PromptLibrary from './components/PromptLibrary';
import LoginPrompt from './components/LoginPrompt';
import Testimonials from './components/Testimonials';
import AstrologyCategories from './components/AstrologyCategories';
import KundliSection from './components/KundliSection';
import WhatVedaOffers from './components/WhatVedaOffers';
import PlatformPathways from './components/PlatformPathways';
import HowItWorks from './components/HowItWorks';
import LanguageSelector from './components/LanguageSelector';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loginNotice, setLoginNotice] = useState('');
  const [navNotice, setNavNotice] = useState('');

  const handleAsk = () => {
    if (!question.trim()) {
      setError('Please enter a question for Veda AI to answer.');
      setSubmitted(false);
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handlePromptSelect = (prompt) => {
    setQuestion(prompt);
    setError('');
    setSubmitted(false);
  };

  const handleCategorySelect = (prompt) => {
    setQuestion(prompt);
    setError('');
    setSubmitted(false);
    // Scroll back up to the hero input
    const hero = document.getElementById('hero-input');
    if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleLogin = () => {
    setLoginNotice('Login is coming soon. Stay tuned!');
    setTimeout(() => setLoginNotice(''), 3000);
  };

  const handleNavigate = (label) => {
    setNavNotice(`${label} — coming soon.`);
    setTimeout(() => setNavNotice(''), 2500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center">
      <CosmicBackground />

      {/* Language selector - top right */}
      <div className="fixed top-4 right-4 z-40">
        <LanguageSelector />
      </div>

      {/* Main hero content */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 pt-20 sm:pt-24 pb-12">
        <div id="hero-input" className="w-full max-w-2xl flex flex-col items-center">
          <HeroSection />

          <div className="w-full flex flex-col items-center gap-4">
            <QuestionInput
              value={question}
              onChange={(v) => {
                setQuestion(v);
                if (error) setError('');
                if (submitted) setSubmitted(false);
              }}
              placeholder="I'm planning to change my job next month. What do my planetary positions indicate about my career?"
            />

            <div className="w-full flex flex-col items-center gap-4">
              <PromptLibrary onSelect={handlePromptSelect} />

              {/* CTA Button */}
              <button
                onClick={handleAsk}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base sm:text-lg font-semibold text-vedabg bg-gradient-to-r from-lightgold via-gold to-lightgold shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Sparkles className="h-5 w-5" />
                Ask Veda AI
              </button>

              {/* Validation error */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-300 animate-fadeIn">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Success / demo message */}
              {submitted && (
                <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-center text-sm text-lightgold animate-scaleIn max-w-md">
                  Your question is ready for Veda AI. This is a demo — full readings are coming soon.
                </div>
              )}

              {/* Login prompt */}
              <div className="mt-2">
                <LoginPrompt onLogin={handleLogin} />
              </div>

              {/* Login demo notice */}
              {loginNotice && (
                <div className="text-sm text-mutedtext animate-fadeIn">{loginNotice}</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* New sections below the hero */}
      <AstrologyCategories onSelect={handleCategorySelect} />
      <KundliSection />
      <WhatVedaOffers />
      <PlatformPathways />
      <HowItWorks />

      {/* Testimonials preserved between How It Works and FAQ */}
      <div className="w-full pb-4">
        <Testimonials />
      </div>

      <FaqSection />

      <Footer onNavigate={handleNavigate} />

      {navNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-gold/30 bg-[#0b0817]/95 px-5 py-3 text-sm text-lightgold shadow-xl shadow-purple/30 animate-fadeIn">
          {navNotice}
        </div>
      )}
    </div>
  );
}

export default App;
