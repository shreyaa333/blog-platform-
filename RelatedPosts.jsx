import { useEffect, useState } from "react";
import api from "../api/axios.js";
import PostCard from "./PostCard.jsx";

export default function RelatedPosts({ tags = [], excludeId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!tags.length) return;
    api.get(`/posts?tag=${encodeURIComponent(tags[0])}&limit=6`).then((res) => {
      setPosts(res.data.posts.filter((p) => p._id !== excludeId).slice(0, 3));
    });
  }, [tags, excludeId]);

  if (!posts.length) return null;

  return (
    <section className="max-w-2xl mx-auto mt-16 pt-10 border-t border-line px-5">
      <h3 className="font-display text-xl font-semibold mb-2">More like this</h3>
      <div>
        {posts.map((p) => (
          <PostCard key={p._id} post={p} />
        ))}
      </div>
    </section>
  );
}
