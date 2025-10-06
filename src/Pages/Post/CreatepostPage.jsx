import { useState } from "react";
import Createmodal from "../../Components/Post/Createmodal";
import Header from "../../Components/Sharedd/Header";

const CreatepostPage = () => {
  const [loading, setLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const token = localStorage.getItem("token");

  // ✅ Helper function: safely parse JSON or fallback to text
  const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { message: text }; // wrap plain text/HTML in an object
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      // 🔹 Subscription check
      const subscriptionCheck = await fetch(
        "https://api.toplike.app/api/has-user-post",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const subscriptionData = await parseResponse(subscriptionCheck);

      if (!subscriptionCheck.ok || !subscriptionData.hasPosted) {
        setPaymentInitiated(true);

        // 🔹 Join challenge
        const joinResponse = await fetch(
          "https://api.toplike.app/api/join/challenge",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const joinData = await parseResponse(joinResponse);

        if (joinData.redirect_url) {
          // Redirect to payment page
          window.location.href = joinData.redirect_url;
          return;
        }

        if (!joinResponse.ok) {
          throw new Error(joinData.message || "Failed to join challenge");
        }
      }

      // 🔹 Create post
      const response = await fetch("https://api.toplike.app/api/post/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await parseResponse(response);

      if (!response.ok) {
        const msg = result.message;

        // If backend sent HTML, hide it
        if (msg && msg.startsWith("<!DOCTYPE")) {
          throw new Error(`Request failed: ${response.status}`);
        }

        throw new Error(msg || `Request failed: ${response.status}`);
      }

      console.log("Post created successfully:", result);

      // Redirect to dashboard or show success message
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
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">Create Post</h1>
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
