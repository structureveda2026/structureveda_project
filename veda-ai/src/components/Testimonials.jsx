import { testimonials } from '../data/prompts';

const Testimonials = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-16 sm:mt-24">
      <h2 className="text-center font-serif text-xl sm:text-2xl text-mutedtext mb-8">
        What seekers are saying
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gold/15 bg-white/5 backdrop-blur-sm p-5 hover:border-gold/40 hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mb-3 flex gap-0.5">
              {[0, 1, 2, 3, 4].map((s) => (
                <span key={s} className="text-gold text-xs">★</span>
              ))}
            </div>
            <p className="italic text-sm text-mutedtext leading-relaxed">"{t.text}"</p>
            <p className="mt-4 text-xs text-white/70 font-medium">— {t.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
