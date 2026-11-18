const SectionHeading = ({ title, subtitle, description }) => {
  return (
    <div className="text-center mb-10 sm:mb-14">
      <div className="inline-flex items-center gap-2 mb-3">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
      </div>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 font-serif text-base sm:text-lg text-mutedtext">{subtitle}</p>
      )}
      {description && (
        <p className="mt-3 font-serif text-base sm:text-lg text-mutedtext max-w-2xl mx-auto px-4 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
