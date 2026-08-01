import { Link } from "react-router-dom";

export default function TagPill({ tag, active = false }) {
  return (
    <Link
      to={`/search?tag=${encodeURIComponent(tag)}`}
      className={`inline-block px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
        active
          ? "bg-ink text-paper border-ink"
          : "bg-paper-2 text-stone border-line hover:border-signal hover:text-signal"
      }`}
    >
      #{tag}
    </Link>
  );
}
