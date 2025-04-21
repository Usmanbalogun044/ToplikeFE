import { useState } from "react";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { FiDollarSign } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sigup = () => {
  const [step, setStep] = useState(1); // 1-4 steps
  const [formData, setFormData] = useState({
    email: "",
    mname: "",
    password: "",
    verifyPassword: "",
    username: "",
    referralCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit final form
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Logo Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <h2 className="text-center text-3xl font-extrabold text-purple-600">
            TopLike
          </h2>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          {step === 1 && "Create your account"}
          {step === 2 && "Verify your password"}
          {step === 3 && "Complete profile"}
          {step === 4 && "Payment"}
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 mx-auto w-full max-w-md px-4">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((item) => (
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
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Step 1: Email/Password */}
            {step === 1 && (
              <>
                <div>
                  <label
                    htmlFor="Name"
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
                      value={formData.mname}
                      onChange={handleChange}
                      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
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
                      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
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
                      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500"
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
                        formData.password.length > 6
                          ? "bg-green-500"
                          : formData.password.length > 4
                          ? "bg-yellow-500"
                          : formData.password.length > 0
                          ? "bg-red-500"
                          : ""
                      }`}
                      style={{
                        width: `${Math.min(
                          formData.password.length * 15,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Verification */}
            {step === 2 && (
              <>
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
                      value={formData.verifyPassword || ""}
                      onChange={handleChange}
                      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
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
                </div>
                {formData.verifyPassword &&
                  formData.verifyPassword !== formData.password && (
                    <p className="text-sm text-red-500 mt-2">
                      Passwords do not match.
                    </p>
                  )}
              </>
            )}

            {/* Step 3: Profile */}
            {step === 3 && (
              <>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Choose a username
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
                      className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* <div>
                  <label
                    htmlFor="referralCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Referral Code (Optional)
                  </label>
                  <input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className="mt-1 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div> */}

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 cursor-pointer rounded"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-purple-600">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-purple-600">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                  <FiDollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Complete Your Registration
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Pay the ₦500 entry fee to participate in weekly contests
                </p>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entry Fee:</span>
                    <span className="font-medium">₦500</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-gray-600">Potential Prize:</span>
                    <span className="font-bold text-purple-600">
                      Up to ₦100,000
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <img
                      src="/paystack.png"
                      alt="Paystack"
                      className="h-6 mr-2"
                    />
                    Pay with Paystack
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <img
                      src="/flutterwave.png"
                      alt="Flutterwave"
                      className="h-6 mr-2"
                    />
                    Pay with Flutterwave
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={
                  (step === 1 && (!formData.email || !formData.password)) ||
                  (step === 2 &&
                    formData.password !== formData.verifyPassword) ||
                  (step === 3 && (!formData.username || !acceptedTerms))
                }
                className={`w-full flex justify-center py-3 px-4 border border-transparent cursor-pointer rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  (step === 1 && (!formData.email || !formData.password)) ||
                  (step === 2 &&
                    formData.password !== formData.verifyPassword) ||
                  (step === 3 && (!formData.username || !acceptedTerms))
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {step < 4 ? (
                  <>
                    <span className="flex items-center">
                      Continue <FiArrowRight className="ml-2" />
                    </span>
                  </>
                ) : (
                  "Complete Payment"
                )}
              </button>
            </div>

            {step === 1 && (
              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-purple-600 hover:text-purple-500"
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

export default Sigup;
