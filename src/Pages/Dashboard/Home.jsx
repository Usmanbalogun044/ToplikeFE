import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Sharedd/Header";
import WeeklyChallengeModal from "../../Components/Challenge/WeeklyChallengeModal";
import Postcard from "../../Components/Post/Postcard";
import Likebtn from "../../Components/Post/Likebtn"

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
        // await checkSubscription();
        await fetchPosts();
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // const checkSubscription = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch("https://api.toplike.app/api/check-subscription", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
      
  //     if (response.ok) {
  //       const data = await response.json();
  //       setHasSubscribed(data.hasSubscribed);
  //       setShowChallengeModal(!data.hasSubscribed);
  //     }
  //   } catch (error) {
  //     console.error("Subscription check error:", error);
  //   }
  // };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://api.toplike.app/api/post/all", {
        headers: { Authorization: `Bearer ${token}` },
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
    // Update the specific post in the posts array
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === likeData.postId 
          ? { 
              ...post, 
              likes_count: likeData.likesCount,
              is_liked: likeData.liked 
            }
          : post
      )
    );
  };

  const handleSubscribeSuccess = () => {
    setHasSubscribed(true);
    setShowChallengeModal(false);
    fetchPosts(); // Refresh posts after subscription
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
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
      
      {/* Weekly Challenge Modal */}
      {showChallengeModal && (
        <WeeklyChallengeModal 
          onSuccess={handleSubscribeSuccess}
          onClose={() => setShowChallengeModal(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Create Post Card */}
          {hasSubscribed && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  U
                </div>
                <Link 
                  to="/create-post"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-6 py-3 text-gray-600 cursor-pointer transition duration-200"
                >
                  What's on your mind?
                </Link>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchPosts}
                className="mt-2 text-red-600 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="text-gray-400 text-6xl mb-4">📷</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Be the first to share something amazing!</p>
                {!hasSubscribed && (
                  <button 
                    onClick={() => setShowChallengeModal(true)}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Subscribe to Post
                  </button>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <Postcard 
                  key={post.id} 
                  post={post} 
                  onLikeSuccess={handleLikeSuccess}
                  formatTimeAgo={formatTimeAgo}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
};



export default Home;