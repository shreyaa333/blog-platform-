import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import TagPill from "../components/TagPill.jsx";
import CommentSection from "../components/CommentSection.jsx";
import ShareButtons from "../components/ShareButtons.jsx";
import RelatedPosts from "../components/RelatedPosts.jsx";

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/posts/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  const onScroll = useCallback(() => {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    setProgress(scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const toggleLike = async () => {
    if (!user) return navigate("/login");
    const res = await api.put(`/posts/${post._id}/like`);
    setPost((p) => ({ ...p, likesCount: res.data.likesCount, likedByMe: res.data.likedByMe }));
  };

  const toggleSave = async () => {
    if (!user) return navigate("/login");
    const res = await api.put(`/posts/${post._id}/save`);
    setPost((p) => ({ ...p, savedByMe: res.data.saved }));
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this story? This cannot be undone.")) return;
    await api.delete(`/posts/${post._id}`);
    navigate(`/@${user.username}`);
  };

  if (loading) return <Loader label="Opening story" />;
  if (notFound || !post) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="font-display text-3xl mb-2">Story not found</p>
        <Link to="/" className="text-signal underline">Back to Inkwell</Link>
      </div>
    );
  }

  const isOwner = user && user._id === post.author._id;

  return (
    <article>
      {/* Reading progress — signature element */}
      <div className="fixed top-16 left-0 right-0 h-[3px] bg-line z-30">
        <div className="h-full bg-signal transition-[width]" style={{ width: `${progress}%` }} />
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-14">
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags?.map((t) => (
            <TagPill key={t} tag={t} />
          ))}
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-xl text-stone mt-4 font-display italic">{post.subtitle}</p>
        )}

        <div className="flex items-center gap-3 mt-8 pb-8 border-b border-line flex-wrap">
          <Link to={`/@${post.author.username}`}>
            <img
              src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=2B2033&color=fff`}
              alt={post.author.name}
              className="w-11 h-11 rounded-full object-cover"
            />
          </Link>
          <div className="text-sm">
            <Link to={`/@${post.author.username}`} className="font-medium hover:text-signal transition-colors">
              {post.author.name}
            </Link>
            <div className="text-stone font-mono text-xs mt-0.5">
              {format(new Date(post.createdAt), "MMM d, yyyy")} · {post.readingTime} min read · {post.views} views
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {isOwner && (
              <div className="flex gap-3 text-xs font-mono">
                <Link to={`/edit/${post._id}`} className="text-stone hover:text-signal">Edit</Link>
                <button onClick={deletePost} className="text-stone hover:text-signal">Delete</button>
              </div>
            )}
            <ShareButtons title={post.title} url={`/post/${post.slug}`} />
          </div>
        </div>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-lg mt-8"
          />
        )}

        <div
          className="prose-article mt-10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex items-center gap-3 mt-10 pt-8 border-t border-line">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors text-sm font-medium ${
              post.likedByMe
                ? "bg-signal text-paper border-signal"
                : "border-line text-stone hover:border-signal hover:text-signal"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={post.likedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            {post.likesCount} {post.likesCount === 1 ? "Like" : "Likes"}
          </button>

          <button
            onClick={toggleSave}
            aria-label={post.savedByMe ? "Remove from saved" : "Save for later"}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors text-sm font-medium ${
              post.savedByMe
                ? "bg-ink text-paper border-ink"
                : "border-line text-stone hover:border-signal hover:text-signal"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={post.savedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
            </svg>
            {post.savedByMe ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div className="px-5">
        <CommentSection postId={post._id} />
        <RelatedPosts tags={post.tags} excludeId={post._id} />
      </div>
    </article>
  );
}
