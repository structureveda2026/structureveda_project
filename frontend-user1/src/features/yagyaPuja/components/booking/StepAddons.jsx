import {
  Package,
  Users,
  Calendar,
  Sparkles,
  Video,
  Film,
  Award,
  Heart,
  Check,
  Info,
} from "lucide-react";
import { useRitualBooking, AVAILABLE_ADDONS } from "../../context/RitualBookingContext";

const ICON_MAP = {
  prasad: Package,
  additional_pandit: Users,
  additional_day: Calendar,
  special_samagri: Sparkles,
  live_participation: Video,
  video_recording: Film,
  certificate: Award,
  other_service: Heart,
};

const StepAddons = () => {
  const { addons, toggleAddon, isCalculatingPrice } = useRitualBooking();

  const isSelected = (type) => addons.some((item) => item.type === type);

  return (
    <div className="space-y-8">
      {/* Information Banner */}
      <div className="rounded-xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-[13px] text-[#685c4f]">
        <div className="flex items-start gap-2.5">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-[#b36c1e]" />
          <div>
            <p className="font-semibold text-[#2b241d]">
              Sacred Ceremony Add-ons & Customizations (Optional)
            </p>
            <p className="mt-0.5 text-[#7a6f62]">
              Select any additional traditional offerings or archival services you wish to include in your ceremony. Add-ons are subject to backend verification and priest scheduling.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Rule Notice */}
      <div className="rounded-xl border border-[#f0e2cd] bg-[#fbf7f0] p-4 text-[12.5px] text-[#7a6f62] flex items-start gap-2.5">
        <Info size={16} className="mt-0.5 shrink-0 text-[#b36c1e]" />
        <div>
          <p className="font-semibold text-[#2b241d]">Authoritative Dakshina Policy</p>
          <p className="mt-0.5 text-[#7a6f62]">
            In strict compliance with Veda Structure guidelines, all ceremony fees and inclusions are calculated directly by the authoritative backend engine. No estimated or fabricated add-on surcharges are applied.
          </p>
        </div>
      </div>

      {/* Add-ons Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {AVAILABLE_ADDONS.map((addon) => {
          const selected = isSelected(addon.type);
          const IconComponent = ICON_MAP[addon.type] || Sparkles;

          return (
            <div
              key={addon.type}
              onClick={() => toggleAddon(addon)}
              className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-5 transition-all duration-200 select-none ${
                selected
                  ? "border-[#b36c1e] bg-[#fffaf0] shadow-[0_4px_20px_rgba(179,108,30,0.12)] ring-1 ring-[#b36c1e]"
                  : "border-[#ead8b8] bg-[#fffdfa] hover:border-[#dfcdb1] hover:bg-[#fffefc] shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                        selected
                          ? "bg-[#f8edd8] text-[#b36c1e]"
                          : "bg-[#fbf7f0] text-[#7a6f62] group-hover:text-[#b36c1e]"
                      }`}
                    >
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif text-[15.5px] font-semibold text-[#2b241d]">
                        {addon.name}
                      </h4>
                      <span className="inline-block mt-0.5 rounded-full bg-[#f4ebe1] px-2 py-0.5 text-[10px] font-medium text-[#7a6f62]">
                        Optional Customization
                      </span>
                    </div>
                  </div>

                  {/* Selection Checkbox Pill */}
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      selected
                        ? "border-[#b36c1e] bg-[#b36c1e] text-white"
                        : "border-[#d8c8b2] bg-white group-hover:border-[#b36c1e]"
                    }`}
                  >
                    {selected && <Check size={14} strokeWidth={2.5} />}
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3.5 text-[13px] leading-relaxed text-[#685c4f]">
                  {addon.tagline}
                </p>
              </div>

              {/* Status Note */}
              <div className="mt-4 flex items-center justify-between border-t border-[#f0e4d2] pt-3 text-[11.5px]">
                <span className="font-medium text-[#8a7c6b]">
                  {selected ? "Included in ceremony request" : "Click to include"}
                </span>
                <span className="font-semibold text-[#b36c1e]">
                  {selected ? "Selected" : "+ Add to Request"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Summary Notice */}
      <div className="rounded-xl border border-[#ead8b8] bg-[#fffdfa] p-4 text-[13px] text-[#685c4f] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
            {addons.length}
          </span>
          <span className="font-medium text-[#2b241d]">
            {addons.length === 0
              ? "No optional add-ons selected."
              : `${addons.length} sacred customization${addons.length > 1 ? "s" : ""} selected.`}
          </span>
        </div>

        {isCalculatingPrice && (
          <span className="text-[12px] font-medium text-[#b36c1e] animate-pulse">
            Syncing authoritative backend Dakshina...
          </span>
        )}
      </div>
    </div>
  );
};

export default StepAddons;
