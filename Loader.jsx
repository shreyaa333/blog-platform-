export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-8 h-8 border-2 border-line border-t-signal rounded-full animate-spin" />
      <span className="text-stone text-sm font-mono">{label}...</span>
    </div>
  );
}
