"use client";

type Props = {
  children: string;
  className?: string;
  dim?: boolean;
};

export default function GlowWord({ children, className = "", dim = false }: Props) {
  return (
    <span
      className={`inline-block cursor-default transition-all duration-300 ${dim ? "text-white/50" : ""} ${className}`}
      style={{ textShadow: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textShadow =
          "0 0 20px rgba(255,255,255,0.45), 0 0 50px rgba(43,108,176,0.3), 0 0 80px rgba(20,52,94,0.15)";
        if (dim) e.currentTarget.style.color = "rgba(255,255,255,0.85)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textShadow = "none";
        if (dim) e.currentTarget.style.color = "";
      }}
    >
      {children}
    </span>
  );
}
