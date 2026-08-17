"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRow({
  value,
  onRate,
  size = 16,
}: {
  value: number;
  onRate: (stars: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value || 0;

  return (
    <div style={{ display: "flex", gap: 2 }} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onRate(i);
          }}
          onMouseEnter={() => setHover(i)}
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
          style={{ background: "none", border: "none", padding: 2, cursor: "pointer", lineHeight: 0 }}
        >
          <Star
            size={size}
            color={i <= display ? "#d9a441" : "#8a8296"}
            fill={i <= display ? "#d9a441" : "none"}
            strokeWidth={1.75}
          />
        </button>
      ))}
    </div>
  );
}
