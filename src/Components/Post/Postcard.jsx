import { useState } from "react";
import Likebtn from "./Likebtn";
import VerifiedBadge from "../VerifiedBadge";
import { FiMessageCircle } from "react-icons/fi";

const Postcard = ({
  post,
  onLikeSuccess,
  formatTimeAgo,
  isInteractive = true,
}) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const caption = post.caption || "";
  const shouldTruncate = caption.length > 150;
  const displayCaption =
    shouldTruncate && !showFullCaption
      ? `${caption.substring(0, 150)}...`
      : caption;

  // Mock avatar color generator
  const getAvatarColor = (name) => {
      const colors = ["from-purple-500 to-indigo-500", "from-fuchsia-500 to-pink-500", "from-violet-500 to-purple-500"];
      const index = (name?.length || 0) % colors.length;
      return colors[index];
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] hover:border-purple-500/20 group">
      {/* Post Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/0">
        <div className="flex items-center space-x-3">
          <div className={`h-10 w-10 rounded-full text-white bg-gradient-to-br ${getAvatarColor(post.user?.username)} flex items-center justify-center font-bold text-sm shadow-lg`}>
            {post.user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-1">
              @{post.user?.username || "anonymous"}
              {post.user?.is_verified && <VerifiedBadge size={14} />}
            </h3>
            <p className="text-xs text-purple-300/60 font-medium">
              {post.created_at ? formatTimeAgo(post.created_at) : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-4 py-3">
          <p className="text-purple-100/90 whitespace-pre-line text-sm leading-relaxed">
            {displayCaption}
            {shouldTruncate && (
              <button
                onClick={() => setShowFullCaption(!showFullCaption)}
                className="text-fuchsia-400 hover:text-fuchsia-300 ml-1 font-medium transition"
              >
                {showFullCaption ? "Show less" : "Show more"}
              </button>
            )}
          </p>
        </div>
      )}

      {/* Media */}
      {post.media_url && (
        <div className="w-full bg-black/50 aspect-square md:aspect-auto md:max-h-[500px] flex items-center justify-center overflow-hidden">
          {post.media_type === "video" ? (
            <video
              src={post.media_url}
              controls={isInteractive}
              className="w-full h-full object-contain"
              poster={post.thumbnail_url}
              loop
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={post.media_url}
              alt="Post content"
              className="w-full h-full object-cover md:object-contain"
              loading="lazy"
            />
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center gap-6 p-4 border-t border-white/5 bg-white/0">
        <Likebtn
          postId={post.id}
          initialLikes={post.likes}
          initialIsLiked={post.isLiked}
          onSuccess={() => onLikeSuccess(post.id)}
        />

        <button
          className="flex items-center text-purple-300/60 hover:text-fuchsia-400 transition gap-2 group/comment"
          onClick={() => setShowLikes(!showLikes)}
        >
          <div className="p-2 rounded-full group-hover/comment:bg-fuchsia-500/10 transition">
             <FiMessageCircle className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">{post.comments_count || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default Postcard;
