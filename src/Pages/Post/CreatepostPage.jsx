import { useState } from "react";
import Createmodal from "../../Components/Post/Createmodal";
import Header from "../../Components/Sharedd/Header";

const CreatepostPage = () => {
  const [loading, setLoading] = useState(false);
  const [paymentIntiated, setPaymentInitiated] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    setLoading(true);

    try {
      const subscriptionCheck = await fetch(
        "https://api.toplike.app/api/has-user-post",
        {
          method: "GET",
          headers: {
            Autorization: `Bearer ${token}`,
          },
        }
      );

      const subscriptionData = await subscriptionCheck.json();

      if (!subscriptionCheck.ok || !subscriptionData.hasPosted) {
        setPaymentInitiated(true);

        const joinResponse = await fetch(
          "https://api.toplike.app/api/join/challenge",
          {
            method: "POST",
            headers: {
              Autorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const joinData = await joinResponse.json();

        if (joinData.redirect_url) {
          // Redirect to payment page
          window.location.href = joinData.redirect_url;
          return;
        }

        throw new Error("Failed to initiate payment");
      }

      // User is subscribed, proceed with post creation
      const response = await fetch("https://api.toplike.app/api/post/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create post");
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
            paymentInitiated={paymentIntiated}
          />
        </div>
      </main>
    </>
  );
};

export default CreatepostPage;
