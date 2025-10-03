import { categories } from "./landingConfig";
import Tilt from "./Tilt";
import {
  FaPaintBrush,
  FaVideo,
  FaCamera,
  FaMusic,
  FaTheaterMasks,
  FaPenFancy,
  FaGamepad,
  FaRunning,
} from "react-icons/fa";

const iconMap = {
  paint: <FaPaintBrush />,
  video: <FaVideo />,
  camera: <FaCamera />,
  music: <FaMusic />,
  theatre: <FaTheaterMasks />,
  pen: <FaPenFancy />,
  game: <FaGamepad />,
  run: <FaRunning />,
};

const Categories = () => (
  <section id="categories" className="px-6 py-24 relative">
    <div className="max-w-7xl mx-auto">
      <h2 className="animate-fade-slide-up text-center text-3xl md:text-4xl font-bold bg-gradient-to-b from-white to-purple-200/70 mb-4 bg-clip-text text-transparent">
        Built For Multi‑Talented Creators
      </h2>
      <p className="text-center text-purple-200/80 max-w-2xl mx-auto mb-12">
        Whether you storyboard, shoot, edit, sing, code gameplays, write, dance
        or design – there’s a lane for you. One platform. Infinite creative
        verticals.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.map((c, i) => (
          <Tilt key={c.label} max={18}>
            <div
              style={{ animationDelay: `${i * 40}ms` }}
              className="animate-fade-slide-up group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#241042]/80 to-[#31155a]/80 backdrop-blur-xl p-3 shadow-lg shadow-black/40 transition border border-fuchsia-500/10 hover:border-fuchsia-400/40 hover:shadow-fuchsia-600/30 three-d-card"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-fuchsia-300 ring-1 bg-gradient-to-br from-purple-600/30 to-fuchsia-600/20 group-hover:from-fuchsia-500/40 group-hover:to-purple-600/30 text-xl ring-white/10">
                {iconMap[c.icon]}
              </div>
              <p className="font-medium text-purple-50 text-sm tracking-wide">
                {c.label}
              </p>
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)] transition duration-500" />
              <div className="absolute bottom-0 left-0 w-full h-0 group-hover:h-1 bg-gradient-to-r from-fuchsia-500 to-purple-500 transition-all" />
            </div>
          </Tilt>
        ))}
      </div>
    </div>
  </section>
);

export default Categories;
