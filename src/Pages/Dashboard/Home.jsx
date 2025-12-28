import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Sharedd/Header";
import WeeklyChallengeModal from "../../Components/Challenge/WeeklyChallengeModal";
import Postcard from "../../Components/Post/Postcard";
import { FiCamera, FiLock } from "react-icons/fi";
import { API_URL } from "../../config";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check subscription and fetch posts
  useEffect(() => {
    const initializeData = async () => {
      try {
        await checkSubscription();
        await fetchPosts();
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/myprofile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setHasSubscribed(data.user?.has_subscribed || false);
      }
    } catch (error) {
      console.error("Subscription check error:", error);
      setHasSubscribed(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/post/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : data.posts || []);
      } else {
        throw new Error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts");
    }
  };

  const handleLikeSuccess = (likeData) => {
    if (!hasSubscribed) {
      setShowChallengeModal(true);
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === likeData.postId
          ? {
              ...post,
              likes_count: likeData.likesCount,
              is_liked: likeData.liked,
            }
          : post
      )
    );
  };

  const handleSubscribeSuccess = () => {
    setHasSubscribed(true);
    setShowChallengeModal(false);
    fetchPosts();
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
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

      {/* Weekly Challenge Modal */}
      {showChallengeModal && (
        <WeeklyChallengeModal
          onSuccess={handleSubscribeSuccess}
          onClose={() => setShowChallengeModal(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen px-4 pb-20 md:px-6 lg:px-8 py-6 max-w-2xl mx-auto w-full">
          
          {/* Create Post Prompt */}
          {hasSubscribed && (
            <div className="glass-panel rounded-2xl p-4 mb-6 flex items-center gap-4 transition-transform hover:scale-[1.01]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white font-bold text-lg">
                U
              </div>
              <Link
                to="/posts/create"
                className="flex-1 px-6 py-3.5 text-purple-200/60 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition border border-white/5 flex items-center gap-3"
              >
                <FiCamera className="text-purple-400" />
                What's on your mind?
              </Link>
            </div>
          )}

          {/* Non-Subscriber Banner */}
          {!hasSubscribed && posts.length > 0 && (
            <div className="bg-gradient-to-r from-purple-900/80 to-fuchsia-900/80 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl p-6 mb-8 text-center shadow-xl shadow-purple-900/50">
              <h3 className="font-bold text-xl text-white mb-2">
                Join the Weekly Challenge 🏆
              </h3>
              <p className="text-purple-200/90 mb-4 text-sm">
                Unlock posting, liking, and win cash prizes.
              </p>
              <button
                onClick={() => setShowChallengeModal(true)}
                className="btn-brand px-8 py-2.5 text-sm"
              >
                Subscribe Now - ₦500
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-center">
              <p className="text-red-300 text-sm mb-2">{error}</p>
              <button
                onClick={fetchPosts}
                className="text-white bg-red-500/20 px-4 py-1.5 rounded-lg text-xs hover:bg-red-500/30 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Feed */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-white/10">
                <div className="text-6xl mb-4 opacity-50 grayscale">📷</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-purple-200/60 text-sm mb-6">
                  Be the first to share something amazing!
                </p>
                {!hasSubscribed && (
                  <button
                    onClick={() => setShowChallengeModal(true)}
                    className="btn-brand px-6 py-2 text-sm"
                  >
                    Subscribe to Post
                  </button>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="relative group">
                  {/* Overlay for non-subscribers */}
                  {!hasSubscribed && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-2xl z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-[#1a0b2e] border border-purple-500/30 rounded-xl p-6 m-4 max-w-xs text-center shadow-2xl">
                        <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3 text-purple-300">
                            <FiLock size={20} />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">
                          Locked Interaction
                        </h3>
                        <p className="text-purple-200/70 text-sm mb-4">
                          Subscribe to match quality with quality.
                        </p>
                        <button
                          onClick={() => setShowChallengeModal(true)}
                          className="btn-brand w-full py-2.5 text-sm shadow-none"
                        >
                          Join Challenge
                        </button>
                      </div>
                    </div>
                  )}

                  <Postcard
                    post={post}
                    onLikeSuccess={handleLikeSuccess}
                    formatTimeAgo={formatTimeAgo}
                    isInteractive={hasSubscribed}
                  />
                </div>
              ))
            )}
          </div>
      </main>
    </>
  );
};

export default Home;
