const quickLinks = ['Home', 'Explore Kundli', 'Features', 'FAQs'];
const platformLinks = ['FREE', 'VERIFY', 'TALK'];

const Footer = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-gold/15 bg-[#070512]/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-gold/30 blur-sm" />
                <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-lightgold to-gold flex items-center justify-center">
                  <span className="font-display text-base font-bold text-vedabg">V</span>
                </div>
              </div>
              <span className="font-display text-lg font-semibold text-white">Veda AI</span>
            </div>
            <p className="text-sm text-mutedtext leading-relaxed max-w-xs">
              AI-powered Vedic astrology insights grounded in ancient wisdom.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-lightgold mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => onNavigate && onNavigate(link)}
                    className="text-sm text-mutedtext hover:text-gold transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display text-sm font-semibold text-lightgold mb-3 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => onNavigate && onNavigate(link)}
                    className="text-sm text-mutedtext hover:text-gold transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tagline */}
          <div>
            <h4 className="font-display text-sm font-semibold text-lightgold mb-3 uppercase tracking-wider">
              Connect
            </h4>
            <p className="text-sm text-mutedtext leading-relaxed">
              Explore the stars, understand your Kundli, and discover what the planets hold for you.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-mutedtext">
            © {new Date().getFullYear()} Veda AI. All rights reserved.
          </p>
          <p className="text-xs text-mutedtext/70">Crafted with ancient wisdom & modern intelligence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
