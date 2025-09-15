import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";

const SignupForm = ({
  formData,
  handleChange,
  showPassword,
  setShowPassword,
  acceptedTerms,
  setAcceptedTerms,
  errors,
  isSubmitting,
  isFormValid,
  onSubmit,
}) => {
  return (
    <>
      {/* Signup Form */}
      <form className="space-y-6" onSubmit={onSubmit}>
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
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1
                    .293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
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
              className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 
              pr-10"
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
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
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
              className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 
              pr-10"
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
          {/* Create Account Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md cursor-pointer shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
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
      </form>
    </>
  );
};

export default SignupForm;
