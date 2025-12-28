import { useState } from "react";
import Createmodal from "../../Components/Post/Createmodal";
import Header from "../../Components/Sharedd/Header";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { API_URL } from "../../config";

const CreatepostPage = () => {
  const [loading, setLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const token = localStorage.getItem("token");

  const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { message: text };
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      // Create post directly. Backend will handle checks (ChallengeService)
      const response = await fetch(`${API_URL}/post/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await parseResponse(response);

      if (!response.ok) {
        // Handle specific error codes if needed (e.g., 403 for not joined)
        if (response.status === 402 || response.status === 403) {
            // Logic to prompt join challenge could go here or be part of component state
        }
        throw new Error(result.message || `Request failed: ${response.status}`);
      }

      console.log("Post created successfully:", result);
      // Remove stale profile data to force refresh on dashboard
      sessionStorage.removeItem("currentUserProfile");
      window.location.href = "/dashboard";
      
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
      setPaymentInitiated(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex justify-center items-center">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-fuchsia-500 shadow-lg shadow-fuchsia-500/20"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        <Link to="/dashboard" className="inline-flex items-center text-purple-300/60 hover:text-white mb-6 transition">
            <FiArrowLeft className="mr-2" /> Back to Feed
        </Link>
        <div className="glass-panel p-6 md:p-8 rounded-2xl animate-fade-in-up">
          <h1 className="text-2xl font-bold mb-6 text-white tracking-tight">Create New Post</h1>
          <Createmodal
            onSubmit={handleSubmit}
            loading={loading}
            paymentInitiated={paymentInitiated}
          />
        </div>
      </main>
    </>
  );
};

export default CreatepostPage;
