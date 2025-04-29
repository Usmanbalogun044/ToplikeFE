import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiEdit,
  FiSave,
  FiX,
  FiAward,
  FiBarChart2,
  FiArrowLeft,
  FiMail,
} from "react-icons/fi";

const Profilepage = () => {
  const { id } = useParams();
  const isCurrentUser = !id;
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");

  // Fetch profile data with caching
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const cacheKey = isCurrentUser
        ? "currentUserProfile"
        : `userProfile-${id}`;
      const cachedProfile = sessionStorage.getItem(cacheKey);

      if (cachedProfile) {
        const data = JSON.parse(cachedProfile);
        setProfile(data);
        setUsername(data.user.username || "");
        setInitialLoad(false);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token && isCurrentUser) {
        navigate("/login");
        return;
      }

      const endpoint = isCurrentUser
        ? "https://toplike.up.railway.app/api/myprofile"
        : `https://toplike.up.railway.app/api/user/profile/${id}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      setProfile(data);
      setUsername(data.user.username || "");
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, isCurrentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://toplike.up.railway.app/api/user/update",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const updatedData = await response.json();
      setProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          username: updatedData.user.username,
        },
      }));

      // Update cache
      const cacheKey = isCurrentUser
        ? "currentUserProfile"
        : `userProfile-${id}`;
      const cachedData = JSON.parse(sessionStorage.getItem(cacheKey)) || {};
      cachedData.user = {
        ...cachedData.user,
        username: updatedData.user.username,
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cachedData));

      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Skeleton loader during initial load
  if (initialLoad) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Profile Header Skeleton */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-1 space-y-3">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex space-x-4 pt-2">
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Posts Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiX className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => {
                    setError("");
                    setInitialLoad(true);
                    fetchProfile();
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  Retry
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {!isCurrentUser && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 mb-4 hover:text-purple-800 transition-colors"
        >
          <FiArrowLeft className="mr-1" /> Back
        </button>
      )}

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 bg-white rounded-xl p-6 shadow-sm">
        {/* User Icon */}
        <div className="flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-purple-100 text-purple-600">
          <FiUser className="w-12 h-12" />
        </div>

        <div className="flex-1">
          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  required
                  minLength={3}
                  maxLength={30}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                >
                  <FiSave className="mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 
                  focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.user.username}
                  </h1>

                  {profile.user.email && (
                    <div className="flex items-center mt-2 text-gray-600">
                      <FiMail className="mr-2" />
                      <span>{profile.user.email}</span>
                    </div>
                  )}
                </div>
                {isCurrentUser && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center text-purple-600 cursor-pointer hover:text-purple-800 transition-colors"
                  >
                    <FiEdit className="mr-1" /> Edit
                  </button>
                )}
              </div>

              <div className="flex space-x-6 mt-6">
                <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                  <FiAward className="text-purple-600 mr-2" />
                  <span className="font-medium">
                    {profile.user.wins || 0} Wins
                  </span>
                </div>
                <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                  <FiBarChart2 className="text-purple-600 mr-2" />
                  <span className="font-medium">
                    Rank #{profile.user.rank || "--"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* User Posts */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Recent Activity
        </h2>
        {profile.posts && profile.posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.posts.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className="group relative block rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100">
                  {post.isVideo ? (
                    <video
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="none"
                    >
                      <source src={post.mediaUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity 
                flex items-end p-4"
                >
                  <div className="text-white">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    <p className="text-sm flex items-center">
                      <FiAward className="mr-1" /> {post.likes || 0} likes
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <FiUser className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No activity yet
              </h3>
              <p className="mt-1 text-gray-500">
                {isCurrentUser
                  ? "You haven't created any content yet."
                  : "This user hasn't created any content yet."}
              </p>
              {isCurrentUser && (
                <div className="mt-6">
                  <Link
                    to="/posts/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Create your first post
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profilepage;
