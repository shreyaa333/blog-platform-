import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import PostCard from "../components/PostCard.jsx";
import Loader from "../components/Loader.jsx";
import TagPill from "../components/TagPill.jsx";

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "trending", label: "Trending" },
  { value: "most_liked", label: "Most liked" },
];

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const tag = params.get("tag") || "";
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    api.get("/posts/meta/tags").then((res) => setTags(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    qs.set("limit", "20");
    qs.set("sort", sort);
    if (q) qs.set("search", q);
    if (tag) qs.set("tag", tag);
    api.get(`/posts?${qs.toString()}`).then((res) => {
      setPosts(res.data.posts);
      setLoading(false);
    });
  }, [q, tag, sort]);

  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl font-semibold mb-2">
        {q ? `Results for "${q}"` : tag ? `Stories tagged #${tag}` : "Explore stories"}
      </h1>

      <div className="flex flex-wrap gap-2 my-6">
        {tags.map((t) => (
          <TagPill key={t.tag} tag={t.tag} active={t.tag === tag} />
        ))}
      </div>

      <div className="flex items-center gap-1 bg-paper-2 rounded-full p-1 w-fit mb-6">
        {SORTS.map((s) => (
          <button
            key={s.value}
            onClick={() => setSort(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              sort === s.value ? "bg-ink text-paper" : "text-stone hover:text-signal"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Searching" />
      ) : posts.length === 0 ? (
        <p className="text-stone py-12">
          No stories found. <Link to="/" className="text-signal underline">Back to home</Link>
        </p>
      ) : (
        <div>{posts.map((p) => <PostCard key={p._id} post={p} />)}</div>
      )}
    </div>
  );
}
