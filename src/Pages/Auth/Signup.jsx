import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import SignupForm from "../../Components/Auth/SignupForm";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    password_confirmation: "",
    username: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateApiRequirements = (data) => {
    const newErrors = {};

    if (!data.name || data.name.trim() === "") {
      newErrors.name = "Full name is required";
    } else if (data.name.length > 255) {
      newErrors.name = "Name must be less than 255 characters";
    }

    if (!data.username || data.username.trim() === "") {
      newErrors.username = "Username is required";
    } else if (data.username.length > 255) {
      newErrors.username = "Username must be less than 255 characters";
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Valid email is required";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (data.password !== data.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const isFormValid = () => {
    return (
      formData.email &&
      /^\S+@\S+\.\S+$/.test(formData.email) &&
      formData.name &&
      formData.name.length <= 255 &&
      formData.username &&
      formData.username.length <= 255 &&
      formData.password &&
      formData.password.length >= 8 &&
      formData.password_confirmation &&
      formData.password === formData.password_confirmation &&
      acceptedTerms
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiErrors = validateApiRequirements(formData);
    if (Object.keys(apiErrors).length > 0) {
      setErrors(apiErrors);
      return;
    }

    if (!isFormValid()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("https://api.toplike.app/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name.substring(0, 255),
          username: formData.username.substring(0, 255),
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
      } else {
        // ✅ IMPROVED ERROR HANDLING
        if (data.errors) {
          setErrors(data.errors);
        } else if (data.message) {
          setErrors({ submit: data.message });
        } else {
          setErrors({ submit: "Signup failed. Please try again." });
        }
      }
    } catch (error) {
      setErrors({
        submit:
          "Network error occurred. Please check your connection try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="auth-bg flex items-center justify-center px-6 py-10 md:py-14">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          {/* Brand / Story Panel */}
          <div className="hidden lg:flex flex-col gap-8 animate-fade-slide-up" style={{animationDelay:'60ms'}}>
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-lg shadow-fuchsia-800/30 flex items-center justify-center font-bold text-white text-xl tracking-tight">TL</div>
              <span className="text-3xl font-extrabold brand-gradient-text leading-none">TopLike</span>
            </Link>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-4 brand-gradient-text">Create Your Account</h1>
              <p className="text-purple-900/70 font-medium leading-relaxed max-w-lg">Join a focused weekly challenge loop that rewards craft over spam. One strategic upload, six days of authentic distribution, results you can track & withdraw.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm font-medium">
              <div className="mini-bullet"><span />Fair ranking algorithm</div>
              <div className="mini-bullet"><span />Wallet & payouts</div>
              <div className="mini-bullet"><span />Trust & growth tiers</div>
              <div className="mini-bullet"><span />Zero follower bias</div>
            </div>
            <p className="text-xs uppercase tracking-wider text-purple-800/60 font-semibold">Craft • Discipline • Momentum</p>
          </div>

          {/* Auth Card */}
          <div className="glass-auth-card p-8 md:p-10 relative auth-card-anim">
            <div className="absolute -inset-px rounded-[28px] pointer-events-none bg-gradient-to-br from-fuchsia-500/10 via-purple-500/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">{step === 1 ? 'Create Account' : 'Verify Email'}</h2>
                <Link to="/login" className="text-xs link-soft">Have an account? Sign in</Link>
              </div>
              <div>
                <div className="step-circles">
                  {[1,2].map(n => <div key={n} className={`circle ${step>=n?'active':''}`}>{n}</div>)}
                </div>
                <div className="progress-track mb-6"><div className="progress-bar-auth" style={{width:`${(step/2)*100}%`}} /></div>
              </div>
              {step === 1 ? (
                <SignupForm
                  formData={formData}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  acceptedTerms={acceptedTerms}
                  setAcceptedTerms={setAcceptedTerms}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  isFormValid={isFormValid}
                  onSubmit={handleSubmit}
                />
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-green-100 ring-2 ring-green-400/30 mb-5 shadow shadow-green-600/20">
                    <FiCheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-3">Verify Your Email</h3>
                  <div className="text-sm text-purple-900/70 space-y-4 max-w-sm mx-auto">
                    <p>We sent a verification link to <span className="font-semibold">{formData.email}</span>.</p>
                    <p>Open it to activate your account and begin your first weekly cycle.</p>
                    <p className="text-xs">No email? Check spam or <button type="button" className="link-soft">resend link</button>.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
