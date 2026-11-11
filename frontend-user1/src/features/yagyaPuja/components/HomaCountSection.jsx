import React from "react";
import { Flame } from "lucide-react";

const HAVAN_COUNTS = [
  { count: "1", label: "Havan" },
  { count: "3", label: "Havans" },
  { count: "5", label: "Havans" },
  { count: "7", label: "Havans" },
  { count: "11", label: "Havans" },
];

export default function HomaCountSection() {
  return (
    <section className="border-b border-[#EAD8B8] bg-[#FFFDF9] px-5 py-12 sm:px-8 sm:py-14 lg:px-12" id="havan-counts">
      <div className="mx-auto max-w-[1080px]">
        {/* Section Header */}
        <div className="mx-auto max-w-[680px] text-center mb-8 sm:mb-10">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#B7791F]">
            SACRIFICIAL CADENCE &amp; SCALE
          </p>
          <h2 className="mt-2 font-serif text-[26px] font-semibold text-[#29231B] sm:text-[32px] lg:text-[36px]">
            The Scale of Sacred Fire
          </h2>
          <p className="mt-1.5 text-[14px] text-[#766D60]">
            Explore the available Havan configurations
          </p>
        </div>

        {/* 5 Equal-Sized Havan Count Cards */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5">
          {HAVAN_COUNTS.map((item, index) => (
            <div
              key={item.count}
              className={`flex flex-col items-center justify-between rounded-2xl border border-[#EAD8B8] bg-[#FFFAF0] p-5 shadow-2xs transition-all duration-300 hover:border-[#B7791F] hover:bg-white hover:shadow-xs hover:-translate-y-0.5 text-center min-h-[140px] sm:min-h-[150px] ${
                index === HAVAN_COUNTS.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              {/* Large Gold-Colored Count Number */}
              <span className="font-serif text-[38px] sm:text-[44px] font-bold text-[#B7791F] leading-none">
                {item.count}
              </span>

              {/* Havan / Havans Label */}
              <span className="font-serif text-[15px] sm:text-[16px] font-semibold text-[#29231B] mt-1">
                {item.label}
              </span>

              {/* Small Flame Icon at the Bottom */}
              <div className="mt-3 flex items-center justify-center text-[#C77722]">
                <Flame size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Custom Ceremony Compact Banner */}
        <div className="mt-4 sm:mt-5">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#EAD8B8] bg-[#F5EBD7] py-3 px-4 text-center">
            <span className="font-serif text-[13.5px] sm:text-[14px] font-semibold text-[#664614]">
              Custom Ceremony · By Consultation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
