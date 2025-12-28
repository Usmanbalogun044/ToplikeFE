import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { API_URL } from "../../config";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      // If no email in state, redirect back to login
     // navigate("/login");
    }
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const code = otp.join("");
    if (code.length !== 6) {
        setError("Please enter the complete 6-digit code.");
        setLoading(false);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/email/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: code }),
        });
        
        const data = await response.json();

        if (response.ok) {
             // Save token and user
             localStorage.setItem("auth_token", data.token);
             localStorage.setItem("user", JSON.stringify(data.user));
             navigate("/dashboard");
        } else {
            setError(data.message || "Verification failed.");
        }
    } catch (err) {
        setError("Network error. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleResend = async () => {
      try {
        await fetch(`${API_URL}/email/resend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        alert("Verification code resent!");
      } catch (e) {
          alert("Failed to resend code.");
      }
  }

  return (
    <div className="auth-bg flex items-center justify-center px-6 py-10 min-h-screen">
      <div className="glass-auth-card w-full max-w-md p-8 md:p-10 relative">
        <Link to="/login" className="absolute top-6 left-6 text-purple-300 hover:text-white transition">
           <FiArrowLeft size={20} />
        </Link>
        
        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-extrabold text-white mb-2">Verify Account</h2>
          <p className="text-purple-200/70 text-sm">
            We sent a 6-digit code to <span className="font-semibold text-white">{email}</span>
          </p>
        </div>

        {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-2 mb-8">
            {otp.map((data, index) => (
              <input
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-purple-500/30 bg-purple-900/40 text-white focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 transition-all outline-none"
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-brand text-lg font-bold shadow-lg shadow-fuchsia-900/20"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-purple-200/60">
            Didn't receive the code?{" "}
            <button onClick={handleResend} className="text-fuchsia-300 font-semibold hover:text-fuchsia-100 transition ml-1">
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
