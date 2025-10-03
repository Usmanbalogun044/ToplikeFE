


const CharacterCanvas = () => (
  <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,rgba(180,70,255,0.15),transparent_65%)]" />
    <div className="relative w-40 h-40 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-700 shadow-xl shadow-fuchsia-900/40 flex items-center justify-center hero-rotate-slow">
      <span className="text-white font-extrabold text-3xl tracking-wider select-none">
        TL
      </span>
    </div>
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl bg-gradient-to-tr from-fuchsia-500/20 to-purple-600/10" />
  </div>
);

const steps = [
  {
    day: "Day 1",
    title: "Ignite Ideas",
    desc: "Rapid brainstorm & trend scan to spark a high-potential theme.",
  },
  {
    day: "Day 2",
    title: "Script & Blueprint",
    desc: "Outline hooks, structure & CTA. Prep assets.",
  },
  {
    day: "Day 3",
    title: "Create & Capture",
    desc: "Record, design, voiceover or draft core pieces.",
  },
  {
    day: "Day 4",
    title: "Edit & Polish",
    desc: "Refine pacing, visuals, captions & accessibility.",
  },
  {
    day: "Day 5",
    title: "Launch & Publish",
    desc: "Multi-platform rollout with optimized thumbnails.",
  },
  {
    day: "Day 6",
    title: "Engage & Amplify",
    desc: "Reply, stitch, remix & community accelerate reach.",
  },
  {
    day: "Day 7",
    title: "Reflect & Reward",
    desc: "Analytics, iteration & payout progress / leaderboard.",
  },
];

const CreatorJourney = () => {
  return (
    <section
      id="weekly-journey"
      className="relative py-28 md:py-36 px-6 md:px-12 lg:px-20"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_40%,rgba(160,60,255,0.08),transparent_60%)]" />
      <div className="grid lg:grid-cols-2 gap-14 items-center relative">
        {/* 3D Character */}
        <div className="h-[420px] md:h-[480px] rounded-3xl overflow-hidden animate-fade-slide-up bg-gradient-to-br from-[#1b062d]/60 via-[#240a45]/60 to-[#320f63]/60 backdrop-blur-xl border border-purple-500/20 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_40px_-10px_rgba(132,42,255,0.45)] ">
          <CharacterCanvas />
        </div>
        {/* Textual Journey */}
        <div>
          <h2 className="animate-fade-slide-up text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-fuchsia-400 via-purple-300 to-fuchsia-200 bg-clip-text text-transparent">
            Weekly Creator Journey
          </h2>
          <p
            className="animate-fade-slide-up text-lg md:text-xl text-purple-200/80 max-w-xl leading-relaxed mb-10"
            style={{ animationDelay: "120ms" }}
          >
            A rhythm engineered for momentum. Cycle through focused micro-goals
            each day so consistency compounds into audience reach, reputation
            and payouts.
          </p>
          <div className="relative pl-6 border-l border-purple-500/30 space-y-8">
            {steps.map((s, i) => (
              <div
                key={s.day}
                style={{ animationDelay: `${i * 55}ms` }}
                className="group animate-fade-slide-up"
              >
                <div className="absolute -left-[13px] mt-1 w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-lg shadow-fuchsia-600/40 group-hover:scale-110 transition" />
                <div className="ml-2">
                  <h3 className="font-bold text-lg md:text-xl text-purple-50 flex items-center gap-3">
                    <span className="text-sm px-2 py-1 rounded-md bg-purple-700/40 border border-purple-500/30 shadow-inner 
                    shadow-fuchsia-500/10">
                      {s.day}
                    </span>
                    {s.title}
                  </h3>
                  <p className="mt-1 text-purple-200/70 text-sm md:text-base max-w-md leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4">
              <div className="h-2 w-full bg-purple-950/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-400 animate-progress-bar" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-wider text-purple-300/60">
                One week. Repeat. Evolve. Scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorJourney;
