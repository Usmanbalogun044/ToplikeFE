import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Postcard from "../../Components/Post/Postcard";
import Createmodal from "../../Components/Post/Createmodal";


const Postlist = () => {
  const [posts, setPosts] = useState([]);
  const [hasPosted, setHasPosted] = useState(false);
  const [showCreatemodal, setShowCreatemodal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check submission status and load posts
  useEffect(() => {
    const checkSubmission = async () => {
        const url = "https://toplike.up.railway.app/api/has-user-post";
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
      try {
        const res = await fetch(
          url, options
        );
        const data = await res.json();

        setHasPosted(data.hasPosted);
        if (data.hasPosted) {
          await loadPosts();
        }
      } catch (error) {
        console.error("Error checking submission:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSubmission();
  }, []);

  const loadPosts = async () => {
    const url = "https://toplike.up.railway.app/api/post/all";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    const res = await fetch(url, options);
    setPosts(await res.json());
  };

  const handlePostSuccess = () => {
    setHasPosted(true);
    loadPosts();
    setShowCreatemodal(false);
  };



  if (!hasPosted) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">No Submission Yet</h2>
          <p className="mb-6">
            Join the weekly challenge by submitting your entry
          </p>
          <button
            onClick={() => setShowCreatemodal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700"
          >
            Submit Entry (₦500)
          </button>
        </div>

        {showCreatemodal && (
          <Createmodal
            onSuccess={handlePostSuccess}
            onClose={() => setShowCreatemodal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Weekly Submissions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Postcard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Postlist;

