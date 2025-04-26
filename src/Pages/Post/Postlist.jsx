import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Postcard from "../../Components/Post/Postcard";

const Postlist = () => {
  const [posts, setPosts] = useState([]);
  const [hasPosted, setHasPosted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        const res = await fetch(url, options);
        const data = await res.json();

        setHasPosted(data.hasPosted);
        if (data.hasPosted) {
          await loadPosts();
        } else {
          navigate("/posts/create");
        }
      } catch (error) {
        console.error("Error checking submission:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSubmission();
  }, [navigate]);

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

  if (loading) {
    return (
      <div className="text-center py-12 text-lg font-medium">Loading...</div>
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
