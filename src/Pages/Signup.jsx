import { useState } from "react";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [step, setStep] = useState(1); // Now only 1-2 steps
  const [formData, setFormData] = useState({
    email: "",
    mname: "",
    password: "",
    verifyPassword: "",
    username: "",
  });
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleVerificationCodeChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, "").slice(0, 1);
    const newCode = [...verificationCode];
    newCode[index] = digit;
    setVerificationCode(newCode);

    // Auto focus next input
    if (digit && index < 5) {
      document.getElementById(`verification-${index + 1}`)?.focus();
    }

    // Auto focus previous on backspace
    if (!digit && index > 0) {
      document.getElementById(`verification-${index - 1}`)?.focus();
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mname) newErrors.mname = "Name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.verifyPassword)
      newErrors.verifyPassword = "Please re-enter your password";
    if (formData.password !== formData.verifyPassword)
      newErrors.verifyPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!acceptedTerms)
      newErrors.terms = "You must accept the terms and conditions";
    if (verificationCode.some((digit) => !digit))
      newErrors.verification = "Please enter the complete verification code";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStep1Valid = () => {
    return (
      formData.email &&
      formData.mname &&
      formData.username &&
      formData.password &&
      formData.password.length >= 6 &&
      formData.verifyPassword &&
      formData.password === formData.verifyPassword
    );
  };

  const isStep2Valid = () => {
    return acceptedTerms && verificationCode.every((digit) => digit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;

    if (step === 1) {
      setStep(2);
    } else {
      try {
        const response = await fetch(
          "https://toplike.up.railway.app/api/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              name: formData.mname,
              username: formData.username,
              password: formData.password,
              verificationCode: verificationCode.join(""),
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("Signup successful:", data);
          navigate("/login"); // ✅ This is the correct place for redirection
        } else {
          console.error("Signup failed:", data);
          alert(data.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("An error occurred. Please try again later.");
      }
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
          {step === 1 ? "Create your account" : "Verify your email"}
        </h2>
      </div>

      {/* Progress Bar - Now only 2 steps */}
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
                <div>
                  <label
                    htmlFor="mname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="mname"
                      name="mname"
                      type="text"
                      required
                      value={formData.mname}
                      onChange={handleChange}
                      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  {errors.mname && (
                    <p className="mt-1 text-sm text-red-500">{errors.mname}</p>
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
                      className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
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
                      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
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
                      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
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
                        formData.password.length > 8
                          ? "bg-green-500"
                          : formData.password.length > 5
                          ? "bg-yellow-500"
                          : formData.password.length > 0
                          ? "bg-red-500"
                          : ""
                      }`}
                      style={{
                        width: `${Math.min(
                          formData.password.length * 10,
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
                    htmlFor="verifyPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Re-enter Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="verifyPassword"
                      name="verifyPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.verifyPassword}
                      onChange={handleChange}
                      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
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
                  {errors.verifyPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.verifyPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Verification */}
            {step === 2 && (
              <>
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                    <FiMail className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Verify your email
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    We've sent a 6-digit code to {formData.email}. Please check
                    your inbox and enter it below.
                  </p>
                  <div className="mt-6">
                    <div className="flex justify-center space-x-4">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength="1"
                          value={verificationCode[index]}
                          onChange={(e) =>
                            handleVerificationCodeChange(index, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "ArrowLeft" && index > 0) {
                              document
                                .getElementById(`verification-${index - 1}`)
                                ?.focus();
                            }
                            if (e.key === "ArrowRight" && index < 5) {
                              document
                                .getElementById(`verification-${index + 1}`)
                                ?.focus();
                            }
                          }}
                          id={`verification-${index}`}
                          className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      ))}
                    </div>
                    {errors.verification && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.verification}
                      </p>
                    )}
                    <p className="mt-4 text-sm text-gray-500">
                      Didn't receive code?{" "}
                      <button
                        type="button"
                        className="text-purple-600 font-medium cursor-pointer"
                      >
                        Resend
                      </button>
                    </p>
                  </div>
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
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={
                  (step === 1 && !isStep1Valid()) ||
                  (step === 2 && !isStep2Valid())
                }
                className={`w-full flex justify-center py-3 px-4 border border-transparent cursor-pointer rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  (step === 1 && !isStep1Valid()) ||
                  (step === 2 && !isStep2Valid())
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {step === 1 ? (
                  <>
                    <span className="flex items-center">
                      Continue <FiArrowRight className="ml-2" />
                    </span>
                  </>
                ) : (
                  "Complete Signup"
                )}
              </button>
            </div>

            {step === 1 && (
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
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
