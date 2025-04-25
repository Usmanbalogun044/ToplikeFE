import { useState } from "react";
import { FiHeart } from "react-icons/fi";

const Likebtn = ({ postId, initialLikes, isLiked, onSuccess }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://toplike.up.railway.app/api/like-post/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center ${
          liked ? "text-red-500" : "text-gray-500"
        } hover:text-red-500`}
      >
        <FiHeart className={`mr-1 ${liked ? "fill-current" : ""}`} />
        <span>{likes}</span>
      </button>
    </>
  );
};

export default Likebtn;
