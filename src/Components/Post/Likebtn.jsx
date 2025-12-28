import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { API_URL } from "../../config";

const Likebtn = ({
  postId,
  initialLikes = 0,
  initialIsLiked = false,
  onSuccess,
  onError,
  disabled = false,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  useEffect(() => {
    setLiked(initialIsLiked);
  }, [initialIsLiked]);

  const handleLike = async () => {
    if (loading || disabled) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/like-post/${postId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikes(newLikedState ? likes + 1 : likes - 1);

        onSuccess?.({
          liked: newLikedState,
          likesCount: newLikedState ? likes + 1 : likes - 1,
          postId,
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

  const handleClick = () => {
    if (disabled) {
      // Let parent component handle the subscription prompt
      onSuccess?.({ postId, requiresSubscription: true });
      return;
    }

    const previousLiked = liked;
    const previousLikes = likes;

    setLiked(!previousLiked);
    setLikes(previousLiked ? likes - 1 : likes + 1);

    handleLike().catch(() => {
      setLiked(previousLiked);
      setLikes(previousLikes);
    });
  };

  return (
    <div className="flex items-center space-x-1 relative">
      <button
        onClick={handleClick}
        disabled={loading || disabled}
        className={`flex items-center space-x-1.5 transition-all duration-300 transform hover:scale-105 active:scale-95 group ${
          liked
            ? "text-fuchsia-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]"
            : disabled
            ? "text-purple-300/30 cursor-not-allowed"
            : "text-purple-300/60 hover:text-fuchsia-400"
        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={
          disabled ? "Join challenge to like" : liked ? "Unlike" : "Like"
        }
      >
        <div className={`transition-transform duration-300 ${liked ? "scale-110" : "group-hover:scale-110"}`}>
            {liked ? (
                <FaHeart className="text-fuchsia-500 animate-pulse" size={20} />
            ) : (
                <FiHeart size={20} className="stroke-current stroke-2" />
            )}
        </div>
        <span
          className={`font-semibold text-sm transition-colors ${
            liked
              ? "text-fuchsia-500"
              : disabled
              ? "text-purple-300/30"
              : "text-purple-300/80 group-hover:text-fuchsia-400"
          }`}
        >
          {likes}
        </span>
      </button>

      {error && (
        <div className="absolute -bottom-8 left-0 z-50 px-2 py-1 bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] rounded whitespace-nowrap backdrop-blur-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default Likebtn;
