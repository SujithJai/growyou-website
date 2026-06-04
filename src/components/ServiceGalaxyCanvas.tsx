import { useMemo } from "react";
import { serviceClusters } from "../data/site";

export function ServiceGalaxyCanvas() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: index,
        left: `${8 + ((index * 17) % 82)}%`,
        top: `${10 + ((index * 13) % 76)}%`,
        delay: `${(index % 9) * 0.8}s`,
      })),
    [],
  );

  return (
    <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(67,240,0,0.14),transparent_34%),linear-gradient(180deg,rgba(4,29,16,0.92),rgba(1,10,5,0.98))] lg:h-[720px]">
      <div className="absolute inset-0 [perspective:1200px]">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#88ff60] opacity-70 shadow-[0_0_12px_rgba(67,240,0,0.55)] animate-[pulse_4s_ease-in-out_infinite]"
            style={{ left: sparkle.left, top: sparkle.top, animationDelay: sparkle.delay }}
          />
        ))}

        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#43F000]/30 bg-[radial-gradient(circle,rgba(67,240,0,0.45),rgba(67,240,0,0.16)_45%,rgba(67,240,0,0.02)_70%)] shadow-[0_0_80px_rgba(67,240,0,0.35)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#43F000]/25 bg-black/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#c7ffb7] backdrop-blur-xl">
          GroYou growth engine
        </div>

        {serviceClusters.map((cluster, index) => {
          const size = cluster.orbit * 4.8;
          return (
            <div
              key={cluster.name}
              className="absolute left-1/2 top-1/2 rounded-full border border-white/6"
              style={{ width: `${size}rem`, height: `${size}rem`, transform: "translate(-50%, -50%) rotateX(72deg)", boxShadow: "inset 0 0 0 1px rgba(67,240,0,0.03)" }}
            >
              <div
                className="relative h-full w-full animate-[orbitSpin_linear_infinite]"
                style={{ animationDuration: `${18 + index * 2.2}s`, animationDelay: `-${index * 1.4}s` }}
              >
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <div className="group rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs font-medium text-white backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#43F000]/55 hover:shadow-[0_0_30px_rgba(67,240,0,0.25)] sm:text-sm">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: cluster.color }} />
                    {cluster.name}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#001007] to-transparent" />
    </div>
  );
}
