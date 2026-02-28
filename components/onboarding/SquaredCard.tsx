"use client";

type Props = {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

export default function SquaredCard({
  selected = false,
  onClick,
  children,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-full text-left
        border transition-all duration-200
        ${
          selected
            ? "border-[#2b6cb0]/60 bg-white/[0.06]"
            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]"
        }
        ${className}
      `}
    >
      {/* Dither noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-0 left-0 h-full w-[2px] bg-[#2b6cb0]" />
      )}
      <div className="relative">{children}</div>
    </button>
  );
}
