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
      {" "}
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

        {/* Content Area */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                    >
                      click here to resend
                    </button>
                    .
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
