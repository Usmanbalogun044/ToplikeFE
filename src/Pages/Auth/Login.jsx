import { Link } from "react-router-dom";
import LoginForm from "../../Components/Auth/LoginForm";

const Login = () => {
  return (
    <div className="auth-bg flex items-center justify-center px-6 py-10 md:py-14">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-14 items-center">
        {/* Left Brand / Value Panel */}
        <div className="auth-side-panel hidden lg:flex flex-col gap-8 animate-fade-slide-up" style={{animationDelay:'70ms'}}>
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-lg shadow-fuchsia-800/30 flex items-center justify-center font-bold text-white text-xl tracking-tight">TL</div>
            <span className="text-3xl font-extrabold brand-gradient-text leading-none">TopLike</span>
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 brand-gradient-text">Welcome Back</h1>
            <p className="text-purple-900/70 font-medium leading-relaxed max-w-md">Log in to compete with one focused post per week. Track authentic reach, climb rankings, and unlock real rewards & creative momentum.</p>
          </div>
          <ul className="space-y-4 text-sm font-medium">
            <li className="mini-bullet"><span />Quality-first weekly posting rhythm</li>
            <li className="mini-bullet"><span />Authentic like tracking & anti-spam filters</li>
            <li className="mini-bullet"><span />Wallet rewards & tiered progression</li>
          </ul>
          <div className="mt-2 text-xs uppercase tracking-wider text-purple-800/60 font-semibold">Create • Compete • Evolve</div>
        </div>

        {/* Right Auth Card */}
        <div className="glass-auth-card p-8 md:p-10 relative auth-card-anim w-full">
          <div className="absolute -inset-px rounded-[28px] pointer-events-none bg-gradient-to-br from-fuchsia-500/10 via-purple-500/5 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">Sign In</h2>
              <Link to="/signup" className="text-xs link-soft">Create account →</Link>
            </div>
            <LoginForm />
            <div className="mt-6 text-center text-sm font-medium text-purple-900/70">
              Don't have an account? <Link to="/signup" className="link-soft">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
