const QuestionInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative w-full">
      {/* Glowing border effect */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-gold/20 via-purple/20 to-gold/20 opacity-60 blur-sm" />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="relative w-full rounded-2xl bg-[#0b0817]/80 backdrop-blur-sm border border-gold/40 px-5 py-4 text-white placeholder:text-mutedtext/60 text-base sm:text-lg leading-relaxed resize-none focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all duration-300"
      />
    </div>
  );
};

export default QuestionInput;
