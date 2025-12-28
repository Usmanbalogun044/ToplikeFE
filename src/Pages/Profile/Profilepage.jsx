import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Sharedd/Header";
import Postcard from "../../Components/Post/Postcard";
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
  FiShield,
  FiSettings,
} from "react-icons/fi";
import VerifiedBadge from "../../Components/VerifiedBadge";
import { API_URL } from "../../config";

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
        ? `${API_URL}/myprofile`
        : `${API_URL}/user/profile/${id}`;

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

      const response = await fetch(`${API_URL}/user`, {
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
    localStorage.removeItem("token");
    sessionStorage.removeItem("currentUserProfile");
    navigate("/");
  };

  const AvatarDisplay = ({ src, editable = false, size = "lg" }) => {
    const sizeClasses = size === "lg" ? "w-28 h-28 md:w-32 md:h-32" : "w-24 h-24";

    return (
      <div
        className={`relative ${sizeClasses} rounded-full flex items-center justify-center border-4 border-fuchsia-500/20 shadow-[0_0_30px_rgba(168,85,247,0.3)] bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 overflow-hidden`}
      >
        {src ? (
          <img
            src={src}
            alt={`Profile picture of ${profile.user.username}`}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
            }}
          />
        ) : (
          <FiUser
            className="text-fuchsia-300 w-12 h-12"
            aria-label="Default profile icon"
          />
        )}

        {editable && (
          <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-10">
            <div className="text-white text-center p-2">
              <FiUpload className="mx-auto mb-1 animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
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

  if (initialLoad) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex justify-center items-center">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-fuchsia-500 shadow-lg shadow-fuchsia-500/20"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col justify-center">
        <div className="glass-panel border-l-4 border-red-500 p-6 rounded-xl text-center">
           <FiX className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <p className="text-red-300 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setError("");
                  setInitialLoad(true);
                  fetchProfile();
                }}
                className="btn-brand bg-red-500/20 text-red-300 hover:bg-red-500/30"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/")}
                className="btn-ghost"
              >
                Go Home
              </button>
            </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
        {!isCurrentUser && (
            <button onClick={() => navigate(-1)} className="flex items-center text-purple-300/60 hover:text-white mb-6 transition gap-2">
                <FiArrowLeft /> Back
            </button>
        )}

        {/* Profile Card */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden animate-fade-in-up">
          {/* Header Actions */}
         <div className="absolute top-4 right-4 z-10 flex gap-2">
             {!isCurrentUser ? (
                  /* Add follow/message buttons for other users here if needed */
                  null
             ) : (
                <div className="flex gap-2">
                     <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-white/10 text-red-400 hover:text-red-300 transition"
                        title="Logout"
                      >
                        <FiX size={20} />
                      </button>
                </div>
             )}
         </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {editMode ? (
                <div className="flex flex-col items-center gap-4 w-full">
                   <AvatarDisplay
                        src={formData.profile_picture_preview || profile.user.profile_picture}
                        editable={true}
                    />
                    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                        <div>
                         <label className="text-xs font-bold text-purple-300/50 uppercase tracking-wider mb-2 block">Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 focus:outline-none transition"
                                minLength={3}
                                maxLength={30}
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                           <button type="submit" className="btn-brand flex-1 py-2.5 text-sm" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                           </button>
                           <button
                             type="button"
                             onClick={() => setEditMode(false)}
                             className="btn-ghost flex-1 py-2.5 text-sm"
                            >
                                Cancel
                           </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                <div className="flex-shrink-0">
                     <AvatarDisplay src={profile.user.profile_picture} />
                </div>
                
                <div className="flex-1 text-center md:text-left w-full">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-2">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                                {profile.user.username}
                                {profile.user.is_verified && <VerifiedBadge size={20} />}
                            </h1>
                            {profile.user.email && (
                                <div className="text-purple-300/50 text-sm mt-1 flex items-center justify-center md:justify-start gap-2">
                                    <FiMail size={14} /> {profile.user.email}
                                </div>
                            )}
                        </div>
                        
                         {isCurrentUser && (
                            <button
                                onClick={() => setEditMode(true)}
                                className="mt-4 md:mt-0 px-4 py-1.5 rounded-full border border-purple-500/30 text-purple-200 text-sm hover:bg-purple-500/10 transition flex items-center gap-2"
                            >
                                <FiSettings size={14} /> Edit Profile
                            </button>
                         )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center">
                             <div className="text-fuchsia-400 mb-1"><FiAward size={20}/></div>
                             <span className="text-2xl font-bold text-white">{profile.user.wins || 0}</span>
                             <span className="text-[10px] text-purple-300/50 uppercase tracking-widest">Wins</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center">
                             <div className="text-purple-400 mb-1"><FiBarChart2 size={20}/></div>
                             <span className="text-2xl font-bold text-white">#{profile.user.rank || "--"}</span>
                             <span className="text-[10px] text-purple-300/50 uppercase tracking-widest">Rank</span>
                        </div>
                    </div>
                </div>
                </>
            )}
          </div>
        </div>

        {/* User Posts */}
        <div className="animate-fade-in-up delay-100">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <span className="w-1.5 h-6 bg-fuchsia-500 rounded-full"></span>
             Recent Activity
          </h2>

          {profile.posts && profile.posts.data && profile.posts.data.length > 0 ? (
            <div className="grid gap-6">
              {profile.posts.data.map((post) => (
                   <Postcard
                        key={post.id}
                        post={{...post, user: profile.user}} // Enhance post with user data since API might return it flat
                        isInteractive={true}
                        formatTimeAgo={(date) => new Date(date).toLocaleDateString()}
                        // Note: You might need to adjust Postcard to not try to refetch user data if provided
                   />
              ))}
            </div>
          ) : (
             <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-2 border-white/10">
                <FiUser className="mx-auto h-16 w-16 text-purple-500/20 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No activity yet</h3>
                <p className="text-purple-300/50 mb-6">
                   {isCurrentUser ? "You haven't shown the world what you've got yet." : "This user is sleeping on their potential."}
                </p>
                {isCurrentUser && (
                   <Link to="/posts/create" className="btn-brand px-6 py-2.5 text-sm">
                      Create First Post
                   </Link>
                )}
             </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profilepage;
