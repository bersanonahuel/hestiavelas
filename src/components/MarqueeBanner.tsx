import { Sparkles } from "lucide-react";

export default function MarqueeBanner() {
  const announcements = [
    "Envíos coordinados a todo el país",
    "Velas 100% Cera de Soja botánica",
    "Pedidos personalizados para eventos y regalos",
    "Fragancias finas de alta concentración",
    "Atención directa por WhatsApp",
    "Envases de vidrio reutilizables",
  ];

  return (
    <div className="w-full bg-primary text-white overflow-hidden py-2.5 border-b border-primary/20 select-none relative z-50">
      <div className="marquee-container flex items-center whitespace-nowrap">
        {/* First Loop */}
        <div className="flex items-center gap-8 px-4">
          {announcements.map((item, idx) => (
            <div key={`loop-1-${idx}`} className="flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-light text-white/90">
              <span>{item}</span>
              <span className="text-accent flex items-center justify-center opacity-80">
                <Sparkles size={11} />
              </span>
            </div>
          ))}
        </div>

        {/* Second Loop for seamless endless loop */}
        <div className="flex items-center gap-8 px-4" aria-hidden="true">
          {announcements.map((item, idx) => (
            <div key={`loop-2-${idx}`} className="flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-light text-white/90">
              <span>{item}</span>
              <span className="text-accent flex items-center justify-center opacity-80">
                <Sparkles size={11} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
