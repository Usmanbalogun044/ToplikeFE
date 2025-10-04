import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("https://api.toplike.app/api/signin", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.errors) setError(Object.values(data.errors).join(", "));
        else if (data.message) setError(data.message);
        else setError("Login failed. Please try again.");
        return;
      }
      localStorage.setItem("token", data.token);
      if (formData.remember) localStorage.setItem("rememberMe", "true");
      else localStorage.removeItem("rememberMe");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-400/40 rounded-xl p-4 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}
      <div className="space-y-5">
        <div className="relative">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wide text-purple-800 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 -translate-y-1/2 top-1/2 w-4 h-4 text-[#8b5cf6] pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="mail@mailer.com"
              className="input-field"
            />
          </div>
        </div>
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wide text-purple-800 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 -translate-y-1/2 top-1/2 w-4 h-4 text-[#8b5cf6] pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8b5cf6] cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="remember-me"
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
          />
          <span className="text-xs font-medium text-purple-900">
            Remember me
          </span>
        </label>
        <div className="text-xs font-semibold">
          <Link to="/forgot-password" className="link-soft">
            Forgot password?
          </Link>
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className={`btn-brand cursor-pointer ${
            loading ? "opacity-70 pointer-events-none" : ""
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
