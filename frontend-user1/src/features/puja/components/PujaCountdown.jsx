import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

/**
 * Calculates time remaining from now until target ISO timestamp.
 * Strictly clamps at 0 to avoid negative values or NaN.
 */
const calculateTimeLeft = (targetDateTime) => {
  if (!targetDateTime) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
  }
  const target = new Date(targetDateTime).getTime();
  if (isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
  }

  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isCompleted: false };
};

const PujaCountdown = ({ targetDateTime, label = "Starts In", compact = false }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDateTime));

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDateTime));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDateTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateTime]);

  const pad = (n) => String(n).padStart(2, "0");

  if (timeLeft.isCompleted) {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-[#ead8b8] bg-[#fbf4e8] px-4 py-2.5 text-[13px] font-semibold text-[#8c5214]">
        <Clock size={15} className="text-[#c77722]" />
        <span>Ritual Underway / Registrations Concluded</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#917960]">
          <Clock size={12} className="text-[#c77722]" />
          <span>{label}</span>
        </div>
      )}

      {/* 4 Timer Boxes */}
      <div className="flex items-center gap-2 sm:gap-3" role="timer" aria-label="Ceremony countdown">
        {/* Days */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#ebdcc4] bg-[#fffdfa] px-3 py-2 shadow-2xs min-w-[56px] sm:min-w-[66px]">
          <span className="font-serif text-[20px] font-bold leading-tight text-[#2b241d] sm:text-[24px]">
            {pad(timeLeft.days)}
          </span>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8a7a68] sm:text-[10px]">
            Days
          </span>
        </div>

        <span className="text-[16px] font-bold text-[#c4b197] sm:text-[20px]">:</span>

        {/* Hours */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#ebdcc4] bg-[#fffdfa] px-3 py-2 shadow-2xs min-w-[56px] sm:min-w-[66px]">
          <span className="font-serif text-[20px] font-bold leading-tight text-[#2b241d] sm:text-[24px]">
            {pad(timeLeft.hours)}
          </span>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8a7a68] sm:text-[10px]">
            Hours
          </span>
        </div>

        <span className="text-[16px] font-bold text-[#c4b197] sm:text-[20px]">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#ebdcc4] bg-[#fffdfa] px-3 py-2 shadow-2xs min-w-[56px] sm:min-w-[66px]">
          <span className="font-serif text-[20px] font-bold leading-tight text-[#2b241d] sm:text-[24px]">
            {pad(timeLeft.minutes)}
          </span>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8a7a68] sm:text-[10px]">
            Min
          </span>
        </div>

        <span className="text-[16px] font-bold text-[#c4b197] sm:text-[20px]">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#ebdcc4] bg-[#fffdfa] px-3 py-2 shadow-2xs min-w-[56px] sm:min-w-[66px]">
          <span className="font-serif text-[20px] font-bold leading-tight text-[#c77722] sm:text-[24px]">
            {pad(timeLeft.seconds)}
          </span>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8a7a68] sm:text-[10px]">
            Sec
          </span>
        </div>
      </div>
    </div>
  );
};

export default PujaCountdown;
