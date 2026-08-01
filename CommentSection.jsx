import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await api.get(`/comments/${postId}`);
    setComments(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await api.post(`/comments/${postId}`, { content: text.trim() });
      setComments((prev) => [res.data, ...prev]);
      setText("");
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id) => {
    await api.delete(`/comments/${id}`);
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <section className="max-w-2xl mx-auto mt-16 pt-10 border-t border-line">
      <h3 className="font-display text-2xl font-semibold mb-6">
        {comments.length} {comments.length === 1 ? "Response" : "Responses"}
      </h3>

      {user ? (
        <form onSubmit={submit} className="mb-10">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What are your thoughts?"
            rows={3}
            className="w-full border border-line rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-signal/30 resize-none bg-paper"
          />
          <div className="flex justify-end mt-2">
            <button
              disabled={posting || !text.trim()}
              className="bg-ink text-paper px-5 py-2 rounded-full text-sm font-medium hover:bg-signal transition-colors disabled:opacity-40"
            >
              {posting ? "Posting..." : "Respond"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-stone text-sm mb-10">
          <Link to="/login" className="text-signal underline">Sign in</Link> to leave a response.
        </p>
      )}

      {loading ? (
        <p className="text-stone text-sm font-mono">Loading responses...</p>
      ) : (
        <ul className="space-y-7">
          {comments.map((c) => (
            <li key={c._id} className="flex gap-3">
              <img
                src={c.author?.avatar || `https://ui-avatars.com/api/?name=${c.author?.name}&background=2B2033&color=fff`}
                alt={c.author?.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{c.author?.name}</span>
                  <span className="text-stone text-xs font-mono">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-ink mt-1 text-[15px] leading-relaxed">{c.content}</p>
                {user?._id === c.author?._id && (
                  <button
                    onClick={() => remove(c._id)}
                    className="text-xs text-stone hover:text-signal mt-1"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
