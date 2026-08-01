import { useEffect, useState } from "react";
import api from "../api/axios.js";
import PostCard from "../components/PostCard.jsx";
import TagPill from "../components/TagPill.jsx";
import Loader from "../components/Loader.jsx";

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "trending", label: "Trending" },
  { value: "most_liked", label: "Most liked" },
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    api.get("/posts/meta/tags").then((res) => setTags(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get(`/posts?page=${page}&limit=8&sort=${sort}`).then((res) => {
      setPosts(res.data.posts);
      setPages(res.data.pages);
      setLoading(false);
    });
  }, [page, sort]);

  const featured = sort === "latest" ? posts.find((p) => p.featured) || posts[0] : null;
  const rest = featured ? posts.filter((p) => p._id !== featured._id) : posts;

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Masthead / hero */}
      <section className="pt-14 pb-10 border-b border-line">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal mb-3">
          A place for ideas, written down
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] max-w-3xl">
          Stories worth <span className="italic text-stone">slowing down</span> for.
        </h1>
        <p className="text-stone mt-5 max-w-xl">
          Inkwell is where independent writers, engineers, and makers publish deep,
          considered work — no algorithmic feed, just good writing.
        </p>
      </section>

      {loading ? (
        <Loader label="Fetching stories" />
      ) : posts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-stone">No stories published yet.</p>
          <p className="text-stone text-sm mt-2">Run the seed script, or be the first to write one.</p>
        </div>
      ) : (
        <>
          {featured && (
            <section className="py-12 border-b border-line">
              <PostCard post={featured} large />
            </section>
          )}

          <div className="grid md:grid-cols-[1fr_260px] gap-12 py-12">
            <div>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
                <h2 className="font-display text-xl font-semibold">Stories</h2>
                <div className="flex items-center gap-1 bg-paper-2 rounded-full p-1">
                  {SORTS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => { setSort(s.value); setPage(1); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                        sort === s.value ? "bg-ink text-paper" : "text-stone hover:text-signal"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                {rest.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex items-center gap-3 mt-8 font-mono text-sm">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 border border-line rounded-full disabled:opacity-30 hover:border-signal transition-colors"
                  >
                    ← Prev
                  </button>
                  <span className="text-stone">Page {page} of {pages}</span>
                  <button
                    disabled={page >= pages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 border border-line rounded-full disabled:opacity-30 hover:border-signal transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wide text-stone mb-3">
                  Explore by tag
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <TagPill key={t.tag} tag={t.tag} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
