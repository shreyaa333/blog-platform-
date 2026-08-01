import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-32 text-center">
      <p className="font-display text-6xl font-semibold text-signal">404</p>
      <p className="text-stone mt-3">This page doesn't exist.</p>
      <Link to="/" className="inline-block mt-6 text-signal underline">Back to Inkwell</Link>
    </div>
  );
}
