import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Sharedd/Header";
import {
  FiUser,
  FiEdit,
  FiSave,
  FiX,
  FiAward,
  FiBarChart2,
  FiArrowLeft,
  FiMail,
  FiUpload,
  FiMessageCircle,
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
  const [formData, setFormData] = useState({
    username: "",
    profile_picture: null,
    profile_picture_preview: "",
  });

  // Fetching profile data with caching
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
        setFormData({
          username: data.user.username || "",
          profile_picture: data.user.profile_picture || "",
          profile_picture_preview: data.user.profile_picture || "",
        });
      }

      const token = localStorage.getItem("token");
      if (!token && isCurrentUser) {
        navigate("/login");
        return;
      }

      const endpoint = isCurrentUser
        ? "https://api.toplike.app/api/myprofile"
        : `https://api.toplike.app/api/user/profile/${id}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      setProfile(data);
      setFormData({
        username: data.user.username || "",
        profile_picture: null,
        profile_picture_preview: data.user.profile_picture || "",
      });
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_picture: file,
        profile_picture_preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formPayload = new FormData();
      formPayload.append("username", formData.username);

      if (formData.profile_picture instanceof File) {
        formPayload.append("profile_picture", formData.profile_picture);
      }

      const response = await fetch("https://api.toplike.app/api/user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      const updatedData = await response.json();

      if (!response.ok) {
        if (updatedData.errors) {
          const firstError = Object.values(updatedData.errors).flat()[0];
          throw new Error(firstError);
        }

        throw new Error(updatedData.message || "Update failed");
      }

      console.log("Updated data from API:", updatedData);

      setProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          username: updatedData.user.username,
          profile_picture: updatedData.user.profile_picture
            ? `${updatedData.user.profile_picture}?t=${Date.now()}`
            : prev.user.profile_picture,
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
        profile_picture: updatedData.user.profile_picture
          ? `${updatedData.user.profile_picture}?t=${Date.now()}`
          : cachedData.user.profile_picture,
      };

      sessionStorage.setItem(cacheKey, JSON.stringify(cachedData));

      await fetchProfile();

      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem("token");

    // Clear cached profile data
    sessionStorage.removeItem("currentUserProfile");

    // Redirect to landing page
    navigate("/");
  };

  // profile_picture display component
  const AvatarDisplay = ({ src, editable = false, size = "lg" }) => {
    const sizeClasses = size === "lg" ? "w-32 h-32" : "w-24 h-24";

    return (
      <div
        className={`relative ${sizeClasses} rounded-full flex items-center border-4 justify-center border-white shadow-lg bg-gradient-to-br from-purple-100 to-blue-100`}
      >
        {src ? (
          <img
            src={src}
            alt={`Profile picture of ${profile.user.username}`}
            className="w-full h-full rounded-full object-cover"
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
            }}
          />
        ) : (
          <FiUser
            className="text-purple-400 w-16 h-16"
            aria-label="Default profile icon"
          />
        )}

        {editable && (
          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="text-white text-center p-2">
              <FiUpload className="mx-auto mb-1" />
              <span className="text-xs">Change Photo</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    );
  };

  // loader during initial load
  if (initialLoad) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Profile Header */}
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

        {/* Posts Grid */}
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
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-red-100
                  text-red-700 hover:bg-red-200"
                >
                  Retry
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-gray-100
                  text-gray-700 hover:bg-gray-200"
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
    <>
      {/* Mobile header */}
      <Header />

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
          {/* Avatar Display */}
          {editMode ? (
            <AvatarDisplay
              src={
                formData.profile_picture_preview || profile.user.profile_picture
              }
              editable={true}
              size="lg"
            />
          ) : (
            <AvatarDisplay src={profile.user.profile_picture} size="lg" />
          )}

          <div className="flex-1 w-full">
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
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="border border-gray-300 w-full px-4 py-2 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-purple-500"
                    required
                    minLength={3}
                    maxLength={30}
                  />
                  {error && <p className="mt-1 text-sm text-red-600">{}</p>}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer font-medium transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    <FiSave className="mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        username: profile.user.username,
                        profile_picture: null,
                        profile_picture_preview: profile.user.profile_picture,
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-50 focus:outline-none 
                    focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
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
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center pr-1.5 text-purple-600 cursor-pointer transition-colors whitespace-nowrap hover:text-purple-800"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center text-red-600 cursor-pointer hover:text-red-800 transition-colors whitespace-nowrap"
                      >
                        <FiX className="mr-1" /> Logout
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
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
        <div className="mt-8 mb-5">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h2>

          {profile.posts &&
          profile.posts.data &&
          profile.posts.data.length > 0 ? (
            <div className="space-y-6">
              {profile.posts.data.map((post) => {
                const media =
                  post.media && post.media.length > 0 ? post.media[0] : null;
                const mediaUrl = media ? media.file_path : null;
                const isVideo = media ? media.type === "video" : false;

                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                  >
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={profile.user.profile_picture}
                          alt={profile.user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {profile.user.username}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()} at{" "}
                            {new Date(post.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {post.type && (
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                            {post.type}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Caption */}
                    {post.caption && (
                      <div className="p-4 border-b border-gray-100">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {post.caption}
                        </p>
                      </div>
                    )}

                    {/* Media */}
                    {mediaUrl && (
                      <div className="flex justify-center bg-gray-50">
                        <div className="max-w-2xl w-full">
                          {isVideo ? (
                            <video
                              className="w-full max-h-96 object-contain"
                              controls
                              playsInline
                            >
                              <source src={mediaUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              src={mediaUrl}
                              alt={
                                post.caption ||
                                `Post by ${profile.user.username}`
                              }
                              className="w-full max-h-96 object-contain"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/500x300?text=Image+Not+Found";
                                e.target.className =
                                  "w-full h-64 object-cover bg-gray-200";
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Post Stats & Actions */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-gray-600">
                          <div className="flex items-center space-x-2">
                            <FiAward className="w-5 h-5 text-purple-600" />
                            <span className="font-medium">
                              {post.likes_count || 0} likes
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiMessageCircle className="w-5 h-5 text-gray-400" />
                            <span>Comment</span>
                          </div>
                        </div>

                        {post.music && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>🎵</span>
                            <span>{post.music}</span>
                          </div>
                        )}
                      </div>

                      {/* Visibility Status */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.is_visible
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {post.is_visible ? "Public" : "Private"}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          Posted on{" "}
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                      className="inline-flex items-center px-4 py-2 border border-transparent bg-purple-600 text-sm text-white font-medium shadow-sm rounded-md focus:ring-2 hover:bg-purple-700 focus:outline-none focus:ring-offset-2 focus:ring-purple-800"
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
    </>
  );
};

export default Profilepage;
