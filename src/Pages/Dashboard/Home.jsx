import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../../Components/Sharedd/Header";
import WeeklyChallengeModal from "../../Components/Challenge/WeeklyChallengeModal";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  // const [hasSubscribed, setHasSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   const checkSubscription = async () => {
  //     try {
  //       const url = "https://api.toplike.app/api/check-subscription";
  //       const response = await fetch(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setHasSubscribed(data.hasSubscribed);
  //         setShowChallengeModal(!data.hasSubscribed);
  //       }
  //     } catch (error) {
  //       console.error("Error checking subscription:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkSubscription();
  //   fetchPosts();
  // }, []);

  const fetchPosts = async () => {
    try {
      const url = "https://api.toplike.app/api/posts";
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubscribeSuccess = () => {
    // setHasSubscribed(true);
    setShowChallengeModal(false);
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

      {/* Weekly challenge modal */}
      {showChallengeModal && (
        <WeeklyChallengeModal
          onSuccess={handleSubscribeSuccess}
          onClose={() => setShowChallengeModal(false)}
        />
      )}

      {/* Main Content */}
    </>
  );
};

export default Home;
