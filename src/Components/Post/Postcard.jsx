import { FiHeart, FiMessageSquare, FiShare2 } from "react-icons/fi";
import { useState } from "react";
import Likebtn from "./Likebtn";

const Postcard = ({
  post,
  onLikeSuccess,
  formatTimeAgo,
  isInteractive = true,
}) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showLikes, setShowLikes] = useState(false); // ✅ added missing state

  const caption = post.caption || "";
  const shouldTruncate = caption.length > 150;
  const displayCaption =
    shouldTruncate && !showFullCaption
      ? `${caption.substring(0, 150)}...`
      : caption;

  const handleLikeClick = (likeData) => {
    if (!isInteractive) return; // overlay will handle this
    onLikeSuccess?.(likeData);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm transition-shadow duration-200 relative overflow-hidden hover:shadow-md">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full text-white bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center font-semibold">
              {post.user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                @{post.user?.username || "anonymous"}
              </h3>
              <p className="text-sm text-gray-500">
                {post.created_at ? formatTimeAgo(post.created_at) : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="p-4">
          <p className="text-gray-800 whitespace-pre-line">
            {displayCaption}
            {shouldTruncate && (
              <button
                onClick={() => setShowFullCaption(!showFullCaption)}
                className="text-purple-600 hover:text-purple-800 ml-1 font-medium"
              >
                {showFullCaption ? "Show less" : "Show more"}
              </button>
            )}
          </p>
        </div>
      )}

      {/* Media */}
      {post.media_url && (
        <div className="w-full bg-black flex items-center justify-center">
          {post.media_type === "video" ? (
            <video
              src={post.media_url}
              controls={isInteractive}
              className="w-full h-auto max-h-96 object-contain"
              poster={post.thumbnail_url}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={post.media_url}
              alt="Post media"
              className="w-full h-auto max-h-96 object-contain"
              loading="lazy"
            />
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex justify-between items-center border-t pt-3 px-4 pb-3">
        <Likebtn
          postId={post.id}
          initialLikes={post.likes}
          initialIsLiked={post.isLiked} // ✅ corrected prop name
          onSuccess={() => onLikeSuccess(post.id)} // ✅ removed undefined fetchLikes
        />

        <button
          className="flex items-center text-gray-500 hover:text-purple-600 space-x-1"
          onClick={() => setShowLikes(!showLikes)}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{post.comments_count || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default Postcard;
