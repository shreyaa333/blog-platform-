import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-lg font-semibold">
          Ink<span className="text-signal">well</span>
        </span>
        <p className="text-sm text-stone font-mono">
          Built with the MERN stack — Human writing, machine reading.
        </p>
        <div className="flex gap-5 text-sm text-stone">
          <Link to="/" className="hover:text-signal transition-colors">Home</Link>
          <Link to="/search" className="hover:text-signal transition-colors">Explore</Link>
        </div>
      </div>
    </footer>
  );
}
