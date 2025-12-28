import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiAtSign } from "react-icons/fi";
import { API_URL } from "../../config";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Min 8 chars";
    if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Redirect to Verify OTP
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        setErrors(data.errors || { form: data.message || "Signup failed" });
      }
    } catch (error) {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
       {errors.form && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl text-center text-sm">
          {errors.form}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
             <label className="text-xs font-semibold text-purple-200/80 ml-1 uppercase tracking-wider">Full Name</label>
             <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field ${errors.name ? "border-red-500/50" : ""}`}
                />
             </div>
             {errors.name && <p className="text-red-300 text-xs ml-1">{errors.name}</p>}
        </div>
        <div className="space-y-1">
             <label className="text-xs font-semibold text-purple-200/80 ml-1 uppercase tracking-wider">Username</label>
             <div className="relative">
                <FiAtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <input
                    type="text"
                    name="username"
                    placeholder="toplike_king"
                    value={formData.username}
                    onChange={handleChange}
                    className={`input-field ${errors.username ? "border-red-500/50" : ""}`}
                />
             </div>
             {errors.username && <p className="text-red-300 text-xs ml-1">{errors.username}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-purple-200/80 ml-1 uppercase tracking-wider">Email</label>
        <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
            <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? "border-red-500/50" : ""}`}
            />
        </div>
        {errors.email && <p className="text-red-300 text-xs ml-1">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-purple-200/80 ml-1 uppercase tracking-wider">Password</label>
        <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Unique Password"
                value={formData.password}
                onChange={handleChange}
                className={`input-field ${errors.password ? "border-red-500/50" : ""}`}
            />
            <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-fuchsia-300 transition"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
        </div>
        {errors.password && <p className="text-red-300 text-xs ml-1">{errors.password}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-purple-200/80 ml-1 uppercase tracking-wider">Confirm Password</label>
        <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
            <input
                type={showPassword ? "text" : "password"}
                name="password_confirmation"
                placeholder="Confirm"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`input-field ${errors.password_confirmation ? "border-red-500/50" : ""}`}
            />
        </div>
        {errors.password_confirmation && <p className="text-red-300 text-xs ml-1">{errors.password_confirmation}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-brand mt-4"
      >
        {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : "Create Account"}
      </button>
    </form>
  );
};

export default SignupForm;
