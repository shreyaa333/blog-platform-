import { useEffect, useState } from "react";
import api from "../api/axios.js";
import PostCard from "../components/PostCard.jsx";
import Loader from "../components/Loader.jsx";

export default function Saved() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/me/saved").then((res) => {
      setPosts(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl font-semibold mb-2">Your reading list</h1>
      <p className="text-stone text-sm mb-8">Stories you've bookmarked to read later.</p>

      {loading ? (
        <Loader label="Loading saved stories" />
      ) : posts.length === 0 ? (
        <p className="text-stone py-12">
          Nothing saved yet — tap the bookmark icon on any story to add it here.
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
