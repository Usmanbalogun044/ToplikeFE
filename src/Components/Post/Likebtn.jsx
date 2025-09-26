import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const Likebtn = ({ postId, initialLikes = 0, initialIsLiked = false, onSuccess, onError }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync with props
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  useEffect(() => {
    setLiked(initialIsLiked);
  }, [initialIsLiked]);

  const handleLike = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://api.toplike.app/api/like-post/${postId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikes(newLikedState ? likes + 1 : likes - 1);
        
        // Call success callback with updated data
        onSuccess?.({
          liked: newLikedState,
          likesCount: newLikedState ? likes + 1 : likes - 1,
          postId
        });
      } else {
        throw new Error(data.message || "Failed to like post");
      }
    } catch (error) {
      console.error("Like error:", error);
      setError(error.message);
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Optimistic UI update with rollback
  const handleClick = () => {
    const previousLiked = liked;
    const previousLikes = likes;

    // Optimistic update
    setLiked(!previousLiked);
    setLikes(previousLiked ? likes - 1 : likes + 1);

    // Actual API call
    handleLike().catch(() => {
      // Rollback on error
      setLiked(previousLiked);
      setLikes(previousLikes);
    });
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center space-x-1 transition-all duration-200 transform hover:scale-110 active:scale-95 ${
          liked 
            ? "text-red-500" 
            : "text-gray-500 hover:text-red-400"
        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={liked ? "Unlike" : "Like"}
      >
        {liked ? (
          <FaHeart className="text-red-500 animate-pulse" size={18} />
        ) : (
          <FiHeart size={18} />
        )}
        <span className={`font-medium ${liked ? "text-red-500" : "text-gray-600"}`}>
          {likes}
        </span>
      </button>
      
      {/* Error tooltip */}
      {error && (
        <div className="absolute mt-8 px-2 py-1 bg-red-100 text-red-600 text-xs rounded opacity-0 animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
};

export default Likebtn;