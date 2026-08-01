import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function PostCard({ post, large = false }) {
  const author = post.author || {};
  const excerpt = post.subtitle || post.content?.replace(/<[^>]+>/g, "").slice(0, 140);

  if (large) {
    return (
      <Link
        to={`/post/${post.slug}`}
        className="group grid md:grid-cols-2 gap-6 items-center animate-fadeUp"
      >
        <div className="overflow-hidden rounded-lg bg-paper-2 aspect-[4/3]">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone font-display text-4xl">Aa</div>
          )}
        </div>
        <div>
          <span className="inline-block text-xs font-mono tracking-wide text-gold uppercase mb-3">Featured</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight group-hover:text-signal transition-colors">
            {post.title}
          </h2>
          {excerpt && <p className="text-stone mt-3 line-clamp-2">{excerpt}</p>}
          <div className="flex items-center gap-3 mt-5 text-sm text-stone">
            <img
              src={author.avatar || `https://ui-avatars.com/api/?name=${author.name}&background=2B2033&color=fff`}
              alt={author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-ink">{author.name}</span>
            <span>·</span>
            <span className="font-mono text-xs">{post.readingTime} min read</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.slug}`} className="group flex gap-5 py-6 border-b border-line animate-fadeUp">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-stone font-mono mb-2">
          <img
            src={author.avatar || `https://ui-avatars.com/api/?name=${author.name}&background=2B2033&color=fff`}
            alt={author.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-ink font-medium">{author.name}</span>
          <span>·</span>
          <span>{post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ""}</span>
        </div>
        <h3 className="font-display text-xl font-semibold leading-snug group-hover:text-signal transition-colors truncate">
          {post.title}
        </h3>
        {excerpt && <p className="text-stone text-sm mt-1.5 line-clamp-2">{excerpt}</p>}
        <div className="flex items-center gap-3 mt-3">
          {post.tags?.slice(0, 2).map((t) => (
            <span key={t} className="text-xs font-mono text-stone bg-paper-2 px-2 py-0.5 rounded-full">
              #{t}
            </span>
          ))}
          <span className="text-xs font-mono text-stone ml-auto">{post.readingTime} min · {post.likesCount ?? post.likes?.length ?? 0} likes</span>
        </div>
      </div>
      {post.coverImage && (
        <div className="hidden sm:block w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-paper-2">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
    </Link>
  );
}
