export default function CityBadge({ city }) {
  const normalized = (city || "gurgaon").toLowerCase();

  if (normalized === "noida") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
        <span className="size-1.5 rounded-full bg-blue-600"></span>
        Noida
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-700/15 ring-inset">
      <span className="size-1.5 rounded-full bg-amber-600"></span>
      Gurgaon
    </span>
  );
}
