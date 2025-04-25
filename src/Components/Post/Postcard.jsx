import { FiHeart, FiMessageSquare, FiShare2 } from "react-icons/fi";

const Postcard = ({ post, onLikeSuccess }) => {
  const [showLikes, setShowLikes] = useState(false);
  const [likesList, setLikesList] = useState([]);

  const fetchLikes = async () => {
    const url = `https://toplike.up.railway.app/api/like/list-user/${post.id}`;
    const options = { method: "GET", headers: { Accept: "application/json" } };
    try {
      const res = await fetch(url, options);
      setLikesList(await res.json());
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
        {/* Post Image */}
        <div className="relative aspect-square">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Media Preview */}
          {post.isVideo ? (
            <video controls className="w-full aspect-video bg-black">
              <source src={post.mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full aspect-square object-cover"
            />
          )}
        </div>

        {/* Post Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-1">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {post.description}
          </p>

          {/* Post Actions */}
          <div className="flex justify-between items-center border-t pt-3">
            <LikeButton
              postId={post.id}
              initialLikes={post.likes}
              isLiked={post.isLiked}
              onSuccess={() => {
                onLikeSuccess(post.id);
                fetchLikes();
              }}
            />

            <button
              className="flex items-center text-gray-500 hover:text-purple-600"
              onClick={() => setShowLikes(!showLikes)}
            >
              <FiMessageSquare className="mr-1" />
              {post.comments}
            </button>

            <button className="text-gray-500 hover:text-purple-600">
              <FiShare2 />
            </button>
          </div>

          {/* Likes Popup */}
          {showLikes && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Liked by:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {likesList.length > 0 ? (
                  likesList.map((user) => (
                    <div key={user.id} className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                      <span className="text-sm">@{user.username}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No likes yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Postcard;
