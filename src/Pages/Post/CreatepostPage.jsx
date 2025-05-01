import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiDollarSign } from "react-icons/fi";
import Createmodal from "../../Components/Post/Createmodal";
import Header from "../../Components/Sharedd/Header";

const CreatepostPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  // Check if user already posted
  useEffect(() => {
    const checkSubmission = async () => {
      try {
        const url = "https://toplike.up.railway.app/api/has-user-post";
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        };
        const res = await fetch(url, options);

        const data = await res.json();
        if (data.hasPosted) navigate("/posts");
      } catch (error) {
        console.error(error);
        // Optionally show error to user or handle differently
      }
    };

    checkSubmission();
  }, [navigate]);

  const handleSubmit = async (formData) => {
    const newErrors = {};

    // Validation
    if (!formData.caption) newErrors.caption = "Caption is required";
    if (!formData.media) newErrors.media = "Media is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Initiate payment
    if (!paymentInitiated) {
      await handlePayment(formData);
      return;
    }

    // Submit after payment
    await submitPost(formData);
  };

  const handlePayment = async (formData) => {
    setLoading(true);
    try {
      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: "YOUR_PAYSTACK_PUBLIC_KEY",
        email: "user@example.com", // Get from user data
        amount: 50000, // ₦500 in kobo
        currency: "NGN",
        ref: `TL-${Date.now()}`,
        callback: (response) => {
          if (response.status === "success") {
            setPaymentInitiated(true);
            handleSubmit(formData); // Retry submission
          }
        },
        onClose: () => setLoading(false),
      });
      handler.openIframe();
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({ ...errors, payment: "Payment failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const submitPost = async (formData) => {
    setLoading(true);
    const url = "https://toplike.up.railway.app/api/post/create";
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const formPayload = new FormData();
      formPayload.append("caption", formData.caption);
      formPayload.append("post_type", formData.post_type);
      formPayload.append("media", formData.media);
      if (formData.music) {
        formPayload.append("music", formData.music);
      }

      const res = await fetch(url, {
        ...options,
        body: formPayload,
      });

      if (res.ok) {
        navigate("/posts");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ ...errors, submit: "Failed to submit. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Mobile Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">Create Post</h1>

          <Createmodal
            onSubmit={handleSubmit}
            loading={loading}
            paymentInitiated={paymentInitiated}
          />

          {/* Payment Info */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
            <div className="flex items-center">
              <FiDollarSign className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="font-medium">Entry Fee: ₦500</p>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              You'll be redirected to Paystack for payment after form validation
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default CreatepostPage;
