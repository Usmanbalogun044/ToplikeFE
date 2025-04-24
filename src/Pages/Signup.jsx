import { useState } from "react";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

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

  // Add this validation function
  const isFormValid = () => {
    return (
      formData.email &&
      /^\S+@\S+\.\S+$/.test(formData.email) &&
      formData.name &&
      formData.username &&
      formData.password &&
      formData.password.length >= 8 &&
      formData.password_confirmation &&
      formData.password === formData.password_confirmation &&
      acceptedTerms
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.password_confirmation)
      newErrors.password_confirmation = "Please re-enter your password";
    else if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "Passwords don't match";
    if (!acceptedTerms) newErrors.terms = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep1()) return;

    const signupUrl = "https://toplike.up.railway.app/api/signup";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        username: formData.username,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      }),
    };
    setIsSubmitting(true);
    try {
      const response = await fetch(signupUrl, options);

      const data = await response.json();

      if (response.ok) {
        setStep(2); // Move to verification message
      } else {
        setErrors({
          submit: data.message || "Signup failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrors({ submit: "An error occurred. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-4 sm:px-6 lg:py-8 lg:px-8">
      {/* Logo Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <h2 className="text-center text-3xl font-extrabold text-purple-600">
            TopLike
          </h2>
        </Link>
        <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
          {step === 1 ? "Create your account" : "Check your email"}
        </h2>
      </div>

      {/* Progress Bar - Only 2 steps */}
      <div className="mt-5 mx-auto w-full max-w-md px-4">
        <div className="flex justify-between mb-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${
                  step >= item
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Step 1: Account Creation */}
            {step === 1 && (
              <>
                {errors.submit && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errors.submit}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 cursor-pointer hover:text-gray-500"
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-1 h-1 w-full bg-gray-200 rounded-full">
                    <div
                      className={`h-1 rounded-full ${
                        formData.password.length > 12
                          ? "bg-green-500"
                          : formData.password.length > 8
                          ? "bg-yellow-500"
                          : formData.password.length > 0
                          ? "bg-red-500"
                          : ""
                      }`}
                      style={{
                        width: `${Math.min(
                          (formData.password.length / 12) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 cursor-pointer"
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={() => setAcceptedTerms(!acceptedTerms)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 cursor-pointer rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-purple-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-purple-600 hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                    {errors.terms && (
                      <p className="mt-1 text-red-500">{errors.terms}</p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md cursor-pointer shadow-sm text-sm 
                      font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                       focus:ring-purple-500 ${
                         !isFormValid() || isSubmitting
                           ? "opacity-50 cursor-not-allowed"
                           : ""
                       }`}
                  >
                    {isSubmitting ? (
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
                        Processing...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>

                <div className="text-center text-sm">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-purple-600 hover:text-purple-500 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* Step 2: Email Verification Message */}
            {step === 2 && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <FiCheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Verify your email
                </h3>
                <div className="mt-2 text-sm text-gray-600 space-y-4">
                  <p>
                    We've sent a verification link to{" "}
                    <span className="font-medium">{formData.email}</span>.
                  </p>
                  <p>
                    Please check your inbox and click on the link to verify your
                    account.
                  </p>
                  <p>
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      type="button"
                      className="text-purple-600 font-medium hover:underline"
                      onClick={() => {
                        // Here you would typically call an API endpoint to resend the verification email
                        console.log(
                          "Resend verification email to:",
                          formData.email
                        );
                      }}
                    >
                      click here to resend
                    </button>
                    .
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Continue to Login
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
