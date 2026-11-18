const HeroSection = () => {
  return (
    <div className="text-center mb-10">
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
        {/* Veda AI logo */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-gold/40 blur-md animate-glowPulse" />
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-lightgold to-gold flex items-center justify-center shadow-lg shadow-gold/30">
            <span className="font-display text-lg sm:text-xl font-bold text-vedabg">V</span>
          </div>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-wide">
          Talk to <span className="text-gradient bg-gradient-to-r from-lightgold to-gold bg-clip-text text-transparent">Veda AI</span>
        </h1>
      </div>
      <p className="font-serif text-base sm:text-lg md:text-xl text-mutedtext max-w-2xl mx-auto leading-relaxed px-4">
        Talk to Veda AI, explore your Kundli, understand planetary influences.
      </p>
    </div>
  );
};

export default HeroSection;
